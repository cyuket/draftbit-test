const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(react-native|expo|@expo|@react-native|react-native-maps|react-native-gesture-handler|react-native-reanimated|react-native-screens)/)',
];

module.exports = config;
