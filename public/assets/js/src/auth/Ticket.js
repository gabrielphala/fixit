import fetch from "../helpers/fetch.js"
import popup from "../helpers/popup.js"

import { closeModal } from "../helpers/modal.js"
import { arrayNotEmpty } from "../helpers/array.js"
import { showError, clearError } from "../helpers/error.js"

import {
    formatTicketsUser,
    formatUnavailableSpecialities,
    formatTicketsTechnician
} from "../helpers/format.js"

let cachedUserTickets = [];
let cachedTechnicianTickets = [];

const uTicketHeader = [
    '#', 'Ticket no', 'Issue Count', 'Status', 'Request date'
]

const uAllowedColumns = [
    'ticket_no', 'item_count', 'status', 'added_on'
]

const tTicketHeader = [
    '#', 'Ticket no', 'Status', 'Requested by', 'Request date'
]

const tAllowedColumns = [
    'ticket_no', 'item_count', 'status', 'lastname', 'added_on'
]

export default class Ticket {
    static async add () {
        const items = [];
        
        try {
            Array.from($('.speciality__item')).forEach(field => {
                if (items.includes(field.value))
                    throw 'Speciality already added';

                items.push(field.value)
            });

            const response = await fetch('/ticket/add', {
                body: {
                    items
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

    static async fetch_all () {
        const response = await fetch(`/ticket/fetch/all`) 

        if (arrayNotEmpty(response.tickets)) {
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
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