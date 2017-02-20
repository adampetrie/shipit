var handlebars = require('handlebars');
var fs = require('fs');

function Template(template) {
  this.template = template;
}

Template.prototype.parse = function(tickets, commits, testData) {
  var ticketStr = '';

  for(var i = 0; i < tickets.length; i++) {
    if(i == tickets.length -1) {
      ticketStr += '"' + tickets[i] + '"';
    } else {
      ticketStr += '"' + tickets[i] + '", ';
    }
  }

  var jql = "key in(" + ticketStr + ")";

  return this.template({
    jql: jql,
    commits: commits,
    testData: testData
  });
}

function load(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf-8', function(err, source){
      if (err !== null) return reject(err);
      var template = handlebars.compile(source);
      resolve(new Template(template));
    });
  });
};

module.exports.load = load
