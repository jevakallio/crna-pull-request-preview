# Introducing appr: A New Review Tool for Mobile Developers

## TL;DR;

[appr](https://github.com/formidablelabs/appr) builds and deploys pull requests in your [create-react-native-app](https://github.com/react-community/create-react-native-app) and [Expo](https://expo.io/)-based projects, and posts a link and a QR code to your PR, so you can run the app on your device or emulator in seconds!

![screenshot](pr.png)

## Great teams review their code

I'm sure you'll agree: Code reviews are a useful tool in a development team's workflow. You wouldn't release code to production without having another pair of eyes on it first, would you?

Thankfully, GitHub makes code reviews simple. As long as the team is disciplined enough to keep their pull requests small and focused, code keeps getting reviewed, improved, fixed, and released. But as soon as reviewing becomes slow, the flow grinds to a halt.

A good code review looks at code conventions, patterns, and architecture. But most importantly, **good reviews verify that the code works as intended.** For UI programming, the only way to do this is to try out the app. To get another developer's code running on your device you will have to stash any work-in-progress in your own workspace, pull down the remote branch, install dependencies, compile, deploy, and start the application. Not so quick, anymore, is it?

## Review apps

I've loved [Heroku](https://www.heroku.com/)'s GitHub-integrated [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) since they were launched. As part of your branch build, Heroku will spin up a new instance of your web application, which you can then access with a direct link from your GitHub pull request. [Netlify](https://www.netlify.com/) offers the same functionality for deploying static front end sites.

Sadly, this one-click workflow hasn't been available to mobile developers without setting up complex build and deployment pipelines, and even then, installing an app to be able to test a simple change still takes way too long.

Inspired by [Expo Sketch](https://sketch.expo.io/), I wanted to see if it would be possible to set up review apps for React Native.

## Introducing _appr_

Appr is a script that deploys pull requests in your project to Expo, and posts a link and a QR code to your PR. **It works just like Sketch, but for your entire project.** Point your Expo app camera to the QR code and the review app will launch on your device. Appr currently works with all unejected Expo apps, including apps created with [create-react-native-app](https://github.com/react-community/create-react-native-app).

The default build environment is [Travis](https://travis-ci.org/), a popular continuous integration service that is free for open source projects, and offers paid plans for private repositories. Switching to your preferred CI should be easy, and PRs to add support are welcome!

## How it works

The basic mechanism is:
1. Trigger a Pull Request build on [Travis CI](https://travis-ci.org/).
2. Run your standard health checks (tests, linters, type checkers).
3. Build and publish the app under a unique name on [Expo](https://expo.io/) using the [exp](https://docs.expo.io/versions/v15.0.0/guides/exp-cli.html) cli.
4. Generate a QR code or the published app URL, and use the GitHub API to post the QR code to Pull Request comments.
5. Scan the QR code with your Expo app.

## Limitations

There are a few limitations you should be aware of. **appr** is currently not able to deploy:

1. React Native apps started with something other than create-react-native-app or Expo.
2. Ejected React Native apps containing custom native module dependencies.
3. Pull Requests from forked repositories. This is due to Travis and Circle security policies (wisely) not exposing secure environment variables to forked builds. (Circle CI allows you to disable this setting, but it is not recommended!)

[Contributions](#contributing) and ideas for solutions welcome.

## Getting started

To make testing your pull requests easy, head to [FormidableLabs/appr](https://github.com/FormidableLabs/appr) on GitHub and follow the simple [Getting started](https://github.com/FormidableLabs/appr#getting-started) guide to add _appr_ to your project. 

Improvements and additions are welcome. For large changes, please submit a discussion issue. If you need help getting started, or if you just have a question, you can find us on Gitter. You can also ping me on Twitter at [@jevakallio](https://twitter.com/jevakallio).
