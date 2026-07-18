const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// lucide-react-native's package.json "exports" map points the "react-native"
// condition at its .mjs ESM build, but Metro doesn't resolve .mjs by default.
config.resolver.sourceExts.push('mjs');

module.exports = config;
