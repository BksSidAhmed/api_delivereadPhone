// routes/router.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        `SELECT * FROM user WHERE LOWER(login) = LOWER(${db.escape(
          req.body.login
        )});`,

        (err, result) => {
          if (result.length) {
            return res.status(409).send({
              msg: 'This username is already in use!'
            });
          } else {
            // username is available
            bcrypt.hash(req.body.mdp, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  msg: err
                });
              } else {
                // has hashed pw => add to database
                db.query(
                  `INSERT INTO user (login, mdp) VALUES (${db.escape(
                    req.body.login
                  )}, ${db.escape(hash)})`,
                  (err, result) => {
                    if (err) {
                      throw err;
                      return res.status(400).send({
                        msg: err
                      });
                    }
                    return res.status(201).send({
                      msg: 'Registered!'
                    });
                  }
                );
              }
            });
          }
        }
      );
});


router.post('/login', (req, res, next) => {
    db.query(
        `SELECT * FROM user WHERE login = ${db.escape(req.body.login)};`,
        (err, result) => {
          // user does not exists
          if (err) {
            throw err;
            return res.status(400).send({
              msg: err
            });
          }
          if (!result.length) {
            console.log('req.body.mdp');
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
          // check password
          bcrypt.compare(
            req.body.mdp,
            result[0]['mdp'],
            (bErr, bResult) => {
              // wrong password
              if (bErr) {
                throw bErr;
                return res.status(401).send({
                  msg: 'Username or password is incorrect!'
                });
              }
              if (bResult) {
                const token = jwt.sign({
                    login: result[0].login,
                    id_user: result[0].id_user
                  },
                  'SECRETKEY', {
                    expiresIn: '100m'
                  }
                );
                return res.status(200).send({
                  msg: '200',
                  token,
                  user: result[0], 
                
                });
              }
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
          );
        }
      );
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    res.send({
      msg : 'Token Valid',
      user : req.userData
    });  
  });

router.get('/books', (req,res,next) => {
    db.query(`SELECT * FROM books where id_commandebooks IS NULL` ,
        (err, result) => {
        // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            else {
                return res.status(200).send({
                msg: 'Transfert effectué !',
                book: result
            });}
        
        }
    )
});

router.get('/books/:id', (req,res,next) => {
  db.query(`SELECT * FROM books where id_book = ${req.params.id}`,
      (err, result) => {
      // user does not exists
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              book: result
          });}
      }
  )
});

router.get('/booksUser/:id', (req,res,next) => {
  db.query(`SELECT * FROM books where id_commandebooks = ${req.params.id}`,
      (err, result) => {
      // user does not exists
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              book: result
          });}
      }
  )
});

module.exports = router;