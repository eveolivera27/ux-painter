import React from "react";
import {Link, goTo} from "route-lite";
import ExtendVersionView from "./ExtendVersionView";
import VersionView from "./VersionView";

class VersionListView extends React.Component {

    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.switchToVersion = this.switchToVersion.bind(this);
        this.state = {currentVersion: window.refactoringManager.getCurrentVersion()};
    }

    getCurrentVersion() {
        return window.refactoringManager.getCurrentVersion().getName()?window.refactoringManager.getCurrentVersion().getName():'Original';
    }

    switchToVersion(event) {
        const selectedVersion = window.refactoringManager.getAllVersions()[event.target.getAttribute("data-version")];
        this.showSwitchingVersionOverlay(selectedVersion.getName());
        window.refactoringManager.getCurrentVersion().unDo();
        window.refactoringManager.setCurrentVersion(selectedVersion);
        selectedVersion.execute();
        window.refactoringManager.save();
        this.setState({currentVersion: selectedVersion});
    }

    handleEdit (event) {
        this.switchToVersion(event);
        goTo(ExtendVersionView);
    }


    handleExport(version) {
        return (event) => {
            version.export();
        };
    }


    render() {
        const allVersions = window.refactoringManager.getAllVersions().map((version, i) => {
            const eyeIconColor = version.getName() == this.state.currentVersion.getName() ? "#ffc107":"black";
            return (
            <div className={'row col-12'}>
                <div className={'col-5 offset-1'}>
                    <p className={'uxpainter-message'} style={{"font-size": "18px"}} data-tip={'Clone version'}>
                        {version.getName()} {window.refactoringManager.getOriginalVersionName() == version.getName()
                         && (<i className="fas fa-lock"></i>)}
                    </p>
                </div>
                <div className={'col-1 offset-1'}>
                    <a style={{"color": eyeIconColor }} className={"uxpainter-icon-link"} onClick={this.switchToVersion}>
                        <i data-version={i} className="fas fa-eye fa-lg"></i>
                    </a>
                </div>
                <div className={'col-1'}>
                    {window.refactoringManager.getOriginalVersionName() != version.getName() && (
                    <a className={"uxpainter-icon-link"} data-version={i} onClick={this.handleEdit}>
                        <i data-version={i} className="fas fa-edit fa-lg"></i>
                    </a>)}
                </div>
                <div className={'col-1'}>
                    <Link className={"uxpainter-icon-link"} component={VersionView} componentProps={{version: version}}>
                        <i data-version={i} className="far fa-clone fa-lg"></i>
                    </Link>
                </div>
                <div className={'col-1'} style={{"display": (version.getName() == this.state.currentVersion.getName() ? 'block' : 'none')}}>
                <a className={"uxpainter-icon-link"} onClick={this.handleExport(version)}>
                        <i data-version={i} className="fa fa-download fa-lg"></i>
                    </a>
                </div>
            </div>)
        });

        return (
            <div className={"container"}>
                <h2 className={'text-center'}>Versions</h2>
                <div className={'row'} style={{"margin-top": "20px"}}>
                    {allVersions}
                </div>
                <div className={'row col-12'}>
                    <Link className={'btn btn-warning'} component={VersionView}
                          componentProps={{version: window.refactoringManager.getOriginalVersion()}}>New version <i className="fas fa-plus-circle"></i>
                    </Link>
                </div>
            </div>
        )
    }

    showSwitchingVersionOverlay(versionName) {
        let overlay = document.createElement("div");
        overlay.id = "uxpainter-overlay";
        overlay.textContent = "Switching to version " + versionName;
        overlay.style.cssText = "font-size:2em;position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity:0.5;opacity:0.5;z-index:9998;padding-top: 5%; padding-left: 35%;";
        document.body.appendChild(overlay);
        setTimeout(() => {document.body.removeChild(document.querySelector("#uxpainter-overlay"))}, 400);
    }


}

export default VersionListView;