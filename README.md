This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## What is this?

Since it was launched, I've loved Heroku's GitHub-integrated [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps). As part of your branch build, Heroku will spin up a new instance of your application, which you can then access with a direct link from your GitHub pull request. [Netlify](https://www.netlify.com/) offers the same functionality for deploying static frontend sites.

In my team's workflow, every pull request is reviewed and tested by another team member before landing to the master branch. Reviewing code on GitHub is simple enough: For most well-crafted pull requests, you can review the code diff in your browser, and either approve the changes, or request further improvements.

Testing another developer's changes isn't quite as simple. Typically, you will have to stash any work in progress in your own workspace, pull down the remote branch, install dependencies, compile and start the application before you can verify that the changes work as intended.

With Heroku and Netlify, you don't need to leave the comfort of your browser. You can simply click a link in your Pull Request. Unfortunately, there isn't a one-click solution like this for mobile development.

Inspired by [Expo Sketch](https://sketch.expo.io/), I wanted to see if it would be possible to set up review apps for React Native.

## Pull request review apps for React Native

This repository contains a proof of concept for GitHub-integrated React Native review apps. It works with ([unejected](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md)) [create-react-native-app](https://github.com/react-community/create-react-native-app) and [Expo](https://expo.io/) applications, using a hosted [Travis CI](https://travis-ci.org/).

The basic mechanism is:
1. Trigger a Pull Request build on [Travis CI](https://travis-ci.org/).
2. Run your standard health checks (tests, linters, type checkers).
3. Build and publish the app under a unique name on [Expo](https://expo.io/) using the [exp](https://docs.expo.io/versions/v15.0.0/guides/exp-cli.html) cli.
4. Generate a QR code or the published app URL, and use the GitHub API to post the QR code to Pull Request comments.
5. Scan the QR code with your Expo app.

## Limitations

This approach doesn't currently work with:
1. React Native apps not started with create-react-native-app or Expo
2. React Native apps containing custom native module dependencies
3. Pull Requests from forked repositories. This is due to Travis security policies (wisely) not exposing secure environment variables to forked builds.

## Detailed setup

To make this flow work, we need to add a few things to our application. Here, we start with an app generated from the standard create-react-native-app template.

#### travis.yml

Add (or modify your existing) [travis.yml](travis.yml) to include the following lines:

```
cache: yarn
script:
  - yarn ci:test
  - 'if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then yarn ci:deploy; fi'
```

This ensures that we are using [yarn](https://yarnpkg.com), and that our deployment scripts only run for Pull Request builds. The `ci:test` task ensures that we don't attempt to publish broken builds.

#### package.json

First, let's add a few packages to our `devDepedencies`. We will need these when publishing the app on Travis.
```sh
yarn add --dev exp request
```

We then add the following `ci:*` and `exp:*` prefixed scripts to the `scripts` section of our [package.json](package.json):
```
"ci:test": "node node_modules/jest/bin/jest.js --forceExit",
"ci:deploy": "yarn ci:exp-login && yarn ci:exp-prepare && yarn ci:exp-publish && yarn ci:exp-comment-qr",
"ci:exp-login": "exp login -u $EXP_USERNAME -p $EXP_PASSWORD",
"ci:exp-prepare": "node ./deploy/prepare-deploy.js $TRAVIS_PULL_REQUEST_BRANCH",
"ci:exp-publish": "exp publish",
"ci:exp-comment-qr": "node ./deploy/pr-comment.js"
```

#### Deployment scripts

I used Node.js scripting for some of the more complicated bits of the deployment process. These scripts live in the [deploy](deploy/) directory. Before build, they generate an unique name for the pull request source branch, and afterwards post the comment to GitHub.

As this is a proof of concept, the script code is... not great. The less said about them, the better :)

#### Enabling Travis

The final step is to enable [Travis CI](https://travis-ci.org/) on the repository using the Travis control panel. While there, you'll need to add a few secure environment variables to your build:
 - `EXP_USERNAME` - Exponent username, under which to publish the review apps.
 - `EXP_PASSWORD` - Exponent password for the publish user.
 - `GITHUB_TOKEN` - A [Personal API Token](https://github.com/blog/1509-personal-api-tokens) of a user with access to the repository. If the repository is private, the token needs to be granted the full `repo` scope. For public repositories, the `public_repo` scope is enough.

#### Test it

You should now be able to create a new branch, make some changes, open a pull request, and if the stars are aligned, the Travis build should publish the app to Expo, and finish with [a comment list this one](https://github.com/jevakallio/crna-pull-request-preview/pull/2#issuecomment-287372812):

---

This branch has been deployed to exp://exp.host/@jevakallio/crna-pull-request-preview-feature-sample-change :rocket:

Point your Expo app at

![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://exp.host/@jevakallio/crna-pull-request-preview-feature-sample-change)

## Result

That's it! If you follow the instructions, you should be able to test the updated Expo app on your phone without leaving your browser.
