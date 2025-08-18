const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "venkatreddy30301@gmail.com" || "your_email@gmail.com", 
        pass: "" || "your_email_app_password"
    },
});

const sendConfirmationEmail = async (userEmail, username, bookingDate, timeSlot, offerName, offerCode, offerPercentage, moreInfo) => {
    const mailOptions = {
        from: `Zomato ${process.env.MY_EMAIL || "venkatreddy30301@gmail.com"}`,
        to: userEmail,
        subject: "🍽️ Your Booking is Confirmed!",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
                <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px;
                            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="background: #ff6b00; color: white; padding: 15px; font-size: 22px; font-weight: bold;
                                border-radius: 10px 10px 0 0;">
                        🍔 Your Booking Order is Confirmed! 🎉
                    </div>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>Thank you for your booking! Here are your details:</p>
                    
                    <div style="text-align: left; margin: 20px 0; padding: 15px; background: #fff8e1; border-radius: 8px;">
                        <p><strong>📅 Booking Date:</strong> ${bookingDate}</p>
                        <p><strong>⏰ Time Slot:</strong> ${timeSlot}</p>
                        <p><strong>🍽️ Offer Name:</strong> ${offerName}</p>
                        <p><strong>🔖 Offer Code:</strong> <span style="background: #ffcc00; padding: 10px; border-radius: 5px; font-weight: bold;">${offerCode}</span></p>
                        <p><strong>💰 Discount:</strong> ${offerPercentage}% off</p>
                        <p><strong>ℹ️ More Info:</strong> ${moreInfo}</p>
                    </div>

                    <p>🚀 Your delicious meal is on its way! Track your order in the app.</p>

                    <a href="https://your-tracking-link.com" style="background: #ff6b00; color: white; text-decoration: none; padding: 12px 20px;
                        border-radius: 5px; display: inline-block; margin-top: 15px; font-size: 18px; font-weight: bold;">
                        📍 Track Order
                    </a>

                    <div style="margin-top: 20px; font-size: 14px; color: gray;">
                        Need help? Contact us at <a href="mailto:support@foodieexpress.com">support@foodieexpress.com</a> 
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendCancelationEmail = async (userEmail, username, bookingDate, timeSlot, offerName, offerCode, offerPercentage, moreInfo) => {
    const mailOptions = {
        from: `Zomato ${process.env.MY_EMAIL || "venkatreddy30301@gmail.com"}`,
        to: userEmail,
        subject: "🚫 Booking Cancelled - Zomato",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);">
                    <div style="background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h2 style="margin: 0; font-size: 28px; font-weight: 600;">Booking Cancelled 😔</h2>
                        <p style="margin-top: 10px; font-size: 16px;">We're sorry, ${username}, your booking has been cancelled.</p>
                    </div>
                    <div style="padding: 20px 0;">
                        <p style="font-size: 16px;">Dear <strong>${username}</strong>,</p>
                        <p style="font-size: 16px;">We regret to inform you that your booking for the following details has been cancelled:</p>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 8px 0; font-size: 15px;"><strong>📅 Booking Date:</strong> ${bookingDate}</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>⏰ Time Slot:</strong> ${timeSlot}</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>🍽️ Offer Name:</strong> ${offerName}</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>🔖 Offer Code:</strong> <span style="background: #ffe082; padding: 8px 12px; border-radius: 5px; font-weight: 600;">${offerCode}</span></p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>💰 Discount:</strong> ${offerPercentage}% off</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>ℹ️ More Info:</strong> ${moreInfo}</p>
                        </div>
                        <p style="margin-top: 20px; font-size: 16px;">We understand this may be disappointing, and we apologize for any inconvenience caused.</p>
                        <p style="margin-top: 10px; font-size: 16px;">If you have any questions or would like to rebook, please contact our support team.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:support@foodieexpress.com" style="background: #3498db; color: white; padding: 15px 25px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Contact Support</a>
                    </div>
                    <div style="text-align: center; margin-top: 25px; font-size: 14px; color: #777;">
                        <p>Thank you for using FoodieExpress.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendPendingConfirmationEmail = async (userEmail, username, bookingDate, timeSlot, offerName) => {
    const mailOptions = {
        from: `Zomato ${process.env.MY_EMAIL || "venkatreddy30301@gmail.com"}`,
        to: userEmail,
        subject: "⏳ Booking Pending Confirmation - Zomato",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);">
                    <div style="background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h2 style="margin: 0; font-size: 28px; font-weight: 600;">Booking Pending ⌛</h2>
                        <p style="margin-top: 10px; font-size: 16px;">Hi ${username}, your booking is awaiting confirmation.</p>
                    </div>
                    <div style="padding: 20px 0;">
                        <p style="font-size: 16px;">Dear <strong>${username}</strong>,</p>
                        <p style="font-size: 16px;">Thank you for placing your booking! We are currently processing your request and will notify you as soon as it's confirmed.</p>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 8px 0; font-size: 15px;"><strong>📅 Booking Date:</strong> ${bookingDate}</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>⏰ Time Slot:</strong> ${timeSlot}</p>
                            <p style="margin: 8px 0; font-size: 15px;"><strong>🍽️ Offer Id:</strong> ${offerName}</p>
                        </div>
                        <p style="margin-top: 20px; font-size: 16px;">We appreciate your patience. We will send you a confirmation email once your booking is approved.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:support@foodieexpress.com" style="background: #3498db; color: white; padding: 15px 25px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Contact Support</a>
                    </div>
                    <div style="text-align: center; margin-top: 25px; font-size: 14px; color: #777;">
                        <p>Thank you for using Zomato.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendTiffinBookingConfirmationEmail = async (userEmail, username, orderId, deliveryDate, deliveryTime, mealPlan, totalAmount, deliveryAddress, contactNumber) => {
    const mailOptions = {
        from: `Zomato Tiffins ${process.env.MY_EMAIL || ""}`,
        to: userEmail,
        subject: "🍱 Your Tiffin Order is Confirmed!",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #e8f5e9; padding: 20px;">
                <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px;
                            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="background: #4CAF50; color: white; padding: 15px; font-size: 22px; font-weight: bold;
                                border-radius: 10px 10px 0 0;">
                        ✅ Tiffin Order Confirmed! 
                    </div>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>Your tiffin order has been successfully placed and confirmed! Here are your details:</p>
                    
                    <div style="text-align: left; margin: 20px 0; padding: 15px; background: #e0f7fa; border-radius: 8px;">
                        <p><strong>📦 Order ID:</strong> ${orderId}</p>
                        <p><strong>📅 Delivery Date:</strong> ${deliveryDate}</p>
                        <p><strong>⏰ Delivery Time:</strong> ${deliveryTime}</p>
                        <p><strong>🍲 Meal Plan:</strong> ${mealPlan}</p>
                        <p><strong>💸 Total Amount:</strong> ₹${totalAmount}</p>
                        <p><strong>🏠 Delivery Address:</strong> ${deliveryAddress}</p>
                        <p><strong>📞 Contact:</strong> ${contactNumber}</p>
                    </div>

                    <p>Your delicious tiffin will be delivered as scheduled. Enjoy your meal!</p>

                    <a href="https://your-tiffin-tracking-link.com" style="background: #2196F3; color: white; text-decoration: none; padding: 12px 20px;
                        border-radius: 5px; display: inline-block; margin-top: 15px; font-size: 18px; font-weight: bold;">
                        🚚 Track Delivery
                    </a>

                    <div style="margin-top: 20px; font-size: 14px; color: gray;">
                        Questions? Reach us at <a href="mailto:tiffin-support@zomato.com">tiffin-support@zomato.com</a> 
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Tiffin booking email sent: " + info.response);
    } catch (error) {
        console.error("Error sending tiffin booking email:", error);
    }
};


const sendCustomNotificationEmail = async (userEmail, subject, htmlContent) => {
    const mailOptions = {
        from: `Zomato Notifications ${process.env.MY_EMAIL || "venkatreddy30301@gmail.com"}`,
        to: userEmail,
        subject: subject,
        html: `
            <div style="font-family: Verdana, Geneva, sans-serif; background-color: #e3f2fd; padding: 20px;">
                <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px;
                            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="background: #2196F3; color: white; padding: 15px; font-size: 22px; font-weight: bold;
                                border-radius: 10px 10px 0 0;">
                        🔔 Important Notification from Zomato
                    </div>
                    <div style="text-align: left; margin: 20px 0; padding: 15px; background: #e0f2f7; border-radius: 8px;">
                        ${htmlContent}
                    </div>
                    <div style="margin-top: 20px; font-size: 14px; color: gray;">
                        This is an automated message, please do not reply directly. For support, visit our help center.
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Custom notification email sent: " + info.response);
    } catch (error) {
        console.error("Error sending custom notification email:", error);
    }
};





const sendAdminTiffinBookingConfirmation = async (adminEmail, username, userEmail, orderId, deliveryDate, deliveryTime, mealPlan, totalAmount, deliveryAddress, contactNumber) => {
    const mailOptions = {
        from: `Zomato Admin <${process.env.MY_EMAIL || "no-reply@zomato.com"}>`,
        to: userEmail||"venkatreddy30301@gmail.com",
        subject: `✅ New Tiffin Order Alert: #${orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #28a745; color: white; padding: 18px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0;">
                        🔔 New Tiffin Order Received!
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">Dear Admin/Restaurant Team,</p>
                    <p style="font-size: 16px;">A new tiffin order has been placed on Zomato. Please review the details below:</p>
                    
                    <div style="text-align: left; margin: 25px 0; padding: 20px; background: #e6f7ff; border-radius: 8px; border-left: 5px solid #28a745;">
                        <h3 style="color: #28a745; margin-top: 0;">Order Details:</h3>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${username}</p>
                        <p style="margin: 8px 0;"><strong>Customer Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
                        <p style="margin: 8px 0;"><strong>Delivery Date:</strong> ${deliveryDate}</p>
                        <p style="margin: 8px 0;"><strong>Delivery Time:</strong> ${deliveryTime}</p>
                        <p style="margin: 8px 0;"><strong>Meal Plan:</strong> ${mealPlan}</p>
                        <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                        <p style="margin: 8px 0;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                        <p style="margin: 8px 0;"><strong>Contact Number:</strong> ${contactNumber}</p>
                    </div>

                    <p style="font-size: 16px; margin-top: 20px;">Please process this order accordingly.</p>
                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                        <p>This is an automated notification. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Admin Tiffin Booking Confirmation Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending admin tiffin booking confirmation email:", error);
    }
};

const sendAdminTiffinBookingCancellation = async (adminEmail, username, userEmail, orderId, deliveryDate, deliveryTime, reason) => {
    const mailOptions = {
        from: `Zomato Admin <${process.env.MY_EMAIL || "no-reply@zomato.com"}>`,
        to: adminEmail,
        subject: `🚫 Tiffin Order Cancelled: #${orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #ffebee; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #dc3545; color: white; padding: 18px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0;">
                        ❌ Tiffin Order Cancellation Alert!
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">Dear Admin/Restaurant Team,</p>
                    <p style="font-size: 16px;">A tiffin order has been cancelled on Zomato. Please note the details below:</p>
                    
                    <div style="text-align: left; margin: 25px 0; padding: 20px; background: #ffe6e6; border-radius: 8px; border-left: 5px solid #dc3545;">
                        <h3 style="color: #dc3545; margin-top: 0;">Cancellation Details:</h3>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${username}</p>
                        <p style="margin: 8px 0;"><strong>Customer Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
                        <p style="margin: 8px 0;"><strong>Original Delivery Date:</strong> ${deliveryDate}</p>
                        <p style="margin: 8px 0;"><strong>Original Delivery Time:</strong> ${deliveryTime}</p>
                        <p style="margin: 8px 0;"><strong>Reason for Cancellation:</strong> ${reason || 'Not specified'}</p>
                    </div>

                    <p style="font-size: 16px; margin-top: 20px;">No further action is required for this cancelled order.</p>
                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                        <p>This is an automated notification. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Admin Tiffin Booking Cancellation Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending admin tiffin booking cancellation email:", error);
    }
};


const sendUserOrderCancellationConfirmation = async (userEmail, username, orderId, orderType, reason, refundDetails = '') => {
    const mailOptions = {
        from: `Zomato <${process.env.MY_EMAIL || "no-reply@zomato.com"}>`, // Your 'from' address
        to: userEmail,
        subject: `🚫 Your Zomato ${orderType} Order #${orderId} Has Been Cancelled`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #fcebeb; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #dc3545; color: white; padding: 18px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0;">
                        ❌ Order Cancellation Confirmation
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">Hi ${username},</p>
                    <p style="font-size: 16px;">We regret to inform you that your Zomato ${orderType} order has been cancelled.</p>
                    
                    <div style="text-align: left; margin: 25px 0; padding: 20px; background: #ffe6e6; border-radius: 8px; border-left: 5px solid #dc3545;">
                        <h3 style="color: #dc3545; margin-top: 0;">Order Details:</h3>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 8px 0;"><strong>Order Type:</strong> Takeaway </p>
                        <p style="margin: 8px 0;"><strong>Cancellation Reason:</strong> ${reason || 'Not specified'}</p>
                        ${refundDetails ? `
                            <p style="margin: 8px 0;"><strong>Refund Information:</strong>Yes</p>
                            <p style="margin: 8px 0; font-size: 14px; color: #555;">Please allow 5-7 business days for the refund to reflect in your account.</p>
                        ` : ''}
                    </div>

                    <p style="font-size: 16px; margin-top: 20px;">We apologize for any inconvenience this may cause.</p>
                    <p style="font-size: 16px;">If you have any questions or concerns, please don't hesitate to contact our support team.</p>
                    
                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                        <p>Thank you for your understanding.</p>
                        <p>Zomato Team</p>
                        <p>This is an automated notification. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        // Assuming 'transporter' is your Nodemailer transporter object
        const info = await transporter.sendMail(mailOptions);
        console.log(`User Order Cancellation Email sent for Order ID ${orderId}: ` + info.response);
        return { success: true, message: "Email sent successfully." };
    } catch (error) {
        console.error(`Error sending user order cancellation email for Order ID ${orderId}:`, error);
        return { success: false, message: "Failed to send email.", error: error.message };
    }
};

const sendOrderConfirmation = async (
    userEmail,
    username,
    orderId,
    restaurantName,
    totalAmount,
    supportContact = 'support@zomato.com'
) => {
    const mailOptions = {
        from: `Zomato <${process.env.MY_EMAIL || "no-reply@zomato.com"}>`,
        to: userEmail,
        subject: `🎉 Your Zomato Takeaway Order #${orderId} is Confirmed!`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #e6f7ff; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #28a745; color: white; padding: 18px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0;">
                        🎉 Your Zomato Takeaway Order is Confirmed!
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">Hi ${username},</p>
                    <p style="font-size: 16px;">Thanks for your order! We've received it and your delicious meal is now being prepared by ${restaurantName}.</p>

                    <div style="text-align: left; margin: 25px 0; padding: 20px; background: #e9f8e9; border-radius: 8px; border-left: 5px solid #28a745;">
                        <h3 style="color: #28a745; margin-top: 0;">Order Details:</h3>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 8px 0;"><strong>Restaurant:</strong> ${restaurantName}</p>
                        <p style="margin: 8px 0;"><strong>Total Amount:</strong> ${totalAmount}</p>
                    </div>

                    <p style="font-size: 16px; margin-top: 20px;">We'll notify you via email and SMS once your order is ready for pickup!</p>
                    
                    <p style="font-size: 16px;">If you have any questions, please contact us at <a href="mailto:${supportContact}" style="color:#007bff;">${supportContact}</a>.</p>

                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                        <p>Thanks for choosing Zomato!</p>
                        <p>This is an automated notification. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        // Assuming 'transporter' is your Nodemailer transporter object
        const info = await transporter.sendMail(mailOptions);
        console.log(`Order Confirmation Email sent for Order ID ${orderId}: ` + info.response);
        return { success: true, message: "Email sent successfully." };
    } catch (error) {
        console.error(`Error sending order confirmation email for Order ID ${orderId}:`, error);
        return { success: false, message: "Failed to send email.", error: error.message };
    }
};
const sendUserTakeawayOrderApproved = async (
    userEmail,
    username,
    orderId,
    restaurantName
) => {
    const mailOptions = {
        from: `Zomato <${process.env.MY_EMAIL || "no-reply@zomato.com"}>`,
        to: userEmail,
        subject: `👍 Your Zomato Takeaway Order #${orderId} is Approved!`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #e0f2f7; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #17a2b8; color: white; padding: 18px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 10px 10px 0 0;">
                        👍 Your Zomato Takeaway Order is Approved!
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">Hi ${username},</p>
                    <p style="font-size: 16px;">Good news! Your takeaway order from ${restaurantName} has been approved and is now being prepared.</p>

                    <div style="text-align: left; margin: 25px 0; padding: 20px; background: #e9f8fb; border-radius: 8px; border-left: 5px solid #17a2b8;">
                        <h3 style="color: #17a2b8; margin-top: 0;">Order Details:</h3>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 8px 0;"><strong>Restaurant:</strong> ${restaurantName}</p>
                    </div>

                    <p style="font-size: 16px; margin-top: 20px;">We'll send you another update (via email and SMS) as soon as your order is ready for pickup.</p>
                    
                    <p style="font-size: 16px; margin-top: 20px;">If you have any questions, please contact us at <a href="mailto:support@zomato.com" style="color:#007bff;">support@zomato.com</a>.</p>

                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                        <p>Thanks for choosing Zomato!</p>
                        <p>This is an automated notification. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        // Assuming 'transporter' is your Nodemailer transporter object
        const info = await transporter.sendMail(mailOptions);
        console.log(`User Takeaway Order Approved Email sent for Order ID ${orderId}: ` + info.response);
        return { success: true, message: "Email sent successfully." };
    } catch (error) {
        console.error(`Error sending user takeaway order approved email for Order ID ${orderId}:`, error);
        return { success: false, message: "Failed to send email.", error: error.message };
    }
};

module.exports = {
    sendConfirmationEmail,
    sendCancelationEmail,
    sendPendingConfirmationEmail,
    sendTiffinBookingConfirmationEmail,
    sendCustomNotificationEmail,
    sendAdminTiffinBookingConfirmation,
    sendAdminTiffinBookingCancellation,
    sendUserOrderCancellationConfirmation,
    sendOrderConfirmation,
    sendUserTakeawayOrderApproved
};
