const express = require('express');
const router = express.Router();
const Notification = require('../models/userNotifications');

const authenticateUser = (req, res, next) => {
  const userId = req.session.user.id;
  console.log(req.session.user);

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required: Session not found or user not logged in.' });
  }
  req.userId = userId;
  next();
};

router.get('/notify', authenticateUser, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const userId = req.userId;

    const notifications = await Notification.find({ userId: userId })
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalNotifications = await Notification.countDocuments({ userId: userId });

    res.json({
      notifications,
      total: totalNotifications,
      hasMore: (parseInt(skip) + notifications.length) < totalNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
});


router.post('/', authenticateUser, async (req, res) => {
    try {
    const userId = req.userId;
    const { type, message, status, details } = req.body;

    if (!type || !message) {
      return res.status(400).json({ message: 'Notification type and message are required.' });
    }

    const newNotification = new Notification({
      userId: userId,
      type: type,
      message: message,
      status: status,
      details: details
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error adding new notification:', error);
    res.status(500).json({ message: 'Server error adding new notification.' });
  }
});

// New Route: Get a single notification by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;

    const notification = await Notification.findOne({ _id: notificationId, userId: userId });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized.' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching single notification:', error);
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid notification ID format.' });
    }
    res.status(500).json({ message: 'Server error fetching notification.' });
  }
});

// New Route: Update/Edit an existing notification
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;
    const { type, message, status, details, read } = req.body;

    const updateFields = {};
    if (type) updateFields.type = type;
    if (message) updateFields.message = message;
    if (status) updateFields.status = status;
    if (details) updateFields.details = details;
    if (typeof read === 'boolean') updateFields.read = read;

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId }, // Find by notification ID and user ID for ownership
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated doc, run schema validators
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found or not authorized to update.' });
    }

    res.json({ message: 'Notification updated successfully.', notification: updatedNotification });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error updating notification:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid notification ID format.' });
    }
    res.status(500).json({ message: 'Server error updating notification.' });
  }
});

router.put('/:id/read', authenticateUser, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found or not authorized to update.' });
    }

    res.json({ message: 'Notification marked as read.', notification: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error marking notification as read.' });
  }
});

// New Route: Mark all notifications for a user as read
router.put('/mark-all-read', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const updateResult = await Notification.updateMany(
      { userId: userId, read: false }, // Find all unread notifications for the user
      { $set: { read: true } }
    );

    res.json({
      message: `Marked ${updateResult.modifiedCount} notifications as read.`,
      modifiedCount: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error marking all notifications as read.' });
  }
});

// New Route: Delete a specific notification
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;

    const deletedNotification = await Notification.findOneAndDelete({ _id: notificationId, userId: userId });

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found or not authorized to delete.' });
    }

    res.json({ message: 'Notification deleted successfully.', notification: deletedNotification });
  } catch (error) {
    console.error('Error deleting notification:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid notification ID format.' });
    }
    res.status(500).json({ message: 'Server error deleting notification.' });
  }
});




module.exports = router;
