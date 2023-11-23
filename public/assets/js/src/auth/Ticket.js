import fetch from "../helpers/fetch.js"
import popup from "../helpers/popup.js"

import { closeModal, openModal } from "../helpers/modal.js"
import { arrayNotEmpty } from "../helpers/array.js"
import { showError, clearError } from "../helpers/error.js"

import {
    formatTicketsUser,
    formatUnavailableSpecialities,
    formatTicketsTechnician,
    formatTicketsAdmin
} from "../helpers/format.js"

let cachedUserTickets = [];
let cachedTechnicianTickets = [];

const uTicketHeader = [
    '#', 'Ticket no', 'Issue Count', 'Status', 'Request date'
]

const uAllowedColumns = [
    'ref_no', 'item_count', 'status', 'added_on'
]

const tTicketHeader = [
    '#', 'Ticket no', 'Status', 'Requested by', 'Request date'
]

const tAllowedColumns = [
    'ref_no', 'item_count', 'status', 'lastname', 'added_on'
]

export default class Ticket {
    static async add () {
        const items = [];
        const descriptions = [];
        
        try {
            Array.from($('.speciality__item')).forEach(field => {
                if (items.includes(field.value))
                    throw 'Speciality already added';

                items.push(field.value)
            });

            Array.from($('.description__item')).forEach(field => {
                if (field.value.trim() == '')
                    throw 'Please describe issue';

                descriptions.push(field.value)
            });

            const response = await fetch('/ticket/add', {
                body: {
                    items,
                    descriptions
                }
            }) 

            if (response.successful) {
                await Ticket.get_by_user()

                closeModal('ticket')

                return setTimeout(() => {
                    popup({ type: 'success', title: 'Ticket generated', message: `Ticket successfully generated` })

                    if (arrayNotEmpty(response.unavailable_specialities)) 
                        popup({ 
                            type: 'error',
                            title: 'Some items not logged',
                            message: formatUnavailableSpecialities(response.unavailable_specialities)
                        })

                }, 900)
            }

            throw response.error;
        } catch (e) {
            showError('repair', e)
        }
    }

    static async finishRepair (ticket_id) {
        const response = await fetch(`/ticket/finish-repair`, {
            body: {
                ticket_id
            }
        })

        Ticket.get_by_technician();
    }

    static async getDescriptionOfNextRepair (ticket_id) {
        const response = await fetch('/ticket/get/repair-description', {
            body: {
                ticket_id
            }
        })

        $('#repair-description').text(response.description);

        openModal('description')
    }

    static async escalateRepair () {
        const response = await fetch(`/ticket/escalate-repair`, {
            body: {
                tech_id: $('#technicians').val(),
                ticket_id: $('#ticket-id').val()
            }
        })

        location.href  = location.href;
    }

    static async escalateNextRepair (ticket_id) {
        const response = await fetch(`/user/fetch/all/speciality`, {
            body: {ticket_id}
        }) 

        let formated = '<option value="select">Select</option>'        

        response.users.forEach(user => {
            formated += `<option value="${user.technician_id}">${user.lastname} ${user.initials}</option>`
        });

        $('#technicians').html(formated)
        $('#ticket-id').val(ticket_id);

        openModal('escalate')
    }

    static async fetch_all () {
        const response = await fetch(`/ticket/fetch/all`) 

        if (arrayNotEmpty(response.tickets)) {
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async fetch_all_for_admin () {
        const response = await fetch(`/ticket/fetch/all`) 

        if (arrayNotEmpty(response.tickets)) {
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsAdmin(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async get_by_technician () {
        const response = await fetch(`/ticket/fetch/technician`) 

        if (arrayNotEmpty(response.tickets)) {
            cachedTechnicianTickets = response.tickets;

            $('#no-tickets').hide();
            
            $('#ticket-list').html(formatTicketsTechnician(response.tickets));
            
            $('.table__body__row__item--finish').off();
            
            $('.table__body__row__item--finish').on('click', e => {
                const ticketid = e.currentTarget.dataset.ticketid;
                
                Ticket.finishRepair(ticketid);
            })

            $('.table__body__row__item--description').on('click', e => {
                const ticketid = e.currentTarget.dataset.ticketid;
                
                Ticket.getDescriptionOfNextRepair(ticketid);
            })

            $('.table__body__row__item--escalate').on('click', e => {
                const ticketid = e.currentTarget.dataset.ticketid;

                Ticket.escalateNextRepair(ticketid);
            })

            return;
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async get_by_user () {
        const response = await fetch(`/ticket/fetch/user`) 

        if (arrayNotEmpty(response.tickets)) {
            cachedUserTickets = response.tickets;
            
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async get_closed_by_user () {
        const response = await fetch(`/ticket/fetch-closed/user`) 

        if (arrayNotEmpty(response.tickets)) {
            cachedUserTickets = response.tickets;
            
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async search () {
        const response = await fetch(`/ticket/search`, {
            body: {
                query: $('#query').val()
            }
        }) 

        if (arrayNotEmpty(response.tickets)) {
            cachedUserTickets = response.tickets;
            
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async search_by_technician () {
        const response = await fetch(`/ticket/search-by-technician`, {
            body: {
                query: $('#query').val()
            }
        }) 

        if (arrayNotEmpty(response.tickets)) {
            cachedTechnicianTickets = response.tickets;

            $('#no-tickets').hide();

            $('#ticket-list').html(formatTicketsTechnician(response.tickets));

            $('.table__body__row__item--finish').off();

            $('.table__body__row__item--finish').on('click', e => {
                const ticketid = e.currentTarget.dataset.ticketid;

                Ticket.finishRepair(ticketid);
            })

            return;
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async search_done () {
        const response = await fetch(`/ticket/search-closed`, {
            body: {
                query: $('#query').val()
            }
        }) 

        if (arrayNotEmpty(response.tickets)) {
            cachedUserTickets = response.tickets;
            
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async downloadUserCSV () {
        const response = await fetch('/download/csv', {
            body: {
                data: cachedUserTickets,
                tableHeader: uTicketHeader,
                allowedColumns: uAllowedColumns,
                reportName: 'Tickets'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }

    static async downloadTechnicialCSV () {
        const response = await fetch('/download/csv', {
            body: {
                data: cachedTechnicianTickets,
                tableHeader: tTicketHeader,
                allowedColumns: tAllowedColumns,
                reportName: 'Tickets'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }
}