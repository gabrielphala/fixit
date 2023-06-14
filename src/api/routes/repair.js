const base_controller = require('../controllers/base');
const repair_service = require('../../services/Repair');

module.exports = (router) => {
    router.post('/repair/get-technician-history', base_controller.wrap_with_store(repair_service.getTechnicianHistory));
};