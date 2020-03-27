// importing all required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session');


mongoose.connect('mongodb+srv://vishal:vishal@cluster0-x9gih.mongodb.net/nodeKnb?retryWrites=true&w=majority', { useUnifiedTopology: true ,useNewUrlParser: true });
let db =mongoose.connection;


//check connection

db.once('open',()=>console.log('Connected To MongoDb'))

//check for db error

db.on('error',(err)=>console.log(err));

//Init app

const app = express();

//bring in models

let User = require('./models/user');

//Load view Engine

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

// use static files
app.use(express.static(path.join(__dirname,'public')));

// body-parser 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// Express Session Middleware

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Express Message

app.use(require('connect-flash')());
app.use((req,res,next)=>{
    res.locals.messages = require('express-messages')(req,res);
    next();
});



//Home Route
app.get('/',(req,res)=>{
    User.find({},(err,users)=>{
        if(err) {
            console.log(err);
        }
        else{
        res.render('index',
        { 
            title: 'Node Excercise',
            users: users
        });   
        } 
    })

   
});

//add Users

app.post('/users/add',(req,res)=>{
    
    let user = new User();
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    

    user.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash('success','User Added');
            res.redirect('/');
        }
    })
    
});


//get single User

app.get('/user/:id',(req,res)=>{
    User.findById(req.params.id,(err,users)=>{
        res.render('editUser',
        { 
            title: 'Node Excersice',
            users: users
        });
    })
});





// update User

app.post('/users/edit/:id',(req,res)=>{
    let user = {};
    user.fname = req.body.fname;
    user.lname = req.body.lname;

    let query = {_id:req.params.id}
    User.updateOne(query,user,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash('success','User Updated');
            res.redirect('/');
        }
    })
        
    });
    
 // Delete User

app.delete('/user/:id',(req,res)=>{
    let query ={_id:req.params.id}
    User.deleteOne(query,(err)=>{
        if(err){
            console.log(err);
        }
        req.flash('danger','User Deleted');
        res.send('Success');
    })
})

//Start Server
app.listen(3000,()=>console.log('server is started on port 3000'));

