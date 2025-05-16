// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const jwtConfig = require('../config/jwtConfig');
// const roles = require('../config/roles');

// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, jwtConfig.secret);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

// const authorize = (role) => {
//     console.log(role)
//     return (req, res, next) => {
//         if (req.user && req.user.role === role) {
//             next();
//         } else {
//             res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
//         }
//     };
// };

// module.exports = { protect, authorize };


const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, jwtConfig.secret);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
        }
    };
};


module.exports = { protect, authorize };
