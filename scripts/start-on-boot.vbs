' เปิดเว็บแอป Master M/C Plan อัตโนมัติตอนเปิดเครื่อง
' ทำงาน 2 อย่าง: (1) สตาร์ท server เบื้องหลังแบบไม่มีหน้าต่างขึ้นมากวนใจ (2) รอให้ server ติดแล้วเปิดเบราว์เซอร์เข้าเว็บให้เลย
' ถ้า server รันอยู่แล้วจากก่อนหน้า (พอร์ตชนกัน) ตัวที่สั่งรันซ้ำจะ error เงียบๆ แล้วปิดตัวเองไป ไม่กระทบของเดิมที่รันอยู่
Set WshShell = CreateObject("WScript.Shell")
projectPath = "C:\Python\Plannin code noon"
appUrl = "http://localhost:3000"

WshShell.CurrentDirectory = projectPath
WshShell.Run "cmd /c cd /d """ & projectPath & """ && node server.js", 0, False

WScript.Sleep 3000
WshShell.Run appUrl, 1, False
