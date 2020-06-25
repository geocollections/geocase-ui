const proxy = require('http-proxy-middleware');

const apiProxy = proxy({
  target: process.env.API_URL,
  pathRewrite: { '^/api': '' },
  auth: `${process.env.API_USER}:${process.env.API_PASS}`,
  changeOrigin: true,
  proxyTimeout: 100,
  timeout: 5000
});

module.exports = apiProxy
