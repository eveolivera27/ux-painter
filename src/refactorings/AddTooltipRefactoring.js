import UsabilityRefactoringOnElement from "./UsabilityRefactoringOnElement";
import AddTooltipView from "../components/AddTooltipView";
import 'tipr/tipr/tipr.css';
import ColorPreviewer from "../previewers/ColorPreviewer";
const $ = require('jquery');
window.jQuery = $;
global.jQuery = $;
require('tipr');


class AddTooltipRefactoring extends UsabilityRefactoringOnElement {

    transform () {
        this.originalElement = this.getElement().cloneNode(true);
        this.getElement().className += " tip";
            this.getElement().setAttribute("data-tip", this.tooltipName);

            $(this.getElement()).tipr();
            const me = this;
            this.getElement().addEventListener("mousemove", function () {
                me.applyStyles(me.getTooltipElement(), me.getStyle().tooltip);
            });

    }

    checkPreconditions() {
        return super.checkPreconditions() && this.tooltipName;
    }

    unDo() {
        this.getElement().parentNode.replaceChild(this.originalElement, this.getElement());
        this.setElement(null);
    }

    setTooltipName (aTooltipName) {
        this.tooltipName = aTooltipName;
    }

    getTooltipName() {
        return this.tooltipName;
    }

    targetElements () {
        return "a, div, img, input, span, p, button";
    }

    serialize () {
        let json = super.serialize();
        json.tooltipName = this.getTooltipName();
        return json;
    }

    getView () {
        return AddTooltipView;
    }

    getTooltipElement() {
        return this.getElement().querySelectorAll(".tipr_content");
    }

    getStyledElementsQty() {
        return 1;
    }

    assignStyle(aStyle) {
        this.getStyle()["tooltip"] = aStyle[0];
    }

    clone(aContext) {
        let clonedRefactoring = super.clone(aContext);
        clonedRefactoring.setTooltipName(this.tooltipName);
        return clonedRefactoring;
    }

    static asString () {
        return "Add Tooltip";
    }

    static getPreviewer() {
        return new ColorPreviewer();
    }

    static getClassName() {
        return "AddTooltipRefactoring";
    }

    getDescription() {
        return "Add an instant tooltip to an element to make clear its purpose";
    }

    getDemoResources() {
        return ["AddTooltipRefactoringBefore.gif","AddTooltipRefactoringAfter.gif"];
    }
    
    getHTMLElement(){
        return this.getElement();
    }

    getDependencies(){
        return {
            id: 'Tipr',
            template: `
            <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/tipr@2.0.2/tipr/tipr.css" />
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/tipr@2.0.2/tipr/tipr.min.js"></script>`
        };
    }

    getCSS(children, selector, css){
        let c = children.find(cc => cc.className.includes('tip'));
        let style = this.getStyle();
        let props = "";
        Object.values(style).forEach(selector => {
            Object.keys(selector).forEach(property => {
                props += '\t' + property + ': ' + selector[property] + '; \n';
            });
        });

        return super.getCSS(children, selector, css) + `\n${c.className ? ' .' + Object.values(c.classList).join('.').trim() : c.id ? ' #' + c.id : ''} .${Object.keys(style).join('.').trim()} { \n ${ props } \n }`;
    }
}

export default AddTooltipRefactoring;


