import React from 'react';
import { DashboardComponentGG } from '../../styled/dashboardGG';

import BoardViewGG from './boardViewGG';
import BoardWeeklyGG from './boardWeeklyGG';
import BoardRealTimeGG from './boardRealTimeGG';
import BoardAgencyEventGG from './boardAgencyEventGG';

const Dashboard = (props) => {
    
    return (
        <DashboardComponentGG>
            <BoardViewGG
                buildingGroupList={props.buildingGroupList}
                todayAllAlarms={props.todayAllAlarms}
                weeklyAlarms={props.weeklyAlarms}
                useSensorList={props.useSensorList}
                useSensorTypes={props.useSensorTypes}
                outdoorZones={props.outdoorZones}
            />
            <BoardAgencyEventGG
                sensorTodayAlarm={props.sensorTodayAlarm}
            />
            <BoardWeeklyGG
                weeklyAlarms={props.weeklyAlarms}
                sensorTodayAlarm={props.sensorTodayAlarm}
            />
            <BoardRealTimeGG
                todayAllAlarms={props.todayAllAlarms}
            />
        </DashboardComponentGG>
    );
};

export default Dashboard;