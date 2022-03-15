const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPLugin = require("copy-webpack-plugin");
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
            ["css"]: path.resolve(__dirname,"src/renderer/assets")
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
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[local]-[hash:base64:8]",
                            },
                        },
                    },
                ],
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
        new CopyPLugin({
            patterns: [{ from: path.resolve(__dirname, "src", "renderer", "assets"), to: path.resolve(__dirname, "dist", "assets") }],
        }),
    ],
};
