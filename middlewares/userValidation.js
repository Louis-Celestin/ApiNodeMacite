// middleware/users.js
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const { verifyOtpController } = require("../controllers/userController");

signUpValidator=(req, res, next)=>{


    const {name,email,password,prenom,phone,sexe,date_naissance,lieu_naissance,IdCommune} = req.body;

    check('')

    if(!name || !email || !password || !prenom || !phone || !sexe || !date_naissance || !lieu_naissance || !IdCommune){
        return res.status(400).json({message:"Tous les champs sont obligatoires"})
    }

    if(password.length < 6){
        return res.status(400).json({message:"Le mot de passe doit contenir au moins 6 caractères"})
    }

    if(email.includes("@")){
        
    }else{
        return res.status(400).json({message:"L'email n'est pas valide"})
        
    }
    if(phone.length < 10){
        return res.status(400).json({message:"Le numéro de téléphone doit contenir au moins 10 caractères"})
    }
    if(typeof(prenom) !== "string"){
        return res.status(400).json({message:"Le prénom n'est pas valide"})
    }

    if(isNaN(IdCommune)){
        return res.status(400).json({message:"L'id de la commune n'est pas valide"})
    }


    if(isNaN(phone)){
        return res.status(400).json({message:"Le numéro de téléphone n'est pas valide"})
    }
    next()
}


module.exports = {signUpValidator};