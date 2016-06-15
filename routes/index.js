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
router.get('/', function (req, res, next) {
    Vac.find(function (err, data) {
    	res.render('index', {
            vacs: data
        });
    });   
});

router.get('/login', function(req, res, next) {
  res.render('login');
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

router.get('/reg', function(req, res, next) {
  res.render('reg');
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
		    	// var n = Vac.find({name:name});
		    	// console.log(n);
	        console.log('save ok');
	        res.redirect("/");
		    }
		  });
		}
	});
	// if(password != repass) {
	// 	res.render("reg",{ title: '注册' });
	// }else{
	// 	var doc = {name : req.body.name, password: req.body.password};
	// 	Vac.create(doc, function(error){
	//     if(error){
 //        console.log(error);
	//     }else{
	//     	// var n = Vac.find({name:name});
	//     	// console.log(n);
 //        console.log('save ok');
	//     }
	//   });
	// }
});

router.get('/article',function(req, res, next){
	res.render('article');
})

router.get('/logout',function(req, res, next){
	
})
module.exports = router;