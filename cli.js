require('dotenv').config()

var cli = require('commander'),
    Promise = require('bluebird');
    config = require('./config');
    GitHub = require('./lib/github'),
    Confluence = require('./lib/confluence');
    Testrail = require('./lib/testrail');
    Template = require('./lib/template');

cli
  .version('0.0.1')
  .option('-r, --repo <required>', 'Repository')
  .option('-b, --base <required>', 'The base for comparison')
  .option('-h, --head <required>', 'The head for comparison')
  .parse(process.argv);

var repoConfig = config[cli.repo];

if(typeof(repoConfig) === 'undefined') {
  console.log('No configuration found for ' + cli.repo + '. Exiting.');
  process.exit();
}

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


ghClient.commits(cli.repo, cli.base, cli.head)
.then(function(gitData) {

  Promise.join(
    testrailClient.getActiveTestPlan(repoConfig.testRail.projectId, gitData.headSha),
    Template.load('templates/flyers.hbs'),
    function(testData, template) {

      var parsedTemplate = template.parse(
        gitData.tickets,
        gitData.commits,
        testData
      );

      confluenceClient.createOrUpdatePage(
        repoConfig.confluence.space,
        'Flyers Build Status',
        parsedTemplate
      );
    }
  );
})
.catch(function(err) {
  console.log(err);
});




