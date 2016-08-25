var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
module.exports = function (app) {
	app.get('/',Nologin);
	app.get('/', function (req, res) {
		Post.get(null, function (err, posts) {
			if (err) {
				posts = [];
			}
			if (posts.length < 1) {
				req.flash('error','暂时没有人留言哦~要不要来个沙发');
			}
			res.render('index',{
				title:'首页',
				menu:req.session.user ? '个人中心' : '登陆',
				back:'<',
				posts:posts,
				login:req.session.user ? '/logout' : '/login',
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			})
		});
	});

	app.post('/', function (req, res) {
		var name = req.session.user.name;
		var docs = req.body.docs;

		var post = new Post ({
			name:name,
			post:docs
		});
		console.log(post);
		post.save(function (err) {
			if (err) {
				req.flash('error', err);
				res.digest('/');
			}
			req.flash('success','发表成功');
			res.redirect('/');
		});
	});


	app.get('/login',Yeslogin);
	app.get('/login', function (req, res) {
		res.render('login',{
			title:'登陆',
			menu:'注册',
			back:'/',
			login:'/sign',
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		})
	});

	app.post('/login', function (req, res) {
		var name = req.body.name;
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');
		User.get(name, function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/login');
			}
			if (!user) {
				req.flash('error', '用户不存在,请确认用户名');
				return res.redirect('/login');
			}
			if (password != user.password) {
				req.flash('error', '密码错误，请确认密码！');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登陆成功');
			res.redirect('/');
		});
	});

	app.get('/sign',Yeslogin);
	app.get('/sign', function (req, res) {
		res.render('sign',{
			title:'注册',
			menu:'',
			back:'/login',
			login:'',
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});


	
	app.post('/sign', function (req, res) {
		var name = req.body.name,
		password = req.body.password,
		password_t = req.body.password_t;
		if (password != password_t) {
			req.flash('error', '两次输入的密码不一致');
			return res.redirect('/sign');
		}
		var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			name:req.body.name,
			password:password,
			email:req.body.email
		});
		User.get(newUser.name, function (err, user) {
			if (err) {
				console.log(err);
				req.flash('error', err);
				return res.redirect('/');
			}

			if (user) {
				req.flash('error','用户已存在');
				return res.redirect('/sign');
			}
			console.log('a');
			newUser.save(function (err,user) {
				if (err) {
					console.log(err);
					req.flash('error', err);
					return req.redirect('/sign');
				}
				req.session.user = user;
				req.flash('success','注册成功！');
				res.redirect('/login');
			});
		});
	});

	app.get('/logout',Nologin);
	app.get('/logout', function (req, res) {
		res.render('logout',{
			title:'个人中心',
			menu:'退出',
			back:'/',
			login:'/logoutY',
			name:req.session.user.name,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		})
	});

	app.get('/logoutY', function (req, res) {
		req.session.user = null;
		req.flash('success','您已成功退出');
		res.redirect('/');
	});

	function Nologin (req, res, next) {
		if (!req.session.user) {
			req.flash('error','你尚未登陆，请登陆');
			res.redirect('/login');
		}
		next();
	};

	function Yeslogin (req, res, next) {
		if (req.session.user) {
			req.flash('error','已登录！');
			res.redirect('/');
		}
		next();
	};
};