const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const dbStructure = require('./structure');

//lets use our body parser with app
app.use(bodyParser.urlencoded({extended:true}));

// set view engine
app.set('view engine', 'ejs');

//useful static files
app.use('/js/',express.static(__dirname+'/node_modules/jquery/dist/js'));
app.use('/js/',express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/css/',express.static(__dirname+'/node_modules/bootstrap/dist/css'));
 
var baseUrl = "http://localhost:8080/";
//register the session
app.use(session({
	secret:'testing',
	uninitialize:true,
	resave:true
}));

//check if the session is set
//lets start routing
app.get('/', function(req, res){
	//first of all check if a session is set
	if (req.session.username) {
		res.redirect('admin');
	}else{
		res.render('index');
	}
});

app.post('/register', function(req,res){
	//get the data from the database
	var info =dbStructure(req.body) 
	info.save(function(err){
		if(err) throw err;
		res.redirect(baseUrl);
		console.log('records inserted successfully');
	});
	});
app.post('/', function(req, res){
	//get the data from the database for comparism
	
	dbStructure.findOne({new_user:req.body.username, new_pass:req.body.password}, function(err, result){
	//compare the username in the database with the one in the view
	if(req.body.username=='' && req.body.password==''){
		res.send('<h1>gut input something!!!</h1> <a href="/">click here</a>');
	}
	else if(result){
		
		req.session.username = result.new_user;
		req.session.password = result.new_pass;
		res.render('admin.ejs', {
			data : req.session.username
		});
	}else {
	console.log(result)
		res.send('<h1> please log in with the normal parameters</h1> <a href="/">click here</a>');
	}
	});
});

app.get('/admin',function(req, res){
	if (req.session && req.session.username) {

	res.render('admin.ejs',{data:req.session.username});
	}else{
		res.redirect(baseUrl);
	}
	
});


//loogout and destroy session bro
app.get('/logout',function(req,res){
	
	// if the user logs out, destroy all of their individual session
	// information
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});

});

//set port your application will be running on bro
app.listen(8080,function(err){
if(err) throw err;
console.log('your are listening to port 8080')
});