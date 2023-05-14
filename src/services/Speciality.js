const Speciality = require('../models/Speciality')

module.exports = class SpecialityService {
    static async add (technician_id, specialities) {
        try {
            specialities.forEach(speciality => {
                Speciality.insert({
                    technician_id,
                    speciality
                })
            });
        } catch (e) { throw e; }
    }
}