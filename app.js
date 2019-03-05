const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true}); 
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); 

// MONGOOSE & MODEL CONFIG 
const blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: 'https://picsum.photos/300'},
    content: String, 
    created: {type: Date, default: Date.now}
}); 

const Blog = mongoose.model('Blog', blogSchema); 

// Blog.create({
//     title: 'Hello World',
//     content: 'This is my first post!'
// }, (err, item) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log('Saved new post'); 
//         console.log(item); 
//     }
// }); 

// RESTful routes


app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX 
app.get('/blogs', (req, res) => {
    // Retrieve all blog posts
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    }); 
    
}); 

// NEW route
app.get('/blogs/new', (req, res) => {
    // show the new blog post form
    res.render('new'); 
});

// SHOW more info about a particular blog post
app.get('/blogs/:id', (req, res) => {
    // use the findById() mongoose method
    Blog.findById(req.params.id, (err, foundPost) => {
        if(err) {
            res.redirect('/blogs'); 
        } else {
            res.render('show', {blog: foundPost})
        }
    }); 
  
}); 


// CREATE route
app.post('/blogs', (req, res) => {
    // Create post
    // console.log(req.body.blog); // saved as an object
    Blog.create(req.body.blog, (err, newPost) => {
        if(err){
            console.log(err);
            res.render('new');
        } else {
            console.log('Saved new post'); 
            // console.log(newPost); 
            // redirect to INDEX
            res.redirect('/blogs');
        }
    }); 
     
}); 


// EDIT route
// find and show the edit form
app.get('/blogs/:id/edit', (req, res) => {
    // Lookup the current info for that post
    Blog.findById(req.params.id, (err, foundPost) => {
        if(err) {
            res.redirect('/blogs'); 
        } else {
            // pass in the data found
            res.render('edit', { blog: foundPost }); 
        }
    }); 
}); 


// UPDATE route
// update the post
app.put('/blogs/:id', (req, res) => {
    // 1. find the existing blog
    // 2. update with the new data
    // ALL IN ONE - use this method: .findByIdAndUpdate(id, newData, callback) 
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost) => {
        if(err) {
            res.redirect('/blogs'); 
        } else {
            // go back to the show page
            res.redirect('/blogs/' + req.params.id); 
        }
    }); 
    
}); 


// DESTROY / DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    // 1: destroy the post
    // 2: redirect somewhere
    // use the method .findByIdAndRemove(id, callback)
    // res.send('You have reached the DESTROY route'); 
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log('ERROR: ', err); 
            res.redirect('/blogs'); 
        } else {
            res.redirect('/blogs');
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () =>{
    console.log('Starting the server...'); 
}); 