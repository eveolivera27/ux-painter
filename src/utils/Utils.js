class Utils {
    static getID(){
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < 4; i++)
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        
        return result;
    }
    static getRandomID() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    static formatProperty(cssProp) {
        return cssProp[0].toLowerCase() + cssProp.slice(1, cssProp.length).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }

    static prettyPrintML(ml){
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        ml = ml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        ml.split('\r\n').forEach((node,index) => {
            var indent = 0;
            
            //esta validación es porque a veces los input no están cerrados entonces no matchea el regex
            let inputIx = node.indexOf('<input');
            if(inputIx > -1){
                let ixClosure = node.indexOf('>');
                if(node.trim()[ixClosure - 1] != '/') node = node.split('>').join('/>');
            }

            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
    
            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }
    
            formatted += padding + node + '\r\n';
            pad += indent;
        });
    
        return formatted;
    }

    static download(filename, content){
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();    
    }
}

export default Utils;