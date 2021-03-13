module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Science Archive | Las Cumbres Observatory';
      return args;
    });
  }
};
