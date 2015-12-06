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

## Setup for iisnode

First ensure [iisnode](https://github.com/tjanczuk/iisnode) and [IIS URL Rewrite](http://www.iis.net/downloads/microsoft/url-rewrite) are installed (obviously [IIS](https://www.iis.net/) has to be [enabled](1)). I've added the `web.config` file already.

Then, in the left pane under the computer name, **right click _Sites_** and select **_Add website_**.

In the modal, set **Site name** to `tickity` or whatever really), and use _tickity_ as the **Application pool** (which should be automatically set). Set the **Physical path** to the actual folder path to the project (in my case `C:\development\kugghuset\customer-engine`). In the binding section of the modal, let **Type** be _http_, **IP adress** to _All unassigned_ and **Port** to _80_. Finally, set the **Host name** to `tickity.localhost`. Then click **OK**.

Verify it works by in the browser of you choice, navigate to: <http://tickity.localhost>

To have the application run on startup, in the left pane, click **Application pools**, and in the list, **right click _tickity_** and select **Advanced settings...**. In the modal, set **Start mode** to _Always running_. **OK**

<!-- References -->

[1]: https://msdn.microsoft.com/en-us/library/ms181052(v=vs.80).aspx