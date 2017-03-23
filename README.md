# Introducing appr: A New Review Workflow for Mobile Developers

[Appr](https://github.com/formidablelabs/appr) builds pull requests in your [Create React Native App](https://github.com/react-community/create-react-native-app) project, deploys the changes to [Expo](https://expo.io/), and posts a link and a QR code to your PR, so you can run the app on your device or emulator in seconds!

![screenshot](https://github.com/FormidableLabs/appr/raw/master/docs/demo.gif)

## Great teams review their code

I'm sure you'll agree: Code reviews are a useful tool in a development team's workflow. You wouldn't release code to production without having another pair of eyes on it first, would you?

Thankfully, GitHub makes code reviews simple. As long as the team is disciplined enough to keep their pull requests small and focused, code keeps getting reviewed, improved, fixed, and released. But as soon as reviewing becomes slow, the flow grinds to a halt.

A good code review looks at code conventions, patterns, and architecture. But most importantly, **good reviews verify that the code works as intended.** For UI programming, the only way to do this is to try out the app. To get another developer's code running on your device you will have to stash any work-in-progress in your own workspace, pull down the remote branch, install dependencies, compile, deploy, and start the application. Not so quick, anymore, is it?

## Review apps

I've loved [Heroku](https://www.heroku.com/)'s GitHub-integrated [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) since they were launched. As part of your branch build, Heroku will spin up a new instance of your web application, which you can then access with a direct link from your GitHub pull request. [Netlify](https://www.netlify.com/) offers the same functionality for deploying static front end sites.

Sadly, this one-click workflow hasn't been available to mobile developers without setting up complex build and deployment pipelines, and even then, installing an app to be able to test a simple change still takes way too long.

Inspired by [Expo Sketch](https://sketch.expo.io/), I wanted to see if it would be possible to set up review apps for React Native.

## Introducing Appr

Appr is a script that deploys pull requests in your project to Expo, and posts a link and a QR code to your PR. **It works just like Sketch, but for your entire project.** Point your Expo app camera to the QR code and the review app will launch on your device. Appr currently works with all unejected Expo apps, including apps created with [create-react-native-app](https://github.com/react-community/create-react-native-app).

Appr works on [Travis](https://travis-ci.org/) and [Circle CI](https://circleci.com/) out of the box, and supports any CI environment that can trigger builds from GitHub pull requests.

## How it works

The basic mechanism is:
1. Open a Pull Request in a [Travis](https://travis-ci.org/) or [Circle CI](https://circleci.com/)-enabled repository
2. Run your standard health checks (tests, linters, type checkers).
3. Appr builds and publishes your app under a unique, unlisted name on [Expo](https://expo.io/) using the [exp](https://docs.expo.io/versions/v15.0.0/guides/exp-cli.html) cli.
4. Appr generates a QR code of the published app URL and uses the GitHub API to post the QR code to Pull Request comments.
5. Open the Expo app on your phone and point it to the QR code - the app will launch in seconds.

## Limitations

There are a few limitations you should be aware of. Appr is currently not able to deploy:

1. React Native apps started with something other than create-react-native-app or Expo.
2. Ejected React Native apps containing custom native module dependencies.
3. Pull Requests from forked repositories. This is due to Travis and Circle security policies (wisely) not exposing secure environment variables to forked builds. (Circle CI allows you to disable this setting, but it is not recommended!)

## Getting started

To make testing your pull requests easy, head to [FormidableLabs/appr](https://github.com/FormidableLabs/appr) on GitHub and follow the simple [Getting started](https://github.com/FormidableLabs/appr#getting-started) guide to add Appr to your project. 

If you need help getting started, or if you just have a question, just open an issue on GitHub. You can also ping me on Twitter at [@jevakallio](https://twitter.com/jevakallio).
