const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        res.status(401).json({ err: "No token in header" });
        return
    }

    const authHeaderArray = authHeader.split(" ");
    const token = authHeaderArray[1];

    console.log(token)

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        res.locals.userId = decoded._id;
        res.locals.userRole = decoded.role;
        next();
    } catch (err) {
        res.status(401).json({ err });
    }
};

function checkAdminRole(req, res, next) {
    console.log(res.locals.userRole)
    if (res.locals.userRole === "admin") {
        next();
    } else {
        res.status(403).json({ err: "Access forbidden"})
    }
}

module.exports = {
    checkToken,
    checkAdminRole,
}