import UsabilityRefactoringOnElement from "./UsabilityRefactoringOnElement";
import TurnAttributeIntoLinkView from "../components/TurnAttributeIntoLinkView";
import TurnAttributeIntoLinkPreviewer from "../previewers/TurnAttributeIntoLinkPreviewer";

class TurnAttributeIntoLinkRefactoring extends UsabilityRefactoringOnElement {

    transform() {
        this.linkElement = document.createElement("a");
        this.linkElement.href = this.getTargetURL();
        this.linkElement.innerHTML = this.getElement().innerHTML;
        this.getElement().innerHTML = "";
        this.getElement().appendChild(this.linkElement);
        this.applyStyles([this.linkElement], this.getStyle().targetElement);
    }

    getTargetURL() {
        return this.targetURL;
    }

    setTargetURL(aUrl) {
        this.targetURL = aUrl;
    }

    targetElements() {
        return "p, span, h1, h2, h3, h4, h5, h6, img, li";
    }

    getView() {
        return TurnAttributeIntoLinkView;
    }

    clone() {
        let refactoring = super.clone();
        refactoring.setTargetURL(this.getTargetURL());
        return refactoring;
    }

    serialize() {
        let json = super.serialize();
        json.targetURL = this.getTargetURL();
        return json;
    }

    static asString() {
        return "Turn Attribute into Link";
    }

    static getPreviewer() {
        return new TurnAttributeIntoLinkPreviewer();
    }

}

export default TurnAttributeIntoLinkRefactoring;