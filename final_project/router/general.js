const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 5));

});

public_users.get('/books', async function (req, res) {
  try {
      res.json({ books });
  } catch (error) {
      res.status(500).json({ 
          error: 'Failed to fetch books',
          details: error.message 
      });
  }
});

async function fetchBooks(){
  try {
    const response = await axios.get('http://localhost:5000/books');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }
}

//fetchBooks();

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 5) );

 });

async function fetchBookByISBN(isbn){
  try {
    const response = await axios.get('http://localhost:5000/isbn/'+isbn);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }
}
//fetchBookByISBN(5);
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  
  const author = req.params.author;
  // 1. Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // 2. Iterate through the 'books' array & check the author matches the one provided in the req parameters
  const matchingBooks = bookKeys.reduce((acc, key) => {
    if (books[key].author === author) {
      acc[key] = books[key];
    }
    return acc;
  }, {});

  res.send( matchingBooks);

});

async function fetchBooksByAuthor(author){
  try {
    const response = await axios.get('http://localhost:5000/author/'+author);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }
}
//fetchBooksByAuthor("Unknown");

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const title = req.params.title;
  // 1. Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // 2. Iterate through the 'books' array & check the title matches the one provided in the req parameters
  const matchingBooks = bookKeys.reduce((acc, key) => {
    if (books[key].title === title) {
      acc[key] = books[key];
    }
    return acc;
  }, {});

  res.send( matchingBooks);


});

async function fetchBooksByTitle(title){
  try {
    const response = await axios.get('http://localhost:5000/title/'+title);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }
}
fetchBooksByTitle("The Epic Of Gilgamesh");


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  
  

});

module.exports.general = public_users;
