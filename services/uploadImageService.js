const path = require('path');

module.exports.fileupload = (file,req,res,next)=>{
    const md5=file.md5
    const filename = file.name;
    const size = file.data.length
    const extension = path.extname(filename)
    const allowedExtensions = ['.jpg','.png','.jpeg','.gif']
    const URL = './uploads/avatar/'+md5+filename;
    file.mv('./uploads/avatar/'+md5+filename,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            return res.status(200).json("TEST")
        }
    }
    )

    if(!allowedExtensions.includes(extension)){
        return res.status(400).json({message:'Extension non autorisée'})
    }

    if(size > 5000000){
        return res.status(400).json({message:'La taille du fichier doit etre inferieur à 5Mo'})
    }
}