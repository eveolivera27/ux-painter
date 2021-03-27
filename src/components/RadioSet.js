import React from 'react';
import Utils from '../utils/Utils'
class RadioSet extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOtherRadio = this.handleOtherRadio.bind(this);
        this.otherFreeInput = React.createRef();
    }

    render () {
        const radioName = Utils.getRandomID();
        const me = this;

        let labelsStyle = this.props.refactoring.getLabelsStyle();
        labelsStyle.cursor = "pointer";
        labelsStyle.display = "inline";

        const radios = this.props.values.map((value, i) => {
            let input = <input class={'uxp-rs-radio_'+(i+1)} id={'uxp-rs-radio_'+(i+1)} type={'radio'} style={{width: "auto"}} value={value} name={radioName} onChange={me.handleChange}/>;
            let label = <label class={'uxp-rs-label_'+(i+1)} style={labelsStyle}>{value}</label>;
            if (!me.props.refactoring.getItemStyle().margin) {
                me.props.refactoring.getItemStyle().margin = "5px";
            }
            return <p class={'uxp-rs-container'} style={me.props.refactoring.getItemStyle()}>
                {this.renderRadioItem(input,label)}
            </p>
        });
        
        const otherInput = <input class={'uxp-rs-radio_'+(this.props.values.length+1)} id={'uxp-rs-radio_'+(this.props.values.length+1)} type={'radio'} value={'Other'} name={radioName} onChange={this.handleOtherRadio}/>;
        const otherLabel = <label class={'uxp-rs-label_'+(this.props.values.length+1)} style={labelsStyle}>Other</label>;

        let otherInputStyle = this.props.refactoring.getOtherInputStyle();
        otherInputStyle.display = "none";
        otherInputStyle["margin-left"] = "5px";
        return (
            <div className={'uxpainter-radio-set'}>
                {radios}
                <p class={'uxp-rs-container'} style={me.props.refactoring.getItemStyle()}>
                    {this.renderRadioItem(otherInput,otherLabel)}
                    <input class="uxp-rs-control" type={'text'} style={otherInputStyle} placeholder={'Enter new value'} onChange={this.handleChange} ref={this.otherFreeInput}/>
                </p>
            </div>
        )
    }

    renderRadioItem(input, label) {
        return this.props.refactoring.getLabelsPosition() == "left"?[label,input]:[input,label];
    }


    handleChange(event) {
        this.props.refactoring.getElement().value = event.target.value;
        if (event.target.type == "radio") {
            this.otherFreeInput.current.style.display = "none";
        }
    }

    handleOtherRadio() {
        this.props.refactoring.getElement().value = "";
        this.otherFreeInput.current.style.display = "inline";
    }

}

export default RadioSet;