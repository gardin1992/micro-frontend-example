const HtmlWebpackPlugin = require("html-webpack-plugin");

const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;

const { NODE_ENV } = process.env;
const MODULE_NAME = "cpFrontEndLogin";

const moduleFederationPluginProps = {
  name: MODULE_NAME,
  filename: "remoteEntry.js",
  exposes: {
    "./Header": "./src/components/Header",
  },
};

if (NODE_ENV !== "local") {
  moduleFederationPluginProps.shared = {
    react: {
      requiredVersion: false,
      singleton: true,
    },
  };
}

const getEnvFilename = (nodeEnv) => {
  switch (nodeEnv) {
    case "local":
      return __dirname + "/.env.local";
    case "development":
      return __dirname + "/.env.development";
    default:
      return __dirname + "/.env";
  }
};

require("dotenv").config({ path: getEnvFilename(NODE_ENV) });

const { ENV, PORT } = process.env;
console.log("ENV", ENV);
console.log("PORT", PORT);

module.exports = {
  entry: "./src/index",
  target: "web",
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin(moduleFederationPluginProps),
  ],
  devServer: {
    port: PORT ?? 8080,
  },
};
