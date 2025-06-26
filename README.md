# localServer

本地离线服务：vue/react/html5 打包后的文件在本地运行，支持API跨域/离线API，实现本地预览上线后的效果

### 用途（个人观点）

1.验证生产包异常：当上线效果不一致时，localServer就可以模拟是不是前端包的问题（接口指向生产地址）。

2.本地离线服务：前端项目+离线报文 = 本地离线服务 ，无需使用phpstudy等进行配置。

### 使用步骤

1.安装

```
npm install
```

2.修改配置 config.js

- target 后端接口地址
- apistart API拦截开头字符
- pathRewite 规则重写对象
- localMode 是否开启本地模式，默认false不开启，ture开启后不走代理，响应数据从json目录返回；
- grapJson 是否抓取接口数据，用于给本地模式抓取数据

注意：grapJson仅代理模式生效，grapJson为true时，localMode必须为false!!!

代理配置案例1：真实接口不带‘/api' 需要重写规则，如下：

```js
module.exports ={
    target: 'http://127.0.0.1:6080', // 接口域名
    apistart: '/api', // api前缀
    // 需要rewrite的接口
    pathRewrite: {
        '^/api': ''
    },
    // localMode 和 grabJson 二选一，不可同时开启
    localMode: false, // 是否开启本地模式，默认关闭 false - 开启之后 接口响应内容从json目录读取
    grabJson: false, // 是否抓取json数据，默认关闭 false - 开启之后 抓取接口数据保存在json目录下
}
```

代理配置案例2：真实接口带‘/api' ，如下：

```js
module.exports ={
    webPort: 13000,
    target: 'http://192.168.11.50:8190/api', // 接口域名
    apistart: '/api', // api前缀
    // 代理需要rewrite的规则
    pathRewrite: {},
    // localMode 和 grabJson 二选一，不可同时开启
    localMode: false, // 是否开启本地模式，默认关闭 false - 开启之后 接口响应内容从json目录读取
    grabJson: false, // 是否抓取json数据，默认关闭 false - 开启之后 抓取接口数据保存在json目录下
}
```

抓取接口配置：grapJson 改为true ,请求会保存到json目录中。

```js
module.exports ={
    target: 'http://127.0.0.1:6080', // 接口域名
    apistart: '/api', // api前缀
    // 需要rewrite的接口
    pathRewrite: {
        '^/api': ''
    },
    // localMode 和 grabJson 二选一，不可同时开启
    localMode: false, // 是否开启本地模式，默认关闭 false - 开启之后 接口响应内容从json目录读取
    grabJson: true, // 是否抓取json数据，默认关闭 false - 开启之后 抓取接口数据保存在json目录下
}
```

本地模式：请求接口时，将返回本地json目录的数据，代理转发将自动关闭！

```js
module.exports ={
    target: 'http://127.0.0.1:6080', // 接口域名
    apistart: '/api', // api前缀
    // 需要rewrite的接口
    pathRewrite: {
        '^/api': ''
    },
    // localMode 和 grabJson 二选一，不可同时开启
    localMode: true, // 是否开启本地模式，默认关闭 false - 开启之后 接口响应内容从json目录读取
    grabJson: false, // 是否抓取json数据，默认关闭 false - 开启之后 抓取接口数据保存在json目录下
}
```

3.运行

```
npm run dev
```

4.将打包后的文件复制到web目录！

### 插件声明

1. "compression": "^1.8.0" - API请求压缩
2. "express": "^5.1.0" - 提供接口拦截
3. "http-proxy-middleware": "^3.0.5" - 实现代理转发，解决跨域
