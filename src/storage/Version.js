import UsabilityRefactoring from "../refactorings/UsabilityRefactoring";
import Utils from "../utils/Utils"
class Version {

    constructor(aName) {
        this.refactorings = [];
        if (aName) {
            this.name = aName;
        }
    }

    setName(aString) {
        this.name = aString;
    }

    getName() {
        return this.name;
    }

    getRefactorings() {
        return this.refactorings;
    }

    setRefactorings(refactorings) {
        this.refactorings = refactorings;
    }

    addRefactoring(aRefactoring) {
        this.refactorings.push(aRefactoring);
    }

    export(){
        try{
            let content = {
                html: '',
                dependencies: [],
                css: '',
                js: ''
            };
            let done = {
                html: 0, 
                css: 0,
                js: 0
            };
            this.refactorings.forEach(refactoring => {
                try{
                    let template = refactoring.getTemplate();
                    let nombre = `<!--${refactoring.refactoring ? refactoring.refactoring : 'Refactoring'}-->\n`;
                    let nombreConBarra = '\n/*' + (refactoring.refactoring ? refactoring.refactoring : 'Refactoring') + '*/\n';
                    if (template.dependencies && !content.dependencies.find(d => d.id == template.dependencies.id)) {
                        content.dependencies.push(template.dependencies); 
                    }
                    if (content.html.indexOf(template.html) == -1){
                        content.html += template.html;
                        done.html++;
                    }

                    if (template.css && content.css.indexOf(template.css) == -1) {
                        content.css += `${nombreConBarra}${template.css}`;
                        done.css++;
                    }

                    if (template.js && content.js.indexOf(template.js) == -1){
                        content.js += `${nombreConBarra}${template.js}`;
                        done.js++;
                    }

                }catch(err){
                    console.log(err.message);
                    content.html += `<!--${err.message}-->\n\n`;
                }
            });
            if(done.html > 0) {
                let a = '<html ng-app="uxpApp"><head><title>Refactored template</title>'
                        + (done.css > 0 ? '<link rel="stylesheet" href="template.css"/>' : '')
                        + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.0/angular.min.js"></script>' 
                        + '<script src="template.js"></script>'
                        + content.dependencies.map(d => d.template).join()             
                        + '</head><body ng-controller="UXPMainCTRL">' 
                        + content.html
                        + '</body></html>';
                Utils.download('template.html', '<!DOCTYPE html>' + Utils.prettyPrintML(a));
            }
            if(done.css > 0) Utils.download('template.css', content.css);   
            Utils.download('template.js', 'var app = angular.module("uxpApp", []);\napp.controller("UXPMainCTRL", function($scope){ \nvar uxp = $scope.uxp = { rs: {} }; \n function validateFields(form){ angular.forEach(form.$error.required, function(field) { if(form[field.$name].$error) form[field.$name].$dirty = true; }); } \n' + content.js + '});');
            
        }catch(err){
            console.warn(err);
        }   
    }

    serialize() {
        let json = {};
        json.name = this.name;
        json.refactorings = [];
        for (let i = 0; i < this.refactorings.length; i++) {
            json.refactorings.push(this.refactorings[i].serialize());
        }
        return json;
    }

    execute() {
        this.refactorings.map(function (refactoring) {
           if (refactoring.getURL() == document.location.href) {
               refactoring.execute();
           }
        });
    }

    unDo() {
        this.refactorings.map(function (refactoring) {
            if (refactoring.getURL() == document.location.href) {
                refactoring.unDo();
            }
        });
    }

    clone() {
        let version = new Version();
        version.setName(this.getName());
        version.setRefactorings(this.getRefactorings().slice());
        return version;
    }

    static fromJSON(json) {
        let version = new Version();
        version.setName(json.name);
        for (let i = 0; i < json.refactorings.length; i++) {
            version.addRefactoring(UsabilityRefactoring.fromJSON(json.refactorings[i]));
        }
        return version;
    }
}

export default Version;