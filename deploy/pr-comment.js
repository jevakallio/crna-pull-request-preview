var request = require('request');
var slug = process.env.TRAVIS_REPO_SLUG;
var pr = process.env.TRAVIS_PULL_REQUEST;
var token = process.env.GITHUB_TOKEN;

if (!slug || slug === 'false') {
  throw new Error('No slug!');
}

if (!pr || pr === 'false') {
  throw new Error('No pull request!');
}

if (!token || token === 'false') {
  throw new Error('No GitHub token!');
}

var org = slug.split('/')[0];
var name = require('../package.json').name;
var expUrl = 'exp://exp.host/@' + org + '/' + name;
var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + expUrl;
var issueUrl = 'https://' +
  'crna-pull-request-bot' +
  ':' +
  token +
  '@api.github.com/repos/' +
  slug +
  '/issues/' +
  pr +
  '/comments';

console.log('Exponent URL ' + expUrl);
console.log('GitHub Issue URL ' + issueUrl);
console.log('QR Code URL ' + issueUrl);

request.post(
  {
    url: issueUrl,
    headers: {
      'User-Agent': 'ci'
    },
    body: JSON.stringify({
      body: 'This branch has been deployed to ' +
        expUrl +
        ' :rocket:\n\nPoint your Expo app at\n![QR Code](' +
        qrUrl +
        ')'
    })
  },
  function(error, response, body) {
    if (error) {
      return console.error('Comment failed:', error);
    }
    console.log('Comment successful!');
  }
);
