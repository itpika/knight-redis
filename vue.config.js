const path = require('path')
module.exports = {
	outputDir: 'dist',
	publicPath: './',
	pages: {
		index: {
			// page 的入口
			entry: 'src/front/main.js',
			// 在 dist/index.html 的输出
			filename: 'index.html'
		}
	}
}
