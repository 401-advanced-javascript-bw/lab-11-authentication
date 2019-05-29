'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }

  function _authBasic(encodedString) {
    let base64Buffer = Buffer.from(encodedString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  function _authenticate(user) {
    if ( user ) {
      request.user = user; //we modify th request to add a valid user that everyone can use afterwards
      request.token = user.generateToken();
      return next(); //here, we continue with the middleware chain, but with a valid user
    }
    else {
      return _authError();
    }
  }

  function _authError() {
    next({
      status: 401, 
      statusMessage: 'Unauthorized', 
      message: 'Invalid User ID/Password',
    });
  }

};

// module.exports = (req, res, next) => {

//   try {

//     let [authType, encodedString] = req.headers.authorization.split(/\s+/);

//     // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

//     switch(authType.toLowerCase()) {
//       case 'basic':
//         return _authBasic(encodedString);
//       default:
//         return _authError();
//     }

//   } catch(e) {
//     return _authError();
//   }

//   function _authBasic() {
//     let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
//     let bufferString = base64Buffer.toString(); // john:mysecret
//     let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
//     let auth = [username,password];  // {username:"john", password:"mysecret"}

//     return User.authenticateBasic(auth)
//       .then( user => _authenticate(user) );
//   }

//   function _authenticate(user) {
//     if ( user ) {
//       next();
//     }
//     else {
//       _authError();
//     }
//   }

//   function _authError() {
//     next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
//   }

// };

