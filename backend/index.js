const app = require('./app.js');
const constants = require('./constants');

var server = app.listen(constants.PORT_NUM, ()=> {
  console.log(server.address());
});
