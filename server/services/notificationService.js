const Notification = require('../models/Notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      await notification.populate(['sender', 'recipient', 'foodItem']);
      
      // Emit real-time notification
      this.io.to(data.recipient.toString()).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        sender: notification.sender,
        foodItem: notification.foodItem,
        createdAt: notification.createdAt,
        isRead: false
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async notifyFoodClaimed(foodItem, claimer) {
    return this.createNotification({
      recipient: foodItem.donor,
      sender: claimer._id,
      type: 'food_claimed',
      title: 'Your food donation was claimed!',
      message: `${claimer.name} has claimed your "${foodItem.title}". Please coordinate pickup details.`,
      foodItem: foodItem._id
    });
  }

  async notifyNewFoodNearby(users, foodItem) {
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: foodItem.donor,
      type: 'new_food_nearby',
      title: 'New food available nearby!',
      message: `"${foodItem.title}" is now available in ${foodItem.location}`,
      foodItem: foodItem._id
    }));

    try {
      const createdNotifications = await Notification.insertMany(notifications);
      
      // Emit to all nearby users
      createdNotifications.forEach(notification => {
        this.io.to(notification.recipient.toString()).emit('notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          foodItem: foodItem,
          createdAt: notification.createdAt,
          isRead: false
        });
      });

      return createdNotifications;
    } catch (error) {
      console.error('Error creating nearby notifications:', error);
      throw error;
    }
  }

  async notifyFoodExpiring(foodItems) {
    const notifications = [];
    
    for (const food of foodItems) {
      notifications.push({
        recipient: food.donor,
        sender: food.donor,
        type: 'food_expiring',
        title: 'Food item expiring soon',
        message: `Your "${food.title}" expires tomorrow. Consider updating or removing it.`,
        foodItem: food._id
      });
    }

    try {
      const createdNotifications = await Notification.insertMany(notifications);
      
      // Emit to donors
      createdNotifications.forEach(notification => {
        this.io.to(notification.recipient.toString()).emit('notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          createdAt: notification.createdAt,
          isRead: false
        });
      });

      return createdNotifications;
    } catch (error) {
      console.error('Error creating expiring notifications:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const notifications = await Notification.find({ recipient: userId })
        .populate('sender', 'name')
        .populate('foodItem', 'title imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments({ recipient: userId });
      const unreadCount = await Notification.countDocuments({ 
        recipient: userId, 
        isRead: false 
      });

      return {
        notifications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (notification) {
        this.io.to(userId.toString()).emit('notification_read', {
          id: notificationId
        });
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      this.io.to(userId.toString()).emit('notifications_all_read');
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
