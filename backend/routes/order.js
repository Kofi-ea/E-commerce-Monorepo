const router = require("express").Router();

const bcrypt = require("bcrypt");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
  verifyVendor,
} = require("./verifyToken");

const Order = require("../models/Order");
const { aggregate } = require("../models/Product");
const Product = require("../models/Product");
const Notification = require("../models/Notifications");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const productsWithVendors = await Promise.all(
      req.body.products.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${product?.title || "a product"}`,
          });
        }
        return {
          productId: item.productId,
          vendorId: product.vendorId, // <-- Add vendor ID here
          quantity: item.quantity,
        };
      })
    );

    const newOrder = new Order({
      userId: req.user.id,
      products: productsWithVendors,
      amount: req.body.amount,
      address: req.body.address,
      phone: req.body.phone,
      status: req.body.status || "pending",
    });
    const savedOrder = await newOrder.save();

    // Notify vendors
    for (let item of productsWithVendors) {
      try {
        const product = await Product.findById(item.productId);
        if (product) {
          const notification = new Notification({
            vendorId: product.vendorId,
            orderId: savedOrder._id,
            message: `New order placed for ${product.title}.`,
          });
          await notification.save();
        }
      } catch (err) {
        console.error("Notification error:", err.message);
      }
    }

    // After saving the order then decrease stock
    for (const item of productsWithVendors) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send notifications to vendors
    const { orderId, products } = savedOrder;
    await Notification.create({
      orderId,
      products,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,

      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).lean();

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedProducts = await Promise.all(
          order.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
              productId: item.productId,
              name: product?.title || "Deleted product",
              quantity: item.quantity,
              price: product?.price || 0,
            };
          })
        );

        return {
          ...order,
          products: detailedProducts,
        };
      })
    );

    res.status(200).json(detailedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },

      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET VENDOR ORDERS for vendor order visibility
router.get("/vendor-orders", verifyToken, verifyVendor, async (req, res) => {
  try {
    const vendorId = req.user.id;

    const orders = await Order.find({
      "products.vendorId": vendorId,
    }).lean();

    // Attach product names and details
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedProducts = await Promise.all(
          order.products
            .filter((p) => p.vendorId === vendorId)
            .map(async (p) => {
              const product = await Product.findById(p.productId);
              return {
                productId: p.productId,
                quantity: p.quantity,
                name: product?.title || "Deleted product",
                price: product?.price || 0,
              };
            })
        );

        return {
          _id: order._id,
          createdAt: order.createdAt,
          phone: order.phone || "No phone provided",
          customerId: order.userId,
          address: order.address,
          products: detailedProducts,
        };
      })
    );

    res.status(200).json(detailedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ORDER STATUS
router.put("/status/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // Only admin or vendor of the product can update
    const isAdmin = req.user.isAdmin;
    const isVendor = order.products.some((p) => p.vendorId === req.user.id);

    if (!isAdmin && !isVendor) {
      return res
        .status(403)
        .json({ message: "Not authorized to update status" });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
