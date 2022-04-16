//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Maecenas suspendisse lacinia eleifend, venenatis platea praesent, pulvinar nostra nisi integer nibh libero blandit. Libero nunc tempus eleifend, habitant suspendisse ante, sit luctus fermentum donec tincidunt pretium. Arcu ultricies suscipit, euismod aliquam, sed etiam interdum ullamcorper tortor velit.";
const aboutContent = "Maecenas suspendisse lacinia eleifend, venenatis platea praesent, pulvinar nostra nisi integer nibh libero blandit. Libero nunc tempus eleifend, habitant suspendisse ante, sit luctus fermentum donec tincidunt pretium.";
const contactContent = "Phone no: 73*1*42502";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/posts", {
  useNewUrlParser: true
});

const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {

    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
});


app.get("/about", function(req, res) {
  res.render("about", {
    about: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contact: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:topic", function(req, res) {
  const reqTitle = (req.params.topic);

  Post.findOne({
    title: reqTitle
  }, function(err, posts) {
    res.render("post", {
      postTitle: posts.title,
      postContent: posts.content
    });
  });
  
});

app.listen(3000, function() {
  console.log("Server running at port 3000");
});
