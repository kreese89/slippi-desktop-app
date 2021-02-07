const ThreadsPlugin = require("threads-plugin");

module.exports = function (context) {
  // Expose dotenv variables
  // context.plugins.push(new Dotenv());

  // Add threads.js handling in webpack
  context.plugins.unshift(
    new ThreadsPlugin({
      globalObject: "self",
      target: "electron-node-worker",
    }),
  );

  return context;
};
