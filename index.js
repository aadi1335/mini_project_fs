const { log } = require('console');
const express = require('express');
const fs = require('fs')
const path = require('path'); // Import path module to use path.join()
const app = express();

// Middleware for accepting form data (either JSON or URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file locations correctly using path.join
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Route to render the index.ejs file
app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', {files: files});
    })
});

app.post('/create', (req, res) => {
    var fname = req.body.title.split(" ").join("_");
    var data = req.body.details;
    fs.writeFile(`./files/${fname}.txt`, data, (err) => {
        res.redirect('/');
    }); 
});

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8",(err, filedata) => {
        res.render("show", {filedata: filedata, filename: req.params.filename});
    })
})

app.post('/update', (req, res) => {
    var newTaskName = req.body.newTitle.split(" ").join("_") + ".txt";
    var oldTaskName = req.body.oldTitle;
    console.log(newTaskName, oldTaskName);
    fs.rename(`./file/${oldTaskName}`, `./file/${newTaskName}`, (err) => {
        res.redirect('/');
    })
})

app.get('/edit/:filename', (req, res) => {
    res.render('edit', {filename: req.params.filename});
})

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
