/*jshint node:true*/

'use strict';

var Promise     = require('ember-cli/lib/ext/promise');
var GitHubApi   = require('github');

var github         = new GitHubApi({version: '3.0.0'});
var compareCommits = Promise.denodeify(github.repos.compareCommits);

module.exports = function generateChangelog(user, repo, version, branch) {
  version = 'v' + version;
  branch = branch || 'master';

  var prRegex = /\(#(\d+)\)\n\n/;

  return compareCommits({
    user: user,
    repo: repo,
    base: version,
    head: branch
  }).then(function(res) {
    return res.commits.filter(function(c) {
      var message = c.commit.message;
      return message.indexOf('Merge pull request #') > -1 || message.indexOf('Auto merge of #') > -1 || prRegex.test(message);

    }).map(function(c) {
      var message = c.commit.message;
      var numAndAuthor, title;

      if (message.indexOf('Auto merge of #') > -1) {
        numAndAuthor = message.match(/#(\d+) - (.*):/).slice(1,3);
        title        = message.split('\n\n')[1];

        return {
          number:  +numAndAuthor[0],
          author:  numAndAuthor[1],
          title:   title
        };
      } else if (message.indexOf('Merge pull request #') > -1) {
        numAndAuthor = message.match(/#(\d+) from (.*)\//).slice(1,3);
        title        = message.split('\n\n')[1];

        return {
          number:  +numAndAuthor[0],
          author:  numAndAuthor[1],
          title:   title
        };
      } else if(prRegex.test(message)) {
        var num = message.match(prRegex);
        title   = message.split('\n\n')[0].substring(0, message.indexOf(num[0]) - 1);

        return {
          number:  +num[1],
          author:  c.author.login,
          title:   title
        };
      }

    }).sort(function(a, b) {
      return a.number > b.number;
    }).map(function(pr) {
      var link   = '[#' + pr.number + ']' +
                   '(https://github.com/' + user + '/' + repo + '/pull/' + pr.number + ')';
      var title  = pr.title;
      var author = '[@' + pr.author + ']' +
                   '(https://github.com/' + pr.author +')';

      return '- ' + link + ' ' + title + ' ' + author;

    }).join('\n');

  }).then(function(changelog) {
    return changelog;
  }).catch(function(/* err */) {
    console.error('No changes found for the given options');
  });
};
