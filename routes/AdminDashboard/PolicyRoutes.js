    const express = require("express");
    const router = express.Router();
    const Policy = require("./../../models/AdminDashboard/PolicySchema");

    // Get policies by category
    router.get("/policies/:category", async (req, res) => {
    const { category } = req.params;

    try {
        const policy = await Policy.findOne({ category });

        if (!policy) {
        return res.status(404).json({ message: "No policies found for this category" });
        }

        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    });

    // Create a new policy
    router.post("/policies", async (req, res) => {
    const { category, privacyPolicies, termsOfService } = req.body;

    try {
        const existingPolicy = await Policy.findOne({ category });

        if (existingPolicy) {
        return res.status(400).json({ message: "Policy for this category already exists" });
        }

        const newPolicy = new Policy({
        category,
        privacyPolicies,
        termsOfService,
        });

        await newPolicy.save();
        res.status(201).json({ message: "Policy added successfully", policy: newPolicy });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    });

    // Update a policy
    router.put("/policies/:category", async (req, res) => {
    const { category } = req.params;
    const { type, index, newPolicy } = req.body;

    try {
        const policy = await Policy.findOne({ category });

        if (!policy) {
        return res.status(404).json({ message: "Category not found" });
        }

        if (!["privacyPolicies", "termsOfService"].includes(type)) {
        return res.status(400).json({ message: "Invalid policy type" });
        }

        if (index < 0 || index >= policy[type].length) {
        return res.status(400).json({ message: "Invalid policy index" });
        }

        policy[type][index] = newPolicy;
        await policy.save();
        res.json({ message: "Policy updated successfully", updatedPolicy: policy });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    });

    // Delete a policy
    router.delete("/policies/:category", async (req, res) => {
    const { category } = req.params;
    const { type, index } = req.body;

    try {
        const policy = await Policy.findOne({ category });

        if (!policy) {
        return res.status(404).json({ message: "Category not found" });
        }

        if (!["privacyPolicies", "termsOfService"].includes(type)) {
        return res.status(400).json({ message: "Invalid policy type" });
        }

        if (index < 0 || index >= policy[type].length) {
        return res.status(400).json({ message: "Invalid policy index" });
        }

        policy[type].splice(index, 1);
        await policy.save();
        res.json({ message: "Policy removed successfully", updatedPolicy: policy });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    });

    router.post("/policy/add/:category", async (req, res) => {
        const { category } = req.params;
        const { type, message } = req.body;
    
        try {
        const existingPolicy = await Policy.findOne({ category });
    
        if (!existingPolicy) {
            return res.status(404).json({ message: "Category not found" });
        }
    
        if (!["privacyPolicies", "termsOfService"].includes(type)) {
            return res.status(400).json({ message: "Invalid policy type" });
        }
    
        existingPolicy[type].push(message);
    
        await existingPolicy.save();
    
        res.json({ message: "Policy updated successfully", updatedPolicy: existingPolicy });
        } catch (error) {
        res.status(500).json({ message: "Server error", error });
        }
    });
    
    module.exports = router;
