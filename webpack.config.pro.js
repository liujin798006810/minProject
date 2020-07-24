const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')            // 自动生成html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')      // 删除打包文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')     // 将css单独打包成一个文件

module.exports = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        contentBase: '/dist',
        open: true
    },
    resolve: {
        'extensions': ['.ts', '.js', '.json'],  //设置引入文件可以省略后缀名
    },
    module: {   //设置loader加载规则
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],   //使用css分离插件 MiniCssExtractPlugin
                exclude: [              //排除此模块文件
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {        //使用css分离插件 MiniCssExtractPlugin
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'    //设置css的class名称
                        }
                    }
                }],
                include: [      //包含此模块文件
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.(eot|woff2|woff|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'font'  //设置字体图标文件打包生成的文件夹
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node-modules/         //排除此模块文件
            }
        ]
    },
    plugins: [      //使用webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
    mode: 'production'     //设置生产模式
}