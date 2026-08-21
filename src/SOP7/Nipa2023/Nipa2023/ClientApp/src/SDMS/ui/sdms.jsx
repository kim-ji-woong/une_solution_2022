import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import nipa_logo from '../../Root/images/nipa_logo.png';

import { SDMSComponent } from '../styled/sdmsStyled';
import wsManager from '../../Root/services/wsManager';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../../Account/services/accountController';
import { SdmsController } from '../services/sdmsController';

class SDMS extends Component {

    constructor(props) {
        super(props);

        this.state = {
            campuses: null,
            campus1Datas: [],
            campus2Datas: [],
            campus3Datas: [],
        }

        this.setWsManager();
        this.initDatas();
    }

    async setWsManager() {
        let wsMgr = this.props.wsManager;

        if (!this.props.wsManager) {
            const user = ProjectResource.getUserInfo();
            let webSocketPort = user?.options?.webSocketPort;

            if (!webSocketPort) {
                const result = await AccountController.requestWebSocketPort();

                if (result.success) {
                    webSocketPort = result.port;

                    if (user?.options) {
                        user.options.webSocketPort = webSocketPort;
                        ProjectResource.setLoginUser(user);
                    }
                }
            }

            if (webSocketPort) {
                wsMgr = new wsManager(webSocketPort);
                this.props.setWsManager(wsMgr);
            }
        }

        if (wsMgr) {
            wsMgr.setViewMode(wsManager.mode.etc, 0);
        }
    }

    async initDatas() {
        const [result, message] = await SdmsController.requestCampusList();

        if(result) {
            const [campus1Datas, campus1Message] = await SdmsController.requestCampusData(ProjectResource.campus.campus_1);
            const [campus2Datas, campus2Message] = await SdmsController.requestCampusData(ProjectResource.campus.campus_2);
            const [campus3Datas, campus3Message] = await SdmsController.requestCampusData(ProjectResource.campus.campus_3);

            this.setState({ campuses: result, campus1Datas: campus1Datas, campus2Datas: campus2Datas, campus3Datas: campus3Datas });
        }
        else{
            console.log(message);
        }
    }

    onClickGoMonitoring = (campus) => {
        ProjectResource.setCampusID(campus);
		this.props.history.push(ProjectResource.path.monitoring);
	}

    handleMouseOver = async (value, campusID) => {
        let area = document.getElementById('tagWrap_' + campusID);
        let text = document.getElementById('factory_' + campusID);

        if(value) {
            area.classList.add('on');
            text.classList.add('on');
        } else {
            area.classList.remove('on');
            text.classList.remove('on');
        }
    }

    getNameTag () {
        const campuses = this.state.campuses;
        const campus1Datas = this.state.campus1Datas;
        const campus2Datas = this.state.campus2Datas;
        const campus3Datas = this.state.campus3Datas;

        let campusDatas = null;

        let nameTag = [];

        if (campuses) {
            campuses.map((campus) => {

                if(campus.id === ProjectResource.campus.campus_1) {
                    campusDatas = campus1Datas;
                }
                else if(campus.id === ProjectResource.campus.campus_2) {
                    campusDatas = campus2Datas;
                }
                else if(campus.id === ProjectResource.campus.campus_3) {
                    campusDatas = campus3Datas;
                }
                
                if(campus.id !== 3) {
                    nameTag.push(
                        <div className={`tagWrap tagWrap_${campus.id}`} id={`tagWrap_${campus.id}`} key={campus.id}>
                            <div
                                className={'nameTag'} 
                                onClick={() => this.onClickGoMonitoring(campus)}
                                onMouseOver={() => this.handleMouseOver(true, campus.id)}
                                onMouseOut={() => this.handleMouseOver(false, campus.id)}
                            >
                                <p>{campus.name}</p>
                            </div>
                            <div className='tagDescription'>
                                <p>공장 정보</p>
                                <ul>
                                    <li className='landArea'>
                                        <div>
                                            <p>대지면적</p>
                                            <p>{parseInt(campusDatas[0].value).toLocaleString() + '평'}</p>
                                        </div>
                                        <p>{parseInt(campusDatas[1].value).toLocaleString()}m</p>
                                    </li>
                                    <li className='buildingArea'>
                                        <div>
                                            <p>건축면적</p>
                                            <p>{parseInt(campusDatas[2].value).toLocaleString() + '평'}</p>
                                        </div>
                                        <p>{parseInt(campusDatas[3].value).toLocaleString()}m</p>
                                    </li>
                                    <li className='addressArea'>
                                        <div>
                                            <p>{campusDatas[4].name}</p>
                                            <p>{campusDatas[4].value}</p>
                                        </div>
                                        <img src={campusDatas[5].value} alt='공장동 사진'></img>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                }
                else {
                    nameTag.push(
                        <div className={`tagWrapOff tagWrap_${campus.id}`} id={`tagWrap_${campus.id}`} key={campus.id}>
                            <div
                                className={'nameTag'} 
                                onMouseOver={() => this.handleMouseOver(true, campus.id)}
                                onMouseOut={() => this.handleMouseOver(false, campus.id)}
                            >
                                <p>{campus.name}</p>
                            </div>
                            <div className='tagDescription'>
                                <p>공장 정보</p>
                                <ul>
                                    <li className='landArea'>
                                        <div>
                                            <p>대지면적</p>
                                            <p>{parseInt(campusDatas[0].value).toLocaleString() + '평'}</p>
                                        </div>
                                        <p>{parseInt(campusDatas[1].value).toLocaleString()}m</p>
                                    </li>
                                    <li className='buildingArea'>
                                        <div>
                                            <p>건축면적</p>
                                            <p>{parseInt(campusDatas[2].value).toLocaleString() + '평'}</p>
                                        </div>
                                        <p>{parseInt(campusDatas[3].value).toLocaleString()}m</p>
                                    </li>
                                    <li className='addressArea'>
                                        <div>
                                            <p>{campusDatas[4].name}</p>
                                            <p>{campusDatas[4].value}</p>
                                        </div>
                                        <img src={campusDatas[5].value} alt='공장동 사진'></img>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                }
            })
        }

        return nameTag;
    }

    render() {
        const campuses = this.state.campuses;
        let nameTag = this.getNameTag();

        return (
            <SDMSComponent className='SDMS'>
                <div className='factoryImgWrap'>
                    {
                        this.props.images && (
                            <img className='factoryImg' src={this.props.images.src} alt='공장동 모델링 이미지' useMap='#factory' id='factory_area' />
                        )
                    }
                    {nameTag}
                </div>

                <section className='UI_Section'>
                    <div className='mainLogo'>
                        <img src={nipa_logo} alt="메인로고" />
                    </div>
                    <ul className='areaListWrap'>
                        {
                            campuses &&
                            campuses.map((campus) => (
                                campus.id !== 3 ?
                                <li 
                                    key={campus.id}
                                    id={`factory_${campus.id}`} 
                                    onClick={() => this.onClickGoMonitoring(campus)} 
                                    onMouseOver={() => this.handleMouseOver(true, campus.id)}
                                    onMouseOut={() => this.handleMouseOver(false, campus.id)}
                                >
                                    <span>{campus.name}</span>
                                </li> :
                                <li 
                                    key={campus.id}
                                    id={`factory_${campus.id}`} 
                                    onMouseOver={() => this.handleMouseOver(true, campus.id)}
                                    onMouseOut={() => this.handleMouseOver(false, campus.id)}
                                >
                                    <span>{campus.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </section>
            </SDMSComponent>
        );
    }
}

export default withRouter(SDMS);