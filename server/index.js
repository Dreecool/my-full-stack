const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const secretKey = "ADASDASDASDASDLASLDKASLD";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs")
const PORT = 3001;

mongoose.connect("mongodb+srv://francesdonaire:chatforte123456@chat-forte-db.xnufm5f.mongodb.net/chat-forte?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Register = require("./model/register");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET, DELETE, PUT"],
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/registerUser", async (req, res) => {
  const full_name = req.body.full_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  try {

    const saltRounds = 10; 

   
    const hash = await bcrypt.hash(password, saltRounds);

    const RegisterUser = new Register({
      full_name: full_name,
      email_address: email_address,
      password: hash, 
    });

    await RegisterUser.save();
    console.log("success");

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});



app.post("/loginUser", async (req, res) => {
  const { email_address, password } = req.body;

  try {
    const existingUser = await Register.findOne({ email_address });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (isPasswordValid) {
        const userId = existingUser._id;
        const name = existingUser.full_name;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: "1d" });

        res.status(200).json({tok: token, Name: name, Result: "Login Successful"});

    
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

function verifyToken(req, res, next) {

  const token = req.cookies.token; 

  if (!token) {

    return res.status(401).json({ message: 'Authentication failed' });

  }

  try {

    const decodedToken = jwt.verify(token, secretKey); 
    req.userData = decodedToken; 
    next(); 

  } catch (error) {

    return res.status(401).json({ message: 'Authentication failed' });
    
  }
}

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
 
  res.json({ message: 'Access granted', user: req.userData });
});

app.listen(PORT, () => {
  console.log("PORT IS LISTENING AT 3001");
});

