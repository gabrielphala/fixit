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
                <li class="table__body__row__item">${ticket.ticket_no}</li>
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
                <li class="table__body__row__item">${count}</li>
                <li class="table__body__row__item">${ticket.ticket_no}</li>
                <li class="table__body__row__item">${ticket.status}</li>
                <li class="table__body__row__item">${ticket.lastname} ${ticket.initials}</li>
                <li class="table__body__row__item">${getStaticDate(ticket.added_on)}</li>
                <li class="table__body__row__item table__body__row__item--finish" data-ticketid="${ticket.id}"><button class="btn btn--primary">Finish repair</button></li>
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