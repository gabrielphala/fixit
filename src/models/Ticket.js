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
        return this.find({
            condition: { is_deleted: false }
        })
    }

    get_by_user (user_id) {
        return this.find({
            condition: { user_id: user_id, is_deleted: false }
        })
    }

    get_by_technician (technician_id) {
        return this.find({
            condition: { cur_technician_id: technician_id, is_deleted: false },
            join: {
                ref: 'user',
                id: 'user_id'
            }
        })
    }
})