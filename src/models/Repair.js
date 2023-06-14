const { SQLifier } = require('sqlifier');

module.exports = new (class Repair extends SQLifier {
    constructor () {
        super();

        this.schema('repair', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            item: { type: 'varchar', length: 25 },
            status: { type: 'varchar', length: 25 },
            ticket_id: { type: 'int', ref: 'ticket' },
            technician_id: { type: 'int' }
        })
    }

    getOneByTicket (ticket_id) {
        return this.findOne({
            condition: { ticket_id, status: 'Pending' }
        })
    }

    complete (ticket_id, technician_id) {
        return this.update(
            { ticket_id, technician_id },
            { status: 'Completed' }
        )
    }
})