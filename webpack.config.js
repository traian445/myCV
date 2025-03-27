'use strict'

const path = require('path')
let fs = require('fs');
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Define source and output paths
const paths = {
    source: path.resolve(__dirname, './src/'),
    output: path.resolve(__dirname, './dist/'),
};

// Paths for static assets
const favicon = path.resolve(paths.source + '/src/images/favicon.ico');
const myHeader = fs.readFileSync(paths.source + '/views/header.html');
const myBanner = fs.readFileSync(paths.source + '/views/banner.html');
const myAbout = fs.readFileSync(paths.source + '/views/about.html');
const myPort = fs.readFileSync(paths.source + '/views/portfolio.html');
const myContact = fs.readFileSync(paths.source + '/views/contact.html');
const myFooter = fs.readFileSync(paths.source + '/views/footer.html');

module.exports = {
    stats: {
        errorDetails: true,
        children: true
    },
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'assets/js/main.bundle.js',
        path: paths.output,
        clean: true, // Clean dist folder before generating new build
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            favicon: favicon,
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            // Passing custom variables to HTML template
            templateParameters: {
                myHeader: myHeader,
                myBanner: myBanner,
                myFooter: myFooter,
            }
        }),
        new miniCssExtractPlugin({
            filename: 'assets/css/main.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(paths.source, 'images'),
                    to: path.resolve(paths.output, 'src/images'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext][query]'
                }
            },
            {
                test: /\.(scss)$/i,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: "compressed",
                            }
                        }
                    }
                ]
            },
            {
                test: /\.json$/i,
                type: 'json'
            },
            {
                test: /\.(jpe?g|png|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './assets/images/[name].[hash:6][ext]',
                },
            },
            {
                test: /\.(js|ts)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    performance: { hints: false, maxAssetSize: 100000 }
}
