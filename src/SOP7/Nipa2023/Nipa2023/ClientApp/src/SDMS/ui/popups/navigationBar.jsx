import React, { Component } from 'react';

import SDMSResource from '../../resource/id';
import Monitoring from '../monitoring';

import { NavigationBarComponent, NavigationModeComponent } from '../../styled/sdmsPopupsStyled';

import { UserDispatch } from '../../../Root/resource/userDispatch';

import nav_home from '../../images/nav_home.png';
import nav_return from '../../images/nav_return.png';

class NavigationBar extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {
            modeBtn: false
        }

        this.props = props;
    }

    componentDidUpdate(prevProps) {
        if(this.state.modeBtn && prevProps.mode !== this.props.mode) {
            this.setState({ modeBtn: false });
        }
    }

    setVisiblePopups(menu) {
        this.props.setVisiblePopups(menu);
    }

    getQuickButtonClassName(name) {
        if (this.props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    handleModeButton() {
        this.setState({ modeBtn: !this.state.modeBtn });
    }

    onClickMode = (mode) => {
        this.setState({ modeBtn: false });
        this.props.onClickMode(mode)
    }

    getAlarmLength = () => {
        let alarmLength = 0;
        let equipmentAlarmLength = 0;

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if(alarms) {
            const datas = alarms['allAlarmDatas'];
            alarmLength = datas.length;

            const equipmentDatas = alarms['equipmentAlarmDatas'];
            equipmentAlarmLength = equipmentDatas?.length;
        }

        return [alarmLength, equipmentAlarmLength];
    }

    render() {
        let mode = this.props.mode;
        const [alarmLength, equipmentAlarmLength] = this.getAlarmLength();

        return (
            <>
            {
                this.state.modeBtn &&
                <NavigationModeComponent className='UI_Section' >
                    <ul>
                        <li>
                            <button className='monitoring' onClick={() => this.onClickMode(SDMSResource.mode.monitoring)} />
                        </li>
                        <li>
                            <button className='equipment' onClick={() => this.onClickMode(SDMSResource.mode.equipment)} />
                        </li>
                    </ul>
                </NavigationModeComponent>
            }

            {
                // 모니터링 모드
                mode === SDMSResource.mode.monitoring &&
                <NavigationBarComponent className='UI_Section navigationBar' mode={mode}>
                    <ul>
                        <li>
                            <ul className='navList'>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.statusInfo} className={this.getQuickButtonClassName(Monitoring.menu.statusInfo) + " " + 'statusInfoIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.statusInfo)} />
                                </li>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.dashboard} className={this.getQuickButtonClassName(Monitoring.menu.dashboard) + " " + 'dashboardIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.dashboard)} />
                                </li>
                            </ul>
                        </li>
                        <li className='navHomeBtn'>
                            <button onClick={() => this.handleModeButton()}><img src={nav_home}></img></button>
                        </li>
                        <li>
                            <ul className='navList'>
                                <li>
                                    {
                                        // 알람이 없으면 이벤트 팝업을 열 수 없음
                                        alarmLength > 0 || equipmentAlarmLength > 0 ? 
                                        <button id={"dsBot_" + SDMSResource.popupLayer.event} className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.event)} /> :
                                        <button className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} />
                                    }
                                </li>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.workerInfo} className={this.getQuickButtonClassName(Monitoring.menu.workerInfo) + " " + 'workerPositioningIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.workerInfo)} />
                                </li>
                            </ul>
                        </li>
                    </ul>
                </NavigationBarComponent>
            }

            {
                // 설비 모드
                mode === SDMSResource.mode.equipment &&
                <NavigationBarComponent className='UI_Section navigationBar' mode={mode}>
                    <ul>
                        <li>
                            <ul className='navList'>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.equipmentStatus} className={this.getQuickButtonClassName(Monitoring.menu.equipmentStatus) + " " + 'equipmentStatusIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.equipmentStatus)} />
                                </li>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.dashboard} className={this.getQuickButtonClassName(Monitoring.menu.dashboard) + " " + 'dashboardIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.dashboard)} />
                                </li>
                            </ul>
                        </li>
                        <li className='navHomeBtn'>
                            <button onClick={() => this.handleModeButton()}><img src={nav_home}></img></button>
                        </li>
                        <li>
                            <ul className='navList'>
                                <li>
                                    {
                                        // 알람이 없으면 이벤트 팝업을 열 수 없음
                                        alarmLength > 0 || equipmentAlarmLength > 0 ? 
                                        <button id={"dsBot_" + SDMSResource.popupLayer.event} className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.event)} /> :
                                        <button className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} />
                                    }
                                </li>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.equipmentFaulty} className={this.getQuickButtonClassName(Monitoring.menu.equipmentFaulty) + " " + 'equipmentFaultyIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.equipmentFaulty)} />
                                </li>
                            </ul>
                        </li>
                    </ul>
                </NavigationBarComponent>
            }

            {
                // 설비 상세정보 모드
                mode === SDMSResource.mode.equipmentDetail &&
                <NavigationBarComponent className='UI_Section navigationBar' mode={mode}>
                    <ul>
                        <li>
                            <ul className='navList'>
                                <li>
                                    <button id={"dsBot_" + SDMSResource.popupLayer.equipmentStatus} className={'on equipmentStatusIcon'} />
                                </li>
                            </ul>
                        </li>
                        <li className='navHomeBtn'>
                            <button onClick={() => this.props.onClickMode(SDMSResource.mode.equipment)}><img src={nav_return}></img></button>
                        </li>
                        <li>
                            <ul className='navList'>
                                <li>
                                    {
                                        // 알람이 없으면 이벤트 팝업을 열 수 없음
                                        alarmLength > 0 || equipmentAlarmLength > 0 ? 
                                        <button id={"dsBot_" + SDMSResource.popupLayer.event} className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.event)} /> :
                                        <button className={this.getQuickButtonClassName(Monitoring.menu.event) + " " + 'eventIcon'} />
                                    }
                                </li>
                            </ul>
                        </li>
                    </ul>
                </NavigationBarComponent>
            }
            </>
        );
    }
}

export default NavigationBar;