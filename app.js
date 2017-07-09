var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expresSanitizer = require("express-sanitizer");

//APP CONFIG
mongoose.connect("mongodb://ductruong:123456@ds151662.mlab.com:51662/blog-demo");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expresSanitizer());
app.use(methodOverride("_method"));
//Mongoose Config
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       }else{
           res.render("index", {blogs: blogs});
       }
    });
})
//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs", function(req, res){
   //create blog
   req.body.blog.body = req.sanitze();
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
   });
   
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog:foundBlog});
        }
   });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
        res.render("edit",{blog: foundBlog}) ;          
      }
   });
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitze();
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
    //Redirect
});
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Blog Server is connecter!!"); 
});