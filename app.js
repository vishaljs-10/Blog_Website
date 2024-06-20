const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@blogs.xhxz0ma.mongodb.net/blogDB`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Create a schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Create a model
const Post = mongoose.model('Post', postSchema);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to fetch all posts
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});


// Route to create a new post
app.post('/api/posts', async (req, res) => {
    try {
      const { title, content } = req.body;
      const newPost = new Post({ title, content });
      await newPost.save();
      console.log('Post created successfully!');
      res.status(201).json({ message: 'Post created successfully', postId: newPost._id });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Route to delete a post
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.findByIdAndDelete(postId);
    console.log('Post deleted successfully!');
    res.sendStatus(200); 
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
