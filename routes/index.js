var express = require('express');
var router = express.Router();
/* GET home page. */
var Vac = require('./model');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var http = require('http');
var url = require('url');

var csstest = '<style>#testactive{background:#333}</style>';
var csstest1 = '<style>#testactive1{background:#333}</style>';
var csstest2 = '<style>#testactive2{background:#333}</style>';
var css1 = '<style>.my-drop{diplay:none}</style>';
function checkLog(req,res,next){
	if(!req.session.name){
		req.session.error = '请先登录！';
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
  Vac.find({type:'user',name:{$nin:req.session.name}},function (err, data) {
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
			res.redirect('/login');
		}else{
			if(password != data.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = '密码错误';
				res.redirect('/login');
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.name = data.name;
				res.redirect('/');
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
			res.redirect('/reg');
		}else if(data){
			req.session.error = '用户名已存在';
			res.redirect('/reg');
		}else{
			var doc = {name : req.body.name, password: req.body.password, type: 'user'};
			Vac.create(doc, function(error){
		    if(error){
	        console.log(error);
		    }else{
	        console.log('save ok');
	        res.redirect('/');
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
router.get('/:name/article',checkLog);
router.get('/:name/article',function(req, res, next){
  Vac.find({name:req.session.name,type:'article'},function (err, data) {
	res.render('article', {
      vacs: data
    });
	}); 
})
//del
router.get('/del',checkLog);
router.get('/del',function(req, res, next){
	var titles = decodeURIComponent(url.parse(req.url).query);
	Vac.find({name:req.session.name,title:titles,type:'article'},function (err, data) {
		if(err){
			console.log(err);
		}else{
			Vac.remove({name:req.session.name,title:titles,type:'article'},function(err){
				if(err){
					console.log(err);
				}
			});
		}
		res.redirect(req.session.name + '/article')
	});
})
//change
router.get('/change',checkLog);
router.get('/change',function(req, res, next){
	var titles = decodeURIComponent(url.parse(req.url).query);
	console.log(titles);
	Vac.findOne({name:req.session.name,title:titles,type:'article'},function (err, data) {
		res.render('change',{
			vacs: data
		});
		console.log(data);
	});
})
router.post('/change',function(req, res, next){
	name = req.session.name;
	var titles = decodeURIComponent(url.parse(req.url).query);
	console.log(titles);
	Vac.findOne({name:req.session.name,title:titles,type:'article'},function(err,data){
		if(err){
			res.send(500);
			console.log(err);
		}else{
			var date = new Date();
			var mon = date.getMonth() + 1;
			var a = date.getFullYear() + '-' + mon + '-' + date.getDate();
			data.title = req.body.title,data.contant = req.body.contant,data.year = a;
			data.save();
			res.redirect(req.session.name + '/article');
		}
	})
})
//addarticle
router.get('/addarticle',checkLog);
router.get('/addarticle',function(req, res, next){
	res.render('addarticle');
})
router.post('/addarticle',function(req, res, next){
	name = req.session.name;
	Vac.findOne({name:name},function(err,data){
		if(err){
			res.send(500);
			console.log(err);
		}else{
			var date = new Date();
			var mon = date.getMonth() + 1;
			var a = date.getFullYear() + '-' + mon + '-' + date.getDate();
			var doc = {name:name, title:req.body.title, contant:req.body.contant,type:'article',year:a};
			Vac.create(doc, function(error){
		    if(error){
	        console.log(error);
		    }else{
	        console.log('save ok');
	        res.redirect(req.session.name + '/article');
		    }
		  });
		}
	})
})
//album
router.get('/album',checkLog);
router.get('/album',function(req, res, next){
	paths = [];
	dir = '../public/img/'+req.session.name;
	if(!fs.existsSync('../public/img/' + req.session.name)){
  	var s = fs.mkdirSync('../public/img/' + req.session.name);
  }
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
        console.log("wrong");
    } else {
			var reg = /.*public/;
    	pathnames = pathname.replace(reg,"");
    	paths.push(pathnames);
    }
  });
	res.render('album',{
     path:paths
	});
})
router.post('/album',function(req, res, next){
	var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    if(!fs.existsSync('../public/img/' + req.session.name)){
    	var s = fs.mkdirSync('../public/img/' + req.session.name);
    }
    form.uploadDir = '../public/img/' + req.session.name + '/';	 //设置上传目录
    console.log(form.uploadDir);
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  	form.parse(req, function(err, fields, files) {
	    if (err) {
	      res.locals.error = err;
	      res.render('index', { title: TITLE });
	      return;		
	  }  
    var extName = '';  //后缀名
    switch (files.fulAvatar.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;		 
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;		 
    }
    if(extName.length == 0){
        res.locals.error = '只支持png和jpg格式图片';
        res.render('album');
        return;				   
    }
    var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    console.log(newPath);
    fs.renameSync(files.fulAvatar.path, newPath);  //重命名
  });
  res.locals.success = '上传成功';
  res.redirect('/album');
  // res.redirect('/');
})
//space
router.get('/:name',function(req, res, next){
	var username = url.parse(req.url).pathname.replace(/\//,'');
	paths = [];
	dir = '../public/img/'+username;
	if(!fs.existsSync('../public/img/' + username)){
  	var s = fs.mkdirSync('../public/img/' + username);
  }
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
        console.log("wrong");
    } else {
			var reg = /.*public/;
    	pathnames = pathname.replace(reg,"");
    	paths.push(pathnames);
    }
  });
  Vac.find({name:username,type:'article'},function (err, data) {
	res.render('space', {
      vacs: data,
      path: paths
    });
	}); 
})
module.exports = router;
