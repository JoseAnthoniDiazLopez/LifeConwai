@echo off
REM Inicializar el repositorio
git init

REM Agregar todos los archivos
git add .

REM Hacer el commit inicial
git commit -m "1.0"

REM Pedir la URL del repositorio
set /p repo_url="Introduce la URL del repositorio: "

REM Conectar el repositorio local con el remoto
git remote add origin %repo_url%

REM Subir los cambios al repositorio remoto
git push -u origin master

echo Todo hecho! El repositorio se ha subido a %repo_url%.
pause
