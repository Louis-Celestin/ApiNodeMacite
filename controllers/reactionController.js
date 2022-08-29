const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const prisma = new PrismaClient();

module.exports.likePropositionIdee = async (req, res, next) => {
  const idUser = req.body.idUser;
  const idProposition = req.body.idProposition;
  if (idUser == null || idProposition == null) {
    return res.status(400).json({ message: "veuillez remplir les champs !" });
  }
  await prisma.users
    .findMany({
      where: {
        id: Number(idUser),
      },
    })
    .then((response) => {
      prisma.proposition_idees
        .findMany({
          where: { id: Number(idProposition) },
        })
        .then((response) => {
          prisma.liker
            .findMany({
              where: {
                IdUser: Number(idUser),
                IdProposIdee: Number(idProposition),
              },
            })
            .then((response) => {
              if (response.length) {
                return res
                  .status(400)
                  .json({ message: "L'utilisateur a deja liker" });
              } else {
                prisma.liker
                  .create({
                    data: {
                      IdUser: Number(idUser),
                      IdProposIdee: Number(idProposition),
                    },
                  })
                  .then((response) => {
                    return res
                      .status(200)
                      .json(response);
                  })
                  .catch((error) => {
                    return res.status(400).json({ message: error });
                  });
              }
            })
            .catch((error) => {
              return res.status(400).json({ message: error });
            });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: "La prosotion d'idée n'existe pas !" });
        });
    })
    .catch((error) => {
      return res.status(400).json({ message: "L'utilisateur n'existe pas !" });
    });
};
