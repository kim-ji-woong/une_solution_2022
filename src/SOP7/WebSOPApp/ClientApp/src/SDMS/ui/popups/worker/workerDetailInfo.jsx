import React, { Component } from 'react';

import PopupDraggable from '../popupDraggable';
import SDMSResource from '../../../resource/id';
import SDMS from '../../sdms';

import { WorkerDetailInfoComponent } from '../../../styled/sdmsPopupsStyled';

import workerDetail_user_icon from '../../../../SDMS/img/popup/workerDetail_user_icon.png';
//import wonik_imgRedLightIco_16 from '../../../../SDMS/img/popup/wonik_imgRedLightIco_16.png';
//import wonik_imgGrayLightIco_16 from '../../../../SDMS/img/popup/wonik_imgGrayLightIco_16.png';
import wonik_more_icon from '../../../../SDMS/img/popup/wonik_more_icon.png';

import { i18n, withTranslation /*, i18nUtil*/ } from '../../../../language/i18n';

class WorkerDetailInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workerDetailInfo: null,
        }

        this.props = props;

        this.state.workerDetailInfo = this.props.workerDetailInfo;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.workerDetailInfo?.content !== prevProps.workerDetailInfo?.content) {
            this.setState({ workerDetailInfo: this.props.workerDetailInfo });
        }
    }

    getDisplayContent = () => {
        const workerDetailInfo = this.state.workerDetailInfo;
        const type = workerDetailInfo?.type;
        const content = workerDetailInfo?.content;

        let name = "-";
        let memberID = "-";
        let teamName = "-";
        let phoneNumer = "-";
        let floor = "-";
        let equipZoneID = -1;
        let stayTime = "-";
        let comNum = 1;
        let alarmMsg = "-";
        let btnUI = null;

        let personCount = 1;

        const arrPerson = content.split("|||");

        if (arrPerson?.length > 0) {
            const person = arrPerson[0];
            const arrData = person.split(",");

            if (arrData?.length === 8) {
                if (arrData[0].length > 0)
                    name = arrData[0];
                if (arrData[1].length > 0)
                    memberID = arrData[1];
                if (arrData[2].length > 0)
                    teamName = arrData[2];
                if (arrData[3].length > 0)
                    phoneNumer = arrData[3];
                if (arrData[4].length > 0)
                    floor = arrData[4];
                if (arrData[5].length > 0)
                    equipZoneID = arrData[5];
                if (arrData[6].length > 0)
                    stayTime = arrData[6];
                if (arrData[7].length > 0)
                    comNum = arrData[7];
            }

            if (arrPerson.length > 1) {
                btnUI = (<a><img src={wonik_more_icon} onClick={() => this.onClickEquipZone(equipZoneID)} alt='more view icon'></img></a>);

                personCount = arrPerson.length - 1;
                name = name + " " + i18n.t('sdms.worker.외') + " " + personCount + " " + i18n.t('sdms.worker.명');
            }
                
        }

        if (type === SDMSResource.facilityType.Becon_Stay)
            alarmMsg = i18n.t('sdms.worker.체류 시간이 초과되었습니다');
        else if (type === SDMSResource.facilityType.Becon_SOS)
            alarmMsg = i18n.t('sdms.worker.SOS 신호가 탐지되었습니다');

        return [name, memberID, teamName, phoneNumer, floor, stayTime, comNum, alarmMsg, btnUI];
    }

    onClickEquipZone = (equipZoneID) => {
        this.props.setWorkerStatusPopup(equipZoneID);
    }

    render() {
        const [name, memberID, teamName, phoneNumer, floor, stayTime, comNum, alarmMsg, btnUI] = this.getDisplayContent();


        return (
            <div>
                <WorkerDetailInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardWorkerDetailInfo'} style={{ zIndex: 0, opacity: 1 }}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={280}
                        popupMinHeight={370}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        <div className={'dslTop dslGrd'}>
                            <h5 className={'dslTitle'} >
                               {i18n.t('sdms.worker.작업자 상세정보')}
                            </h5>
                            <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerDetailInfo, false)}></a>
                        </div>
                        <div className={'dslCont'}>
                            <img src={workerDetail_user_icon} alt='worker image' className='worker-image' />
                            <div className='worker-detail-info-wrap'>
                                <ul className='worker-detail-info-top'>
                                    <li className='worker-id'>{memberID}</li>
                                    <li className='worker-name'>
                                        <span>{comNum}</span>
                                        <div>
                                            <span>{name}</span>
                                            {btnUI}
                                        </div>
                                    </li>
                                    <li className='notice-message'>{alarmMsg}</li>
                                    <li className='notice-time'>+{stayTime}</li>
                                </ul>
                                <ul className='worker-detail-info-bottom'>
                                    <li className='worker-floor'>
                                        <span>{i18n.t('sdms.worker.층')}</span>
                                        <span>{floor}</span>
                                    </li>
                                    <li className='worker-contact-number'>
                                        <span>{i18n.t('sdms.worker.연락처')}</span>
                                        <span>{phoneNumer}</span>
                                    </li>

                                    {/* SOS */}
                                    {/* <li className='worker-sos-status'>
                                        <span>SOS</span>
                                        <img className={'alarm-img'} src={wonik_imgGrayLightIco_16} />
                                    </li> */}

                                    {/* 체류시간 */}
                                    <li className='worker-stay-time'>
                                        <span>{i18n.t('sdms.worker.체류시간')}</span>
                                        <span>{stayTime}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </PopupDraggable>
                </WorkerDetailInfoComponent>
            </div>
        );
    }
}

export default withTranslation()(WorkerDetailInfo);