const { SQLifier, SQLDate } = require('sqlifier');

module.exports = new (class Ticket extends SQLifier {
    constructor () {
        super();

        this.schema('ticket', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            user_id: { type: 'int', ref: 'user' },
            cur_technician_id: { type: 'int', ref: 'user' },
            ticket_no: { type: 'varchar', length: 5 },
            item_count: { type: 'int', length: 2 },
            status: { type: 'varchar', length: 30 },
            added_on: { type: 'datetime', default: SQLDate.now },
            is_deleted: { type: 'boolean', default: false }
        })
    }

    fetch_all () {
        return this.raw(`
            SELECT 
                ticket_no, status, item_count, ticket.added_on,
                cust.lastname as cust_lastname,
                cust.initials as cust_initials,
                technician.lastname as technician_lastname,
                technician.initials as technician_initials
            FROM ticket
            INNER JOIN user cust 
            ON ticket.user_id = cust.id
            INNER JOIN user technician 
            ON ticket.cur_technician_id = technician.id
        `)
    }

    getById (id) {
        return this.findOne({
            condition: { id }
        })
    }

    get_by_user (user_id) {
        return this.find({
            condition: { user_id: user_id, is_deleted: false, status: { $ne: 'Done' } }
        })
    }

    search_tickets (query, user_id) {
        return this.search({
            condition: [
                {  user_id: user_id, item_count: query, is_deleted: false  },
                {  user_id: user_id, ticket_no: query, is_deleted: false  },
                {  user_id: user_id, status: query, is_deleted: false  }
            ]
        })
    }

    search_tickets_technician (query, cur_technician_id) {
        return this.search({
            condition: [
                {  cur_technician_id  },
                {  cur_technician_id},
                {  cur_technician_id}
            ]
        })
    }

    search_done (query, user_id) {
        return this.search({
            condition: [
                {  user_id: user_id, item_count: query, is_deleted: false, status: 'Done' },
                {  user_id: user_id, ticket_no: query, is_deleted: false, status: 'Done' }
            ]
        })
    }

    get_closed_by_user (user_id) {
        return this.find({
            condition: { user_id: user_id, is_deleted: false, status: 'Done' }
        })
    }

    get_by_technician (technician_id) {
        return this.find({
            condition: { cur_technician_id: technician_id, is_deleted: false, status: { $ne: 'Done' } },
            join: {
                ref: 'user',
                id: 'user_id'
            }
        })
    }
})