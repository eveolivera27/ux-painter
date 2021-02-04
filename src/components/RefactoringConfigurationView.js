import React from "react";
import {goBack, goTo, Link } from "route-lite";
import RefactoringPreview from "./RefactoringPreview";
import PageSelector from "../PageSelector";

class RefactoringConfigurationView extends React.Component {

    constructor(props) {
        super(props);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.pageSelector = new PageSelector(this);
    }

    handleNext() {
        if (this.props.child && this.props.child.onNext() && this.props.child.next) {
            goTo(this.props.child.next(), {refactoring: this.props.refactoring});
        }
        else if (!this.props.child || (this.props.child && this.props.child.onNext())) {
            goTo(RefactoringPreview, {refactoring: this.props.refactoring});
        }
    }

    handleBack() {
        if (this.props.child) {
            this.props.child.onBack();
        }
        goBack();
    }

    render () {
        return (
                <div className={"container"}>
                    <div className={'row col-12'}>
                        <h5 className={'text-center'}>{this.props.refactoring.constructor.asString()}</h5>
                    </div>
                    <div className={"row uxpainter-long-row col-12"}>

                        {(this.props.description) && (<p className={'uxpainter-message'}>{this.props.description}</p>)}
                        {(!this.props.description) && (<p className={'uxpainter-message'}>Complete the following parameters:</p>)}

                    </div>
                    <div className={"row uxpainter-long-row col-12"}>
                            {this.props.children}
                    </div>
                    <div className={'row uxpainter-long-row'}>
                        <div className={"col-5"}>
                            <Link className={'btn btn-secondary'} onClick={this.handleBack}><i className="fas fa-arrow-circle-left"></i> Back</Link>
                        </div>
                        <div className={"col-5"}>
                            <Link onClick={this.handleNext} className={'btn btn-warning'}>Next <i className="fas fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
        )
    }
}

export default RefactoringConfigurationView;