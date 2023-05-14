import fetch from "../helpers/fetch.js"

import { showError, clearError } from "../helpers/error.js"

export default class Admin {
    static async sign_in () {
        const response = await fetch(`/a/sign-in`, {
            body: {
                email: $('#user-email').val(),
                password: $('#user-password').val()
            }
        })

        if (!response.successful) {
            return showError('login', response.error);
        }

        clearError('login')
        
        return location.href = '/a/students'
    }
}