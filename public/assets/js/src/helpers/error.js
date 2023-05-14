export const showError = (id, message) => {
    const parent = $(`#${id}-error`)

    $('h4', parent[0])[0].innerText = message;

    parent[0].style.display = 'flex';
}

export const clearError = (id) => {
    $(`#${id}-error`).hide()
}