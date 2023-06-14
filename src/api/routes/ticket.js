const base_controller = require('../controllers/base');
const ticket_service = require('../../services/Ticket');

module.exports = (router) => {
    router.post('/ticket/add', base_controller.wrap_with_store(ticket_service.add));
    router.post('/ticket/fetch/all', base_controller.wrap(ticket_service.fetch_all));
    router.post('/ticket/fetch/user', base_controller.wrap_with_store(ticket_service.get_by_user));
    router.post('/ticket/fetch/technician', base_controller.wrap_with_store(ticket_service.get_by_technician));
    router.post('/ticket/finish-repair', base_controller.wrap_with_store(ticket_service.finishRepair));
};