@echo off

rem source
mkdir src\assets\scss\partials;
mkdir src\assets\js\;
mkdir src\assets\images;
mkdir src\lib\css;
mkdir src\lib\js;

rem app
mkdir app\assets\css;
mkdir app\assets\js;
mkdir app\assets\images;
mkdir app\lib\css;
mkdir app\lib\js;

rem html,js,css files
echo Create something awesome! > app\index.html;
echo //Main scss file > src\assets\scss\app.scss;
echo //Variables scss file > src\assets\scss\partials\_variables.scss;
echo //Main javascript file > src\assets\js\app.js;