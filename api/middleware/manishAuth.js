const jwt = require("jsonwebtoken");
const config = require("./../config.json");

module.exports = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwt_token);
        req.userData = decoded;
        console.log(req.userData);
        if (req.userData.email === 'mranjan1398@gmail.com' && req.userData.password === '$2b$10$LErPLdr4oJkJvaFiZA8e8OKwi94Wa/KN.BKKGvlVkNWqCb9LfEqKW'){
            next();
        } else {
            return res.status(200).json({
                status: 'fail',
                message: "Authentication Failed.Please Log In."
            });
        }
    } catch (err) {
        return res.status(200).json({
            status: 'fail',
            message: "Authentication Failed.Please Log In."
        });
    }
};