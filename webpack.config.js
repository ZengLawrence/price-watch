const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = (env, argv) => {
   const isDev = argv.mode === 'development';

   return {
      mode: "production",
      entry: {
         content: path.resolve(__dirname, "src", "content.ts"),
         popup: path.resolve(__dirname, "src", "popup.ts"),
         background: path.resolve(__dirname, "src", "background.ts"),
      },
      output: {
         path: path.join(__dirname, "./dist"),
         filename: "[name].js",
      },
      resolve: {
         extensions: [".ts", ".js"],
      },
      module: {
         rules: [
            {
               test: /\.tsx?$/,
               loader: "ts-loader",
               exclude: /node_modules/,
            },
         ],
      },
      plugins: [
         new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
         }),
      ],
      devtool: isDev ? "cheap-module-source-map" : false,
   }
};