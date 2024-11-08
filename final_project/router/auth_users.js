const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid

  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});

    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 5 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;

  if (!isbn || !review || !username) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the user has already posted a review for this book
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
  } else {
    // Add a new review
    books[isbn].reviews[username] = review;
  }

  res.send('Review saved successfully' );




});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  if (!isbn || !username) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (books[isbn]) {
      // Get the reviews object for the book
      const reviews = books[isbn].reviews;

      // Filter out the reviews with the given username
      books[isbn].reviews = Object.values(reviews).filter(review => review.username !== username);
      res.send(`Review for book ${isbn} with username ${username} deleted...`);

      
  } else {
      res.send("Book not found. Unable to delete review");
  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
