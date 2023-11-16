class Datatable {
    constructor({table_id, container_id, data, id_var, colnames = {}}) {
        this.table_id = table_id;
        this.container = document.getElementById(container_id);
        this.data = data;
        this.id_var = id_var;
        this.colnames = colnames;

        this.container.innerHTML = this.generateDatatable();
    }

    generateDatatable() {
        if (this.data.length === 0) return "";
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
                                    <td></td>
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
        this.container.innerHTML = this.generateDatatable();
    }
}

module.exports = Datatable;