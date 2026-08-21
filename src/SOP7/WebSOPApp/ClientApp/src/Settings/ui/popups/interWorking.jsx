import React, { Component } from 'react';
import $ from 'jquery';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { SettingController } from '../../services/settingController';
import SettingsResource from '../../resource/id';
import { InterWorkingComponent } from '../../styled/settingsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import CCTVSetting_gg from './gyeonggi/cctvSetting_gg';
import SensorSet_gg from './gyeonggi/sensorSet_gg';
import NVRSetting_gg from './gyeonggi/nvrSetting_gg';

class InterWorking extends Component{
    constructor(props) {
		super(props);
		this.props = props;

		this.state = {
            tabMenu: SettingsResource.setInterWorking.센서_설정,
		}
	}

    onClickTab = (target, value) => {
		$('.MonitoringTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value});
	}

    sensorSetOff = () => {
        this.setState({ sensorPopOnOff: false });
    }

    cctvSetOff = () => {
        this.setState({ cctvPopOnOff: false });
    }

    nvrSetOff = () => {
        this.setState({ nvrPopOnOff: false });
    }

    onSensorBox = () =>{
        this.setState({ sensorPopOnOff: true });
	}
    
    onCCTVSetBox = () =>{
        this.setState({ cctvPopOnOff: true });
	}

    onNVRSetBox = () =>{
        this.setState({ nvrPopOnOff: true });
	}

    render(){

        return(
            <>
                <InterWorkingComponent>
                    <div className={'stgScroll'}>
                        <div className={'stgName'}>
                            <h5>센서 설정</h5>
                            <span className={'stgTltp'} data-tooltip="센서 활성화/비활성화 상태를 설정합니다."></span>
                            <a onClick={() => this.onSensorBox()} className={'stgnRset' + " " + 'upload'}>센서 설정하기</a>
                            {/* <input ref={this.refBuildingFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectBuildingFile} /> */}
                        </div>
                        <div className={'stgName'}>
                            <h5>CCTV 설정</h5>
                            <span className={'stgTltp'} data-tooltip="CCTV 정보를 설정합니다."></span>
                            <a onClick={() => this.onCCTVSetBox()} className={'stgnRset' + " " + 'upload'}>CCTV 설정하기</a>
                            {/* <input ref={this.refGroupFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectGroupFile} /> */}
                        </div>
                        <div className={'stgName'}>
                            <h5>NVR 설정</h5>
                            <span className={'stgTltp'} data-tooltip="관할 CCTV 서버 정보를 설정합니다."></span>
                            <a onClick={() => this.onNVRSetBox()} className={'stgnRset' + " " + 'upload'}>NVR 설정하기</a>
                            {/* <input ref={this.refGroupFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectGroupFile} /> */}
                        </div>
                    </div>
                </InterWorkingComponent>
                {
                    /* Sensor 설정 팝업창 */
                    this.state.sensorPopOnOff &&
                    <SensorSet_gg 
                        sensorSetOff={this.sensorSetOff}
                    />
                }
                {
                    /* CCTV 설정 팝업창 */
					this.state.cctvPopOnOff && 
					<CCTVSetting_gg 
                        cctvSetOff={this.cctvSetOff}
                    />
				}
                {
                    /* NVR 설정 팝업창 */
                    this.state.nvrPopOnOff && 
                    <NVRSetting_gg 
                        nvrSetOff={this.nvrSetOff}
                        nvrList={this.props.nvrList} 
                        updateCCTVSettings={this.props.updateCCTVSettings}
                    />
                }
            </>
        );
    }
}

export default withTranslation()(InterWorking);