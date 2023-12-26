const EuserModels = require("../Models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const orderModel = require("../Models/orderModel");
const sendMail = require("../helper/SendMail");
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    // validations
    if (!username) {
      return res.send({ message: "Username is required" });
    } else if (!email) {
      return res.send({ message: "Email is required" });
    } else if (!password) {
      return res.send({ message: "Password is required" });
    }
    // check
    const allRecord = await EuserModels.find({});
    // user Exisit
    const isExist = allRecord.filter((item) => item.email === email);
    console.log(isExist);
    if (isExist.length > 0)
      return res.status(409).send({ message: "email already exist" });
    // hash password
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);
    // register user
    const newUser = new EuserModels({
      ...req.body,
      password: securedPassword,
    });
    const users = await newUser.save();
    return res
      .status(201)
      .send({ success: true, users, message: "User register successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in Registeration", error });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await EuserModels.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    //match password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (passwordMatch) {
      await sendMail(
       `${user.email}`,
        "Node Mailer",
        `${user.username}  logged in successfully`
      );
    }
    if (!passwordMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// test
const testController = (req, res) => {
  try {
    console.log("protected route");
    return res.send("protected route");
  } catch (error) {
    console.log(error);
    return res.send({ error });
  }
};

// const updateProfile = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = await userModel.findById(req.user._id);

//     //password
//     if (!password && password.length < 6) {
//       return res.json({ error: "Password is require and 6 character long" });
//     }
//     const hashedPassword = password ? await passwordMatch(password)
//     const updatedUser = await userModel.findByIdAndUpdate(
//       req.user._id,
//       {
//         username: username || user.username,
//         password: password || user.password,

//       },
//       { new: true }
//     );
//   } catch (error) {
//     return res.status(400).send({
//       success: false,
//       message: "Error While Update Profile",
//     });
//   }
// };

const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "username");
    res.json(orders);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error While getting orders",
    });
  }
};
const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "username");
    // .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While getting all orders",
    });
  }
};

const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While updating orders",
    });
  }
};
module.exports = {
  register,
  login,
  testController,
  getOrderController,
  getAllOrderController,
  orderStatus,
};
