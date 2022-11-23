module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  dependencies: {
    'react-native-audiowaveform': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
   },
  },
  assets: ['./Assets/Fonts/'], // stays the same
};
