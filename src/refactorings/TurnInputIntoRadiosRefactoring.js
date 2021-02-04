import UsabilityRefactoringOnElement from './UsabilityRefactoringOnElement';
import ReactDOM from "react-dom";
import React from 'react';
import RadioSet from "../components/RadioSet";
import TurnInputIntoRadiosView from "../components/TurnInputIntoRadiosView";
import TurnInputIntoRadiosPreviewer from "../previewers/TurnInputIntoRadiosPreviewer";

class TurnInputIntoRadiosRefactoring extends UsabilityRefactoringOnElement {

    setValues(values) {
        this.values = values;
    }

    getValues() {
        return this.values;
    }

    targetElements = function () {
        return "input[type='text']";
    };

    transform () {
        this.getElement().setAttribute("type", "hidden");
        this.radioSetContainer = document.createElement("div");
        this.getElement().parentNode.insertBefore(this.radioSetContainer, this.getElement());
        ReactDOM.render(<RadioSet values={this.getValues()} refactoring={this}/>,this.radioSetContainer);
    }

    checkPreconditions() {
        return super.checkPreconditions() && this.getValues() && this.getValues().length > 0;
    }

    unDo() {
        this.getElement().parentNode.removeChild(this.radioSetContainer);
        this.getElement().setAttribute("type", "text");
    }

    getView() {
        return TurnInputIntoRadiosView;
    }

    static asString () {
        return "Turn Input into Radios";
    }

    static getPreviewer() {
        return new TurnInputIntoRadiosPreviewer();
    }

    setItemStyle(aString) {
        this.getStyle().item = aString;
    }

    getItemStyle() {
        return this.getStyle().item;
    }

    setLabelsPosition(aString) {
        this.getStyle().labelsPosition = aString;
    }

    getLabelsPosition() {
        return this.getStyle().labelsPosition;
    }

    setLabelsStyle(aStyle) {
        this.getStyle().labels = aStyle;
    }

    getLabelsStyle() {
        if (!this.getStyle().labels) {
            return {};
        }
        return this.getStyle().labels;
    }

    getOtherInputStyle() {
        if (!this.getStyle().otherInput) {
            return {};
        }
        return this.getStyle().otherInput;
    }

    setOtherInputStyle(style) {
        this.getStyle().otherInput = style;
    }

    clone(aContext) {
        let refactoring = super.clone();
        refactoring.setValues(this.getValues());
        return refactoring;
    }

    serialize() {
        let json = super.serialize();
        json.values = this.getValues();
        return json;
    }

    static getClassName() {
        return "TurnInputIntoRadiosRefactoring";
    }

    getDescription() {
        return "Turn a regular text field into a set of radio buttons with predefined values. 'Other' option is included to enter a different value";
    }
    
    getHTMLElement(){
        return this.radioSetContainer;
    }
    
    addAttributes(elem) {
        if(elem.localName == 'input' && elem.type == 'radio'){   
            elem.setAttribute("ng-model", `uxp.${this.identifier}.radio`);
        }else if(elem.localName == 'input' && elem.type == 'text'){
            elem.setAttribute("ng-if", `uxp.${this.identifier}.radio` + ' == "Other"');
            elem.setAttribute("ng-model", `uxp.${this.identifier}.radio_input`);
            elem.setAttribute("style", 'display: inline');
        }
        return elem;
    }
}

export default TurnInputIntoRadiosRefactoring;








