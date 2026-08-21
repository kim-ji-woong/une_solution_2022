import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TabletEquipment14 from './TabletEquipment14';
import TabletEquipment22 from './TabletEquipment22';
import TabletEquipment23 from './TabletEquipment23';

class TabletEquipment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.eqNo === 14) {
            return <TabletEquipment14 />
        }
        else if (this.props.eqNo === 22) {
            return <TabletEquipment22 />
        }
        else if (this.props.eqNo === 23) {
            return <TabletEquipment23 />
        }
        else {
            return <></>
        }
    }
}

export default withRouter(TabletEquipment);