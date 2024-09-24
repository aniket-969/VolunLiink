import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
   
export const upload = multer({ 
  
    storage, 
    limits:{fileSize:1*1024*1024},
    fileFilter: (req, file, cb) => {
     
      console.log(file.fieldname);
      if (file.fieldname === "avatar") {
       
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);  
        } else {
          cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);  // Reject the file
        }
      } else {
        cb(new Error("Invalid field. Expected 'avatar' field."), false);  // Reject if field name doesn't match
      }
    }
})