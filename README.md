# Customer Engine

A small customer support app written in NodeJS with Express, Angular and some other cool stuff.

## Setup

First, ensure Gulp and Bower are installed:

```bash
npm install -g gulp bower
```

Then, install all dependencies:

```bash
npm install
bower install
```

To ensure userConfig isn't changed by mistake, ensure to set it as `--assume-unchaged` or simply run `gulp assume-unchanged`.

```bash
git update-index --assume-unchanged userConfig.js
```

or simply

```bash
gulp assume-unchanged
```