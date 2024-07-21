
require("dotenv").config();
module.exports = {
    siteName: 'My Gridsome Site',
    plugins: [],
    port: process.env.PORT || "8080",
    chainWebpack: config => {
        config
            .plugin("env")
            .use(require.resolve("webpack/lib/EnvironmentPlugin"), [
                "CONSUMER_BACKEND_URL",
            ]);
    }
}

