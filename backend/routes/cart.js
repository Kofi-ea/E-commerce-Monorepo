const router = require("express").Router();

const bcrypt = require("bcrypt");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
  verifyVendor,
  verifyTokenAndUser,
} = require("./verifyToken");

const Cart = require("../models/Cart");
console.log(verifyTokenAndUser);

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const existingCart = await Cart.findOne({ userId: req.user.id });

    if (existingCart) {
      // Add the new product to existing cart
      existingCart.products.push(req.body.products[0]); // assuming single product at a time
      const updatedCart = await existingCart.save();
      return res.status(200).json(updatedCart);
    }

    // Create new cart
    const newCart = new Cart({
      ...req.body,
      userId: req.user.id,
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Cart update failed", message: error.message });
  }
});

// UPDATE CART
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check ownership
    if (cart.userId !== req.user.id) {
      return res.status(403).json("You are not allowed to update this cart");
    }

    // Optional: Prevent duplicate product add
    const newProduct = req.body.products?.[0];
    if (newProduct) {
      const exists = cart.products.some(
        (p) => p.productId === newProduct.productId
      );
      if (exists) {
        return res.status(400).json({ message: "Product already in cart" });
      }

      cart.products.push(newProduct);
      const updatedCart = await cart.save();
      return res.status(200).json(updatedCart);
    }

    // If no product, fallback to a full update
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
