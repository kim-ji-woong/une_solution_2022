import React, { Component } from 'react';
//import styles from '../css/sdms.module.css';
import styles from '../../Common/css/ui.module.css';
import styles2 from '../../Common/css/style.module.css';
import newStyles from '../../Common/css/newStyle.module.css';
import SDMSResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';

import $ from 'jquery';
import { i18n, withTranslation } from '../../language/i18n';

class SDMSMenuBtn extends Component {
    static keys = [];

    constructor(props) {
        super(props);

        this.props = props;
        this.refMain = React.createRef();
    }

    componentDidMount() {
        $('#mainSB').click(function (e) {
            // 메뉴 창이 열렸을 경우 닫기 
            if ($(".subMenu." + styles.fileWrap).hasClass(styles.isShow)) {
                if (e.target.className !== styles.btnFile && e.target.className !== styles.iconFile) {
                    $(".subMenu." + styles.fileWrap).removeClass(styles.isShow);
                }
            }
        });

        // 단축키 이벤트 리스너
        window.addEventListener("keydown", (e) => this.keysPressed(e, this), false);
        window.addEventListener("keyup", this.keysReleased, false);
    }

    keysPressed(e, target) {
        // store an entry for every key pressed
        SDMSMenuBtn.keys[e.keyCode] = true;
        const commonKey = 17;   // ctrl 키
        const shiftKey = 16;

        if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.statusInfo]) {
            // statusInfo 퀵버튼
            target.onClickMenu(SDMSResource.menu.현황정보);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.statusInfo] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.cctv]) {
            // cctv 퀵버튼
            target.onClickMenu(SDMSResource.menu.전체_CCTV);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.cctv] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.dashboard]) {
            // dashboard 퀵버튼
            target.onClickMenu(SDMSResource.menu.대시보드);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.dashboard] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.eventInfo]) {
            // eventInfo 퀵버튼
            target.onClickMenu(SDMSResource.menu.이벤트_정보);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.eventInfo] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.miniMap]) {
            // miniMap 퀵버튼
            target.onClickMenu(SDMSResource.menu.미니맵);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.miniMap] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.editMode]) {
            // editMode 퀵버튼
            target.onClickMenu(SDMSResource.menu.편집모드);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.editMode] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.manualReport]) {
            // manualReport 퀵버튼
            target.onClickMenu(SDMSResource.menu.수동신고);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.manualReport] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.workerPath]) { /* 0929 */
            // workerPath 퀵버튼
            target.onClickMenu(SDMSResource.menu.인원현황);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.workerPath] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.workerInfoSB]) { /* 0929 */
            // workerPath 퀵버튼
            target.onClickMenu(SDMSResource.menu.작업일지);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.workerInfoSB] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.sensorStatus]) { /* 0929 */
            // sensorStatus 퀵버튼
            target.onClickMenu(SDMSResource.menu.센서현황);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.sensorStatus] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SDMSMenuBtn.keys[commonKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.weatherInfo]) {
            // weatherInfo 퀵버튼
            target.onClickMenu(SDMSResource.menu.기상정보);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.weatherInfo] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm1]) {
            // 알람 CCTV 뷰어창1 퀵버튼
            target.onClickMenu(SDMSResource.menu.알람_CCTV_1);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm1] = false;
            // prevent default browser behavior
            //e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm2]) {
            // 알람 CCTV 뷰어창2 퀵버튼
            target.onClickMenu(SDMSResource.menu.알람_CCTV_2);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm2] = false;
            // prevent default browser behavior
            //e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm3]) {
            // 알람 CCTV 뷰어창3 퀵버튼
            target.onClickMenu(SDMSResource.menu.알람_CCTV_3);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.cctvAlarm3] = false;
            // prevent default browser behavior
            //e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.detectionInfo]) {
            target.onClickMenu(SDMSResource.menu.이상_탐지);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.detectionInfo] = false;
            e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.simulationInfo]) {
            target.onClickMenu(SDMSResource.menu.시뮬레이션);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.simulationInfo] = false;
            e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.analysisInfo]) {
            target.onClickMenu(SDMSResource.menu.위험도_분석);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.analysisInfo] = false;
            e.preventDefault();
        }
        else if (SDMSMenuBtn.keys[shiftKey] && SDMSMenuBtn.keys[SDMSResource.quickBtn.changeSensorName]) {
            target.onClickMenu(SDMSResource.menu.센서명_변경);

            SDMSMenuBtn.keys[SDMSResource.quickBtn.changeSensorName] = false;
            e.preventDefault();
        }
        
    }

    keysReleased(e) {
        // mark keys that were released
        SDMSMenuBtn.keys[e.keyCode] = false;
    }

    onClickMenu(menu) {
        if (!this.refMain.current) {
            return;
        }

        const parent = this.refMain.current.parentNode;

        if (parent) {
            parent.classList.remove(styles.isShow);
        }

        if (this.props.menuEvent.handler) {
            this.props.menuEvent.handler(menu, this.getParameter(menu));
        }
    }

    getParameter(menu) {
        return "";

        
    }

    render() {
        return (
            <div className={newStyles.rqQck + " rqBtn"}>
                <button className="rqQckBtn">메뉴열기</button>
                <ul ref={this.refMain}>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen 
                            ? <>
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.현황정보)}>{i18n.t('sdms.menu.현황정보')}</a></li>      {/*현황정보*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.대시보드)}>{i18n.t('sdms.menu.대시보드')}</a></li>      {/*CCTV*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.이벤트_정보)}>{i18n.t('sdms.menu.이벤트 정보')}</a></li> {/*이벤트 정보*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.이상_탐지)}>{i18n.t('sdms.menu.이상 탐지')}</a></li>    {/*이상탐지*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.시뮬레이션)}>{i18n.t('sdms.menu.시뮬레이션')}</a></li>   {/*시뮬레이션*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.위험도_분석)}>{i18n.t('sdms.menu.위험도 분석')}</a></li> {/*위험도 분석*/}
                            </>
                            : <>
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.현황정보)}>{i18n.t('sdms.menu.현황정보')}</a></li>       {/*현황정보*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.전체_CCTV)}>{i18n.t('sdms.menu.CCTV 영상정보')}</a></li> {/*CCTV*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.대시보드)}>{i18n.t('sdms.menu.대시보드')}</a></li>       {/*CCTV*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.이벤트_정보)}>{i18n.t('sdms.menu.이벤트 정보')}</a></li>  {/*이벤트 정보*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.미니맵)}>{i18n.t('sdms.menu.미니맵')}</a></li>          {/*미니맵*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.편집모드)}>{i18n.t('sdms.menu.편집모드')}</a></li>       {/*편집모드*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.수동신고)}>{i18n.t('sdms.menu.수동신고')}</a></li>       {/*수동신고*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.기상정보)}>{i18n.t('sdms.menu.기상정보')}</a></li>       {/*기상정보*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.센서현황)}>{i18n.t('sdms.menu.센서현황')}</a></li>       {/*센서현황*/}
                                <li><a onClick={() => this.onClickMenu(SDMSResource.menu.인원현황)}>{i18n.t('sdms.menu.인원현황')}</a></li>       {/*인원현황*/}
                            </>
                    }
                </ul>
            </div>
        );
    }
}

export default withTranslation()(SDMSMenuBtn);