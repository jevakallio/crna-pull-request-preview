var fs = require('fs');
var pkg = require('../package.json');

var branchName = process.argv[2];
if (!branchName) {
  throw new Error('Branch name not provided');
}
var sanitized = branchName.replace('/', '--');
if (pkg.name.endsWith(sanitized)) {
  console.log('Branch name already appended');
} else {
  fs.writeFileSync(
    './package.json',
    JSON.stringify(Object.assign(pkg, { name: pkg.name + '--' + sanitized }), null, 2)
  );
}
