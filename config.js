module.exports ={
    target: 'http://127.0.0.1:6080', // 接口域名
    apistart: '/api', // api前缀
    // 需要rewrite的接口
    pathRewrite: {
        '^/api': ''
    }
}