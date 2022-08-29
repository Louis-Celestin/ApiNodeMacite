const db = require("../lib/db")
const { validationResult } = require('express-validator');
const {PrismaClient}=require('@prisma/client');
const prisma = new PrismaClient()

module.exports.propositionsController = async (req, res, next) => {
  const props = await prisma.proposition_idees.findMany({
    include: { themes: true, users: true },
  });
  return res.status(200).json(props);
};

module.exports.proposistionsByIdController = (req, res, next) => {
  db.query(
    `SELECT * FROM proposition_idees WHERE proposition_idees.id = ${req.params.id}`,
    (err, result) => {
      if (!result.length) {
        return res
          .status(404)
          .json({ message: "Erreur, cette ressource n'existe pas" });
      } else {
        return res.status(200).json(result[0]);
      }
    }
  );
};

module.exports.propositionsCreateController = (req, res, next) => {
  description = req.body.description;
  user = req.body.IdUser;
  theme = req.body.IdTheme;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    for (let i = 0; i < errors.array().length; i++) {
      console.log(errors.array()[i].msg);
      return res.status(401).json({ errors: errors });
    }
  }
  db.query(
    `INSERT INTO proposition_idees(description,IdUser,IdTheme,created_at) VALUES(${db.escape(
      description
    )},${db.escape(user)},${db.escape(theme)},now())`,
    (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
      if (result) {
        return res.status(200).json({ message: "Insertion reussie" });
      }
    }
  );
};

module.exports.propositionsUpdateController = (req, res, next) => {
  //Get a PI
  db.query(
    `SELECT * FROM proposition_idees WHERE proposition_idees.id = ${req.params.id}`,
    (err, result) => {
      if (!result.length) {
        return res
          .status(404)
          .json({ message: "Erreur, cette ressource n'existe pas" });
      } else {
        if (!req.body.description && !req.body.IdUser && !req.body.IdTheme) {
          db.query(
            `UPDATE proposition_idees SET description=${db.escape(
              result[0].description
            )}, IdUser=${db.escape(result[0].IdUser)},IdTheme=${db.escape(
              result[0].IdTheme
            )} WHERE proposition_idees.id=${db.escape(result[0].id)}`,
            (err1, result1) => {
              if (err) {
                return res.status(400).json(err1);
              } else {
                return res
                  .status(200)
                  .json({ message: "Mise a jour effectuée sans modification" });
              }
            }
          );
        } else {
          //Validation
          //TEST
          db.query(
            `UPDATE proposition_idees SET description=${db.escape(
              req.body.description
            )}, IdUser=${db.escape(result[0].IdUser)},IdTheme=${db.escape(
              req.body.IdTheme
            )},updated_at=now() WHERE proposition_idees.id=${db.escape(
              result[0].id
            )}`,
            (err2, result2) => {
              if (err2) {
                return res.status(400).json(err2);
              } else {
                return res
                  .status(200)
                  .json({ message: "Mise a jour effectuée 2" });
              }
            }
          );
        }
      }
    }
  );
};

module.exports.propositionsLikerController =async (req, res, next) => {
  
}

module.exports.commentPropositionsController=async (req,res,next)=>{

    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        for (let i = 0; i < errors.array().length; i++) {
            console.log(errors.array()[i].msg)
            return res.status(401).json({ errors: errors });
        }

  db.query(
    `SELECT IdUserLiker FROM proposition_idees WHERE proposition_idees.id=${db.escape(
      req.params.id
    )}`,
    (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
      if (result.length) {
        let test1 = JSON.stringify(result[0]);
        let test2 = JSON.parse(test1);
        let test3 = test2.push({ cle: "valeur" });
        console.log(test3);
      }

    }
  );
};

module.exports.commentPropositionsController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    for (let i = 0; i < errors.array().length; i++) {
      console.log(errors.array()[i].msg);
      return res.status(401).json({ errors: errors });
    }
  }
  //Check if existing in database
  db.query(
    `SELECT id FROM proposition_idees WHERE proposition_idees.id =${db.escape(
      req.params.id
    )}`,
    (err, result) => {
      if (err) {
        return res.json({ err }).status(400);
      }
      if (result.length) {
        db.query(
          `INSERT INTO commenter(description,IdUser,IdProposIdee,created_at) VALUES(${db.escape(
            req.body.description
          )},${db.escape(req.body.IdUser)},${db.escape(req.params.id)},now())`,

          (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              db.query(
                `SELECT * FROM commenter WHERE commenter.IdUser=${req.body.IdUser} ORDER BY id DESC`,

                (err, result) => {
                  if (err) {
                    return res.status(400).json({ message: "Erreur" });
                  }
                  if (result) {
                    return res.status(200).json(result);
                  }
                }
              );
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Cette ressource n'existe pas" });
      }
    }
    )
}
}
