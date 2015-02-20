This is a Dragonfly mobile web application. HTML5 based offline mobile
app dedicated to UK dragonfly recording.

## Configuration

App configuration hosted in `scr/conf.js`.

**Note:** it should be done *before* building the code.

## Building

- Install [NodeJS](http://nodejs.org/)
- Clone a copy of the main rare-arable-flowers git repo by running:

```bash
git clone git://github.com/NERC-CEH/mobile_dragonfly.git
```

- Enter the `morel` directory and install the npm build dependancies:

```bash
cd mobile_dragonfly && npm install
```

- Build the library: 

```bash
grunt
```

This will create a `dist` folder with the app code.


## Bugs and feature requests

Have a bug or a feature request? search for existing and closed issues. [Please open a new issue](https://github.com/NERC-CEH/mobile_dragonfly/issues).


## Creators

**Karolis Kazlauskis**

- <https://github.com/kazlauskis>



## Copyright and license

Code and documentation copyright 2015 CEH. Code released under the [GNU GPL v3 license](LICENSE).