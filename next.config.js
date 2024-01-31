/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const nextConfig = {
  output:'export',
  reactStrictMode: true,
  webpack2: true,
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  optimization: {
    scripts: true,
    styles: {
       minify: false,
       inlineCritical: false
    },
    fonts: true
  },
  experimental: {
    images: {
      allowFutureImage: true
    }
  },
  webpack: (config, { isServer, webpack }) => {
    if(!isServer){
      config.plugins.push(
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
        })
        );
      }
    return config;
  },
};

module.exports = nextConfig;
