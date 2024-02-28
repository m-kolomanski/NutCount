class Datatable extends HTMLElement {
    constructor() {
        super();
    }

    init({container_id = null, table_id, data, id_var, colnames = {}, action_name = null, row_selection = null}) {
        this.table_id = table_id;
        this.data = data;
        this.id_var = id_var;
        this.colnames = colnames;
        this.action_name = action_name;
        this.row_selection = row_selection;
        document.getElementById(container_id)?.append(this);
    } 

    connectedCallback() {
        this.innerHTML = this.data !== null ? this.generateDatatable() : "";
        if (this.action_name) this.setupActionEvent();
        if (this.row_selection) this.setupRowSelectionEvent();
    }

    generateDatatable() {
        if (this.data === null) return "";

        return `
            <table id="${this.table_id}">
                <thead>
                    <tr>
                    ${
                        Object.keys(this.data[0]).map((key) => {
                            if (key !== this.id_var) {
                                return `<th>${this.colnames[key] || key}</th>`;
                            }
                        }).join("")
                    }
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        this.data.map((row) => {
                            return `
                                <tr item_id="${row[this.id_var]}">
                                    ${
                                        Object.keys(row).map((key) => {
                                            if (key !== this.id_var) return `<td colname="${key}">${row[key]}</td>`;
                                        }).join("")
                                    }
                                    ${this.action_name ? '<td class="action-cell"></td>' : ''}
                                </tr>
                            `
                        }).join("")
                    }
                </tbody>
            </table>
        `;
    }

    updateData(data) {
        this.data = data;
        this.innerHTML = this.generateDatatable();
        if (this.action_name) this.setupActionEvent();
        if (this.row_selection) this.setupRowSelectionEvent();
    }

    setupActionEvent() {
        this.querySelectorAll(".action-cell").forEach((element) => {
            element.addEventListener("click", (event) => {
                this.dispatchEvent(new CustomEvent(this.action_name, {
                    bubbles: true,
                    detail: {
                        row_id: event.target.parentElement.getAttribute('item_id')
                    }
                }));
            });
        });
    }

    setupRowSelectionEvent() {
        this.querySelectorAll("td:not(.action-cell)").forEach((element) => {
            element.addEventListener("click", (event) => {
                const status = event.target.classList.contains("active");
                event.target.classList.toggle("active");

                this.dispatchEvent(new CustomEvent(this.row_selection, {
                    bubbles: true,
                    detail: {
                        row_id: event.target.parentElement.getAttribute("item_id"),
                        status: status
                    }
                }));
            });
        });
    }


}

module.exports = Datatable;