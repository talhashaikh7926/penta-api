const Agenda = require('agenda');
const os = require('os');


// or override the default collection name:
let agenda = new Agenda({db: {address: process.env.MONGODB_URI, collection: 'jobs'}});
agenda.name(os.hostname + '-' + process.pid);
let jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

jobTypes.forEach(function(type) {
  require('./jobs/' + type)(agenda);
});

if(jobTypes.length) {
  agenda.on('ready', function() {
    agenda.start();
  });
}

function graceful() {
    agenda.stop(function() {
      process.exit(0);
    });
}
  
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

module.exports = agenda;