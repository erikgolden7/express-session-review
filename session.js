module.exports = function(req, res, next) {
	if (!req.session.user) {
		email: "";
	}
	next();
};
