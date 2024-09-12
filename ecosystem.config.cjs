module.exports = {
  apps: [
    {
      name: 'fastify-newsee',
      script: 'npm run start:eject',
      instances: '2',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'root',
      host: ['192.168.1.53'],
      ref: 'origin/master',
      repo: 'https://gitee.com/Di_json/fastify-ts.git',
      path: '/opt/newsee/fastify',
      'pre-setup':
        "echo 'commands or local script path to be run on the host before the setup process starts'",
      'post-setup':
        "echo 'commands or a script path to be run on the host after cloning the repo'",
      'post-deploy': 'pnpm install && pm2 start ecosystem.config.cjs',
    },
  },
}
