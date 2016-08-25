var mongodb = require('./db');

function Post (post) {
	this.name = post.name;
	this.post = post.post;
};

module.exports = Post;

Post.prototype.save = function (cb) {
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear() + '-' + (date.getMonth() + 1),
		day:date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		minute:date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' +(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};

	var post = {
		name:this.name,
		post:this.post,
		time:time
	};

	mongodb.open(function (err, db) {
		if (err) {
			return cb(err);
		}
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return cb(err);
			}
			collection.insert(post, {
				safe:true
			}, function (err, post) {
				mongodb.close();
				if (err) {
					return cb(err);
				}
				cb(null);
			});
		});
	});
};

Post.get = function (name, cb) {
	mongodb.open(function (err, db) {
		if (err) {
			return cb(err);
		}
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return cb(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			collection.find(query).sort({
				time:-1
			}).toArray(function (err, docs) {
				mongodb.close();
				if (err) {
					return cb(err);
				}
				cb(null, docs);
			});
		});
	});
}