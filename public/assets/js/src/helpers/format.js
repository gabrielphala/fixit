import { getStaticDate } from "./datetime.js"

export const formatUsersAdmin = (users) => {
    let formated = '', count = 1;

    users.forEach(user => {
        formated += `
            <ul class="table__body__row table__body__row--user" data-userid="${user.id}">
                <li class="table__body__row__item">${count}</li>
                <li class="table__body__row__item">${user.lastname}</li>
                <li class="table__body__row__item">${user.initials}</li>
                <li class="table__body__row__item">${user.unique_no}</li>
                <li class="table__body__row__item" style="text-align: right; margin-right: 1rem;">${getStaticDate(user.added_on)}</li>
                <li class="table__body__row__item table__body__row__item--outside pos--abs">
                    <svg class="image--icon table__body__row__item__edit">
                        <use href="#pencil"></use>
                    </svg>
                    <svg class="image--icon table__body__row__item__delete">
                        <use href="#trash"></use>
                    </svg>
                </li>
            </ul>
        `;

        count++
    });

    return formated;
}

export const formatTicketsUser = (tickets) => {
    let formated = '', count = 1;

    tickets.forEach(ticket => {
        formated += `
            <ul class="table__body__row table__body__row--ticket" data-ticketid="${ticket.id}">
                <li class="table__body__row__item">${count}</li>
                <li class="table__body__row__item">${ticket.ref_no}</li>
                <li class="table__body__row__item">${ticket.technician}</li>
                <li class="table__body__row__item">${ticket.item_count}</li>
                <li class="table__body__row__item">${ticket.status}</li>
                <li class="table__body__row__item">${getStaticDate(ticket.added_on)}</li>
            </ul>
        `;

        count++
    });

    return formated;
}

export const formatTicketsAdmin = (tickets) => {
    let formated = '', count = 1;

    tickets.forEach(ticket => {
        formated += `
            <ul class="table__body__row table__body__row--ticket" data-ticketid="${ticket.id}">
                <li class="table__body__row__item">${count}</li>
                <li class="table__body__row__item">${ticket.cust_lastname} ${ticket.cust_initials}</li>
                <li class="table__body__row__item">${ticket.technician_lastname} ${ticket.technician_initials}</li>
                <li class="table__body__row__item">${ticket.ref_no}</li>
                <li class="table__body__row__item">${ticket.item_count}</li>
                <li class="table__body__row__item">${ticket.status}</li>
                <li class="table__body__row__item">${getStaticDate(ticket.added_on)}</li>
            </ul>
        `;

        count++
    });

    return formated;
}

export const formatTicketsTechnician = (tickets) => {
    let formated = '', count = 1;

    tickets.forEach(ticket => {
        formated += `
            <ul class="table__body__row table__body__row--ticket" data-ticketid="${ticket.id}">
                <li class="table__body__row__item" style="flex: 0 0 3rem;">${count}</li>
                <li class="table__body__row__item">${ticket.ref_no}</li>
                <li class="table__body__row__item">${ticket.status}</li>
                <li class="table__body__row__item">${ticket.lastname} ${ticket.initials}</li>
                <li class="table__body__row__item">${getStaticDate(ticket.added_on)}</li>
                <li class="table__body__row__item flex" style="justify-content: end; cursor: pointer;">
                    <svg class="image--icon table__body__row__item--finish margin--right-1" data-ticketid="${ticket.id}">
                        <use href="#wrench"></use>
                    </svg>
                    <svg class="image--icon table__body__row__item--description margin--right-1" data-ticketid="${ticket.id}">
                        <use href="#exclamation"></use>
                    </svg>
                    <svg class="image--icon table__body__row__item--escalate" data-ticketid="${ticket.id}">
                        <use href="#share"></use>
                    </svg>
                </li>
            </ul>
        `;

        count++
    });

    return formated;
}

export const formatRepairHistory = (repairs) => {
    let formated = '', count = 1;

    repairs.forEach(repair => {
        formated += `
            <ul class="table__body__row table__body__row--repair" data-repairid="${repair.id}">
                <li class="table__body__row__item">${count}</li>
                <li class="table__body__row__item">${repair.item}</li>
                <li class="table__body__row__item">${repair.ref_no}</li>
                <li class="table__body__row__item">${repair._ticket_status}</li>
                <li class="table__body__row__item">${getStaticDate(repair.added_on)}</li>
            </ul>
        `;

        count++
    });

    return formated;
}

export const formatUnavailableSpecialities = (specialities) => {
    let formated = 'Could not find technicials for specialities: ';

    for (let i = 0; i < specialities.length; i++) {
        const speciality = specialities[i];
    
        if (i < specialities.length - 1) formated += speciality + ', ';
        
        else if (specialities.length != 1) formated += 'and ' + speciality;

        else formated += speciality;
    }

    return formated;
}