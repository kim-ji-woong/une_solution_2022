import React, { Component } from 'react';

class ColText extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            value: this.props.value,
        };

        this.props = props;
    }

    onChangeCCTVList = (value, cctv) => {
        this.props.onChangeCCTVList(value, cctv, this.props.type);
    }

    render() {
        let value = this.state.value;
        
        return (
            <input 
                type='text' 
                defaultValue={value || ''} 
                onBlur={(e) => this.onChangeCCTVList(e.target.value, this.props.cctv)} 
            />
        );
    }
}

export default ColText;