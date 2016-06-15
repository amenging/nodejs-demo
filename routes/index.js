var express = require('express');
var router = express.Router();
/* GET home page. */
var Vac = require('./model');
// Vac.remove({name:"tom"},function(err,doc){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log('delete ok');
// 	}
// });
//console.log(Vac);
// db.Vac.insert({"name":"user3","password":123456});
var csstest = "<style>#testactive{background:#333}</style>";
var csstest1 = "<style>#testactive1{background:#333}</style>";
var csstest2 = "<style>#testactive2{background:#333}</style>";
var css1 = "<style>.my-drop{diplay:none}</style>";
function checkLog(req,res,next){
	if(!req.session.name){
		req.session.error = "请先登录！";
		res.redirect('/login');
	}
	next();
}
function checkNotLog(req,res,next){
	if(!req.session.name){
		res.redirect('back');
	}
	next();
}
router.get('/', function (req, res, next) {
    Vac.find(function (err, data) {
    	res.render('index', {
            vacs: data,
            css: csstest
        });
    });   
});
//login
router.get('/login', function(req, res, next) {
  res.render('login',{
  	css:csstest1
  });
});
router.post('/login',function(req, res, next){
	var name,password;
	name = req.body.name,password = req.body.password;
	Vac.findOne({name:name},function(err,data){
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else if(!data){
			req.session.error = '用户名不存在';
			res.redirect("/login");
		}else{
			if(password != data.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = "密码错误";
				res.redirect("/login");
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.name = data.name;
				res.redirect("/");
			}
		}
	});
})
//register
router.get('/reg', function(req, res, next) {
  res.render('reg',{
  	css:csstest2,
  	name:req.session.name
  });
});
router.post('/reg',function(req, res, next){
	var name, password, repass;
	name =  req.body.name,password = req.body.password,repass = req.body.repass;
	Vac.findOne({name:name},function(err,data){
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else if(password != repass){
			req.session.error = '两次输入的密码不一样';
			res.redirect("/reg");
		}else if(data){
			req.session.error = '用户名已存在';
			res.redirect("/reg");
		}else{
			var doc = {name : req.body.name, password: req.body.password};
			Vac.create(doc, function(error){
		    if(error){
	        console.log(error);
		    }else{
	        console.log('save ok');
	        res.redirect("/");
		    }
		  });
		}
	});
});

//logout
router.get('/logout',function(req, res, next){
	req.session.name = null;
	res.redirect('/');
})

//article
router.get('/article',checkLog);
router.get('/article',function(req, res, next){
  Vac.find({name:req.session.name,type:"article"},function (err, data) {
	res.render('article', {
      vacs: data
    });
	}); 
})

//addarticle
// router.get('/addarticle',checkLog);
router.get('/addarticle',function(req, res, next){
	res.render('addarticle');
})
router.post('/addarticle',function(req, res, next){
	name = req.session.name;
	Vac.findOne({name:name},function(err,data){
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else{
			//res.send(data);
			var date = new Date();
			var a = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
			var doc = {name:name, title:req.body.title, contant:req.body.contant,type:"article",year:a};
			Vac.create(doc, function(error){
		    if(error){
	        console.log(error);
		    }else{
	        console.log('save ok');
	        res.redirect("/article");
		    }
		  });
		}
	})
})

//album
router.get('/album',function(req, res, next){
	res.render('album');
})
router.post('/album',function(req, res, next){
	name = req.session.name;
	Vac.findOne({name:name},function(err,data){
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else{

		}
	})
})
module.exports = router;