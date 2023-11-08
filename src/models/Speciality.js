const { SQLifier } = require('sqlifier');

module.exports = new (class Speciality extends SQLifier {
    constructor() {
        super();

        this.schema('speciality', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            technician_id: { type: 'int', ref: 'user' },
            speciality: { type: 'varchar', length: 25 }
        })
    }

    getAllBySpeciality (speciality) {
        return this.find({
            condition: { speciality }
        })
    }

    getLatestBySpeciality (speciality) {
        return this.findLatestOne({
            condition: {
                speciality
            },
            join: {
                ref: 'user',
                condition: { id: { $r: 'speciality.technician_id' } }
            }
        })
    }
})