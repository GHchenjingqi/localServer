const express = require('express');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const serveStatic = require('serve-static');
const config = require('./config');
app.use(compression());



// 配置 API 代理（放在通配符路由之前）
app.use( config.apistart , createProxyMiddleware({
  target: config.target,
  changeOrigin: true,
  pathRewrite: config.pathRewrite,
  secure: false,
   pool: {
    maxSockets: 50,       // 最大并发连接数
    maxFreeSockets: 10,   // 空闲连接数上限
    timeout: 30000,       // 连接超时时间（毫秒）
    keepAliveMsecs: 30000 // 保持连接活跃时间
  },
  compress: true,
  onError: (err, req, res) => {
    console.error('代理错误:', err);
    res.status(500).send('代理服务器错误');
  }
}));

// 配置静态文件服务
const STATIC_DIR = path.join(__dirname, 'web');
// app.use(express.static(STATIC_DIR));
app.use(serveStatic(STATIC_DIR, {
  maxAge: '1d',  // 启用浏览器缓存
  etag: true     // 启用缓存校验
}));

// 通配符路由（处理 SPA 路由）
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// 使用环境变量或默认端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务运行在 http://127.0.0.1:${PORT}`);
});