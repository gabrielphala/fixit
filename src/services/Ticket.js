const Ticket = require('../models/Ticket')
const Speciality = require('../models/Speciality')
const Repair = require('../models/Repair');
const User = require('../models/User');

const String = require('../helpers/String');

module.exports = class TicketService {
    static async add (wrap_res, { items, descriptions }, { user_info }) {
        try {
            const unavailable_specialities = [];

            let new_ticket, attended = 0;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const description = descriptions[i];

                if (!(/^[a-zA-Z]+$/.test(item))) throw 'Item should be alphabets'
                if (!(/^[a-zA-Z0-9\s ]+$/.test(description))) throw 'Description should be alphabets or numbers'

                if (item == 'select') throw 'You left a speciality field on \'select\'';

                // get all tecshnicians by this speciiality
                // find who has the least tickets

                const technicians = await Speciality.getAllBySpeciality(item);

                if (!technicians) {
                    unavailable_specialities.push(item);
                    
                    continue;
                }

                if (!new_ticket) {
                    new_ticket = await Ticket.insert({
                        user_id: user_info.id,
                        ref_no: String.uniqueId(8),
                        item_count: items.length,
                        status: 'New'
                    })
                }

                let lowestRepairCountTechId;
                let lowestRepairCount;

                for (let i = 0; i < technicians.length; i++) {
                    const technician = technicians[i];

                    let count = await (Repair.countIncompleteRepairs(technician.technician_id));
                    
                    if (lowestRepairCount == null || lowestRepairCount >= count) {
                        lowestRepairCount = count;
                        lowestRepairCountTechId = technician.technician_id;
                    }
                }

                const repair_info = await Repair.insert({
                    item,
                    description,
                    status: 'Pending',
                    ticket_id: new_ticket.id,
                    technician_id: lowestRepairCountTechId
                })

                const currentTech = await User.findOne({ condition: { id: lowestRepairCountTechId } })

                if (!(attended++)) {
                    repair_info.status = 'In Progress'

                    new_ticket.status = `In Progress`;
                    new_ticket.technician = `${currentTech.lastname} ${currentTech.initials}`

                    new_ticket.cur_technician_id = lowestRepairCountTechId;

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

    static async get_closed_by_user (wrap_res, _, { user_info }) {
        try {
            wrap_res.tickets = await Ticket.get_closed_by_user(user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async search_tickets (wrap_res, body, { user_info }) {
        try {
            if (!(/^[a-zA-Z0-9]+$/.test(body.query))) throw 'Search term should be alphabets or numbers'

            wrap_res.tickets = await Ticket.search_tickets(body.query, user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async search_tickets_technician (wrap_res, body, { user_info }) {
        try {
            wrap_res.tickets = await Ticket.search_tickets_technician(body.query, user_info.id);

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async admin_search_all (wrap_res, body, { user_info }) {
        try {
            wrap_res.tickets = await Ticket.admin_search_all(body.query);

            return wrap_res;
        } catch (e) { throw e; }
    }

    // static async search_tickets_admin (wrap_res, body) {
    //     try {
    //         wrap_res.tickets = await Ticket.search_tickets_admin(body.query);

    //         return wrap_res;
    //     } catch (e) { throw e; }
    // }

    static async search_done (wrap_res, body, { user_info }) {
        try {
            if (!(/^[a-zA-Z0-9]+$/.test(body.query))) throw 'Search term should be alphabets or numbers'

            wrap_res.tickets = await Ticket.search_done(body.query, user_info.id);

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
                ticket.status = `In Progress`;
                ticket.technician = `${technician.lastname} ${technician.initials}`

                repair.save();
            }

            else {
                const rep = await Repair.findOne({
                    condition: {
                        id: body.ticket_id
                    }
                });

                rep.status = 'Closed';

                rep.save()

                ticket.status = 'Closed';
            }

            ticket.save();

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async escalateRepair (wrap_res, body) {
        try {
            const { tech_id, ticket_id } = body;

            const ticket = await Ticket.getById(ticket_id);

            const repair = await Repair.findOne({
                condition: {
                    ticket_id,
                    status: 'In Progress'
                }
            });

            const technician = await User.getById(tech_id);

            ticket.cur_technician_id = tech_id;
            ticket.technician = `${technician.lastname} ${technician.initials}`;

            repair.technician_id = tech_id

            repair.save();
            ticket.save();

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async getDescriptionOfNextRepair (wrap_res, body) {
        try {
            const repair = await Repair.findOne({
                condition: {
                    id: body.ticket_id
                }
            });

            wrap_res.description = repair.description;

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }

    static async getTechniciansByRepairKind (wrap_res, body, { user_info }) {
        try {
            const { ticket_id } = body;
            
            const repair = await Repair.findOne({
                condition: {
                    ticket_id,
                    status: 'In Progress'
                }
            });

            wrap_res.users = await Speciality.find({
                condition: {
                    speciality: repair.item
                },
                join: {
                    ref: 'user',
                    id: 'technician_id'
                }
            })

            wrap_res.users.forEach((user, index) => {
                if (user.technician_id == user_info.id)
                    return wrap_res.users.splice(index, 1)
             })

            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }
}