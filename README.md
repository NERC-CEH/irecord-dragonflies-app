![iRecord Dragonfly](https://github.com/NERC-CEH/irecord-dragonfly-app/src/images/app_logo.png)
![Made By](https://github.com/NERC-CEH/irecord-dragonfly-app/src/images/sponsor_logo.png)

This is a British Dragonfly identification and recording mobile web application. 
HTML5 based offline mobile app linked to [iRecord](http://www.brc.ac.uk/irecord/) website.

Live: [British Dragonfly Society](http://www.british-dragonflies.org.uk/mobile)

## Configuration

App configuration hosted in `scr/conf.js`.

**Note:** it should be done *before* building the code.

## Building

- Install [NodeJS](http://nodejs.org/)
- Get a copy of the code by running:

```bash
git clone git://github.com/NERC-CEH/irecord-dragonfly-app.git
```

- Enter the `irecord-dragonfly-app` directory and install the npm build dependencies:

```bash
cd irecord-dragonfly-app && npm install
```

- Build the library: 

```bash
grunt
```

This will create a `dist` folder with the app code and its dependencies.


## Bugs and feature requests

Have a bug or a feature request? search for existing and closed issues. [Please open a new issue](https://github.com/NERC-CEH/mobile_dragonfly/issues).


## Creators

**Karolis Kazlauskis**

- <https://github.com/kazlauskis>



## Copyright and license

Code and documentation copyright 2015 CEH. Code released under the [GNU GPL v3 license](LICENSE).
Media (photos, maps) all rights reserved.