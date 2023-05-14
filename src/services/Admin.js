const Admin = require('../models/Admin')

const v = require("../helpers/Validation")
const { isSame } = require('../helpers/Hasher');

const jwt = require('../helpers/Jwt');

module.exports = class AdminService {
    static async sign_in (wrap_res, body) {
        try {
            v.validate({
                'Email address': { value: body.email, min: 9, max: 30 },
                'Password': { value: body.password, min: 8, max: 16 }
            });

            const adminDetails = await Admin.findOne({
                condition: {
                    email: body.email
                }
            })

            if (!adminDetails)
                throw 'Email address or password is incorrect';

            if (!(await isSame(adminDetails.password, body.password)))
                throw 'Email address or password is incorrect';

            wrap_res.successful = true;

            delete adminDetails.password;

            const tokens = jwt.get_cookie_tokens(adminDetails.toObject());

            wrap_res.set_cookie('fi_admin', tokens);

            return wrap_res;
        } catch (e) { throw e; }
    }
}