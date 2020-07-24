const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
                use: ['style-loader', 'css-loader'],
                exclude: [              //排除此模块文件
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
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
                use: ['file-loader']
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
        new CleanWebpackPlugin()
    ],
    mode: 'development'     //设置开发模式
}