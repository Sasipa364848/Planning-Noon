-- Master M/C Plan Dashboard — MySQL schema
-- See C:\Users\dsst24073\.claude\plans\quirky-wishing-snowglobe.md for the original design rationale.
--
-- Lives inside the existing shared `digital_transform_db` database (not a dedicated database — the
-- service account `dts_app` only has DDL rights on that one existing database, not CREATE DATABASE
-- globally). Every table is prefixed `mcplan_` to avoid any collision with that database's own tables
-- (he_check_*, lot_*, ms_*) and to make it obvious in a shared schema listing which tables are ours.
--
-- Run once against digital_transform_db to create all tables:
--   mysql -h <host> -P <port> -u dts_app -p digital_transform_db < db/schema.sql

USE digital_transform_db;

-- Reference data: known machine/mold groups. Groups are not created/deleted at runtime by the app
-- today (processConfig is hardcoded in public/js/app.js); only `label` is ever patched by admins.
-- process is VARCHAR, not ENUM: the app already went through adding a 4th process (AI) after this
-- schema was first drafted, which would have needed an ALTER TABLE under an ENUM — VARCHAR avoids
-- that recurring cost if a 5th process is ever added. Valid values are validated at the app layer
-- (server.js PROCESS_KEYS), same as process_status.process_key already does below.
CREATE TABLE mcplan_groups (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,       -- e.g. 'bw_dg1_esd', 'ai_t1_t3' — matches app.js processConfig group ids
  process     VARCHAR(10) NOT NULL,              -- 'BW' | 'LC' | 'CW' | 'AI'
  label       VARCHAR(255) NOT NULL DEFAULT '',  -- may contain literal '<br>' (rendered as-is by the frontend)
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Every model gets its own surrogate id, scoped to its group. This is what structurally fixes the
-- bugs the migration was designed to close:
--  - deleting/renaming a model whose name is a prefix of another's (e.g. "X2" vs "X2_Auto") can no
--    longer cross-match, because every model is addressed by id, not by string-prefix scanning.
--  - cover-code/color data below is keyed by model_id, so same-named models in different processes
--    (e.g. "G3" existing in both LC and CW) can no longer share one entry.
--  - AI's models: the JSON-side app stores AI model names as "<groupId>::<display name>" (a client-side
--    workaround, because AI has the same display name in two different groups — e.g. "AC-No cover_Auto"
--    exists in both "ai_t1_t3" and "ai_i1"). That workaround is unnecessary here: group_id already scopes
--    uniqueness (see uniq_group_name below), so the migration script stores just the plain display name.
CREATE TABLE mcplan_models (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  group_id    INT NOT NULL,
  name        VARCHAR(191) NOT NULL,   -- 191 not 255: stays under the 767-byte index limit with utf8mb4
  sort_order  INT NOT NULL DEFAULT 0,  -- preserves drag-reorder position
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_group_name (group_id, name),
  FOREIGN KEY (group_id) REFERENCES mcplan_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- groupParams: {oa, mct} — always written as one unit by the app, kept as one row per group.
CREATE TABLE mcplan_group_params (
  group_id  INT PRIMARY KEY,
  oa        DECIMAL(10,4) NULL,
  mct       DECIMAL(10,4) NULL,
  FOREIGN KEY (group_id) REFERENCES mcplan_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- cellData: the core daily planning-grid value (machine count) per model per day.
-- Real DATE column replaces the old "25-Aug" (no-year) string key.
CREATE TABLE mcplan_plan_cells (
  model_id     INT NOT NULL,
  plan_date    DATE NOT NULL,
  machine_qty  VARCHAR(32) NULL,  -- kept as string to match existing "" vs value semantics (never type-coerced by the app)
  PRIMARY KEY (model_id, plan_date),
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- cellComments: kept as a separate table from plan_cells (independently deletable in the app today —
-- clearing a cell's quantity must not delete its comment, and vice versa).
CREATE TABLE mcplan_plan_cell_comments (
  model_id   INT NOT NULL,
  plan_date  DATE NOT NULL,
  comment    TEXT NULL,
  PRIMARY KEY (model_id, plan_date),
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- coverData — scoped by model_id (fixes the cross-process name-collision bug that the JSON store hit
-- for real: CW's "G3" and LC's "G3" briefly shared one entry before the JSON-side fix that scoped
-- coverData keys as "<process>::<name>"; here model_id already does that structurally, no key trick needed).
CREATE TABLE mcplan_model_cover_code (
  model_id    INT PRIMARY KEY,
  cover_code  VARCHAR(32) NULL,
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- coverColors — kept separate from mcplan_model_cover_code (independently deletable in the app today).
CREATE TABLE mcplan_model_cover_color (
  model_id  INT PRIMARY KEY,
  color     VARCHAR(32) NULL,
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- coverCodeColors — genuinely global (shared per cover code across every model using that code),
-- not model-scoped, so this one stays keyed by the cover code itself.
CREATE TABLE mcplan_cover_code_colors (
  cover_code  VARCHAR(32) PRIMARY KEY,
  color       VARCHAR(32) NOT NULL
) ENGINE=InnoDB;

-- hrsData: working hours per process per day. Real DATE column, same rationale as plan_cells.
CREATE TABLE mcplan_process_hours (
  process_key  VARCHAR(10) NOT NULL,  -- 'BW' | 'LC' | 'CW' | 'AI'
  plan_date    DATE NOT NULL,
  hours        DECIMAL(6,2) NULL,
  PRIMARY KEY (process_key, plan_date)
) ENGINE=InnoDB;

-- revData
CREATE TABLE mcplan_process_rev (
  process_key  VARCHAR(10) PRIMARY KEY,  -- 'BW' | 'LC' | 'CW' | 'AI'
  rev          VARCHAR(32) NOT NULL DEFAULT '00'
) ENGINE=InnoDB;

-- timestamps + lastEditor merged into one table: the server always writes both together on every
-- save, so there's no independent-deletion concern that would argue for keeping them separate.
-- process_key is VARCHAR, not an enum of any kind: live data shows 'Overview' and 'Stock' also appear
-- here, not just BW/LC/CW/AI, since the app never enforced a fixed process set for these two fields.
CREATE TABLE mcplan_process_status (
  process_key       VARCHAR(20) PRIMARY KEY,
  last_saved_text   VARCHAR(64) NULL,
  last_editor       VARCHAR(128) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- stockData
CREATE TABLE mcplan_model_stock (
  model_id    INT PRIMARY KEY,
  qty         VARCHAR(32) NULL,
  updated_by  VARCHAR(64) NULL,
  updated_at  DATETIME NULL,
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- plannedUsedData — kept separate from mcplan_model_stock (independently deletable in the app today).
CREATE TABLE mcplan_model_planned_used (
  model_id    INT PRIMARY KEY,
  qty         VARCHAR(32) NULL,
  updated_by  VARCHAR(64) NULL,
  updated_at  DATETIME NULL,
  FOREIGN KEY (model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- sourceMap (BOM-style cross-process linkage). RESTRICT (not CASCADE) on the source side, so deleting
-- an upstream model that something downstream still depends on fails loudly instead of silently
-- orphaning the mapping — the old JSON code had no such protection at all.
CREATE TABLE mcplan_model_source_map (
  dest_model_id  INT PRIMARY KEY,
  src_model_id   INT NOT NULL,
  ratio          DECIMAL(8,4) NOT NULL DEFAULT 1,
  FOREIGN KEY (dest_model_id) REFERENCES mcplan_models(id) ON DELETE CASCADE,
  FOREIGN KEY (src_model_id)  REFERENCES mcplan_models(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE mcplan_announcements (
  id          VARCHAR(32) PRIMARY KEY,
  text        TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Append-only audit trail. No longer needs the old 200-row cap for storage reasons (MySQL doesn't
-- care) — full history can be retained; the API layer can still choose to return only the most
-- recent 200 to keep response payload size comparable to today.
CREATE TABLE mcplan_change_log (
  seq          INT AUTO_INCREMENT PRIMARY KEY,
  process_key  VARCHAR(20) NOT NULL,
  models_json  JSON NULL,
  editor       VARCHAR(128) NULL,
  username     VARCHAR(64) NULL,
  time_text    VARCHAR(64) NULL,      -- preserves the existing display string as-is (DD/MM/YYYY HH:mm:ss)
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mcplan_users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(64) NOT NULL UNIQUE,
  password_hash  CHAR(60) NOT NULL,               -- bcrypt hash, fixed length ($2b$10$... = 60 chars)
  role           ENUM('admin','process') NOT NULL,
  processes      JSON NOT NULL,                   -- subset of ['BW','LC','CW','AI','Stock'], validated at the app layer
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
