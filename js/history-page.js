const renderHistoryTable = function() {
    $("#history-table").empty();
    var history_data = dbmgr.getHistory(Number($("#days-to-show").val()) + 1, !$("#combine-items")[0].checked);

    const table = $("<table/>", {
        html: [
            // header //
            $("<thead/>", {
                html: $("<tr/>", {
                    html: () => {
                        var headers = []
                        for (let header of ["Data", "Nazwa", "Ilość", "Kcal", ""]) {
                            let header_cell = $("<th/>");
                            header_cell.append(document.createTextNode(header));
                            headers.push(header_cell);
                        }
                        return headers;
                    }
                })
            }),
            // body //
            $("<tbody/>", {
                html: () => {
                    var table_rows = [];

                    for (let entry in history_data.reverse()) {
                        var entry_row = $("<tr/>", {
                            html: () => {
                                var row_cells = [];
                                for (let i of Object.keys(history_data[entry])) {
                                    row_cells.push($("<td/>", {html: () => {
                                        var value = isNaN(history_data[entry][i]) ? history_data[entry][i] : Math.round(history_data[entry][i]);
                                        return document.createTextNode(value)
                                    }}))
                                }
                                row_cells.push($("<td/>", {
                                    class: "add-to-today-cell"
                                }))
                                return row_cells;
                                
                            }
                        })

                        table_rows.push(entry_row);
                    }
                    return table_rows
                }
            })
        ]
    })

    $("#history-table").append(table);
}

renderHistoryTable();

// events //
$(document).on("input", ["#days-to-show", "#combine-items"], renderHistoryTable);

$(document).on("click", ".add-to-today-cell", (event) => {
    var added_source = Object.keys(nuts.cookbook).includes(event.target.parentElement.children[1].innerHTML) ? "cookbook" : "catalogue";

    dbmgr.addTodayItem(event.target.parentElement.children[2].innerHTML,
        event.target.parentElement.children[1].innerHTML,
        added_source);

    $("#notification-container")
    .empty()
    .append("<p id='notification'>Produkt został dodany.</p>")
    $("#notification")
    .delay(3000)
    .fadeOut();
})