import multer from "multer";

// Returns a StorageEngine implementation configured to store files on the local file system.
const storage = multer.diskStorage({
  
 destination:function (req,file,cb){
    cb(null,"./public/temp")
 },
 filename:function(req,file,cb){

        cb(null,file.originalname)
 }

})
  // multerfunction ke andar storage variable use kar rha hai 
export  const upload = multer({
    storage,
})