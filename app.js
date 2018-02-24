var bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    express             = require('express'),
    methodOverride      = require('method-override'),
    expressSanitizer    = require('express-sanitizer'),
    app                 = express();

var port = process.env.PORT || 4000;
// APP CONFIG
// mongoose.connect("mongodb://localhost/BlogApp"); //Creating a new DB 
mongoose.connect("mongodb://sm:sm@ds247678.mlab.com:47678/my-blog-app"); //Creating a new DB


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String, 
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("BlogCollection", blogSchema);

// ROUTES

app.get('/', function(req, res){
    res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function(req, res){

    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        } else {
            res.render("index.ejs", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get('/blogs/new', function(req, res){
    res.render('new.ejs');
});

// CREATE ROUTE
app.post('/blogs', function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);    
    Blog.create(req.body.blog, function(err, returnedBlog){
        if (err){
            res.redirect('/blogs/new');
        } else {
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect('/blogs');
        } else {
            res.render('show.ejs',{blog: foundBlog});
        }
    });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res){

    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect('/blogs');
        } else {
            res.render('edit.ejs', {blog: foundBlog});                
        }
    });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res){

    req.body.blog.body = req.sanitize(req.body.blog.body);    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect('/blogs/' + req.params.id);
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE ROUTE 
app.delete('/blogs/:id', function(req, res){
    Blog.findOneAndRemove(req.params.id, function(err){
        if (err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');            
        }
    });
});

app.listen(port, function(){
    console.log("Server is running at PORT 4000");
});
