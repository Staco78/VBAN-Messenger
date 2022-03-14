const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/renderer/index.tsx",
    target: "electron-renderer",
    devtool: "source-map",
    resolve: {
        alias: {
            ["@"]: path.resolve(__dirname, "src"),
            ["@@"]: path.resolve(__dirname, "src/renderer"),
        },
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: "ts-loader" }],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/dist",
        filename: "renderer.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/renderer/index.html",
        }),
    ],
};
