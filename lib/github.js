var github = require('octonode');
var _ = require('lodash');


function GitHub(options) {
  this.client = github.client({
    username: options.user,
    password: options.password
  });
}

GitHub.prototype.commits = function (repo, base, head, callback) {
  console.log('Retrieving info from GitHub...');

  var repo = this.client.repo('wishabi/' + repo);

  return new Promise(function(resolve, reject) {
    repo.compare(base, head, function(err, data, headers){
      if(err !== null) return reject(err);

      var tickets = [];
      var commits = [];

      data.commits.forEach(function(commit) {
        var ticket = commit.commit.message.match(/(FP|PS)-[0-9]*/g);

        if (ticket !== null) {
          tickets.push(ticket[0]);
        } else {
          commits.push({
            sha: commit.sha,
            link: 'https://github.com/wishabi/flyers/commit/' + commit.sha,
            author: commit.commit.author.name,
            message: commit.commit.message
          });
        }
      });

      resolve({
        headSha: data.commits.pop().sha,
        commits: commits,
        tickets: _.uniq(tickets)
      });
    });
  });
}

module.exports = GitHub;
