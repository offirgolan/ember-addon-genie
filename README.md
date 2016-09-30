# Ember Addon Genie

[![npm version](https://badge.fury.io/js/ember-addon-genie.svg)](http://badge.fury.io/js/ember-addon-genie)
[![Build Status](https://travis-ci.org/offirgolan/ember-addon-genie.svg?branch=master)](https://travis-ci.org/offirgolan/ember-addon-genie)

Blueprint for setting up an addon with a build, ember-try scenarios, code coverage, and documentation via YUI

## Installation

```
ember install ember-addon-genie
```

## Looking for help?
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-addon-genie/issues).


## Blueprints

When you first install ember-addon-genie or run the default blueprint via
`ember g ember-addon-genie` you will get the following prompt to select which
components you want to include in your addon.

![prompt](http://i.imgur.com/hZR0axZ.png)

Note: All items are already pre-selected, press _SPACE_ to deselect and _ENTER_ to continue

### genie-init

- Takes your selected options and installs the correct packages
- Modifies `package.json` to add some missing information such as repo details, author, and demoURL

![genie-init](http://i.imgur.com/GBnWzBI.png)

### genie-chrome

- Setup TravisCI to run your tests with Chrome instead of PhantomJS

### genie-coverage

- Setup ember-cli-blanket
- Setup CodeClimate for code coverage reporting integration with TravisCI
    - A prompt will ask you for your CodeClimate repo token, if you don't have it, just press _ENTER_ and you can modify it later in your `.travis.yml` or run `ember g genie-coverage`

__Get Your CodeClimate Token__

1. Create a [CodeClimate](https://codeclimate.com) account for your github repo
2. Grab your `CODECLIMATE_REPO_TOKEN` from Settings --> Test Coverage --> JavaScript

    You will see something along the lines of:

    ```
    CODECLIMATE_REPO_TOKEN=<YOUR_REPO_TOKEN> codeclimate-test-reporter < lcov.info
    ```

![genie-coverage](http://i.imgur.com/kim7WRx.png)

### genie-try

- Setup ember-try scenarios with TravisCI
    - A prompt will ask you to enter a comma separated list of Ember versions you want to create scenarios for (ex. `1.13`, `2.2`, `2.4` `2.5`)

![genie-try](http://i.imgur.com/BEGGEqy.png)

### genie-gh-pages

- Setup ember-release to publish a new version of your addon's demo app when to the `gh-pages` branch when you release

![genie-gh-pages](http://i.imgur.com/4qXmtDK.png)

### genie-changelog

- Setup ember-release to update the changelog with the latest commits

### genie-docs

- Setup YUIDoc via `ember-cli-yuidoc`
    - Config is setup so docs will be present in production mode. This means that when you run `ember release` it will publish your addon's demo page AND your updated docs to the gh-pages branch

__Usage__

To view your docs you will need to use

```
ember serve --docs
```

Once your server is ready, navigate to `localhost:4200/docs` and you should see all your YUIDoc defined classes and modules.

![genie-try](http://i.imgur.com/BEGGEqy.png)

## Commands

### genie:changelog

Generate a changelog in markdown by comparing the given version to the given branch of a repo.

__Available Options__

- `user`: The repo user or org. Defaults to your current git username
- `repo`: The repo name. Defaults to your current project's name
- `version`: The version to be compared with the branch. Defaults to your current repo's version
- `new-version`: The new version. This is used to title the changes when written to file
- `branch`: The branch to compare with the version. Defaults to 'master'
- `write`: If set to true will write to `file`. Defaults false
- `file`: Path to changelog file. Defaults to 'CHANGELOG.md'

```
ember genie:changelog --user=ember-cli --repo=ember-cli --version=2.6.0 --branch=master --write=true --file=CHANGELOG.md
```
