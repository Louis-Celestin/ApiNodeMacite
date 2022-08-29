const db = require("../lib/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otp = require("../services/otpService");
const sendSms = require("../services/sendSms");
const { body, validationResult } = require('express-validator');
const path = require('path');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.signUpController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    for (let i = 0; i < errors.array().length; i++) {
      return res.status(401).json({ errors: errors.array()[i].msg });
    }
  }

    //Check email
    db.query(`SELECT email FROM users WHERE LOWER(email)=${db.escape(req.body.email)}`,

      (err,result)=>{
        if(err){return res.status(400).json({message:err})}
        if(result.length){return res.status(400).json({message:"Email deja pris"})}else{
          //Check Phone
          db.query(`SELECT phone FROM users WHERE phone=${db.escape(req.body.phone)}`,
          
          (err,result)=>{
            if(err){return res.status(400).json({message:err})}
            if(result.length){return res.status(400).json({message:"Numero deja pris"})}
            else{
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  throw err;
                } else {
      
                  if (!req.files){
                    let image = "test.png"
                    db.query(
                      `INSERT INTO users(image,name,email,password,prenom,phone,sexe,date_naissance,lieu_naissance,otp,IdCommune,IdtypeUtilisateur,created_at) VALUES(${db.escape(
                        image
                      )},${db.escape(req.body.name)},${db.escape(
                        req.body.email
                      )},${db.escape(hash)},${db.escape(req.body.prenom)},${db.escape(
                        req.body.phone
                      )},${db.escape(req.body.sexe)},${db.escape(
                        req.body.date_naissance
                      )},${db.escape(req.body.lieu_naissance)},${db.escape(
                        otp
                      )},${db.escape(req.body.IdCommune)},2,now())`,
                      (err, result) => {
                        if (err) throw err;
                        if (result) {
                          db.query(
                            `SELECT id,otp FROM users WHERE LOWER(email)=${db.escape(
                              req.body.email
                            )}`,
                            (err, result) => {
                              if (err) {
                                return res.status(400).json({ message: err });
                              }
                              if (result.length) {
                                sendSms(
                                  req.body.phone,
                                  `Votre code de confirmation est:${result[0]["otp"]}`
                                );
                                  return res.status(201).json({message:"Inscription reussie",IdUser:result[0]['id']})
                              }
                            }
                          );
                          // sendSms(req.body.phone,
                          //   `Votre code de confirmation est ${result}`)
                          console.log("TERMINE");
                        }
                      }
                    );
                  } //If no file
                  else {
                    let image = req.files.image
                    const md5 = image.md5
                    const filename = image.name;
                    const size = image.data.length
                    const extension = path.extname(filename)
                    const allowedExtensions = ['.jpg', '.png', '.jpeg', '.gif']
                    const URL = './uploads/avatar/' + md5 + filename;
                    image.mv('./uploads/avatar/' + md5 + filename, (err) => {
                      if (err) {
                        console.log(err)
                      }
                      else {
                        console.log("TEST")
                      }
                    }
                    )
                    if (!allowedExtensions.includes(extension)) {
                      return res.status(400).json({ message: 'Extension non autorisée' })
                    }
      
                    if (size > 5000000) {
                      return res.status(400).json({ message: 'La taille du fichier doit etre inferieur à 5Mo' })
                    }
                    else {
                      db.query(
                        `INSERT INTO users(image,name,email,password,prenom,phone,sexe,date_naissance,lieu_naissance,otp,IdCommune,IdtypeUtilisateur,created_at) VALUES(${db.escape(filename)},${db.escape(req.body.name)},${db.escape(
                          req.body.email
                        )},${db.escape(hash)},${db.escape(req.body.prenom)},${db.escape(
                          req.body.phone
                        )},${db.escape(req.body.sexe)},${db.escape(
                          req.body.date_naissance
                        )},${db.escape(req.body.lieu_naissance)},${otp},${db.escape(
                          req.body.IdCommune
                        )},2,now())`,
                        (err, result) => {
                          if (err) {return res.status(400).json({err})};
                          if (result) {
                            db.query(`SELECT otp FROM users WHERE LOWER(email)=${db.escape(req.body.email)}`,(err,result)=>{
                              if(err){return res.status(400).json({err})}
                              if(result.length){
                                sendSms(req.body.phone,
                                  `Votre code de confirmation est:${result[0]['otp']}`
                                  )
                                  return res.status(201).json({message:"Inscription reussie",IdUser:result[0]['id']})
                              }
                            })
                            // sendSms(req.body.phone,
                            //   `Votre code de confirmation est ${result}`)
                            console.log("TERMINE")
                          }
                        })
                    }
                  }
                }
              })
            }
          }
          )
        }
      }
    
    )
}


module.exports.loginController = (req, res, next) => {
  const password = req.body.password;
  const user = req.body.user;

  if (!isNaN(user)) {
    db.query(
      `SELECT id,name,password,email,prenom,sexe,phone,lieu_naissance,date_naissance,IdCommune,IdTypeUtilisateur,created_at,last_login,active FROM users WHERE phone = ${db.escape(
        user
      )}`,
      (err, result) => {
        if (err) {
        } else if (!result.length) {
          return res
            .status(200)
            .json({ message: "Numero ou mot de passe incorrect" });
        } else if (result.length) {
          bcrypt.compare(password, result[0]['password'], (err, isMatch) => {
            if (err) {
              return res.status(200).json({ message: "Erreur Serveur" })
            }
            if (isMatch) {
              const token = jwt.sign(
                {
                  userId: result[0]["id"],
                },
                "SECRETKEY",
                { expiresIn: "1h" }
              );
              db.query(
                `UPDATE users SET last_login = now() WHERE id = ${result[0]["id"]}`
              );
              return res.status(200).json({
                message: "Connexion réussie",
                user: result[0],
                token: token,
              });
            } else {
              return res.json({ message: "Numero ou mot de passe incorrects" })
            }
          })
        }
      }
    );
  } else {
    db.query(
      `SELECT id,name,password,email,prenom,sexe,phone,lieu_naissance,date_naissance,IdCommune,IdTypeUtilisateur,created_at,last_login,active FROM users WHERE LOWER(email) = ${db.escape(
        user
      )}`,
      (err, result) => {
        if (err) {
        } else if (!result.length) {
          return res
            .status(400)
            .json({ message: "Email ou mot de passe incorrect" });
        } else if (result.length) {
          bcrypt.compare(password, result[0]['password'], (err, isMatch) => {
            if (err) {
              return res.status(500).json({ message: "Erreur Serveur" })
            }
            if (isMatch) {
              const token = jwt.sign(
                {
                  userId: result[0]["id"],
                },
                "SECRETKEY",
                { expiresIn: "1h" }
              );
              db.query(
                `UPDATE users SET last_login = now() WHERE id = ${result[0]["id"]}`
              );
              return res.status(200).json({
                message: "Connexion réussie",
                user: result[0],
                token: token,
              });
            } else {
              return res.json({ message: "Email ou mot de passe incorrects" })
            }
          })
        }
      }
    );
  }
};


module.exports.verifyOtp = (req, res, next) => {

    // check if userAccount is already activate


    
  db.query(
    `SELECT id FROM users WHERE id = ${db.escape(req.body.id)}`,
    (err, result) => {
      if (err) throw err;
      if (!result.length) {
        return res.status(400).json({ message: "L'utilisateur n'existe pas" });
      } else {

        db.query(`SELECT otp FROM users WHERE id=${db.escape(req.body.id)}`,
        
        (err,result)=>{
          if(err){return res.status(400).json({message:err})}
          if(!result.length){return res.status(400).json({ message: "Code incorrect" });
        }else{
          db.query(
            `UPDATE users SET active = 1 WHERE otp = ${db.escape(req.body.otp)}`,
            (err2, result2) => {
              if (err2) throw err2;
              if (result2) {
                return res.status(200).json({ message: "Compte activé" });
              }
            }
          )
        }
        }
        )
      }
    }
  )
}
