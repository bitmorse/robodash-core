var express    = require('express');        // call express
var btoa    = require('btoa');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var PouchDB = require('pouchdb');

PouchDB.plugin(require('pouchdb-authentication'));

var ajaxOpts = {
  ajax: {
    headers: {
      Authorization: 'Basic ' + btoa(process.env.ROBODASH_API_USER+ ':' + process.env.ROBODASH_API_PASSWORD)
    }
  }
};

var publicDb = new PouchDB('https://sync.robodash.io/robodash-public%2Fmeta', {skipSetup: true});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8050;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'robodash.io API' });
});


// API ROUTES
// =============================================================================


//curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"username": "bitmorse", "email": "sam@example.com", "password": "cleartext"}' http://localhost:8080/api/users
router.post('/users', function(req, res) {

  var username = req.body.username,
  email = req.body.email,
  pass = req.body.password,
  uuid = req.body.uuid;

  publicDb.signUp(email, pass, {metadata: {username: username, uuid: uuid}, ajax: ajaxOpts.ajax}).then(()=>{
    res.json({ message: 'success' });
  }).catch((err)=>{
    res.json({ message: 'signup_error' });
  });

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// AUTHENTICATE TO API
// =============================================================================
publicDb.login(process.env.ROBODASH_API_USER, process.env.ROBODASH_API_PASSWORD, ajaxOpts, function (err, response) {
  if (err) {
    if (err.name === 'authentication_error') {
      // name or password incorrect
      console.log("api-server.js: api credentials incorrect");
    } else {
      console.log("api-server.js: other error");
      console.log(err);
    }
  }else{
    // START THE SERVER
    // =============================================================================
    app.listen(port);
    console.log('robodash.io API server listening on ' + port);
    console.log(response);
  }
});
