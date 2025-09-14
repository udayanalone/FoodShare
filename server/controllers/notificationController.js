const Notification = require('../models/Notification');

// Simple notification service without Socket.IO
class NotificationService {
  constructor() {}

  async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const [notifications, total] = await Promise.all([
        Notification.find({ user: userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Notification.countDocuments({ user: userId })
      ]);

      return {
        notifications,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { $set: { isRead: true } },
        { new: true }
      );
      return notification;
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        user: userId,
        isRead: false
      });
    } catch (error) {
      throw new Error('Failed to get unread count');
    }
  }
}

const notificationService = new NotificationService();

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationService.getUserNotifications(
      req.user._id, 
      parseInt(page), 
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id, 
      req.user._id
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, 1, 1);
    res.json({ count: result.unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};
