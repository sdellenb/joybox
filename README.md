# joybox
Simple touch-based media player with Web UI

## Targetted Hardware (i.e. tested with)
* Raspberry Pi 3 Model A+ running Raspbian Stretch
* Pimoroni HyperPixel 4.0 Touch Screen
* Adafruit Mini External USB Stereo Speaker

## Requirements
1. Node.js v10.x (LTS):  
https://github.com/nodesource/distributions/blob/master/README.md#debinstall

2. Yarn 1.12.x:  
https://yarnpkg.com/lang/en/docs/install/#debian-stable

3. Raspbian Stretch Packages (additional to Raspbian Lite)
* `omxplayer` for media playback
* `chromium-browser` for the Web UI

## Setup
1. Fork/Clone
2. Install dependencies with `yarn install`
3. Create the SQLite database and tables with `knex migrate:latest --env development`
4. Fill the library SQLite database with `npm scan`  
  This will execute `knex seed:run --env development` to seed the database with the contents of the `media` folder.
5. Fire up the server with `node start`
6. Start the front-end with `DISPLAY=:0 chromium-browser --kiosk http://localhost:3000`

## Notes
Volume control with amixer
```
amixer cset numid=3,iface=MIXER,name='PCM Playback Volume' 10%
```

Playback control with omxplayer
```
omxplayer -o alsa media/one_love.mp3
```
