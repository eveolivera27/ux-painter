import StyleScrapper from '../scrappers/StyleScrapper';
import XPathInterpreter from "./XPathInterpreter";
import RefactoringPreviewer from "../previewers/RefactoringPreviewer";
import PageSelector from "../PageSelector";
import RefactoringPreview from "../components/RefactoringPreview";
import Utils from "../utils/Utils";

class UsabilityRefactoring {
    constructor () {
        this.styleScrapper = new StyleScrapper();
        this.xpathInterpreter = new XPathInterpreter();
        this.pageSelector = new PageSelector(this);
    }

    initialize () {}
    transform () {}

    static asString () {}

    execute () {
        this.initialize();
        if (this.checkPreconditions()) {
            this.identifier = Utils.getID();
            this.transform();
        }
        else {
            console.log("Invalid refactoring");
        }
    }

    checkPreconditions() {
        return true;
    }

    isOnElement () {
        return false;
    }

    serialize () {
        return {"refactoring": this.constructor.getClassName(), "url": this.getURL(), "style": this.getStyle()};
    }

    createRefactoring(json) {
        return new window[json.refactoring](json);
    }

    setStyle (style) {
        this.style = style;
    }

    getStyle() {
        if (!this.style) {
            this.style = {};
        }
        return this.style;
    }

    getStyleScrapper() {
        return this.styleScrapper;
    }

    setStyleScrapper(aScrapper) {
        this.styleScrapper = aScrapper;
    }

    setURL(url) {
        this.url = url;
    }

    getURL() {
        return this.url;
    }

    setContext(anElement) {
        this.context = anElement;
    }

    getContext() {
        if (!this.context) {
            this.context = document.body;
        }
        return this.context;
    }

    getSelectionView() {
        return RefactoringPreview;
    }

    clone() {
        let clone = new this.constructor();
        return clone;
    }

    cloneContext(aContext) {
        const clonedElement = aContext.cloneNode(true);
        if (clonedElement.querySelector("#refactoring-extension-root")) {
            console.log("borra root");
            clonedElement.querySelector("#refactoring-extension-root").parentNode.removeChild(clonedElement.querySelector("#refactoring-extension-root"));
        }
        return clonedElement;
    }

    getElementInContext(anElement) {
        let id = anElement.getAttribute("data-uxpainter-id");
        if (this.getContext().getAttribute("data-uxpainter-id") == id) {
            return this.getContext();
        }
        else {
            return this.getContext().querySelector("[data-uxpainter-id='" + id + "']");
        }
    }

    getElementsXpath(elements) {
        const me = this;
        return elements.map(element => {
            return me.xpathInterpreter.getPath(me.getElementInContext(element), me.getContext())[0];
        });
    }

    applyStyles(targetElements,styles) {
        if (!styles) {
            return
        }
        for (let i = 0; i < targetElements.length; i++) {
            Object.keys(styles).forEach(function (cssProperty) {
                targetElements[i].style[cssProperty] = styles[cssProperty];
            });
        }
    }

    static fromJSON(json) {
        let refactoring = new (window.refactoringManager.getRefactoringClass(json.refactoring));
        Object.keys(json).map(function (key) {
           refactoring[key] = json[key];
        });
        return refactoring;
    }

    static getClassName() {
        return "";
    }

    static getPreviewer() {
        return new RefactoringPreviewer();
    }

    getDescription() {
        return "";
    }

    getDemoResources() {
        return null;
    }

    getTemplate(id){
        let element = this.getHTMLElement();
        let template = {
            html: this.getHTML(element.children && element.children.length ? Object.values(element.children) : [element], id),
            dependencies: this.getDependencies(),
            css: this.getCSS(element.children && element.children.length ? element.children : [element], '', ''),
            js: this.getJS()
        };

        return template;
    }

    getHTMLElement(){ 
        throw new Error("Este refactoring no posee una plantilla de código.");
    }
    
    getDependencies(){
        return "";
    } 

    //private function
    addAttributes(elem, id) {
        return elem 
    };
    
    getHTML(children, id){
        let template = '';
        children.forEach(c => {
            let cc = c.cloneNode(true);
            this.prepareElement(cc, id);
            template += cc.outerHTML;
        });
        return template;
        //return Object.values(children).reduce((a,b) => a + b.outerHTML, '');
    }
    prepareElement = (elem, id) => {
        let prepare = e => {
            e.style = null;
            e.removeAttribute('style');
            e = this.addAttributes(e, id);
        }
        if(elem.children && Object.values(elem.children).length){
            Object.values(elem.children).forEach(c => {
                if (c.children) this.prepareElement(c, id);
                else prepare(c);
            });
        }
        prepare(elem);
        return elem;
    }


    getCSS(children, selector, css){ //la idea es que esto sea privado
        Object.values(children).forEach(e => {  
            let childrenSelector = selector; 
            if(e.style){
                let id = e.id ? e.id : !e.className ? Utils.getRandomID() : '';
                childrenSelector += e.className ? ' .' + Object.values(e.classList).join('.').trim() : ' #' + id;
                if(css.indexOf(childrenSelector) == -1 && e.style.cssText){
                    let styles = '\t' + e.style.cssText.split(';').map(s => s.trim()).join(';\n\t');
                    styles = styles.substring(0, styles.length-1);
                    let alreadyIn = css.indexOf(styles);
                    if(alreadyIn == -1) 
                        css += `${childrenSelector}{\n${styles}}\n\n`;
                    else{
                        let preStyle = css.substring(0, alreadyIn);
                        let lastOpeningIx = preStyle.lastIndexOf('{');
                        preStyle = preStyle.substring(0, lastOpeningIx) + ',' + preStyle.substring(lastOpeningIx + 1);
                        css = preStyle + `${childrenSelector}{\n` + css.substring(alreadyIn);
                    }
                    if(!e.className) e.id = id;
                } 
            }
            if(e.children && e.children.length) css = this.getCSS(e.children, childrenSelector, css);
        });
        return css;
    }

    getJS(){
        return "";
    }
}

export default UsabilityRefactoring;














    









