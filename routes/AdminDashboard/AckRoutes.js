const express = require("express");
const router = express.Router();

const Agreement=require("./../../models/AdminDashboard/AgreementSchema")
router.post("/agreements", async (req, res) => {
    try {
        const { title, content } = req.body;
        let agreement = await Agreement.findOne({ title });
      
        if (agreement) {
          agreement.content = content;
          await agreement.save();
        } else {
          agreement = new Agreement({ title, content });
          await agreement.save();
        }
      
        res.status(201).json(agreement);
      } catch (error) {
        res.status(500).json({ message: "Error processing agreement", error });
      }      
});

router.get("/agreements/:title", async (req, res) => {
    const title=req.params;
    try {
      const agreements = await Agreement.find(title);
      res.status(200).json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching agreements", error });
    }
  });
  
module.exports = router;
