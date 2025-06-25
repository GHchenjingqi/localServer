const express = require('express');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const serveStatic = require('serve-static');
const config = require('./config');
const fs = require('fs');
const { promisify } = require('util');
app.use(compression());

// 抓取json文件
if (config.grabJson) {
  const LOG_DIR = path.join(__dirname, 'json');
  const writeFileAsync = promisify(fs.writeFile);
  app.use(config.apistart, createProxyMiddleware({
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
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('请求拦截器执行');
        const interfaceName = req.originalUrl.split('?')[0].replace(/^\//, '').replace(/\//g, '_') || 'root';
        req._interfaceName = interfaceName;
      },
      proxyRes: async (proxyRes, req, res) => {
        console.log('响应拦截器执行');
        const interfaceName = req._interfaceName || 'unknown';
        const filePath = path.join(LOG_DIR, `${interfaceName}.json`);

        // 使用流处理响应数据
        const responseChunks = [];
        proxyRes.on('data', (chunk) => responseChunks.push(chunk));

        proxyRes.on('end', async () => {
          try {
            const responseBody = Buffer.concat(responseChunks).toString('utf8');
            await writeFileAsync(filePath, responseBody);
            console.log(`日志已保存: ${filePath}`);
          } catch (err) {
            console.error('保存日志失败:', err);
          }
        });
      }
    }
  }));
} else {
  if (config.localMode) {
    // json 模式
    // json 模式
    const LOG_DIR = path.join(__dirname, 'json');
    const readFileAsync = promisify(fs.readFile);
    
    app.use(config.apistart, async (req, res, next) => {
      try {
        // 生成接口对应的文件名
        const interfaceName = req.originalUrl.split('?')[0].replace(/^\//, '').replace(/\//g, '_') || 'root';
        const filePath = path.join(LOG_DIR, `${interfaceName}.json`);
        
        console.log(`[本地模式] 尝试读取文件: ${filePath}`);
        
        // 读取文件内容
        const fileContent = await readFileAsync(filePath, 'utf8');
        
        // 尝试解析为 JSON（如果失败则按原始文本处理）
        let responseData;
        try {
          responseData = JSON.parse(fileContent);
        } catch (jsonErr) {
          responseData = fileContent;
        }
        
        // 设置响应头（默认为 JSON，可根据需要调整）
        res.setHeader('Content-Type', 'application/json');
        
        // 返回本地数据
        res.send(responseData);
      } catch (err) {
        console.error(`[本地模式] 读取文件失败: ${err.message}`);
        
        // 文件不存在或其他错误，返回 404 或自定义错误
        if (err.code === 'ENOENT') {
          res.status(404).send(`本地模拟数据不存在: ${req.originalUrl}`);
        } else {
          res.status(500).send(`读取本地数据失败: ${err.message}`);
        }
      }
    });
  } else {
    // 配置 API 代理（放在通配符路由之前）
    app.use(config.apistart, createProxyMiddleware({
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
      compress: true
    }));
  }
}




// 配置静态文件服务
const STATIC_DIR = path.join(__dirname, 'web');
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