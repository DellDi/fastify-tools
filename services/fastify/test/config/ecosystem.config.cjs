/**
 * @description: windows模式，需要指定脚本的执行路径 （非常失望）

// module.exports = {
//   apps: [
//     {
//       name: 'fastify-newsee',
//       script: 'D:\\nvm\\v20.17.0\\node.exe',
//       args: 'dist/server.js',
//       instances: '2',
//       autorestart: true,
//       watch: false,
//       max_memory_restart: '1G',
//       env: {
//         NODE_ENV: 'production',
//       },
//     },
//   ],
// }

// module.exports = {
//   apps: [
//     {
//       name: 'fastify-ts',
//       script: 'D:\\nvm\\v20.17.0\\node_modules\\npm\\bin\\npm-cli.js', // window 情况下需要指定路径
//       args: 'run dev:eject', // 额外的参数
//       instances: '2',
//       autorestart: true,
//       watch: false,
//       max_memory_restart: '1G',
//       env: {
//         NODE_ENV: 'production',
//       },
//       env_production: {
//         NODE_ENV: 'production',
//       },
//     },
//   ],
// }
