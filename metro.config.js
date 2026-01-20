// // const { getDefaultConfig } = require('expo/metro-config');

// // const config = getDefaultConfig(__dirname);



// // metro.config.js
// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = getDefaultConfig(__dirname);

// // Add wasm asset support for SQLite on web
// config.resolver.assetExts.push('wasm');

// // Add COEP and COOP headers for SharedArrayBuffer
// config.server.enhanceMiddleware = (middleware) => {
//   return (req, res, next) => {
//     res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     middleware(req, res, next);
//   };
// };

// module.exports = withNativeWind(config, { input: './global.css' });
// // module.exports = config;


const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add wasm asset support for SQLite on web
config.resolver.assetExts.push('wasm');

// For Web support with SQLite
// Note: enhanceMiddleware is deprecated, use createMiddleware instead
config.server = {
  ...config.server,
  unstable_createMiddleware: (metroMiddleware, metroServer) => {
    return async (req, res, next) => {
      // Add COEP and COOP headers for SharedArrayBuffer (required for SQLite on web)
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      
      // Call the original metro middleware
      return metroMiddleware(req, res, next);
    };
  }
};

// Enable extra optimization for NativeWind
config.transformer = {
  ...config.transformer,
  // This helps with NativeWind optimization
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(config, { 
  input: './global.css',
  // Optional: Add these for better NativeWind performance
  projectRoot: __dirname,
  watchFolders: [__dirname],
});