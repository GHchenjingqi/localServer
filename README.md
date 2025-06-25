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

```js
module.exports ={
    target: 'http://127.0.0.1:6080', // 接口地址
    apistart: '/api', // api前缀
    // 重写规则
    pathRewrite: {
        '^/api': ''
    }
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
