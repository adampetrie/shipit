var TestrailAPI = require('testrail-api');

function TestRail(options) {
  this.testrail = new TestrailAPI({
    user: options.user,
    password: options.password,
    host: options.host
  });
}

TestRail.prototype.getActiveTestPlan = function(project_id, commitSha) {
  console.log('Retrieving Testrail Data...');

  if(typeof(project_id) !== 'undefined') {
    return this.testrail.getPlans(project_id)
    .then(function(plans) {
      return {
        passed: plans[0].passed_count,
        failed: plans[0].failed_count
      }
    });
  } else {
    return new Promise(function(resolve, reject) {
      resolve(null);
    });
  }
}

module.exports = TestRail;
