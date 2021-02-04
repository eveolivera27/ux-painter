import React from "react";
import RefactoringConfigurationView from "./RefactoringConfigurationView";

export default class AddAutocompleteView extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }



    render() {
        return (
            <RefactoringConfigurationView refactoring={this.refactoring}>
                <div className={'form-group'}>
                    <label>Values to autocomplete</label>
                    <input type={'text'} placeholder={'apple,orange,banana'} className={'form-control'} onChange={this.handleChange}/>
                </div>
            </RefactoringConfigurationView>
        )
    }

}