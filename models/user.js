var mongodb = require('./db');

function User (user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = function (cb) {
	var user = {
		name : this.name,
		password : this.password,
		email: this.email
	};
	mongodb.open(function (err, db) {
		if (err) {
			return cb(err);
		}

		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return cb(err);
			}

			collection.insert(user, {
				safe:true
			}, function (err, user) {
				mongodb.close();
				if (err) {
					return cb(err);
				}

				cb(null, user[0]);
			});
		});
	});
};

User.get = function (name, cb) {
	mongodb.open(function (err, db) {
		if (err) {
			return cb(err);
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
				console.log(user);
				cb(null, user);
			});
		});
	});
}; 