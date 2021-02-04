import $ from 'jquery';
import 'jquery-dropdown-datepicker/dist/jquery-dropdown-datepicker';
import UsabilityRefactoringOnElement from './UsabilityRefactoringOnElement';
import DateInputIntoSelectsPreviewer from "../previewers/DateInputIntoSelectsPreviewer";

class DateInputIntoSelectsRefactoring extends UsabilityRefactoringOnElement {

    transform = function () {
        var dateInput = $(this.getElement());
        if (typeof(dateInput[0]) != "undefined") {
            this.submitFieldName = dateInput.attr("name");
            dateInput.attr("name", "");
            dateInput.dropdownDatepicker({...{
                submitFieldName: this.submitFieldName,
                daySuffixes: false,
                monthSuffixes: false
            }, ...this.getLanguageOptions()["es"]});
            this.applyStyles(this.getSelects(), this.getStyle().selectElement);
        }
    }

    unDo() {
        $(this.getElement()).dropdownDatepicker('destroy');
        this.getElement().setAttribute("type", "text");
        this.getElement().setAttribute("name", this.submitFieldName);
    }

    targetElements() {
        return "input[type='text']";
    }

    getSelects() {
        return this.getElement().parentNode.querySelectorAll("select");
    }

    getLanguageOptions() {
        return {
            es: {
                dayLabel: "Día",
                monthLabel: "Mes",
                yearLabel: "Año",
                monthLongValues: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthShortValues: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                initialDayMonthYearValues: ['Día', 'Mes', 'Año']
            },
            en: {
                dayLabel: "Day",
                monthLabel: "Month",
                yearLabel: "Year",
                monthLongValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthShortValues: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                initialDayMonthYearValues: ['Day', 'Month', 'Year']
            }
        }
    }

    static asString() {
        return "Date Input into Selects";
    }

    static getPreviewer() {
        return new DateInputIntoSelectsPreviewer();
    }

    static getClassName() {
        return "DateInputIntoSelectsRefactoring";
    }

    getDescription() {
        return "Turn simple text field for dates into 3 selects for Day - Month - Year";
    }

    getHTMLElement(){
        let container = document.createElement("div");
        container.className = "uxp-date-selects";
        this.getSelects().forEach(s => {
            let ss = s.cloneNode(true);
            let opt = Object.values(ss.options);
            for(let i = 1; i < opt.length; i++)
                opt[i].remove();
            container.appendChild(ss);
        });
        return container;
    }

    getJS(){
        let selects = this.getSelects();
        let days = Object.values(selects[0].options).map(x => ({ Id: x.value, Nombre: x.label }));
        days.shift();
        let months = Object.values(selects[1].options).map(x => ({ Id: x.value, Nombre: x.label }));
        months.shift();
        let years = Object.values(selects[2].options).map(x => ({ Id: x.value, Nombre: x.label }));
        years.shift();
        return `
        uxp.${this.identifier} = {
            combos: {
                days: ${JSON.stringify(days)},
                months: ${JSON.stringify(months)},
                years: ${JSON.stringify(years)}
            }
        };`;
    }

    addAttributes(elem) {
        if(elem.localName == 'select'){
            let id = elem.className.includes('day') ? 'day' : elem.className.includes('month') ? 'month' : 'year';
            elem.id = 'uxp-dis-' + id + 's';
            elem.setAttribute("ng-model", `uxp.${this.identifier}.${id}`);
            elem.setAttribute("ng-options", `x as x.Nombre for x in uxp.${this.identifier}.combos.${id}s`);
        }
    }

}

export default DateInputIntoSelectsRefactoring;




