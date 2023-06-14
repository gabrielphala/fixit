const Repair = require('../models/Repair');

module.exports = class RepairService {
    static async getTechnicianHistory (wrap_res, body, { user_info }) {
        try {
            wrap_res.repairs = await Repair.getTechnicianHistory(user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }
}