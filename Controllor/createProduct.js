const productModel = require("../Models/productModel");
const categoryModel = require("../Models/categoryModel");
const orderModel = require("../Models/orderModel");
const fs = require("fs");
const slugify = require("slugify");
const braintree = require("braintree");
const dotenv = require('dotenv')
dotenv.config()
// payment getway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVET_KEY,
});

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category ,oldPrice} = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !slug:
        return res.status(500).send({ error: "slug is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !oldPrice:
        return res.status(500).send({ error: "old price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case photo && photo.size > 400000:
        return res.status(500).send({ error: "photo is required" });

      default:
        break;
    }
    const products = await productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    return res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in product",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    return res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in getting single product",
    });
  }
};

const ProductPhoto = async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await productModel.findById({ _id }).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting photo",
    });
  }
};

const deleteProducts = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error while deletting photo",
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !slug:
        return res.status(500).send({ error: "slug is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case photo && photo.size > 400000:
        return res.status(500).send({ error: "photo is required" });

      default:
        break;
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    return res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating photo",
    });
  }
};

const productFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      return (args.category = checked);
    } else if (radio.length) {
      return (args.price = { $gte: radio[0], $lte: radio[1] });
    }
    const products = await productModel.find(args);
    return res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error,
      message: "Error while filtering  product",
    });
  }
};

// search product

const searchProductControllor = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error,
      message: "Error while searching  product",
    });
  }
};

const realtaedProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(4)
      .populate("category");
    return res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error,
      message: "Error while getting related  product",
    });
  }
};

const productCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const product = await productModel.find({ category }).populate("category");
    return res.status(200).send({
      success: true,
      category,
      product,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error,
      message: "Error while getting cate  product",
    });
  }
};

// payment getway api
//token
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment

const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransactions = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          return res.json({ok:true})
        }else{
          return res.status(500).send(error)
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  ProductPhoto,
  deleteProducts,
  updateProduct,
  productFilter,
  searchProductControllor,
  realtaedProduct,
  productCategory,
  braintreeTokenController,
  braintreePaymentController,
};
