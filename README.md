# joybox
Simple touch-based media player with Web UI

## Requirements
Node.js v10.x (LTS):
https://github.com/nodesource/distributions/blob/master/README.md#debinstall

Yarn 1.12.x:
https://yarnpkg.com/lang/en/docs/install/#debian-stable

Raspbian Stretch Packages
* omxplayer
* chromium-browser

## Setup
```
yarn install
node run
```

Start the front-end with
```
DISPLAY=:0 chromium-browser --kiosk http://localhost:3000
```

