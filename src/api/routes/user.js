const base_controller = require('../controllers/base');
const user_service = require('../../services/User');
const ticket_service = require('../../services/Ticket');

const { isStudentOrLecturerAuth } = require('../../middleware');

module.exports = (router) => {
    router.get('/login', base_controller.render('login', 'Log in'));
    router.get('/repairs', isStudentOrLecturerAuth, base_controller.render('user/repairs', 'Repair requests'));
    router.get('/history', isStudentOrLecturerAuth, base_controller.render('user/history', 'Repair history'));
    router.get('/logout', base_controller.logout);

    router.post('/user/add', base_controller.wrap(user_service.add));
    router.post('/user/delete', base_controller.wrap(user_service.delete));
    router.post('/user/update', base_controller.wrap(user_service.update));
    router.post('/user/sign-in', base_controller.wrap(user_service.sign_in));
    router.post('/user/fetch/all/speciality', base_controller.wrap_with_request(ticket_service.getTechniciansByRepairKind));
    router.post('/user/fetch/all/:user_type', base_controller.wrap_with_request(user_service.fetch_all));
    router.post('/user/search-students', base_controller.wrap(user_service.searchStudents));
    router.post('/user/search-technicians', base_controller.wrap(user_service.searchTechnicians));
    router.post('/user/search-lecturers', base_controller.wrap(user_service.searchLecturers));
};