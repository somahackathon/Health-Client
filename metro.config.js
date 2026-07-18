const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// lucide-react-native's package.json "exports" map points the "react-native"
// condition at its .mjs ESM build, but Metro doesn't resolve .mjs by default.
config.resolver.sourceExts.push('mjs');

// expo-sqlite's web backend (wa-sqlite) ships a .wasm binary that Metro
// only bundles as an asset, not a source module, once this extension is registered.
config.resolver.assetExts.push('wasm');

module.exports = config;
