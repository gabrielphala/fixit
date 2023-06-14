const base_controller = require('../controllers/base');

const { isTechnicianAuth } = require('../../middleware');

module.exports = (router) => {
    router.get('/t/repairs', isTechnicianAuth, base_controller.render('technician/repairs', 'Received repair requests'));
    router.get('/t/history', isTechnicianAuth, base_controller.render('technician/history', 'Repair history'));
};