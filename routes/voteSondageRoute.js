const express = require('express')
const router = express.Router()
const {voteController} = require('../controllers/voteSondageController')
const {body}=require('express-validator')




router.post('/voteOption/:id',[
    body('IdUser').not().isEmpty().isNumeric().withMessage("L'utilisateur n'est pas valide")
],
voteController
)


module.exports=router