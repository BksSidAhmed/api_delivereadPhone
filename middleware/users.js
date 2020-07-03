const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
      // username min length 3
      if (!req.body.login || req.body.login.length < 3) {
        return res.status(400).send({
          msg: 'Please enter a login with min. 3 chars'
        });
      }
      // password min 6 chars
      if (!req.body.mdp || req.body.mdp.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
      }

      next();
    },

    isLoggedIn: (req, res, next) => {
        try {
          const token = req.headers.authorization.split(' ')[1];
          //console.log('hi ' + decoded)
          const decoded = jwt.verify(
            token,
            'SECRETKEY'
          );
          req.userData = decoded;
          next();
        } catch (err) {
            console.log('error ')
          return res.status(401).send({
            msg: 'Your session is not valid!'
          });
        }
      }
  };