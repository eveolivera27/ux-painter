import UsabilityRefactoringOnElement from "./UsabilityRefactoringOnElement";
import XPathInterpreter from "./XPathInterpreter";
import AddFormValidationView from "../components/AddFormValidationView";
import Utils from "../utils/Utils";

class AddFormValidationRefactoring extends UsabilityRefactoringOnElement {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        let invalidInputs = false;
        this.getRequiredInputs().map(function (requiredInput) {
            if (!requiredInput || !requiredInput.value) {
                requiredInput.style.borderColor = "rgb(255,0,0)";
                requiredInput.required = true;
                invalidInputs = true;
            }
        });
        if (invalidInputs) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }
        else {
            this.getElement().submit();
        }
    }

    transform() {
        this.getElement().addEventListener("submit", this.onSubmit);
    }

    unDo() {
        this.getElement().removeEventListener("submit", this.onSubmit);
    }

    checkPreconditions() {
        return super.checkPreconditions() && this.requiredInputXpaths && this.requiredInputXpaths.length > 0;
    }

    setRequiredInputXpaths(aCollection) {
        this.requiredInputXpaths = aCollection;
    }

    getRequiredInputXpaths() {
        return this.requiredInputXpaths;
    }

    getRequiredInputs() {
        const me = this;
        return this.getRequiredInputXpaths().map(function (inputXpath) {
            return new XPathInterpreter().getSingleElementByXpath(inputXpath, me.getElement());
        });
    }

    targetElements () {
        return "form";
    }

    clone(aContext) {
        let clonedRefactoring = super.clone(aContext);
        clonedRefactoring.setRequiredInputXpaths(this.getRequiredInputXpaths());
        return clonedRefactoring;
    }

    static asString() {
        return "Add Late Form Validation";
    }

    getView() {
        return AddFormValidationView;
    }

    serialize() {
        let json = super.serialize();
        json.requiredInputXpaths = this.getRequiredInputXpaths();
        return json;
    }

    static getClassName() {
        return "AddFormValidationRefactoring";
    }

    getDescription() {
        return "Provide client validation to a form when the user submits it. Mandatory fields must be indicated";
    }

    getHTMLElement(){
        let elem = document.createElement('div');
        elem.appendChild(this.targetElement.cloneNode(true));
        return elem;
    }
    getJS(){
        return `
        var ${this.identifier} = uxp.${this.identifier} = {};
        
        uxp.${this.identifier}.submit = (f,e) => {
            if(f.$invalid){
                e.preventDefault();
                validateFields(f);
                return;
            }
            //acción del formulario
        }`;
    }
    addAttributes(elem){
        if(elem.localName == 'form'){
            if(!elem.name)
                elem.name = Utils.getID();
            elem.id = "form_"+ this.identifier;
            elem.setAttribute("novalidate", "");
            elem.setAttribute("ng-submit", `uxp.${this.identifier}.submit(${elem.name}, $event)`);    
        }else if(elem.localName == 'input' && elem.type != 'submit'){
            if(!elem.name)
                elem.name = Utils.getID();
            
            elem.id = elem.name + '_' + this.identifier;
            elem.setAttribute("ng-model", `uxp.${this.identifier}.${elem.name}`); 
            elem.setAttribute("ng-style", `{ 'border': ${"form_"+ this.identifier}.${elem.name}.$dirty && ${"form_"+ this.identifier}.${elem.name}.$invalid ? '1px solid red' : '' }`);    
        }
    }
}

export default AddFormValidationRefactoring;