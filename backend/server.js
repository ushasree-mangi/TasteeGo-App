// server.js
const express = require('express');
const connectDB = require('./config/db');
const { getAllFoodItems , getFoodItem} = require('./controllers/foodController'); 
const user =require("./models/User")
const cart=require("./models/Cart")
const jsonWebToken=require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes

//Register API

app.post("/register",async(req,res)=>{ 
  try{ 
  const {username , password} =req.body
  const userDetails=await user.find({username})
  
  if(userDetails[0]==undefined){  
   
    await user.create({username , password})
    res.status(200).json({message:"user is created successfully"});
  }else {
    res.status(401).json({ message: "user is already registered" });
  }
  }catch(error){
    res.status(500).json({ message: error.message });
  }

})

//Login API

app.post("/login" ,async(req,res)=>{ 
  try{ 
    const {username , password} =req.body
    

    const userDetails=await user.find({username})
    
    
    if(userDetails[0]!==undefined){ 
      if(password==userDetails[0].password){ 
          const token= jsonWebToken.sign({ userId: userDetails[0]._id, username: userDetails[0].username } ,secretKey)
          res.status(200).json({message:"user is logged in successfully " ,token});
      }
      else{
        res.status(401).json({ message: "invalid password" }); 
      }
    }
    else{
      res.status(401).json({ message: "invalid username" }); 
    }
  }catch(error){
    res.status(500).json({ message: error.message });
  }

})

//Middleware function -token verification
const authenticateToken = (req, res, next) => {
  // Access the Authorization header
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  // Extract the token (after 'Bearer ')
  const token = authHeader.split(' ')[1];

  // Verify the token (if using jsonwebtoken)
  jsonWebToken.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token!' });
    }

    req.user = user // Attach user data to the request
    
    next(); // Move to the next middleware/route handler
  });
}; 


//GET Food Items API
app.get('/foodItems', authenticateToken, getAllFoodItems); 

// GET A Food Item API

app.get("/foodItems/:id",authenticateToken, getFoodItem)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add item into cart 

app.post('/addToCart', authenticateToken,async(req,res)=>{
  try{ 
        const {foodItemId , quantity}=req.body 
        const {userId}=req.user    
        console.log(`user id is ${userId}`) 
        const userCartDetails=await cart.findOne({userId})
        console.log(userCartDetails)

        if(userCartDetails==null){ 
            await cart.create( { userId, items:[ {foodItemId , quantity} ] }) 
            
        }
        else{
            console.log(userCartDetails)
            // check that item is already in the cart or not 
            const isItemAlreadyInCart =userCartDetails.items.some((eachItem)=>
              eachItem.foodItemId==foodItemId
            )
           //if item already in the cart
              if( isItemAlreadyInCart){
                return res.status(401).json({message:"Item is Already in the Cart"})

              }
              else{ 
                    userCartDetails.items.push({foodItemId , quantity})
                    const updatedCartItemsArray =userCartDetails.items
                    await cart.updateOne({ _id : userCartDetails._id } , {$set : {items :updatedCartItemsArray}}  )
                }
                
            res.status(200).json({message:"Item is added to the cart successfully" });

          }
      

  }catch(error){
    res.status(500).json({ message: error.message });
  }


})

// Get Cart Items 
app.get('/cartItems',  authenticateToken,async(req,res)=>{ 
    
  try{
      const {userId} =req.user
      const {items} = await cart.findOne({userId})
      res.status(200).json({cartItems:items})

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }

})


// Remove Item form Cart

app.delete('/removeCartItem',  authenticateToken,async(req,res)=>{

  try{
    const {foodItemId}=req.body
   
    const {userId}=req.user    
   
    const userCartDetails=await cart.findOne({userId})
    
    const updatedCartItemsArray=userCartDetails.items.filter((eachItem)=>{
      
      return eachItem.foodItemId!=foodItemId   })
   

    await cart.updateOne({userId} , { $set :{items :updatedCartItemsArray} })
    res.status(200).json({message:"Item Was Deleted Successfully"})
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }

})

// until this the code is perfect  

//
app.post('',async(req,res)=>{

  try{

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }

})
