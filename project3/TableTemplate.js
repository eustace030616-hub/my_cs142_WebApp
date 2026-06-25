'use strict';

class TableTemplate {
    // the goal is to find each element in row, and each row in table, so i need a for loop for rows, and a for loop for each element inside, and a if condition for coloumnName
    static fillIn(id, dict, columnName) {
        var table = document.getElementById(id);

        // process header row
        for (var c = 0; c < table.rows[0].cells.length; c++) {
            var cell = table.rows[0].cells[c];
            cell.innerHTML = this._replaceTemplate(cell.innerHTML, dict);
        }

        var colIndex = -1;
        if (columnName) {
            for (var c = 0; c < table.rows[0].cells.length; c++) {
                if (table.rows[0].cells[c].innerHTML === columnName) {
                colIndex = c;
                break;  // exit early once found
                }
            }
        }

        for (var r = 1; r < table.rows.length; r++) {
            for (var c = 0; c < table.rows[r].cells.length; c++) {
                if (colIndex === -1 || c === colIndex) {
                    var cell = table.rows[r].cells[c];
                    cell.innerHTML = this._replaceTemplate(cell.innerHTML, dict);
                }
            }
        }

        if (table.style.visibility === "hidden") {
            table.style.visibility = "visible";
        }
    }

    static _replaceTemplate(text, dict) {
        var pattern = /\{\{(\w+)\}\}/g;
        return text.replace(pattern, function(match, key) {
            return dict[key] !== undefined ? dict[key] : "";
        });
    }

}