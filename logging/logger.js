const morgan = require('morgan');
const fs = require('fs');

const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
const logger = morgan('[:date[web]]  :method :url :status  :res[content-length] :response-time ms', {
  stream: {
    write: function (str) {
      accessLogStream.write(str);
      console.log(str);
    }
  }
});

module.exports = logger;
