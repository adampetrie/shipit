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

  this.confluence.getContentByPageTitle(space, 'Release', (err, data) => {
    if(err) {
      this.confluence.postContent(space, 'Release', template, null, function(err) {
        if(err) {
          console.log(err.res.body.message);
        }
        console.log('Page created successfully.');
      });
    } else {
      var pageId = data.results[0].id;
      var version = parseInt(data.results[0].version.number) + 1;

      this.confluence.putContent(space, pageId, version, 'Release', template, function(err) {
        if(err) {
          console.log(err.res.body.message);
        }
        console.log('Page updated successfully.');
      });
    }
  });
}

module.exports = Confluence;
