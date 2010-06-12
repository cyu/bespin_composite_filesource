exports.mount = function(env, args, request) {
  var ServerFileSource = require('composite_filesource:server').ServerFileSource;
  env.files.source.addSource(new ServerFileSource(args.server));
  env.files.invalidate();
}