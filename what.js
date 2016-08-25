User.get = function () {
	mongodb.open(function (err, db) {
		if (err) {
			return  function (err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/');
				}

				if (user) {
					req.flash('error', '用户已存在');
					return res.redirect('/sign');
				}
				newUser.save(function (err,user) {
					if (err) {
						req.flash('error', err);
						return req.redirect('/sign');
					}
					req.session.user = user;
					req.flash('success','注册成功！');
					res.redirect('/login');
				});
			}(err)
		}

		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return cb(err);
			}

			collection.findOne({
				name:name
			}, function (err, user) {
				mongodb.close();
				if (err) {
					return cb(err);
				}
				cb(null, user);
			});
		});
	});
}