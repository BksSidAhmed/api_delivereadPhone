// routes/router.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const moment = require('moment')

                                                                            ////AUTH
//POST
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

router.post('/sign-up/livreur', userMiddleware.validateRegister, (req, res, next) => {
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
                `INSERT INTO user (prenom,nom,login,mdp,telephone,email,id_role) VALUES (${db.escape(req.body.prenom)},${db.escape(req.body.nom)},${db.escape(req.body.login)},${db.escape(hash)},${db.escape(req.body.telephone)},${db.escape(req.body.email)}, 4)`,
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

router.post('/sign-up/admin', userMiddleware.validateRegister, (req, res, next) => {
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
                `INSERT INTO user (prenom,nom,login,mdp,telephone,email,id_role) VALUES (${db.escape(req.body.prenom)},${db.escape(req.body.nom)},${db.escape(req.body.login)},${db.escape(hash)},${db.escape(req.body.telephone)},${db.escape(req.body.email)}, 1)`,
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
        // if (result[0].id_role !== 2) {
        //   return res.status(401).send({
        //     msg: 'Ce nest pas un compte utilisateur'
        //   });
        // }
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
//GET
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    res.send({
      msg : 'Token Valid',
      user : req.userData
    });  
  });

                                                                            ////USER
//POST
router.post('/user/:dataUser/:id', (req,res,next) => {
  db.query(`update user set ${req.params.dataUser} = '${req.body.valDataUser}' where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});
router.post('/starUser', (req,res,next) => {
  db.query(`INSERT INTO commentaire (commentaire,note, id_user,id_book) VALUES ("${req.body.commentaire}",${req.body.note}, ${req.body.id_user}, ${req.body.id_book}) `,    
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
              user: result
          });}
      }
  )
});

// Post NbBookCommande +1
router.post('/nbBookCommandepostplus/:id', (req,res,next) => {
  db.query(`update user set NbBookCommande  = NbBookCommande + ${1} where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});


// Post NbBookCommande -1
router.post('/nbBookCommandepostmoins/:id', (req,res,next) => {
  db.query(`update user set NbBookCommande  = NbBookCommande - ${1} where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

//GET

//Get NbBookCommande
router.get('/nbBookCommandeget/:id', (req,res,next) => {
  db.query(`Select NbBookCommande from user where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

router.get('/user/:id', (req,res,next) => {
  db.query(`Select * from user where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

router.get('/commentaire/:id_user/:id_book', (req,res,next) => {
  db.query(`SELECT * FROM commentaire WHERE id_user = ${req.params.id_user} AND id_book = ${req.params.id_book} ` ,
      (err, result) => {
      // user does not exists
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          return res.status(200).send({
                  msg: 'Transfert effectué !',
                  commentaire: result
          })
          ;
      
      }
  )
});

router.get('/commentaireAll/:id_book', (req,res,next) => {
  db.query(`Select user.login, commentaire.commentaire,commentaire.note from user, commentaire where commentaire.id_user=user.id_user AND commentaire.id_book= ${req.params.id_book}`,
      (err, result) => {
      // user does not exists
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          return res.status(200).send({
                  msg: 'Transfert effectué !',
                  commentaire: result
          })
          ;
      
      }
  )
});


                                                                            ////BOOK
//GET
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

router.get('/bookSearch/:text', (req,res,next) => {
db.query(`SELECT * FROM books WHERE SOUNDEX(titre) = SOUNDEX("${req.params.text}") OR SOUNDEX(auteur) = SOUNDEX("${req.params.text}") OR auteur LIKE "${req.params.text}%" OR titre LIKE "${req.params.text}%"` ,
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
db.query(`Select * from books,user,commande where books.id_commandebooks = commande.id_Commande and commande.id_userscommande = user.id_user and user.id_user = ${req.params.id} and not (commande.etat = "relais")` ,

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
          // if(result =)(result)
          return res.status(200).send({
                msg: 'Transfert effectué !',
                book: result
              })
        ;}
    }
)
});

router.get('/statStarUser/:id_book', (req,res,next) => {
  db.query(`SELECT COUNT(id_commentaire) AS nombreVotant FROM commentaire WHERE id_book = ${req.params.id_book} `,    
  (err, result) => {
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              note: result
          });}
      }
  )
});

router.get('/statStar/:id_book', (req,res,next) => {
  db.query(`SELECT COUNT(id_commentaire) AS nombreVotant FROM commentaire WHERE id_book = ${req.params.id_book} `,    
  (err, result) => {
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
            db.query(`SELECT SUM(note/${result[0].nombreVotant}) AS note FROM commentaire WHERE id_book = ${req.params.id_book} `,    
            (err, result) => {
                    if (err) {
                        throw err;
                        return res.status(400).send({
                            msg: err
                        });
                    }
                    else {
                        return res.status(200).send({
                        msg: 'Transfert effectué !',
                        note: result
                    });}
                }
            )
        }
      }
  )
});

                                                                            ////COMMANDE
//POST
router.post('/commandeBooks/:id', (req, res, next) => {
  db.query(
    `SELECT id_commandebooks FROM books WHERE id_book = ${req.params.id};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if(result[0].id_commandebooks !== null) {
        return res.status(400).send({
          msg: "Le livre viens tout juste d'etre reservé",
        });
      }
        db.query(
          `INSERT INTO commande (nom_Commande,date_commande,date_livraison,reference,etat,adresse,id_userscommande) VALUES ('commande','${(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))}','${(req.body.datelivraison)}','reference','Commande en cours de Traitement','${(req.body.adresselivraison)}', ${(req.body.id_user)})`,
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
      }
  )
});

router.post('/commandeBooksid/:id', (req, res, next) => {
  db.query(
    `SELECT id_commandebooks FROM books WHERE id_book = ${req.params.id};`,
    (err, result_id_commandebooks) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if(result_id_commandebooks[0].id_commandebooks !== null) {
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err + 'Ce livre viens etre commandé '
          });
        }
      }
      else {
        db.query(
          `UPDATE books SET id_commandebooks = ${(req.body.idcommandeBooks)} WHERE id_book = ${req.params.id} `,
          (err, result) => {
            if (err) {
              throw err;
              return res.status(400).send({
                msg: err
              });
            }
            else{
              db.query(
                `SELECT ReferenceBook FROM books WHERE id_book = ${req.params.id};`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  else {
                    db.query(
                      `UPDATE commande SET ReferenceBook = ${(result[0].ReferenceBook)} WHERE id_Commande = ${(req.body.idcommandeBooks)} `,
                    )
                  }
                },
              )
            }
            return res.status(200).send({
              msg: 'Success!'
            });
          },
        );
      }
    }
  )
});

//je choisie cette commande
router.post('/commandeOfLivreur/:idLivreur/:idCommande', (req,res,next) => {
  db.query(`update commande set id_livreur = '${req.params.idLivreur}' where id_Commande = ${req.params.idCommande}`,
      (err, result) => {
      // user does not exists
      console.log(result);
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              user: result
          });}
      }
  )
});

//je choisie cette commande
router.post('/commandeOfLivreurClient/:idLivreur/:idCommande', (req,res,next) => {
  db.query(`update commande set etat = 'phase de retour' where id_Commande = ${req.params.idCommande}`,
      (err, result) => {
      // user does not exists
      console.log(result);
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              user: result
          });}
      }
  )
});

//je choisie cette commande
router.post('/commandeOfAdmin/:idCommande', (req,res,next) => {
  db.query(`update commande set etat = 'Commande remis au livreur' where id_Commande = ${req.params.idCommande}`,
      (err, result) => {
      // user does not exists
      console.log(result);
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              user: result
          });}
      }
  )
});

//je choisie cette commande
router.post('/commandeOfBookRendu/:idCommande', (req,res,next) => {
  db.query(`update commande set etat = 'Livre rendu' where id_Commande = ${req.params.idCommande}`,
      (err, result) => {
      // user does not exists
      console.log(result);
          if (err) {
              throw err;
              return res.status(400).send({
                  msg: err
              });
          }
          else {
              return res.status(200).send({
              msg: 'Transfert effectué !',
              user: result
          });}
      }
  )
});

//GET
router.get('/commande/:reference/:id', (req,res,next) => {
  db.query(`Select * from commande where ReferenceBook = ${req.params.reference} AND id_userscommande= ${req.params.id} AND not (commande.etat = "relais")`,
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
//Retourner toutes les nouvelles commandes
router.get('/commandes/:id', (req,res,next) => {
  db.query(`SELECT * FROM commande,books where commande.etat='Commande en cours de Traitement' AND commande.id_Commande=books.id_commandebooks OR commande.etat='Commande remis au livreur' AND commande.id_Commande=books.id_commandebooks AND commande.id_livreur = ${req.params.id}`,
      (err, result) => {
      // user does not exists
          if (err) {
            console.log(err)
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

//Retourner toutes commande pour l'admin
router.get('/commandeAdmin', (req,res,next) => {
  db.query(`SELECT * FROM commande,books where commande.id_livreur IS NOT NULL AND commande.id_Commande=books.id_commandebooks`,
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

//Retourner toutes les nouvelles commandes
router.get('/cmdCliUser/:id', (req,res,next) => {
  db.query(`SELECT * FROM commande,books,user where commande.id_Commande= ${req.params.id} AND commande.id_Commande=books.id_commandebooks AND commande.id_userscommande= user.id_user`,
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

                                                                            ////ABONNEMENT
//POST
// Post idAbonnement
router.post('/userAbonnementpost/:id', (req,res,next) => {
  db.query(`update user set id_abonnement  = '${req.body.idAbonnement}' where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

// Post token 
router.post('/userTokenABPost/:id', (req,res,next) => {
  db.query(`update user set token_Stripe  = '${req.body.tokenAbonnement}' where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

//GET
//Get idAbonnement
router.get('/userAbonnementget/:id', (req,res,next) => {
  db.query(`Select id_abonnement from user where id_user = ${req.params.id}`,
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
              user: result
          });}
      }
  )
});

module.exports = router;