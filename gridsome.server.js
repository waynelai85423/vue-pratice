
const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = function(api) {
    api.chainWebpack((config, { isServer }) => {
        if (isServer) {
        }
    });

    api.configureServer(app => {
        app.use(
            `${process.env.PATH_PREFIX || ""}/consumer-api`,
            createProxyMiddleware({
                target: `${process.env.CONSUMER_BACKEND_URL}`,
                changeOrigin: true,
                pathRewrite: {
                    "^/consumer-api": "/"
                }
            })
        );
    });
}
