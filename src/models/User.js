const { SQLifier } = require('sqlifier');

module.exports = new (class User extends SQLifier {
    constructor () {
        super();

        this.schema('user', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            lastname: { type: 'varchar', length: 15 },
            initials: { type: 'varchar', length: 5 },
            unique_no: { type: 'int', length: 10 },
            type: { type: 'varchar', length: 12 },
            password: { type: 'varchar', length: 250 },
            added_on: { type: 'datetime' },
            is_deleted: { type: 'boolean', default: false }
        })
    }

    get_user_by_unique_no (unique_no) {
        return this.findOne({
            condition: { unique_no, is_deleted: false }
        })
    }

    fetch_all (type) {
        return this.find({
            condition: { type, is_deleted: false }
        })
    }

    delete (id) {
        return this.update({id}, {
            is_deleted: true
        })
    }
})