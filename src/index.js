/*global chrome*/

import ReactDOM from "react-dom";
import React from "react";
import Main from './content'
import "./index.css"

const app = document.createElement('div');
app.id = "refactoring-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action") {
            toggle();
        }
    }
);

function toggle(){
    if(app.style.display === "none"){
        app.style.display = "block";
    }else{
        app.style.display = "none";
    }
}