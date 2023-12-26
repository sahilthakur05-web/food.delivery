const cateSchema = require("../Models/categoryModel");
const slugify = require("slugify");
const createCate = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await cateSchema.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category is already created",
      });
    }
    const category = await new cateSchema({ name, slug: slugify(name) }).save();

    return res.status(201).send({
      success: true,
      message: "category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await cateSchema.find({});
    return res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await cateSchema.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Category Update Successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating Category",
    });
  }
};

const getSindleCategory = async (req, res) => {
  try {
    const category = await cateSchema.findOne({ slug: req.params.slug });
    return res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting single  Category",
    });
  }
};

const deleteCategory = async(req,res)=>{
    try {
        const {id}= req.params;
        await cateSchema.findByIdAndDelete(id)
        return res.status(200).send({
            success:true,
            message:'Category Deleted Successfully '
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            error,
            message: "Error while deleting  Category",
          });
    }
}

module.exports = { createCate, getCategory, updateCategory, getSindleCategory ,deleteCategory};
