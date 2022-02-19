del /f clipnuke-chrome-extension.zip
7z a -tzip clipnuke-chrome-extension.zip -r build\* -x!*hot-update.*
7z rn clipnuke-chrome-extension.zip build\ clipnuke-chrome-extension\