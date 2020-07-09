// routes/router.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const moment = require('moment')

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        `SELECT * FROM user WHERE LOWER(login) = LOWER(${db.escape(req.body.login)});`,
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
                  `INSERT INTO user (prenom,nom,login,mdp,telephone,email,id_role) VALUES (${db.escape(req.body.prenom)},${db.escape(req.body.nom)},${db.escape(req.body.login)},${db.escape(hash)},${db.escape(req.body.telephone)},${db.escape(req.body.email)}, 2)`,
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
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
          if (result[0].id_role !== 2) {
            return res.status(401).send({
              msg: 'Ce nest pas un compte utilisateur'
            });
          }
          // check password
          bcrypt.compare(req.body.mdp, result[0]['mdp'],
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
                    expiresIn: '1000m'
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

router.post('/commandeBooks', (req, res, next) => {
  //console.log('commande')
  db.query(
    `INSERT INTO commande (nom_Commande,date_commande,date_livraison,reference,etat,adresse,id_userscommande) VALUES ('commande','${(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))}','${(req.body.datelivraison)}','reference','Traitement','${(req.body.adresselivraison)}', ${(req.body.id_user)})`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(200).send({
        msg: 'Registered!',
        data: result
      });
    }
  );
});

router.post('/commandeBooksid/:id', (req, res, next) => {
  //console.log('commande')
  db.query(
    `UPDATE books SET id_commandebooks = ${(req.body.idcommandeBooks)} WHERE id_book = ${req.params.id} `,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(200).send({
        msg: 'Registered!'
      });
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
    db.query(`SELECT * FROM books` ,
        (err, result) => {
        // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            else {
              for(i = 0; i < result.length; i++) {
                  var buffer = new Buffer(result[i].image, 'binary' );
                  var test = buffer.toString('base64');
                  result[i].image = test
              }
              return res.status(200).send({
                    msg: 'Transfert effectué !',
                    book: result
                  })
            ;}
        
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
            for(i = 0; i < result.length; i++) {
                var buffer = new Buffer(result[i].image, 'binary' );
                var test = buffer.toString('base64');
                result[i].image = test
            }
            return res.status(200).send({
                  msg: 'Transfert effectué !',
                  book: result
                })
          ;}
          // else {
          //     return res.status(200).send({
          //     msg: 'Transfert effectué !',
          //     book: result
          // });}
          
      }
  )
});

router.get('/booksUser/:id', (req,res,next) => {
  db.query(`Select * from books,user,commande where books.id_commandebooks = commande.id_Commande and commande.id_userscommande = user.id_user and user.id_user = ${req.params.id}`,
      (err, result) => {
      // user does not exists
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
            for(i = 0; i < result.length; i++) {
                var buffer = new Buffer(result[i].image, 'binary' );
                var test = buffer.toString('base64');
                result[i].image = test
            }
            return res.status(200).send({
                  msg: 'Transfert effectué !',
                  book: result
                })
          ;}
      }
  )
});
router.get('/commande/:id', (req,res,next) => {
  db.query(`Select * from commande where id_userscommande = ${req.params.id}`,
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
              commande: result
          });}
      }
  )
});

module.exports = router;