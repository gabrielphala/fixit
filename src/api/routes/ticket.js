const base_controller = require('../controllers/base');
const ticket_service = require('../../services/Ticket');

module.exports = (router) => {
    router.post('/ticket/add', base_controller.wrap_with_store(ticket_service.add));
    router.post('/ticket/fetch/all', base_controller.wrap(ticket_service.fetch_all));
    router.post('/ticket/fetch/user', base_controller.wrap_with_store(ticket_service.get_by_user));
    router.post('/ticket/fetch-closed/user', base_controller.wrap_with_store(ticket_service.get_closed_by_user));
    router.post('/ticket/fetch/technician', base_controller.wrap_with_store(ticket_service.get_by_technician));
    router.post('/ticket/finish-repair', base_controller.wrap_with_store(ticket_service.finishRepair));
    router.post('/ticket/escalate-repair', base_controller.wrap(ticket_service.escalateRepair));
    router.post('/ticket/get/repair-description', base_controller.wrap(ticket_service.getDescriptionOfNextRepair));
    
    router.post('/ticket/search-closed', base_controller.wrap_with_store(ticket_service.search_done));
    router.post('/ticket/search', base_controller.wrap_with_store(ticket_service.search_tickets));
    router.post('/ticket/search-by-technician', base_controller.wrap_with_store(ticket_service.search_tickets_technician));
    router.post('/ticket/search-by-admin', base_controller.wrap_with_store(ticket_service.admin_search_all));
};