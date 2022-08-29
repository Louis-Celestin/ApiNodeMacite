const express = require('express')
const {body,check}=require('express-validator')
const router = express.Router()
const controllers = require('../controllers/userController')
const db = require('../lib/db')
const userValidation = require('../middlewares/userValidation')


router.post("/signup",[
    body('name').not().isEmpty().withMessage('Le nom est obligatoire'),
    body('email').isEmail().withMessage("email invalide"),
    body('password').isLength({min:6}).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
    body('phone').isLength({min:10}).withMessage("Le numéro de téléphone doit contenir 10 chiffres"),
    body('sexe').isIn(['M','F']).withMessage("Le sexe doit être M ou F"),
    body('date_naissance').isISO8601().withMessage("La date de naissance doit être au format YYYY-MM-DD"),
    body('lieu_naissance').not().isEmpty().withMessage("Le lieu de naissance est obligatoire"),
    body('prenom').not().isEmpty().withMessage("Le prénom est obligatoire"),
    body('IdCommune').not().isEmpty().isNumeric().withMessage("La commune est obligatoire"),
],
 controllers.signUpController)
router.post("/login", controllers.loginController)
router.post("/activeAccount",controllers.verifyOtp)


//Export the express Router module
module.exports = router