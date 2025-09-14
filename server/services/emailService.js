const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"FoodShare" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  async sendFoodClaimedNotification(donor, claimer, foodItem) {
    const subject = `Your food donation "${foodItem.title}" has been claimed!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Great News! Your Food Donation Was Claimed</h2>
        <p>Hello ${donor.name},</p>
        <p>We're excited to let you know that your food donation has been claimed by someone in need!</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0369a1;">Food Item Details:</h3>
          <p><strong>Title:</strong> ${foodItem.title}</p>
          <p><strong>Description:</strong> ${foodItem.description}</p>
          <p><strong>Quantity:</strong> ${foodItem.quantity}</p>
          <p><strong>Pickup Location:</strong> ${foodItem.location}</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #16a34a;">Claimed By:</h3>
          <p><strong>Name:</strong> ${claimer.name}</p>
          <p><strong>Email:</strong> ${claimer.email}</p>
          <p><strong>Phone:</strong> ${claimer.phone}</p>
        </div>

        <p>Please coordinate with ${claimer.name} for the pickup details. You can reach them at ${claimer.email} or ${claimer.phone}.</p>
        
        <p>Thank you for helping reduce food waste and supporting your community!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The FoodShare Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(donor.email, subject, html);
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to FoodShare!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to FoodShare, ${user.name}!</h2>
        <p>Thank you for joining our community dedicated to reducing food waste and helping those in need.</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What you can do:</h3>
          <ul>
            <li><strong>Donate Food:</strong> Share surplus food with your community</li>
            <li><strong>Claim Food:</strong> Find free food items near you</li>
            <li><strong>Make a Difference:</strong> Help reduce food waste while helping others</li>
          </ul>
        </div>

        <p>Get started by browsing available food items or creating your first donation!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Sharing Food
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The FoodShare Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendExpiryReminderEmail(donor, foodItems) {
    const subject = 'Food Items Expiring Soon - FoodShare';
    const itemsList = foodItems.map(item => 
      `<li><strong>${item.title}</strong> - Expires: ${new Date(item.expiryDate).toLocaleDateString()}</li>`
    ).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Food Items Expiring Soon</h2>
        <p>Hello ${donor.name},</p>
        <p>This is a friendly reminder that some of your donated food items are expiring soon:</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            ${itemsList}
          </ul>
        </div>

        <p>Consider updating the expiry dates if they're still good, or remove them if they're no longer available.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/my-donations" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage My Donations
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The FoodShare Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(donor.email, subject, html);
  }
}

module.exports = new EmailService();
