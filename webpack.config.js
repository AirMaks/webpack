const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

const pages = fs
  .readdirSync(path.resolve(__dirname, "src"))
  .filter((fileName) => fileName.endsWith(".pug"));

const objArr = pages.map((page) => {
  fs.stat("./src/js/" + page.split(".")[0] + ".js", (err) => {
    if (err) {
      page.split(".")[0] = "";
      fs.writeFile(
        "./src/js/" + page.split(".")[0] + ".js",
        "import './app';\n" +
          "import '../styles/" +
          page.split(".")[0] +
          ".scss';",
        "utf8",
        (err) => {
          if (err) {
            return console.log(err);
          }
        }
      );
      fs.writeFile(
        "./src/styles/" + page.split(".")[0] + ".scss",
        "@import 'global';",
        "utf8",
        (err) => {
          if (err) {
            return console.log(err);
          }
        }
      );
    }
  });
  return {
    [page.split(".")[0]]: "./src/js/" + page.split(".")[0] + ".js",
  };
});

// console.log(objArr);

const entriesObj = objArr.reduce((result, current) => {
  return Object.assign(result, current);
}, {});

let mode = "development";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

let isDev = mode === "development";

module.exports = {
  mode: mode,
  entry: entriesObj,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
    clean: true,
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  devtool: isDev ? "source-map" : false,
  optimization: {
    splitChunks: {
      chunks: "all",
      // cacheGroups: {
      //   jquery: {
      //     test: /[\\/]node_modules[\\/]((jquery).*)[\\/]/,
      //     name: "libs/jquery",
      //     chunks: "all",
      //   },
      //   swiper: {
      //     test: /[\\/]node_modules[\\/]((swiper).*)[\\/]/,
      //     name: "libs/swiper",
      //     chunks: "all",
      //   },
      // },
    },
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  devServer: {
    watchFiles: ["./src"],
    static: {
      directory: path.resolve(__dirname, "./src"),
    },
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",

          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        loader: "image-webpack-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "./assets/images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "./assets/fonts/[name][ext]",
        },
      },
      {
        test: /\.pug$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: isDev,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].[contenthash].css",
    }),

    ...pages.map((page) => {
      return new HtmlWebpackPlugin({
        filename: page.split(".")[0] + ".html",
        template: "./src/" + page,
        chunks: [page.split(".")[0]],
        minify: {
          collapseWhitespace: false,
          removeComments: true,
        },
        // favicon: "./src/favicon.svg",
      });
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./src/js/libs"), to: "./js/libs" },
        {
          from: path.resolve(__dirname, "./src/styles/libs"),
          to: "./css/libs",
        },
      ],
    }),
  ],
};
