/**
 * PM2 Configuration for Production Deployment
 *
 * To deploy: pm2 start ecosystem.config.js
 * To stop: pm2 stop ecosystem.config.js
 * To monitor: pm2 monit
 */

module.exports = {
  apps: [{
    name: 'aziz-restaurant-backend',
    script: './src/app.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    watch: false, // Turn off in production
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      DATABASE_URL: 'postgresql://username:password@localhost:5432/restaurant_dev',
      REDIS_URL: 'redis://localhost:6379',
      JWT_SECRET: 'your_development_jwt_secret',
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: 587,
      SMTP_USER: 'your_smtp_user',
      SMTP_PASS: 'your_smtp_password',
      FRONTEND_URL: 'http://localhost:3000',
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'postgresql://username:password@prod-db-host:5432/restaurant_prod',
      REDIS_URL: 'redis://prod-redis-host:6379',
      JWT_SECRET: process.env.JWT_SECRET,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      FRONTEND_URL: process.env.FRONTEND_URL || 'https://yourdomain.com',
      LOG_LEVEL: 'info',
    }
  }]
};