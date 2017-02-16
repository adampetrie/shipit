require('dotenv').config()

var cli = require('commander'),
    Promise = require('bluebird');
    Testrail = require('testrail-api');
    config = require('./config');
    GitHub = require('./lib/github'),
    Confluence = require('./lib/confluence');
    Template = require('./lib/template');

cli
  .version('0.0.1')
  .option('-r, --repo <required>', 'Repository')
  .option('-b, --base <required>', 'The base for comparison')
  .option('-h, --head <required>', 'The head for comparison')
  .parse(process.argv);

var repoConfig = config[cli.repo];

var ghClient = new GitHub({
  user: process.env.GITHUB_USER,
  password: process.env.GITHUB_PASSWORD
});

var testrailClient = new Testrail({
  user: process.env.TESTRAIL_USER,
  password: process.env.TESTRAIL_PASSWORD,
  host: "https://wishabi.testrail.com/"
});

var confluenceClient = new Confluence({
  user: process.env.CONFLUENCE_USER,
  password: process.env.CONFLUENCE_PASSWORD,
  baseUrl: 'https://confluence.wishabi.com'
});

Promise.join(
  ghClient.commits(cli.repo, cli.base, cli.head),
  testrailClient.getPlans(repoConfig.testRail.projectId),
  Template.load('templates/flyers.hbs'),
  function(data, testPlans, template) {
    var parsedTemplate = template.parse(
      data.tickets,
      data.commits,
      testPlans[0]
    );

    confluenceClient.createOrUpdatePage(
      repoConfig.confluence.space,
      parsedTemplate
    );
  }
).catch(function(err) {
  console.log(err);
});




