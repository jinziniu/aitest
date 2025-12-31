// API 配置
// 使用环境变量，如果没有设置则使用默认值
// 在 .env 文件中设置 VITE_API_BASE_URL 来覆盖默认值
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

