const proxy = require('http-proxy-middleware');
 module.exports = function(app) {
       app.use(
             '/proxy/api',
             proxy.createProxyMiddleware({
               target: 'http://localhost:3000/',
               changeOrigin: true,
               pathRewrite: {
                 '^/proxy/api': ''
               }
         })
       )
}