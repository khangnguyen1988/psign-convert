const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 30000
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue'
      }
    }
  }
})
