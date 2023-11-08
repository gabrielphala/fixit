const Speciality = require('../models/Speciality')

module.exports = class SpecialityService {
    static async add (technician_id, specialities) {
        try {
            specialities.forEach(speciality => {
                if (!(/^[a-zA-Z]+$/.test(speciality))) throw 'speciality should be alphabets'

                Speciality.insert({
                    technician_id,
                    speciality
                })
            });
        } catch (e) { throw e; }
    }
}