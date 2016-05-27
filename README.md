# Ember Addon Genie

[![npm version](https://badge.fury.io/js/ember-addon-genie.svg)](http://badge.fury.io/js/ember-addon-genie)

Blueprint for setting up an addon with a build, ember-try scenarios, code coverage, and documentation via YUI

## Installation

```
ember install ember-addon-genie
```

## Looking for help?
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-addon-genie/issues).


## Setup CodeClimate (Coverage)

1. Create a [CodeClimate](https://codeclimate.com) account for your github repo
2. Grab your `CODECLIMATE_REPO_TOKEN` from Settings --> Test Coverage --> JavaScript

    You will see something along the lines of:

    ```
    CODECLIMATE_REPO_TOKEN=<YOUR_REPO_TOKEN> codeclimate-test-reporter < lcov.info
    ```

3. Open up `.travis.yml` and replace `<CODE_CLIMATE_TOKEN_GOES_HERE>` with your repo token
4. Save & Commit

## Setup Github Pages

Once you have committed all your changes, you need to setup your gh-pages branch. To do that, please
follow the instructions on the [ember-cli-github-pages](https://github.com/poetic/ember-cli-github-pages) README.
