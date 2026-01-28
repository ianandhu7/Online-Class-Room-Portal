const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Proxy API requests to Django backend
app.use('/api', createProxyMiddleware({
  target: 'https://classroom-portal-backend.onrender.com',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to Django backend`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Proxy server running',
    target: 'https://classroom-portal-backend.onrender.com',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📡 Proxying API requests to: https://classroom-portal-backend.onrender.com`);
  console.log(`🌐 Update your frontend VITE_API_URL to: http://localhost:${PORT}/api`);
});