export const createSpecialityItem = () => {
    const specialityCount = parseInt($('#speciality-count').val()) + 1;

    const itemTemplate = `

		<div class="input" id="speciality-item-${specialityCount}" style="margin-top: 1.4rem;">
			<label for="speciality-${specialityCount}" id="speciality-${specialityCount}-label">Speciality: ${specialityCount}</label>
			<div class="flex flex--a-center">
				<select id="speciality-${specialityCount}" class="speciality__item" style="flex: 1;">
					<option value="select">Select</option>
					<option value="ram">Ram</option>
					<option value="rom">Rom</option>
					<option value="screen">Screen</option>
					<option value="charging port">Charging port</option>
				</select>
				<svg class="image--icon" style="margin-left: 1rem; fill: #b68c8c;" id="delete-item-${specialityCount}">
					<use href="#cancel"></use>
				</svg>
			</div>
		</div>
    `;

    const parent = $(`#speciality-selection-container`);

    $(itemTemplate).appendTo(parent);

    $(`#speciality-${specialityCount}`).html($(`#speciality-1`).html())

    $(`#delete-item-${specialityCount}`).on('click', (e) => {
        const itemId = e.currentTarget.id.split('-')[2];

        removeSpecialityItem(itemId);
    });

    $('#speciality-count').val(specialityCount);
};

const rename = (itemId, specialityCount) => {
    itemId = parseInt(itemId);

    for (let i = specialityCount; i > itemId; i--) {
        const oldId = i,
            currentId = oldId - 1;

        const item = $(`#speciality-item-${oldId}`)[0];
        item.id = `speciality-item-${currentId}`;

        const label = $(`#speciality-${oldId}-label`)[0];
        $(label).attr('for', `speciality-${currentId}`);
        label.id = `speciality-${currentId}-label`;
        label.innerText = `Speciality: ${currentId}`;

        const select = $(`#speciality-${oldId}`)[0];
        select.id = `speciality-${currentId}`;

        const deleteBtn = $(`#delete-item-${oldId}`);
        deleteBtn[0].id = `delete-item-${currentId}`;

        // remove previous event, because it points to an old id
        deleteBtn.off('click');

        // set new event pointing to current event
        $(deleteBtn).on('click', () => {
            removeSpecialityItem(currentId);
        });
    }

    $('#speciality-count').val(specialityCount - 1);
};

export const removeSpecialityItem = (itemId) => {
    const specialityCount = parseInt($('#speciality-count').val());

    if (specialityCount == 1)
        return;

    $(`#speciality-item-${itemId}`).remove();

    rename(itemId, specialityCount);
};