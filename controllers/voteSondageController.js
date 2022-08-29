const db = require("../lib/db")
const { validationResult } = require('express-validator');
const {PrismaClient}=require('@prisma/client');
const prisma = new PrismaClient()


module.exports.voteController=async (req,res,next)=>{
    //check if user votes this option
    const voteOption=prisma.votes.findMany({
      include:{
        options:{
          include:{
            sondages:true
          }
        }
      },
      where:{
        IdUser:Number(req.body.IdUser)
      }
    })
    voteOption.then((result)=>{
      if(!result.length){console.log("Cet utilisteur peut voter")}else{
        if(result[0].IdUser==Number(req.body.IdUser)){
          return res.status(400).json({message:"Vous avez deja voté"})
        }else{
          console.log("")
        }
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
