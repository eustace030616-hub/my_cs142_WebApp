'use strict';
class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
        this.element = document.getElementById(id);
        this.currentDate = new Date();
    }

    render(date) {
        this.currentDate = date;
        var year = date.getFullYear();
        var month = date.getMonth();

        var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var dayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ];

        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var daysInPrevMonth = new Date(year, month, 0).getDate();

        var totalSlots = firstDay + daysInMonth;
        var totalRows = Math.ceil(totalSlots / 7);
        var totalCells = totalRows * 7;

        var cells = [];

        var prevMonthDays = firstDay;
        for (let i = prevMonthDays; i > 0; i--) {
            cells.push({
                day: daysInPrevMonth - i,
                month: month === 0 ? 11 : month - 1,
                year: month === 0 ? year - 1 : year,
                isCurrentMonth: false
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            cells.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        var remainingCells = totalCells - totalSlots;
        for (let i = 1; i <= remainingCells; i++) {
            cells.push({
                day: i,
                month: month + 1,
                year: month === 11 ? year + 1 : year,
                isCurrentMonth: false
            });
        }

        //calendar header
        var html = '';

        html += '<div class="calendar-header">';
        html += '<button class="nav-btn" data-offset="-1">&lt;</button>';
        html += '<span class="month-year">' + monthNames[month] + ' ' + year + '</span>';
        html += '<button class="nav-btn" data-offset="1">&gt;</button>';
        html += '</div>';

        //week
        html += '<table class="calendar-grid">';
        html += '<tr>';
        for (let i = 0; i < 7; i++) {
            html += '<th>' + dayNames[i] + '</th>';
        }
        html += '</tr>';

        //day
        for (var row = 0; row <totalRows; row++) {
            html += '<tr>';

            for (var col = 0; col < 7; col++) {
                var cell = cells[row * 7 + col];
                var className = 'calendar-cell';
                if (!cell.isCurrentMonth) {
                    className += ' other-month';
                }
                html += '<td class="' + className + '" data-day="' + cell.day + '" data-month="' + cell.month + '" data-year="' + cell.year + '"data-current"' + cell.isCurrentMonth + '">';
                html += cell.day;
                html += '</td>';
            }
            html += '</tr>';
        }
        html += '</table>';

        this.element.innerHTML = html;

        var self = this;
        var navBtns = this.element.getElementsByClassName('nav-btn');
        for (let i = 0; i < navBtns.length; i++) {
            navBtns[i].onclick = function() {
            var offset = parseInt(this.getAttribute('data-offset'), 10);
            var newDate = new Date(self.currentDate);
            newDate.setMonth(newDate.getMonth() + offset);
            self.render(newDate);
            };
        }

        var dayCells = this.element.getElementsByClassName('calendar-cell');
        for (let i = 0; i < dayCells.length; i++) {
            dayCells[i].onclick = function() {
                var d = parseInt(this.getAttribute('data-day'), 10);
                var m = parseInt(this.getAttribute('data-month'), 10);
                var y = parseInt(this.getAttribute('data-year'), 10);
                self.callback(self.id, {
                    month: m + 1,
                    day: d,
                    year: y
                });
            };
        }
    }
}