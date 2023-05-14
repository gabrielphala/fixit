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
                await Ticket.fetch_all()

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
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsTechnician(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }

    static async get_by_user () {
        const response = await fetch(`/ticket/fetch/user`) 

        if (arrayNotEmpty(response.tickets)) {
            $('#no-tickets').hide();
            return $('#ticket-list').html(formatTicketsUser(response.tickets));
        }
            
        $('#no-tickets').show();
        return $('#ticket-list').html('');
    }
}