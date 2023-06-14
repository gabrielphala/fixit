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

    getById (id) {
        return this.findOne({
            condition: { id }
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

    searchStudents (query) {
        return this.search({
            condition: [
                { lastname: query, type: 'student', is_deleted: false },
                { initials: query, type: 'student', is_deleted: false },
                { unique_no: query, type: 'student', is_deleted: false },
            ]
        })
    }

    searchTechnicians (query) {
        return this.search({
            condition: [
                { lastname: query, type: 'technician', is_deleted: false },
                { initials: query, type: 'technician', is_deleted: false },
                { unique_no: query, type: 'technician', is_deleted: false },
            ]
        })
    }

    searchLecturers (query) {
        return this.search({
            condition: [
                { lastname: query, type: 'lecturer', is_deleted: false },
                { initials: query, type: 'lecturer', is_deleted: false },
                { unique_no: query, type: 'lecturer', is_deleted: false },
            ]
        })
    }

    delete (id) {
        return this.update({id}, {
            is_deleted: true
        })
    }
})