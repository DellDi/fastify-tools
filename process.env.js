const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 确定当前环境，如果未设置则默认为 'development'
const currentEnv = process.env.NODE_ENV || 'development';

// 环境文件路径
const basePath = path.resolve(__dirname, '.env');
const envPath = `${basePath}.${currentEnv}`;

// 加载环境变量
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  console.log('Loaded environment variables:', envConfig);

  // 导出环境变量对象
  module.exports = envConfig;
} else {
  console.error(`No environment configuration file found for environment: ${currentEnv}`);
  process.exit(1);
}
