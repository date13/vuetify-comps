const path = require('path');
const resolve = dir => require('path').join(__dirname, dir);
const TerserPlugin = require('terser-webpack-plugin');
const {ProgressPlugin} = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const env = process.env.NODE_ENV;
const isProd = env === 'production'
const publicPath = isProd
  ? '/'
  : '/';

console.log(`run env:${env}`);


module.exports = {
  parallel: require('os').cpus().length > 1,
  devServer: {
    host: 'localhost',
    port: 8003,
    compress: true,
    https: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: publicPath,
  productionSourceMap: !isProd,
  configureWebpack: config => {
    config.plugins.push(new ProgressPlugin());
    if (isProd) {
      config.performance = {
        hints: 'warning', // 枚举
        maxAssetSize: 30000000, // 整数类型（以字节为单位）
        maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
        assetFilter: function (assetFilename) {
          // 提供资源文件名的断言函数
          return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
      };
      /*config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_debugger: false,
              drop_console: true,
            },
          },
          sourceMap: false,
          parallel: true,
        })
      );*/
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8
      }));
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'vuetify': 'Vuetify',
        'lodash':'_',
        'echarts': 'echarts'
      };
      config.optimization = {
        // runtimeChunk: 'single',
        runtimeChunk: {
          name: entrypoint => `runtimechunk~${entrypoint.name}`
        },// 不使用可读的模块标识符进行调试
        namedModules: false,
        // 不使用可读的块标识符进行调试
        namedChunks: false,
        // 标记块是否是其它块的子集
        // 控制加载块的大小（加载较大块时，不加载其子集）
        flagIncludedChunks: true,
        // 标记模块的加载顺序，使初始包更小
        occurrenceOrder: true,
        // 启用副作用
        sideEffects: true,
        // 确定每个模块的使用导出，
        // 不会为未使用的导出生成导出
        // 最小化的消除死代码
        // optimization.usedExports 收集的信息将被其他优化或代码生成所使用
        usedExports: true,
        // 查找模块图中可以安全的连接到其它模块的片段
        concatenateModules: true,
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false, // Must be set to true if using source-maps in production
            terserOptions: {
              compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
              }
            }
          }),
        ],
        splitChunks: {
          // 默认 webpack4 只会对按需加载的代码做分割
          chunks: 'async',
          // 表示在压缩前的最小模块大小,默认值是30kb
          minSize: 30000,
          // 旨在与HTTP/2和长期缓存一起使用
          // 它增加了请求数量以实现更好的缓存
          // 它还可以用于减小文件大小，以加快重建速度。
          maxSize: 0,
          // 分割一个模块之前必须共享的最小块数
          minChunks: 1,
          // 按需加载时的最大并行请求数
          maxAsyncRequests: 6,
          // 入口的最大并行请求数
          maxInitialRequests: 4,
          // 界定符
          automaticNameDelimiter: '~',
          // 块名最大字符数
          automaticNameMaxLength: 30,
          cacheGroups: { // 缓存组
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        },
        // 当打包时，遇到错误编译，将不会把打包文件输出
        // 确保 webpack 不会输入任何错误的包
        noEmitOnErrors: true,
        checkWasmTypes: true,
      };
    }
    /*plugins: [
      new webpack.ProvidePlugin({
        $: 'zepto',
        Zepto: 'zepto',
        'window.Zepto': 'zepto'
      }),
    ]*/
  },
  chainWebpack: webpackConfig => {
    if (isProd) {
      webpackConfig.plugin('html')
        .tap(args => {
          args[0].cdn = cdn;
          return args;
        });

    }

    webpackConfig.resolve
      .symlinks(true)

    webpackConfig.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))

    /*const entry = webpackConfig.entry('app')
    entry
      .add('babel-polyfill')
      .end()*/

    webpackConfig.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {limit: 10240}));
  },
};
