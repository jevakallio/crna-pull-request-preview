var qr = require('qrcode-terminal');
var slug = process.env.TRAVIS_REPO_SLUG;

if (!process.env.TRAVIS_REPO_SLUG) {
  throw new Error('No slug!');
}

var org = slug.split('/')[0];
var name = require('../package.json').name;
var url = 'exp://exp.host/@' + org + '/' + name;
qr.generate(url, { small: true });
