// webpack 4
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');
const precss = require('precss');

const bundleExtractPlugin = new ExtractTextPlugin({
  filename: 'bundle.css',
});

module.exports = {
  devtool: 'eval',
  mode:process.env.mode || "development",
  entry: [
    'webpack/hot/only-dev-server',
    'font-awesome/scss/font-awesome.scss',
    './src/js/main.js',
    './src/scss/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'build/', // Relative directory for base of server
    publicPath: '/', // Live-reload
    hot:true,
    inline: true,
    port: process.env.PORT || 3000, // Port Number
    host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',      
      Popper: ['popper.js', 'default'], 
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Util: "exports-loader?Util!bootstrap/js/dist/util",    
    }),
    bundleExtractPlugin,
    new CopyWebpackPlugin([
      { from: 'src/**/*', to: 'build/', force: true, ignore: [ '*.js', '*.css', '*.scss' ] },
    ], {
      ignore: [ '*.js', '*.css', '*.scss' ]
    })
  ],
  module: {
     
    rules: [
    {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["es2015"] }
        }
      },
    {
      test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']
    },
    {
    test: /\.(scss)$/,    
    use: bundleExtractPlugin.extract({
    fallback:'style-loader',    
    use: [
      {
        loader: 'css-loader', // translates CSS into CommonJS modules
      }, {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins() {
            // post css plugins, can be exported to postcss.config.js
            return [
              precss,
              autoprefixer
            ];
          }
        }
      }, {
        loader: 'sass-loader' // compiles SASS to CSS
      }
    ]})
      
    },
    // Bootstrap 4
    {
      test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery'
    },
    // font-awesome
    {
      test: /font-awesome\.config\.js/,
      use: [
        { loader: 'style-loader' },
        { loader: 'font-awesome-loader' }
      ]
    },
    /*{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },*/
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  }
};
