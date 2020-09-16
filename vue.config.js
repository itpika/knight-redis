const path = require('path')
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
	outputDir: 'dist',
	publicPath: './',
	devServer: {
		port: 8000
	},
	pages: {
		index: {
			// page 的入口
			entry: 'front/main.js',
			// 在 dist/index.html 的输出
			filename: 'index.html'
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@': resolve('./')
			}
		}

	}
}
