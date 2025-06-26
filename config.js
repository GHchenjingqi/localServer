module.exports ={
    webPort: 13000,
    target: 'http://192.168.11.50:8190', // 接口域名
    apistart: '/api', // api前缀
    // 代理需要rewrite的规则
    pathRewrite: {
        '^/api': ''
    },
    // localMode 和 grabJson 二选一，不可同时开启
    localMode: false, // 是否开启本地模式，默认关闭 false - 开启之后 接口响应内容从json目录读取
    grabJson: false, // 是否抓取json数据，默认关闭 false - 开启之后 抓取接口数据保存在json目录下
}