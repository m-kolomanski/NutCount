/**
 * Function for adding a dropdown menu to selected text input.
 * 
 * @param {string} text_input_id Id of the text input element to have picklist added.
 * @param {array} full_item_list Array of all items to be added to the picklist 
 */
addDropdownMenu = function(text_input_id, full_item_list) {
    // create container
    container_id = `${text_input_id}-options`;
    $(`#${container_id}`).remove();
    const dropdown_container = document.createElement("div");
    dropdown_container.classList.add("dropdown-options");
    dropdown_container.setAttribute("id", container_id);
    
    // get item names for the picklist
    for (let item of full_item_list) {
        const opt = document.createElement("p");
        opt.classList.add("dropdown-option");
        opt.setAttribute("id", item);
        opt.appendChild(document.createTextNode(item));
        dropdown_container.appendChild(opt);
    };

    $(`#${text_input_id}`).after(dropdown_container);

    // show dropdown
    $(document).on("focus", `#${text_input_id}`, () => {
        $(`#${container_id}`).css("display", "block");
    });
    // hide dropdown
    $(document).on("blur", `#${text_input_id}`, () => {
        $(`#${container_id}`).css("display", "none");
    });
    // select option
    $(document).on("mousedown", ".dropdown-option", (event) => {
        $(`#${text_input_id}`).val(event.target.id);
    });
    // filter dropdown
    $(document).on("input", `#${text_input_id}`, (event) => {
        $(`#${container_id}`).empty();
        for (let item of full_item_list) {
            if (item.toLowerCase().includes(event.target.value.toLowerCase())) {
                const opt = document.createElement("p");
                opt.classList.add("dropdown-option");
                opt.setAttribute("id", item);
                opt.appendChild(document.createTextNode(item));
                dropdown_container.appendChild(opt);
            }
        }
    });
    // set as active
    $(document).on("keydown", (event) => {
        if ((event.which !== 40 && event.which !== 38) ||
            $(`#${container_id}`)[0].style.display !== "block") {
                return null;
            } else {
                var current_active_element = $(`#${container_id} > .dropdown-option.selected`)[0];
                if (current_active_element == null) {
                    $(`#${container_id} > .dropdown-option`)[0].classList.add("selected");
                } else {
                    if (event.which === 38) {
                        current_active_element.previousElementSibling.classList.add("selected");
                    } else {
                        current_active_element.nextElementSibling.classList.add("selected");
                    }
                    current_active_element.classList.remove("selected");
                    $(`#${container_id} > .dropdown-option.selected`)[0].scrollIntoView({block: "center"});
                }
            }
    });
    $(document).on("mouseenter", ".dropdown-option", (event) => {
        var currently_selected = $(`#${container_id} > .dropdown-option.selected`)[0]
        if (currently_selected != null) $(`#${container_id} > .dropdown-option.selected`)[0].classList.remove("selected");
        $(`[id='${event.target.id}']`).addClass("selected");
    })
}

/**
 * Function for showing a popup menu.
 * 
 * @param {html} contents Contents to be displayed within popup window
 */
displayPopupMenu = function(contents) {
    $("body").append($("<div/>", {
        id: "backdrop",
        html: $("<div/>", {
            id: "popup-menu",
            html: contents
        })
    }));

    document.getElementById("backdrop").addEventListener("click", () => {$("#backdrop").remove();}, { once: true });
}

module.exports = {addDropdownMenu, displayPopupMenu};