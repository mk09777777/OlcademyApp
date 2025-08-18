const express = require("express");
const router = express.Router();

const Acknowledgment=require("./../../models/AdminDashboard/Acknowledge")
const Agreement = require("./../../models/AdminDashboard/AgreementSchema");
const Email=require("./EmailService")
const UserAc=require("./../../models/AdminDashboard/UserSchema")


    router.post("/send-agreement", async (req, res) => {
        try {
        const { templateName } = req.body;
    
        const agreement = await Agreement.findOne({ title:templateName });
        if (!agreement) {
            return res.status(404).json({ message: "Agreement template not found" });
        }
    
        const newUsers = await UserAc.find({ sentAgreement: false });
        console.log(newUsers)
        if (newUsers.length === 0) {
            return res.status(200).json({ message: "No new users to send the agreement to." });
        }
    
        const acknowledgments = [];
        for (const user of newUsers) {
            const acknowledgment = new Acknowledgment({
            agreement: agreement._id,
            user: user._id,
            });

            acknowledgments.push(acknowledgment.save());
            Email(user.email,agreement.content,user._id)
        }
    
        await Promise.all(acknowledgments);
    
        await UserAc.updateMany({ sentAgreement: false }, { $set: { sentAgreement: true } });

        res.status(200).json({ message: "Agreement sent and acknowledgment created successfully!" ,newUsers});
        } catch (error) {
        res.status(500).json({ message: "Server error", error });
        }
    });
    router.post("/admin-accept/:id", async (req, res) => {
        try {
        const {id} = req.params;
    
        const acknowledgment = await Acknowledgment.findById(id);
        if (!acknowledgment) {
            return res.status(404).json({ message: "Acknowledgment not found" });
        }
    
        acknowledgment.adminAccepted = true;
        acknowledgment.adminAcceptedAt = new Date();
        await acknowledgment.save();
    
        res.status(200).json({ message: "Acknowledgment accepted by admin", acknowledgment });
        } catch (error) {
        res.status(500).json({ message: "Error updating acknowledgment", error });
        }
    });
    router.post("/addUser", async (req, res) => {
        try {
        const { username, email } = req.body;
    
        const existingUser = await UserAc.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const newUser = new UserAc({ username, email });
        await newUser.save();
    
        res.status(201).json({ message: "User added successfully.", user: newUser });
        } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error." });
        }
    });
    router.get("/acknowledgments/:userId", async (req, res) => {
        try {
            const { userId } = req.params;
    
            
            const acknowledgments = await Acknowledgment.find({ user: userId })
                .populate("agreement")
                .populate("user")
                .exec();
    
            if (!acknowledgments || acknowledgments.length === 0) {
                return res.status(404).json({ message: "No acknowledgments found for this user." });
            }
    
            res.status(200).json(acknowledgments);
        } catch (error) {
            console.error("Error fetching acknowledgments:", error);
            res.status(500).json({ message: "Server error", error });
        }
    });
    router.post("/user-accept/:id", async (req, res) => {
        try {
            const {id} = req.params;
    
            const acknowledgment = await Acknowledgment.findById(id);
            if (!acknowledgment) {
                return res.status(404).json({ message: "Acknowledgment not found" });
            }
    
            acknowledgment.acknowledgedAt= new Date();
            await acknowledgment.save();
    
            res.status(200).json({ message: "Agreement acknowledged by user", acknowledgment });
        } catch (error) {
            console.error("Error in user-accept route:", error);
            res.status(500).json({ message: "Server error", error });
        }
    });
    router.get("/all",async(req,res)=>{
        try{
            const acknowledgments = await Acknowledgment.find()
                .populate("agreement")
                .populate("user")
                .exec();
                const acknowledged = acknowledgments.filter(ack => ack.acknowledgedAt !== null && ack.adminAccepted !== true);
                const adminAccepted = acknowledgments.filter(ack => ack.adminAccepted === true);
        
                res.status(200).json({
                    userAccepted:acknowledged,
                    adminAccept:adminAccepted
                });
        }
        catch(error){
            return res.status(400).json(error.message)
        }
    })
module.exports = router;
