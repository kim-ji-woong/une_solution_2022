import React, { Component } from 'react';

import Clock from '../../../Dashboard/ui/components/clock';
import { EquipmentDetailComponent } from '../../styled/sdmsPopupsStyled';

class EquipmentDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.props = props;
    }

    render() {

        return (
            <EquipmentDetailComponent id={'EquipmentDetail'} className='EquipmentDetail'>
                <div className='dslCont'>
                <Clock />
                </div>
            </EquipmentDetailComponent>
        );
    }
}

export default EquipmentDetail;