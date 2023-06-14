const Ticket = require('../models/Ticket')
const Speciality = require('../models/Speciality')
const Repair = require('../models/Repair');
const User = require('../models/User');

const String = require('../helpers/String');

module.exports = class TicketService {
    static async add (wrap_res, { items }, { user_info }) {
        try {
            const unavailable_specialities = [];

            let new_ticket, attended = 0;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item == 'select') throw 'You left a speciality field on \'select\'';

                const info = await Speciality.getLatestBySpeciality(item);

                if (!info) {
                    unavailable_specialities.push(item);
                    
                    continue;
                }

                if (!new_ticket) {
                    new_ticket = await Ticket.insert({
                        user_id: user_info.id,
                        ticket_no: String.uniqueId(8),
                        item_count: items.length,
                        status: 'New'
                    })
                }

                const repair_info = await Repair.insert({
                    item,
                    status: 'Pending',
                    ticket_id: new_ticket.id,
                    technician_id: info.technician_id
                })

                if (!(attended++)) {
                    new_ticket.status = `${item} by ${info.lastname} ${info.initials}`
                    repair_info.status = 'In Progress'

                    new_ticket.cur_technician_id = info.technician_id;

                    repair_info.save()
                }
            }

            if (!new_ticket) throw 'Could not generate ticket; Could be due to lack of technicians';

            new_ticket.save()

            wrap_res.successful = true;
            wrap_res.unavailable_specialities = unavailable_specialities;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async fetch_all (wrap_res) {
        try {
            wrap_res.tickets = await Ticket.fetch_all();

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async get_by_user (wrap_res, _, { user_info }) {
        try {
            wrap_res.tickets = await Ticket.get_by_user(user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async get_by_technician (wrap_res, _, { user_info }) {
        try {
            wrap_res.tickets = await Ticket.get_by_technician(user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async finishRepair (wrap_res, body, { user_info }) {
        try {
            const ticket = await Ticket.getById(body.ticket_id);

            await Repair.complete(body.ticket_id, user_info.id);

            const repair = await Repair.getOneByTicket(body.ticket_id);

            if (repair) {
                repair.status = 'In Progress';

                const technician = await User.getById(repair.technician_id);

                ticket.cur_technician_id = repair.technician_id;
                ticket.status = `${repair.status} by ${technician.lastname}`;

                repair.save();
            }

            else {
                ticket.status = 'Done';
            }

            ticket.save();

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }
}