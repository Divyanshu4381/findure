import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, getCurrentUser } from "../controllers/user.js"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { addBusiness, getMyBusinesses, deleteBusiness, getServicesByCategory, updatedBusiness } from "../controllers/business.js";
import { searchBusiness } from "../controllers/SearchBusiness.js";


const router = Router();


router.route("/register").post(upload.fields([
    {
        name: "avatar",                            //jab frontend ka field banega to iska naam avatar rkhna 
        maxCount: 1
    },
]), registerUser)



router.route("/login").post(loginUser);
router.get("/search", searchBusiness)   //user jo search karega usko authenticated hona zaroori nhi sirf 


//Secured routes 


router.route("/logoutUser").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

//busienss routes 
//business listing listing ke liye rouiyes hai 

router.route("/listbusiness").post(verifyJWT, upload.fields([
    {
        name: "businessImage",                            //jab frontend ka field banega to iska naam avatar rkhna 
        maxCount: 1
    },
]), addBusiness)

// router.get("/search", searchBusiness)   //user jo search karega usko authenticated hona zaroori nhi sirf

router.get("/mybusiness", verifyJWT, getMyBusinesses);
router.patch('/updatebusiness/:id', verifyJWT, upload.fields([
    {
        name: "businessImage",                          //jab frontend ka field banega to iska naam avatar rkhna 
        maxCount: 1
    },
]), updatedBusiness) 
router.delete("/delete/:id", verifyJWT, deleteBusiness)

router.get("/getuser", verifyJWT, getCurrentUser)






export default router;


