const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose");

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true}); 
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

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


app.listen(process.env.PORT, process.env.IP, () =>{
    console.log('Starting the server...'); 
}); 