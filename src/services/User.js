const User = require('../models/User')

const v = require("../helpers/Validation")
const { makeMySQLDate } = require("../helpers/Date");
const { hash, isSame } = require('../helpers/Hasher');

const jwt = require('../helpers/Jwt');

const SpecialityService = require('./Speciality');

module.exports = class StudentService {
    static async add (wrap_res, body) {
        try {
            v.validate({
                'Last name': { value: body.lastname, min: 2, max: 30 },
                'Initials': { value: body.initials, min: 1, max: 5 },
                'ID': { value: body.unique_no, min: 9, max: 10 }
            });

            if ((await User.exists({ unique_no: body.unique_no })).found)
                throw `A ${body.user_type} with the ID: ${body.unique_no} already exists`;

            if (body.user_type == 'technician') {
                if (!body.specialities || body.specialities && body.specialities.length == 0) {
                    throw 'Please select a speciality'
                }

                const unselected = body.specialities.some((value) => {
                    return value == 'select'
                })

                if (unselected) throw 'A speciality field is left on "select"';
            }

            const new_user = await User.insert({
                lastname: body.lastname,
                initials: body.initials,
                unique_no: body.unique_no,
                type: body.user_type,
                password: await hash('Password123'),
                added_on: makeMySQLDate()
            });

            if (body.user_type == 'technician') {
                SpecialityService.add(new_user.id, body.specialities)
            }

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async update (wrap_res, body) {
        try {
            v.validate({
                'Last name': { value: body.lastname, min: 2, max: 30 },
                'Initials': { value: body.initials, min: 1, max: 5 },
                'ID': { value: body.unique_no, min: 9, max: 10 }
            });

            if ((await User.exists({ unique_no: body.unique_no, id: { $ne: body.id } })).found)
                throw `A ${body.user_type} with the ID: ${body.unique_no} already exists`;

            User.update({ id: body.id }, {
                lastname: body.lastname,
                initials: body.initials,
                unique_no: body.unique_no
            })

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async sign_in (wrap_res, body) {
        try {
            v.validate({
                'ID': { value: body.unique_no, min: 9, max: 10 },
                'Password': { value: body.password, min: 8, max: 16 }
            });

            const userDetails = await User.get_user_by_unique_no(body.unique_no);

            if (!userDetails)
                throw 'ID or password is incorrect';

            if (!(await isSame(userDetails.password, body.password)))
                throw 'ID or password is incorrect';

            wrap_res.successful = true;

            wrap_res.user_type = userDetails.type;

            delete userDetails.password;

            const tokens = jwt.get_cookie_tokens({ ...userDetails });
            wrap_res.set_cookie('fi_user', tokens);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async fetch_all (wrap_res, _, req) {
        try {
            wrap_res.users = await User.fetch_all(req.params.user_type);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async searchStudents (wrap_res, body) {
        try {
            wrap_res.users = await User.searchStudents(body.query);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async searchTechnicians (wrap_res, body) {
        try {
            wrap_res.users = await User.searchTechnicians(body.query);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async searchLecturers (wrap_res, body) {
        try {
            wrap_res.users = await User.searchLecturers(body.query);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async delete (wrap_res, body) {
        try {
            await User.delete(body.user_id);

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }
}