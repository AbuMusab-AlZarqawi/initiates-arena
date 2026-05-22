/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const path = require("path");

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /@react-native-async-storage\/async-storage/,
        path.resolve(__dirname, "src/lib/asyncStorageMock.js")
      )
    );
    return config;
  },
};

module.exports = nextConfig;
