var ConfluenceAPI = require('confluence-api');

function Confluence(options) {
  this.confluence = new ConfluenceAPI({
    username: options.user,
    password: options.password,
    baseUrl:  options.baseUrl
  });
}

Confluence.prototype.createOrUpdatePage = function(space, template) {
  console.log('Posting to Confluence...');

  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var minutes = date.getMinutes();

  if(month < 10) month = '0' + month;

  var pageTitle = 'Nightly Build ' + minutes + '-' + day + '-' + month + '-' + year;

  this.confluence.getContentByPageTitle(space, pageTitle, (err, data) => {
    if(err !== null) console.log(err);

    if(data.results.length === 0) {
      this.confluence.postContent(space, pageTitle, template, null, function(err) {
        if(err) {
          console.log(err.res.body.message);
        }
        console.log('Page created successfully.');
      });
    } else {
      var pageId = data.results[0].id;
      var version = parseInt(data.results[0].version.number) + 1;

      this.confluence.putContent(space, pageId, version, pageTitle, template, function(err) {
        if(err) {
          console.log(err.res.body.message);
        }
        console.log('Page updated successfully.');
      });
    }
  });
}

module.exports = Confluence;
