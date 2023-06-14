const admin_routes = require('./admin');
const download_routes = require('./download');
const user_routes = require('./user');
const ticket_routes = require('./ticket');
const technician_routes = require('./technician');

module.exports = (router) => {
    admin_routes(router);
    download_routes(router);
    user_routes(router);
    ticket_routes(router);
    technician_routes(router);
};