const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("node:path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const baseResolveRequest = config.resolver.resolveRequest;
const nativewindConfig = withNativewind(config);
const nativewindResolveRequest = nativewindConfig.resolver.resolveRequest;
const expoAssetDirectory = path.dirname(require.resolve("expo-asset/package.json")) + path.sep;

nativewindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // NativeWind 5 RC0 omits the AssetRegistry export added in React Native 0.88.
  // Let expo-asset use React Native directly until that compatibility gap is fixed.
  if (
    platform !== "web" &&
    moduleName === "react-native" &&
    context.originModulePath.startsWith(expoAssetDirectory)
  ) {
    const resolveRequest = baseResolveRequest ?? context.resolveRequest;
    return resolveRequest(context, moduleName, platform);
  }

  return nativewindResolveRequest(context, moduleName, platform);
};

module.exports = nativewindConfig;
