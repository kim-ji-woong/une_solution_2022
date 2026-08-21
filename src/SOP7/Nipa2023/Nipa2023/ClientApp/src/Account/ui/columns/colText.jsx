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

    onChangeMember = (type, value, id) => {

        let isUpdate = true;
        if (this.state.value === value) {
            isUpdate = false;
        }
        
        this.props.onChangeMember(type, value, id, isUpdate);
    }

    render() {
        let value = this.state.value;
        
        return (
            <input 
                type='text' 
                defaultValue={value || ''} 
                onChange={(e) => this.onChangeMember('text', e.target.value, this.props.id)} 
            />
        );
    }
}

export default ColText;