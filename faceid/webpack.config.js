const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    config.resolve = config.resolve || {};
    config.resolve.fallback = config.resolve.fallback || {};
    config.resolve.fallback.crypto = require.resolve('expo-crypto');
    return config;
};

//this was created because of the crypto issue that we had when implementing the core nodejs crypto library
//so im trying this workaround with the expo-crypto library