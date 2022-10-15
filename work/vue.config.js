const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '^/': {
        target: 'http://localhost:3000',
        onProxyReq:function(proxyReq,req,res){
          console.log("remote addr: "+req.connection.remoteAddress);
          proxyReq.setHeader("X-Forwarded-for",req.connection.remoteAddress);
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.vue', '.js', '.json']
    }
  }
})
