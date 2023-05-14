const jwt = require('../helpers/Jwt');

module.exports.isStudentOrLecturerAuth = (req, res, next) => {
    if (
        !req.store ||
        req.store && !req.store.user_info ||
        req.store && req.store.user_info && req.store.user_info.type == 'technician'
    )
        return res.redirect('/login');

    next();
}

module.exports.isTechnicianAuth = (req, res, next) => {
    if (
        !req.store ||
        req.store && !req.store.user_info ||
        req.store && req.store.user_info && req.store.user_info.type != 'technician'
    )
        return res.redirect('/login');

    next();
}

module.exports.isAdminAuth = (req, res, next) => {
    if (!req.store || req.store && !req.store.admin_info)
        return res.redirect('/a/sign-in');

    next();
}

module.exports.loadUserInfo = (req, res, next) => {
    if (!req.cookies || req.cookies && !req.cookies['fi_user'])
        return next();

    jwt.verify(req.cookies['fi_user'].jwtAccess, (user_info) => {
        if (!req.store) req.store = {}
        req.store.user_info = user_info;
        res.locals.user_info = user_info;
    });

    next();
}

module.exports.loadAdminInfo = (req, res, next) => {
    if (!req.cookies || req.cookies && !req.cookies['fi_admin'])
        return next();

    jwt.verify(req.cookies['fi_admin'].jwtAccess, (admin_info) => {
        if (!req.store) req.store = {}
        req.store.admin_info = admin_info;
        res.locals.admin_info = admin_info;
    });

    next();
}