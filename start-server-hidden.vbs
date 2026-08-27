Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Python\Plannin code noon"
WshShell.Run "cmd /c npm start >> server-log.txt 2>&1", 0, False
