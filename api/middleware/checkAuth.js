const jwt = require('jsonwebtoken');
const config = require('./../config.json');

module.exports = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    try{
        const decoded = jwt.verify(token, config.jwt_token);
        req.userData = decoded;
        next();
    } catch(err) {
        return res.status(200).json({
            status: 'fail',
            message: "Authentication Failed.Please Log In."
        });
    }
};
