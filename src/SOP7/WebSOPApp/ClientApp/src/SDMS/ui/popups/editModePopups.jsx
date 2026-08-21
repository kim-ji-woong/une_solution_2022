import React, { Component } from 'react';
import { EditModePopupsComponent } from '../../styled/sdmsPopupsStyled';

export class EditModePopups extends Component {
	constructor(props) {
        super(props);
    }
    
    render() {

		return (
            <EditModePopupsComponent className={'modal openModal'}  style={{ position: this.props.position, top: this.props.top, left: this.props.left }} >
                <section>
                    <header>
                        {this.props.title}
                        <button className={'close'} > &times; </button>
                    </header>
                    {
                        this.props.content
                    }
                </section>
            </EditModePopupsComponent>
		);
    }
}

export default EditModePopups;