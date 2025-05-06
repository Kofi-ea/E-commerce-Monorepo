const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
  verifyVendor,
} = require("./verifyToken");

const router = require("express").Router();
const User = require("../models/User");
const upload = require("../models/multerConfig");

//CREATE
router.post(
  "/",
  verifyToken,
  verifyVendor,
  //upload.single("productImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== "vendor") {
        return res.status(403).json({ error: "Only vendors can add products" });
      }

      //const imageUrl = req.file
      // ? `${req.protocol}://${req.get("host")}/${req.file.path}`
      // : null;

      const { title, description, price, stock, productImageUrl } = req.body;

      const newProduct = new Product({
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        productImage: productImageUrl, // now a URL from Firebase
        vendorId: user._id,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to add product", message: error.message });
    }
  }
);

//UPDATE
router.put("/:id", verifyToken, verifyVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the vendor owns the product
    if (product.vendorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    // Update fields (including optional new image URL)
    const updatedData = {
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      stock: req.body.stock,
    };

    if (req.body.productImage) {
      updatedData.productImage = req.body.productImage; // image URL from Firebase
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,

      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", verifyToken, verifyVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure vendor owns the product
    if (product.vendorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// RESTOCK PRODUCT (Vendor Only)
router.put("/:id/stock", verifyToken, verifyVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product belongs to the vendor making the request
    if (product.vendorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product's stock" });
    }

    // Update stock
    const newStock = parseInt(req.body.stock);
    if (isNaN(newStock) || newStock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }

    product.stock = newStock;
    const updatedProduct = await product.save();

    res.status(200).json({ message: "Stock updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
