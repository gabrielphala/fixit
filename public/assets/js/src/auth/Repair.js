import fetch from "../helpers/fetch.js"

import { arrayNotEmpty } from "../helpers/array.js";
import { formatRepairHistory } from "../helpers/format.js";

let cachedRepairs = [];

const tableHeader = [
    '#', 'Item', 'Ticket no', 'Status', 'Request date'
]

const allowedColumns = [
    'item', 'ticket_no', 'status', 'added_on'
]

export default class Repair {
    static async getTechnicianHistory () {
        const response = await fetch(`/repair/get-technician-history`) 

        if (arrayNotEmpty(response.repairs)) {
            cachedRepairs = response.repairs;

            $('#no-repairs').hide();
            return $('#repair-list').html(formatRepairHistory(response.repairs));
        }
            
        $('#no-repairs').show();
        return $('#repair-list').html('');
    }

    static async downloadCSV () {
        const response = await fetch('/download/csv', {
            body: {
                data: cachedRepairs,
                tableHeader,
                allowedColumns,
                reportName: 'History'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }
}