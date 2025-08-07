import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const generateAcessTokenAndRefreshTokens = async (userId) => {

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    //  refresh token database me save karna hai 

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });                   // iska matlab validation na lagao direct save karo 

    return { accessToken, refreshToken };


  } catch (error) {
    throw new ApiError(500, "Something went error while generating refresh and acces token ")
  }

}

//register user 

const sendOtp=asyncHandler(async(req,res)=>{
    
})
const registerUser = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body;


  if ([username, email, password].some((field) => field?.trim() === "")) {    // ye rray ke har ek elemnt check karega khaali to nhi  agar khaali to false wrna true

    throw new ApiError(400, "all the fields are required ")
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists please login ")
  }

    // console.log("request files ",req.files)
  const avatarLoacalPath = await req.files?.avatar[0]?.path;
  // console.log("ye hamara local path hai avatarLoacalPath",avatarLoacalPath)

  if (!avatarLoacalPath) {
    throw new ApiError(400, "image  file is required ")
  }

  const avatar = await uploadOnCloudinary(avatarLoacalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required")
  }


  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(409, "something went wrong in registering user ")
  }

  return res.status(201).json(

    new ApiResponse(200, createdUser, "User registered successfully")
  )



})



//login user 

const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }


  const user = await User.findOne({
    email
  })


  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }

  //ham log ko baar bar acces token ar  refresh token geanarate karna padega to inko ek hi method me oopr rkh lete hai
  //genarate  acces ar refersh token refresh token ko db mne svae bhi karenge ar fir  server pr bhejenge
  const { accessToken, refreshToken } = await generateAcessTokenAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


  //cookies 
  const options = {
    httpOnly: true,                                           //isko koi bhi frontend se modify nhi kar skta hai
    secure: true
  }


  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200, {

      user: loggedInUser,
      refreshToken,
      accessToken

    },
      "User logged in succesfully "


    ))


})
//user maine add kia hai  authmiddleware me  last me verification ke time to user object add kia tha ar agar user hai to logout kardo
//logout me user object se id laaenge ar database se query marenge  id ke basis pr ar refersh token delete kardunga
//jab user login ho rha hai to ham response me user ko user ki details bhi bjej rahe hain json me whi se user ka acces le rahe hai


const logoutUser = asyncHandler(async (req, res) => {
  //findbyIdandupdate do cheeze leta hai user find kaise kare ar doosra value kisi update karni hai
  //  new true kar denge to jo  nyi value milega wo updatted hogi 
  // fir cookies ko clear karna hai 


  await User.findByIdAndUpdate(req.user._id,
    {

      $set: {
        refreshToken: 1

      }
    },
    {
      new: true              // nyi updated value dega 
    }

  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "user logged out succesfully "))

})
//get current user 
//ku ki jab maine  middle ware bnaaya tha user agar login hi to mine usme user ki details bhi hgui hai already whi se lenege

const getCurrentUser = asyncHandler(async (req, res) => {

res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));


})

// Refresh ACcESS token 

// /acces token refresh karne ke liye 
// agar user ka acces token expiree ho gya hai to ham  refersh token ko compare karke ke dataabse se ek naya acces ar refersh token fenerate kar le  iska ye 
// jwt token ka mainly yhi motive hot ki user ko baar  user ko baar bar email ar password   daalna na  pade.

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies?.refreshToken ||  req.body.refreshToken;

  //agar refresh token nhi mila to error do 
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  //agar mil gya refersh token   check karo phle shi hai ya nhi fir  naya token geenrate kerenge 
  //verify() phle decrypt karta hai fir compare karta hai 
  try {

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);



    //agar mil gya  to mai user ki id se user ka datat managawa ka nayaya acces token ar refrshj token geneenrate karke  chipka kar bhej dunga


    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    //check karenge donon  same hain ya nhi 

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used ")
    }

    //new refersh token generated 

    const { accessToken, refreshToken } = await generateAcessTokenAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
        200, {

        user:updateduser,
        refreshToken,
        accessToken

      },
        "refershToken generated successfully "


      ))
  } catch (error) {

    throw new ApiError(401, error?.message || "Invalid refresh token ")

  }




})


export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken

}