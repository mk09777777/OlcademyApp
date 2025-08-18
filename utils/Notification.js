const Notification=require("../models/userNotifications");

async function createNotification(userId, type, message, status = 'unread', details = {}) {
    if (!userId || !type || !message) {
        throw new Error('User ID, notification type, and message are required to create a notification.');
    }

    try {
        const newNotification = new Notification({
            userId: userId,
            type: type,
            message: message,
            status: status,
            details: details
        });

        const savedNotification = await newNotification.save();
        return savedNotification;
    } catch (error) {
        // You might want to log the error more comprehensively here
        console.error('Error saving notification in createNotification utility:', error);
        if (error.name === 'ValidationError') {
            throw new Error(`Validation Error creating notification: ${error.message}`);
        }
        throw new Error(`Failed to create notification: ${error.message || 'Unknown error'}`);
    }
}

module.exports = { createNotification };