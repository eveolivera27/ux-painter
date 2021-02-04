import RefactoringOnElementPreviewer from "./RefactoringOnElementPreviewer";

class TurnInputIntoRadiosPreviewer extends RefactoringOnElementPreviewer {

    generatePreviews(aRefactoring) {
        let previews = [];
        const existingStyle = this.findRadioSetStyle();
        if (!existingStyle.labelsStyle) {
            existingStyle.labelsStyle = this.findLabelStyle(aRefactoring);
        }
        const options = [{radioSetItem: {display: "inline", ...existingStyle.radioSetItem}, labelsStyle: existingStyle.labelsStyle, labelsPosition:"right"},
            {radioSetItem: {display:"block", ...existingStyle.radioSetItem}, labelsStyle: existingStyle.labelsStyle, labelsPosition:"right"}];
        for (let i = 0; i < options.length; i++) {
            previews.push(this.createPreviewRefactoring(aRefactoring, options[i]));
        }
        return previews;
    }

    createPreviewRefactoring(aRefactoring, style) {
        // clone refactoring target element and its container
        let previewRefactoring = aRefactoring.clone();

        previewRefactoring.setItemStyle(style.radioSetItem);
        previewRefactoring.setLabelsPosition(style.labelsPosition);

        previewRefactoring.setLabelsStyle(style.labelsStyle);
        previewRefactoring.setOtherInputStyle(this.getTextInputStyle());

        return previewRefactoring;

    }

    findRadioSetStyle() {
        let style = {};
        style.labelsStyle = {};
        style.radioSetItem = {};
        const radio = document.querySelector("input[type='radio']");
        if (!radio) {
            return style;
        }
        let radioLabel = this.findRadioLabel(radio, "right");
        if (radioLabel && radioLabel.nodeType == 1) {
            style.labelsStyle["font-family"] = window.getComputedStyle(radioLabel).getPropertyValue("font-family");
            style.labelsStyle["font-weight"] = window.getComputedStyle(radioLabel).getPropertyValue("font-weight");
            style.labelsStyle["font-size"] = window.getComputedStyle(radioLabel).getPropertyValue("font-size");
            style.labelsStyle["margin"] = window.getComputedStyle(radioLabel).getPropertyValue("margin");
            style.labelsStyle["padding"] = window.getComputedStyle(radioLabel).getPropertyValue("padding");
        }

        let currentContainer = radio;
        while (currentContainer.parentElement.querySelectorAll("input[name='" + radio.name + "']").length == 1) {
            currentContainer = currentContainer.parentElement;
        }
        style.radioSetItem.margin = window.getComputedStyle(currentContainer).getPropertyValue("margin");
        style.radioSetItem.padding = window.getComputedStyle(currentContainer).getPropertyValue("padding");

        return style;
    }

    findRadioLabel(inputRadio, position) {
        let nextElement = position == "left" ? inputRadio.previousSibling:inputRadio.nextSibling;
        let radioLabel;
        while (nextElement && !radioLabel) {
            //check that text content contains not only spaces
            if (nextElement.textContent && nextElement.textContent.replace(/\s/g, '').length != 0) {
                return nextElement;
            }
            nextElement = position == "left" ? nextElement.previousSibling:nextElement.nextSibling;
        }
    }

    findLabelStyle(aRefactoring) {
        return this.styleScrapper.getStyles("label", document,
            ["font-family", "font-weight", "font-size", "margin", "padding"], aRefactoring.getElement());
    }

}

export default TurnInputIntoRadiosPreviewer;