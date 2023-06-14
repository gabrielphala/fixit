import fetch from "../helpers/fetch.js"
import popup from "../helpers/popup.js"

import { closeModal, openModal } from "../helpers/modal.js"
import { arrayNotEmpty } from "../helpers/array.js"
import { formatUsersAdmin } from "../helpers/format.js"
import { showError, clearError } from "../helpers/error.js"

let cachedUsers = [];

const tableHeader = [
    '#', 'Last name', 'Initials', 'Unique no', 'Added on'
]

const allowedColumns = [
    'lastname', 'initials', 'unique_no', 'added_on'
]

export default class User {
    static async add (user_type) {
        const specialities = [];
        
        try {
            Array.from($('.speciality__item')).forEach(field => {
                if (specialities.includes(field.value))
                    throw 'Speciality already added';

                specialities.push(field.value)
            });

            const response = await fetch('/user/add', {
                body: {
                    lastname: $('#user-lastname').val(),
                    initials: $('#user-initials').val(),
                    unique_no: $('#user-id').val(),
                    specialities,
                    user_type
                }
            }) 

            if (response.successful) {
                await User.fetch_all(user_type)

                closeModal(user_type)

                return setTimeout(() => {
                    popup({ type: 'success', title: 'User added', message: `${user_type} successfully added` })
                }, 1500)
            }

            throw response.error;
        } catch (e) {
            showError('user-add', e);
        }
    }

    static async sign_in () {
        const response = await fetch(`/user/sign-in`, {
            body: {
                unique_no: $('#user-id').val(),
                password: $('#user-password').val()
            }
        })

        if (!response.successful) {
            return showError('login', response.error);
        }

        clearError('login')

        if (response.user_type == 'technician')
            return location.href = '/t/repairs';
        
        return location.href = '/repairs'
    }

    static async fetch_all (user_type) {
        const response = await fetch(`/user/fetch/all/${user_type}`) 

        if (arrayNotEmpty(response.users)) {
            cachedUsers = response.users;
            
            $('#no-users').hide();
            $('#user-list').html(formatUsersAdmin(response.users));

            $('.table__body__row__item__delete').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                User.delete(userid);

                return User.fetch_all(user_type);
            })

            $('.table__body__row__item__edit').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                $('#edit-user-row-id').val(userid);

                const data = $('.table__body__row__item', e.currentTarget.parentElement.parentElement);

                $('#edit-user-lastname').val(data[1].innerText);
                $('#edit-user-initials').val(data[2].innerText);
                $('#edit-user-id').val(data[3].innerText);

                openModal('user-update');
            })

            return;
        }
            
        $('#no-users').show();
        return $('#user-list').html('');
    }

    static async searchStudnets () {
        const response = await fetch(`/user/search-students`, {
            body: {
                query: $('#query').val()
            }
        })

        if (arrayNotEmpty(response.users)) {
            cachedUsers = response.users;

            $('#no-users').hide();
            $('#user-list').html(formatUsersAdmin(response.users));

            $('.table__body__row__item__delete').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                User.delete(userid);

                return User.searchStudnets();
            })

            $('.table__body__row__item__edit').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                $('#edit-user-row-id').val(userid);

                const data = $('.table__body__row__item', e.currentTarget.parentElement.parentElement);

                $('#edit-user-lastname').val(data[1].innerText);
                $('#edit-user-initials').val(data[2].innerText);
                $('#edit-user-id').val(data[3].innerText);

                openModal('user-update');
            })

            return;
        }

        $('#no-users').show();
        return $('#user-list').html('');
    }
    
    static async searchTechnicians () {
        const response = await fetch(`/user/search-technicians`, {
            body: {
                query: $('#query').val()
            }
        })

        if (arrayNotEmpty(response.users)) {
            cachedUsers = response.users;

            $('#no-users').hide();
            $('#user-list').html(formatUsersAdmin(response.users));

            $('.table__body__row__item__delete').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                User.delete(userid);

                return User.searchTechnicians();
            })

            $('.table__body__row__item__edit').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                $('#edit-user-row-id').val(userid);

                const data = $('.table__body__row__item', e.currentTarget.parentElement.parentElement);

                $('#edit-user-lastname').val(data[1].innerText);
                $('#edit-user-initials').val(data[2].innerText);
                $('#edit-user-id').val(data[3].innerText);

                openModal('user-update');
            })

            return;
        }

        $('#no-users').show();
        return $('#user-list').html('');
    }

    static async searchLecturers () {
        const response = await fetch(`/user/search-lecturers`, {
            body: {
                query: $('#query').val()
            }
        })

        if (arrayNotEmpty(response.users)) {
            cachedUsers = response.users;

            $('#no-users').hide();
            $('#user-list').html(formatUsersAdmin(response.users));

            $('.table__body__row__item__delete').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                User.delete(userid);

                return User.searchTechnicians();
            })

            $('.table__body__row__item__edit').on('click', e => {
                const userid = e.currentTarget.parentElement.parentElement.dataset.userid;

                $('#edit-user-row-id').val(userid);

                const data = $('.table__body__row__item', e.currentTarget.parentElement.parentElement);

                $('#edit-user-lastname').val(data[1].innerText);
                $('#edit-user-initials').val(data[2].innerText);
                $('#edit-user-id').val(data[3].innerText);

                openModal('user-update');
            })

            return;
        }

        $('#no-users').show();
        return $('#user-list').html('');
    }


    static async delete (userId) {
        const response = await fetch(`/user/delete`, {
            body: {
                user_id: userId
            }
        }) 
    }

    static async update (user_type) {
        const response = await fetch('/user/update', {
            body: {
                lastname: $('#edit-user-lastname').val(),
                initials: $('#edit-user-initials').val(),
                unique_no: $('#edit-user-id').val(),
                id: $('#edit-user-row-id').val(),
                user_type
            }
        }) 

        if (response.successful) {
            User.fetch_all(user_type);

            return closeModal('user-update');
        }

        return showError('user-update', response.error);
    }

    static async downloadCSV () {
        const response = await fetch('/download/csv', {
            body: {
                data: cachedUsers,
                tableHeader,
                allowedColumns,
                reportName: 'Users'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }
}