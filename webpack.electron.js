const path = require("path");

module.exports = {
    // Build Mode
    mode: "development",
    // Electron Entrypoint
    entry: "./src/main/index.ts",
    target: "electron-main",
    resolve: {
        alias: {
            ["@"]: path.resolve(__dirname, "src"),
        },
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: "ts-loader" }],
            },
            {
                test: /\.node$/,
                loader: "node-loader",
            },
        ],
    },
    output: {
        path: __dirname + "/dist",
        filename: "main.js",
    },
    externals: {
        "better-sqlite3": "commonjs better-sqlite3",
    },
};
