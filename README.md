# `Initializr` [![npm](https://img.shields.io/npm/v/:package.svg?style=flat-square)](https://www.npmjs.com/package/initializr) [![npm](https://img.shields.io/npm/dt/:package.svg?style=flat-square)](https://npmcharts.com/compare/initializr) [![NpmLicense](https://img.shields.io/npm/l/:package.svg?style=flat-square)](https://github.com/artisawesm/initializr/blob/master/LICENSE)

An automation tool for creating single page applications.

# What do we have here

**`Initializr`** is a tool powered by [Gulp](https://gulpjs.com/) and [Webpack](https://webpack.js.org/) that minifies and bundles your assets, provides a SEO friendly boilerplate and can be used with [React JS](https://reactjs.org/) (and soon to have [Vue JS](https://vuejs.org/) as well).

# Setting up

1. Open your bash/terminal and clone [**`Initializr`**](https://github.com/artisawesm/initializr).
2. Install all the dependencies using `npm run ini:setup`.
3. Then run **`Initializr`** by typing `npm run ini` on your bash/terminal.

Congratulations, you're now using **`initializr`**!.

# How `initializr` works

Simply type `npm run` followed by the command. i.e. `npm run ini`.

1. **ini:setup** : install dependencies.
2. **ini** : start **`initializr`** in `development` mode.
3. **ini:prod** : bundles and minifies `JS` and `CSS` files for `production`.

**PHPloy Commands for `initializr`**

**`initializr`** is also using [PHPloy](https://github.com/banago/PHPloy) for deployment.

1. **ini:phploy** : this will setup PHPloy on your directory by adding `phploy.ini` file.
2. **ini:deploy** : this will deploy your changes on the server.

# Thanks!

Thank you for choosing **`initializr`**, this project started as a solution for my personal issues in development, hopefully it can solve yours.

</> with :heart: by [Art](https://artisawesm.com/)
