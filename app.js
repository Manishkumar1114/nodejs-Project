const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/user'); 

const port = 4000;
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render("index");
});

app.get('/read', async (req, res) => {
  try {
    let users = await User.find();
    console.log("Users:", users); 
    res.render("read", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

app.get('/edit/:userid', async (req, res) => {
  let user = await User.findOne({_id: req.params.userid});
  res.render("edit" , {user});
});

app.post('/update/:userid', async (req, res) => {
  let { name, email, image } = req.body;

  let user = await User.findOneAndUpdate({_id: req.params.userid} , {image , name , email} , {new: true});
  res.redirect("/read");
});

app.get('/delete/:id', async (req, res) => {
  try {
    // Find and delete the user by ID
    await User.findByIdAndDelete(req.params.id);
    
    // Redirect back to the "read" page
    res.redirect("/read");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});


app.post('/create', async (req, res) => {
  try {
    const { name, email, image } = req.body;

    let createdUser = await User.create({
      name,
      email,
      image
    });

    res.redirect('/read');
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
