# `Initializr` [![npm](https://img.shields.io/npm/v/initializr.svg?style=flat-square)](https://www.npmjs.com/package/initializr) [![npm](https://img.shields.io/npm/dm/initializr.svg?style=flat-square)](https://npmcharts.com/compare/initializr) [![NpmLicense](https://img.shields.io/npm/l/initializr.svg?style=flat-square)](https://github.com/artisawesm/initializr/blob/master/LICENSE)

An automation tool for creating single page applications.

# What do we have here

**`Initializr`** is a tool powered by [Gulp](https://gulpjs.com/) and [Webpack](https://webpack.js.org/) that minifies and bundles your assets, provides a SEO friendly boilerplate and can be used with [React JS](https://reactjs.org/) (and soon to have [Vue JS](https://vuejs.org/) as well).

# Setting up

1. Install [Node Js](https://nodejs.org/en/) and [Gulp Js](https://gulpjs.com/)
2. Open your bash/terminal and clone [**`Initializr`**](https://github.com/artisawesm/initializr).
3. Install all the dependencies using `npm run ini:setup`.
4. Then run **`Initializr`** by typing `npm run ini` on your bash/terminal.

Congratulations, you're now using **`initializr`**!.

# How `initializr` works

Simply type `npm run` followed by the command. i.e. `npm run ini`.

1. **ini:setup** : install dependencies.
2. **ini** : start **`initializr`** in `development` mode.
3. **ini:prod** : bundles and minifies `JS` and `CSS` files for `production`.

**PHPloy Commands for `initializr`**

**`initializr`** also supports [PHPloy](https://github.com/banago/PHPloy) for deployment. PHPloy can be installed using [composer](https://getcomposer.org/)

1. **ini:phploy** : this will setup PHPloy on your directory by adding `phploy.ini` file.
2. **ini:deploy** : this will deploy your changes on the server.

# Thanks!

Thank you for choosing **`initializr`**, this project started as a solution for my personal issues in development, hopefully it can solve yours.

</> with :heart: by [Art](https://artisawesm.com/)
