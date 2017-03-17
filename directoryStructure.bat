@echo off
mkdir dist\assets\css\lib;
mkdir dist\assets\js\lib;
mkdir dist\assets\fonts;
mkdir dist\assets\images;

mkdir src\assets\css\lib;
mkdir src\assets\js\lib;
mkdir src\assets\images;
mkdir src\scss\partials;

echo //Main pug file > src\index.pug
echo //Main scss file > src\scss\main.scss
echo //Variables scss file > src\scss\partials\_variables.scss
echo //Constant scss file (for constant elements) > src\scss\partials\_constant.scss
echo //Main javascript file > src\assets\js\main.js