const Mail=require("./../../models/AdminDashboard/EmailSchema");
const Notify=require("./../../models/logs/notify");
const express=require("express");
const router=express.Router();
const {verify}=require("./GenerateToken");

const User=require("./../../models/user")
const multer=require("multer");

const posts=multer.memoryStorage();
const upload=multer({posts});

router.get("/inbox", verify, async (req, res) => {
  const userId=req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
    try {
      const mails = await Mail.find({ receiverMailId : req.userId,'receiverStatus.isTrashed':false})
        .sort({ createdAt: -1 })
        .populate("user", "username ")
        .skip((page - 1) * limit)
        .limit(limit);
      
        const totalItems = await Mail.countDocuments({ 
          receiverMailId: req.userId,
          'receiverStatus.isTrashed': false
        });
      res.status(200).json({ message:"found",mails,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,});
    } catch (error) {
      console.error("Error retrieving inbox:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving mails.",
        error: error.message,
      });
    }
  });

router.post("/sent", verify,upload.single("image"), async (req, res) => {
    const { emailId, subject, body, preview } = req.body;
    const userId=req.userId;
    try {
      if (!emailId || !subject || !body) {
        return res.status(400).json({ message: "Required fields are missing." });
    }
  
      const user = await User.findById(userId );
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      let imageBase64 = null;
      if (req.file) {
        imageBase64 = req.file.buffer.toString("base64");
        console.log(imageBase64);
      }
      const newMail = new Mail({
        receiverMailId:emailId,
        subject,
        body,
        preview,
        user: user._id,
        image:imageBase64,
        createdAt:Date.now(),
        senderStatus:{isSent:true},
        
      });
  
      const savedMail = await newMail.save();
  
      res.status(201).json({
        message: "Mail created successfully.",
        mail: savedMail,
      });
    } catch (error) {
      console.error("Error creating mail:", error.message);
      res.status(500).json({
        message: "An error occurred while creating the mail.",
        error: error.message,
      });
    }
});

router.get("/Sent",verify,async(req,res)=>{
  const userId=req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try{
    const findUser=await User.findById(userId)
    const findSentMails=await Mail.find({user:findUser._id,'senderStatus.isDraft':false}).sort({ createdAt: -1 }).populate("user","username ")
    .skip((page - 1) * limit)
    .limit(limit);
    const totalItems = await Mail.countDocuments({
      user:findUser._id,
      'senderStatus.isDraft':false
    });
    return res.status(200).json({message:"sent mails",findSentMails,totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page});
  }
  catch(error){
    return res.status(400).json({message:error.message});
  }
})

router.get("/star",verify,async(req,res)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId=req.userId;
    try {
      const mails = await Mail.find({  receiverMailId : req.userId,'receiverStatus.isStarred':true})
        .sort({ createdAt: -1 })
        .populate("user", "username ")
        .skip((page - 1) * limit)
        .limit(limit);
        const totalItems = await Mail.countDocuments({
          receiverMailId : req.userId,
          'receiverStatus.isStar':true
        });
      res.status(200).json({ message:"found",mails,  totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,});
    } catch (error) {
      console.error("Error retrieving inbox:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving mails.",
        error: error.message,
      });
    }
})

router.post("/SendStar",verify,async(req,res)=>{
  const userId=req.userId;
  const {id}=req.body;
  try {
    const mails = await Mail.findById(id)
      .sort({ createdAt: -1 })
      .populate("user", "username ");
      mails.receiverStatus.isStarred=true;
      await mails.save();
    res.status(200).json({ message:"found",mails });
  } catch (error) {
    console.error("Error retrieving inbox:", error.message);
    res.status(500).json({
      message: "An error occurred while retrieving mails.",
      error: error.message,
    });
  }
})

router.post("/inbox/read",verify,async(req,res)=>{
  const {id}=req.body;
  console.log(id);
  try{
    const mails = await Mail.findById(id)
      .sort({ createdAt: -1 })
      .populate("user", "username ");
    mails.receiverStatus.read=true
    mails.save();
    res.status(200).json({ message:"found",mails });
  } catch (error) {
    console.error("Error retrieving inbox:", error.message);
    res.status(500).json({
      message: "An error occurred while retrieving mails.",
      error: error.message,
    });
  }
})

router.post("/SentTrash",verify,async(req,res)=>{
  const userId=req.userId;
  const {id}=req.body;
  try {
    const mails = await Mail.findById(id)
      .sort({ createdAt: -1 })
      .populate("user", "username ");
      console.log(mails);
      mails.receiverStatus.isTrashed=true;
      await mails.save();
        const newNotify=new Notify({
                  timestamp:new Date(),
                  level:"A Support section got a new message check it",
                  type:['admin'],
                  message:"A Collection details is updated check it once",
                  metadata:{
                    category:["Chat"],
                    isViewed:false,
                    isAccept:false,
                    isReject:false,
                  }
          })
          await newNotify.save();
    res.status(200).json({ message:"found",mails });
  } catch (error) {
    console.error("Error retrieving inbox:", error.message);
    res.status(500).json({
      message: "An error occurred while retrieving mails.",
      error: error.message,
    });
  }
})


router.get("/isTrashed",verify,async(req,res)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId=req.userId;
    try {
      const mails = await Mail.find({ receiverMailId : req.userId,'receiverStatus.isTrashed':true})
        .sort({ createdAt: -1 })
        .populate("user", "username ")
        .skip((page - 1) * limit)
        .limit(limit);

        const totalItems = await Mail.countDocuments({
          receiverMailId : req.userId,
          'receiverStatus.isTrashed':true
        });
      res.status(200).json({ message:"found",mails,totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page});
    } catch (error) {
      console.error("Error retrieving inbox:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving mails.",
        error: error.message,
      });
    }
})

router.post("/draft",verify,async(req,res)=>{
  const { emailId, subject, body, preview } = req.body;
  const userId=req.userId;
  try {
    if (!emailId || !subject || !body) {
      return res.status(400).json({ message: "Required fields are missing." });
  }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newMail = new Mail({
      receiverMailId:emailId,
      subject,
      body,
      preview,
      user: user._id,
      createdAt:Date.now(),
      senderStatus:{isDraft:true},
      
    });

    const savedMail = await newMail.save();

    res.status(201).json({
      message: "Mail created successfully.",
      mail: savedMail,
    });
  } catch (error) {
    console.error("Error creating mail:", error.message);
    res.status(500).json({
      message: "An error occurred while creating the mail.",
      error: error.message,
    });
  }
})

router.get("/isDraft",verify,async(req,res)=>{
  const userId=req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try{
    const findUser=await User.findById(userId)
    const findSentMails=await Mail.find({user:findUser._id,'senderStatus.isDraft':true}).sort({ createdAt: -1 }).populate("user","username")
    .skip((page - 1) * limit)
    .limit(limit);

    const totalItems = await Mail.countDocuments({
      user:findUser._id,
      'senderStatus.isDraft':true
    });
    return res.status(200).json({message:"sent mails",findSentMails,  totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,});
  }
  catch(error){
    return res.status(400).json({message:error.message});
  }
})

module.exports = router;

