module.exports = {
    test: {
        player: 'FakePlayer', // TODO: Make a TestPlayer.
    },
    development: {
        player: 'MPlayer',
    },
    production: {
        player: 'OmxPlayer',
    },
};
