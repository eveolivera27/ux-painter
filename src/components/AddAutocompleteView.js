import React from "react";
import RefactoringConfigurationView from "./RefactoringConfigurationView";

export default class AddAutocompleteView extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const valuesCollection = event.target.value.split(",");
        this.setState({values: valuesCollection});
        this.props.refactoring.setValues(valuesCollection);
    }

    render() {
        return (
            <RefactoringConfigurationView refactoring={this.props.refactoring}>
                <div className={'form-group'}>
                    <label>Values to autocomplete</label>
                    <input type={'text'} placeholder={'apple,orange,banana'} className={'form-control'} onChange={this.handleChange}/>
                </div>
            </RefactoringConfigurationView>
        )
    }

}