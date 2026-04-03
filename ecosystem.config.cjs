module.exports = {
  apps: [
    {
      name: 'travelblog-chatbot',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        CHATBOT_PORT: 8787,
      },
    },
  ],
};
