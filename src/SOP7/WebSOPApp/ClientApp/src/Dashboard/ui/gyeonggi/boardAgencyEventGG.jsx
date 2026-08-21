import React, { useEffect, useState } from 'react';

import { BoardAgencyEventComponent } from '../../styled/dashboardGG';
import DoughnutChart from './chart/doughnutChart';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../../SDMS/resource/id';

const BoardAgencyEvent = (props) => {
    const [datas, setDatas] = useState([
        { index: 1, title: '경기도청/도의회', data: 0 },
        { index: 2, title: '경기도서관', data: 0 },
        { index: 3, title: '경기신용보증재단', data: 0 },
        { index: 4, title: '경기도교육청', data: 0 },
        { index: 5, title: '복합시설관', data: 0 },
        { index: 6, title: '경기주택도시공사 신사옥', data: 0 },
    ]);

    useEffect(() => {
        if (props.sensorTodayAlarm.length > 0) {
            let alarms_GG_A = 0;
            let alarms_GG_B = 0;
            let alarms_GG_D = 0;
            let alarms_GG_E = 0;
            let alarms_GG_F = 0;
            let alarms_GG_G = 0;
            let alarms_GG_H = 0;

            for (let alarm of props.sensorTodayAlarm) {
                if (alarm.facilityType === SdmsResource.facilityType.Earthquake) {
                    alarms_GG_A++;
                    alarms_GG_B++;
                    alarms_GG_D++;
                    alarms_GG_E++;
                    alarms_GG_F++;
                    alarms_GG_G++;
                    alarms_GG_H++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_A) {
                    alarms_GG_A++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_B) {
                    alarms_GG_B++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_D) {
                    alarms_GG_D++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_E) {
                    alarms_GG_E++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_F) {
                    alarms_GG_F++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_G) {
                    alarms_GG_G++;
                }
                else if (alarm.siteID === ProjectResource.Site.GG_H) {
                    alarms_GG_H++;
                }
            }

            setDatas([
                { index: 1, title: '경기도청/도의회', data: alarms_GG_B },
                { index: 2, title: '경기도서관', data: alarms_GG_D },
                { index: 3, title: '경기신용보증재단', data: alarms_GG_F },
                { index: 4, title: '경기도교육청', data: alarms_GG_G },
                { index: 5, title: '복합시설관', data: alarms_GG_E },
                { index: 6, title: '경기주택도시공사 신사옥', data: alarms_GG_H },
            ]);
        }
    }, [props.sensorTodayAlarm])

    return (
        <BoardAgencyEventComponent className='agency-event-area'>
            <h2>기관별 당일 이벤트 발생 건수</h2>

            <div className='chartWrap'>
                <DoughnutChart chartData={datas} />
            </div>
            <div className='tableWrap'>
                <ul>
                    {
                        datas.map((data) => 
                            <li key={data.index}>
                                <p>{data.title}</p>
                                <div>
                                    <span>{data.data}</span>
                                    <span>건</span>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </BoardAgencyEventComponent>
    );
};

export default BoardAgencyEvent;