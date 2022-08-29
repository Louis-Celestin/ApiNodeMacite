const express = require('express')
const router = express.Router()
const db = require('../lib/db')
const propositions = require('../controllers/propositionsIdeeController')
const {body,validationResult}=require('express-validator')


router.get('/propositions', propositions.propositionsController)
router.get('/propositions/:id', propositions.proposistionsByIdController)
router.post('/propositionsCreate',[
    
    body('description').not().isEmpty().withMessage('La description doit etre une chaine de caractere'),
    body('IdUser').not().isEmpty().isNumeric().withMessage("Utilisateur invalide"),
    body('IdTheme').not().isEmpty().isNumeric().withMessage("Theme invalide")
], propositions.propositionsCreateController)

router.put('/propositionsUpdate/:id'
,propositions.propositionsUpdateController)

router.post('/propositionsLiker/:id',[

    body('description').not().isEmpty().withMessage('La description doit etre une chaine de caracetere'),
    body('IdUser').not().isEmpty().isNumeric().withMessage("L'utilisateur n'est pas valide")

], propositions.propositionsLikerController)


router.post('/commentPropositions/:id',[
    body('description').not().isEmpty().isString().withMessage('La description doit etre une chaine de caracetere'),
    body('IdUser').not().isEmpty().isNumeric().withMessage("L'utilisateur n'est pas valide")
], propositions.commentPropositionsController)

module.exports=router