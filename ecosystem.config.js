module.exports = {
  apps : [{
    name: 'cbm-registry',
    script: 'bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
