"""Train the offline handwritten-digit model used by the stock count-sheet reader.

Usage: python scripts/train-digit-model.py <mnist_dir>
Writes public/models/digits.bin (float32 weights) + public/models/digits.json (layer shapes).

Every digit goes through canonicalize() before training — public/js/count-sheet.js (csCanonicalize) does the
exact same steps in the browser: crop -> fit 40px -> binarize -> skeletonize -> redraw at fixed stroke width ->
halve to 24px -> centre of mass at (14,14) in 28x28. Pen thickness then no longer matters.
"""
import gzip, json, os, sys
from multiprocessing import Pool
import numpy as np
from scipy import ndimage

rng = np.random.default_rng(42)

FIT, CANVAS = 40, 48
DISK = np.array([[0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0]], bool)


def fit48(img):
    ys, xs = np.nonzero(img > 0.3)
    out = np.zeros((CANVAS, CANVAS), bool)
    if len(ys) == 0:
        return out
    crop = img[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = crop.shape
    s = FIT / max(h, w)
    th, tw = max(1, round(h * s)), max(1, round(w * s))
    z = ndimage.zoom(crop, (th / h, tw / w), order=1)[:th, :tw]
    y0, x0 = (CANVAS - z.shape[0]) // 2, (CANVAS - z.shape[1]) // 2
    out[y0:y0 + z.shape[0], x0:x0 + z.shape[1]] = z > 0.4
    return out


def zhang_suen(b):
    """Vectorised Zhang-Suen thinning over a batch (N,H,W) of bool images."""
    img = np.pad(b, ((0, 0), (1, 1), (1, 1))).astype(np.uint8)
    while True:
        changed = False
        for step in (0, 1):
            P = img
            p2, p3, p4 = P[:, :-2, 1:-1], P[:, :-2, 2:], P[:, 1:-1, 2:]
            p5, p6, p7 = P[:, 2:, 2:], P[:, 2:, 1:-1], P[:, 2:, :-2]
            p8, p9 = P[:, 1:-1, :-2], P[:, :-2, :-2]
            c = P[:, 1:-1, 1:-1]
            seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
            A = sum(((seq[k] == 0) & (seq[k + 1] == 1)).astype(np.uint8) for k in range(8))
            if step == 0:
                m = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                m = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            rem = (c == 1) & (B >= 2) & (B <= 6) & (A == 1) & m
            if rem.any():
                changed = True
                img[:, 1:-1, 1:-1][rem] = 0
        if not changed:
            break
    return img[:, 1:-1, 1:-1].astype(bool)


def canonicalize(batch):
    b = np.stack([fit48(i) for i in batch])
    sk = zhang_suen(b)
    th = np.stack([ndimage.binary_dilation(s, DISK) for s in sk]).astype(np.float32)
    small = th.reshape(-1, 24, 2, 24, 2).mean((2, 4))
    out = np.zeros((len(batch), 28, 28), np.float32)
    for i, s in enumerate(small):
        tot = s.sum()
        if tot == 0:
            continue
        yy, xx = np.indices(s.shape)
        cy, cx = (s * yy).sum() / tot, (s * xx).sum() / tot
        oy, ox = int(np.floor(14 - cy)), int(np.floor(14 - cx))
        for r in range(24):
            Y = r + oy
            if 0 <= Y < 28:
                lo, hi = max(0, -ox), min(24, 28 - ox)
                if lo < hi:
                    out[i, Y, lo + ox:hi + ox] = s[r, lo:hi]
    return out.reshape(-1, 784)


def augment(img, rng):
    ang = np.deg2rad(rng.uniform(-14, 14))
    sc = rng.uniform(0.85, 1.15)
    shear = rng.uniform(-0.25, 0.25)
    asp = rng.uniform(0.8, 1.2)
    m = np.array([[np.cos(ang), -np.sin(ang)], [np.sin(ang), np.cos(ang)]]) @ np.array([[1, shear], [0, 1]]) @ np.diag([1, asp]) / sc
    c = np.array([14, 14])
    return ndimage.affine_transform(img, m, offset=c - m @ c, order=1)


def prep_chunk(args):
    imgs, seed = args
    if seed is None:
        return canonicalize(imgs)
    r = np.random.default_rng(seed)
    return canonicalize(np.stack([augment(i, r) for i in imgs]))


def prep(pool, imgs, seed=None):
    chunks = np.array_split(imgs, 64)
    seeds = [None] * 64 if seed is None else [seed * 1000 + k for k in range(64)]
    return np.concatenate(pool.map(prep_chunk, list(zip(chunks, seeds))))


def load(mnist_dir, name, header, shape):
    with gzip.open(os.path.join(mnist_dir, name), 'rb') as f:
        return np.frombuffer(f.read(), np.uint8, offset=header).reshape(shape)


if __name__ == '__main__':
    mnist_dir = sys.argv[1]
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'models')
    xtr = load(mnist_dir, 'train-images-idx3-ubyte.gz', 16, (-1, 28, 28)).astype(np.float32) / 255
    ytr = load(mnist_dir, 'train-labels-idx1-ubyte.gz', 8, (-1,))
    xte = load(mnist_dir, 't10k-images-idx3-ubyte.gz', 16, (-1, 28, 28)).astype(np.float32) / 255
    yte = load(mnist_dir, 't10k-labels-idx1-ubyte.gz', 8, (-1,))
    pool = Pool(min(16, os.cpu_count() or 4))
    print('canonicalizing test set...', flush=True)
    xte_c = prep(pool, xte)

    sizes = [784, 512, 256, 10]
    W = [rng.normal(0, np.sqrt(2 / a), (a, b)).astype(np.float32) for a, b in zip(sizes[:-1], sizes[1:])]
    B = [np.zeros(b, np.float32) for b in sizes[1:]]
    params = W + B
    m_ = [np.zeros_like(p) for p in params]
    v_ = [np.zeros_like(p) for p in params]
    t = 0


    def forward(x, train=False):
        acts = [x]
        for i in range(len(W)):
            z = acts[-1] @ W[i] + B[i]
            if i < len(W) - 1:
                z = np.maximum(z, 0)
                if train:
                    z *= (rng.random(z.shape) > 0.2) / 0.8
            acts.append(z)
        return acts


    epochs, bs = 12, 128
    for ep in range(epochs):
        lr = 1e-3 * (0.5 ** (ep // 4))
        xa = prep(pool, xtr, seed=ep + 1)
        perm = rng.permutation(len(xa))
        for s in range(0, len(xa), bs):
            idx = perm[s:s + bs]
            x, y = xa[idx], ytr[idx]
            acts = forward(x, train=True)
            logits = acts[-1]
            p = np.exp(logits - logits.max(1, keepdims=True))
            p /= p.sum(1, keepdims=True)
            g = p
            g[np.arange(len(y)), y] -= 1
            g /= len(y)
            gW, gB = [None] * len(W), [None] * len(W)
            for i in reversed(range(len(W))):
                gW[i] = acts[i].T @ g
                gB[i] = g.sum(0)
                if i > 0:
                    g = (g @ W[i].T) * (acts[i] > 0)
            t += 1
            for k, (p_, gr) in enumerate(zip(params, gW + gB)):
                m_[k] = 0.9 * m_[k] + 0.1 * gr
                v_[k] = 0.999 * v_[k] + 0.001 * gr * gr
                p_ -= lr * (m_[k] / (1 - 0.9 ** t)) / (np.sqrt(v_[k] / (1 - 0.999 ** t)) + 1e-8)
        acc = (forward(xte_c)[-1].argmax(1) == yte).mean()
        print(f'epoch {ep + 1}/{epochs} lr={lr:.0e} test_acc={acc:.4f}', flush=True)

    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, 'digits.bin'), 'wb') as f:
        for w, b in zip(W, B):
            f.write(w.astype('<f4').tobytes())
            f.write(b.astype('<f4').tobytes())
    with open(os.path.join(out_dir, 'digits.json'), 'w') as f:
        json.dump({'layers': [[a, b] for a, b in zip(sizes[:-1], sizes[1:])], 'input': 28, 'preprocess': 'skeleton-v1', 'testAccuracy': float(acc)}, f)
    print('saved to', os.path.abspath(out_dir))
