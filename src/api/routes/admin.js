const base_controller = require('../controllers/base');
const admin_service = require("../../services/Admin");

const { isAdminAuth } = require('../../middleware');

module.exports = (router) => {
    router.get('/a/technicians', isAdminAuth, base_controller.render('admin/technicians', 'Technicians'));
    router.get('/a/students', isAdminAuth, base_controller.render('admin/students', 'Students'));
    router.get('/a/lecturers', isAdminAuth, base_controller.render('admin/lecturers', 'Lecturers'));
    router.get('/a/repairs', isAdminAuth, base_controller.render('admin/repairs', 'Repair tickets'));
    
    router.get('/a/sign-in', base_controller.render('admin/sign-in', 'Sign in'));
    router.get('/a/logout', base_controller.logoutAdmin);

    router.post('/a/sign-in', base_controller.wrap(admin_service.sign_in));
};