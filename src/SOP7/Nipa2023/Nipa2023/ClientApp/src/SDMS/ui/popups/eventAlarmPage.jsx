import React, { Component } from 'react';

import { EventAlarmPageComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

class EventAlarmPage extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    getDisplayView = () => {
        const alarmData = this.props.alarmData;
        let displayView = [];

        if(alarmData){

            let [ymd, hms] = SdmsResource.getDate(new Date(alarmData.eventTime));

            displayView.push(
                <div className='content'>
                    <h1>{alarmData.positionName}</h1>
                    <p>{ymd + ' ' + hms} {alarmData.message}</p>
                    <button onClick={() => this.props.handleAlarmPopup(false)}>확인</button>
                </div>
            );

            return displayView;
        }
    }

    render() {
        const displayView = this.getDisplayView();

        return(
            <EventAlarmPageComponent className='UI_Section'>
                {displayView}
            </EventAlarmPageComponent>
        );
    }
}

export default EventAlarmPage;