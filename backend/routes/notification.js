const router = require("express").Router();
const Notification = require("../models/Notifications");
const Order = require("../models/Order");
const Product = require("../models/Product");

//CREATE NOTIFICATION for vendors when order is placed
router.post("/new", async (req, res) => {
  try {
    const { products, userId } = req.body;

    const createdNotifications = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);

      if (product) {
        const vendorId = product.vendorId; // Get vendor of the product
        const newNotification = new Notification({
          vendorId,
          orderId: req.body.orderId, // Assuming orderId is passed from the frontend
          message: `New order placed for ${product.title}.`, // Notification message
        });

        const savedNotification = await newNotification.save();
        createdNotifications.push(savedNotification);
      }
    }
    res.status(201).json(createdNotifications);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all notifications for a vendor
router.get("/:vendorId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      vendorId: req.params.vendorId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
