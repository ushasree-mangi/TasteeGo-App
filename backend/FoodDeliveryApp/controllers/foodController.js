// controllers/foodController.js
const FoodItem = require('../models/FoodItem');

// Add mock food items

// controllers/foodController.js
const getAllFoodItems = async (req, res) => {
    try {
      const foodItems = await FoodItem.find();
      res.status(200).json(foodItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // GET Food Item 
  const getFoodItem=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id)
        const foodItem = await FoodItem.findById(id);
        console.log(foodItem)
        res.status(200).json(foodItem);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

  //add to cart the food item 

  const addToCartItem=async(req, res)=>{
    
  }
  
module.exports = { getFoodItem,getAllFoodItems };
  