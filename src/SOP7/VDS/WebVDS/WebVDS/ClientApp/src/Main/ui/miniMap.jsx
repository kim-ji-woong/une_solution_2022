import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';

//import SettingsStore from '../../Settings/settingsStore';
import PopupDraggable from './popupDraggable';



class MiniMap extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        }


        /* SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this)); */

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            //console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        //this.setScrollbar();
    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName(main.miniPopup)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.statusInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {
            this.search();
        }
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    render() {
        return (
            <>
                <div id={this.props.popupType} className={main.miniPopup}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={493}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                    <div className={main.miniMapBox}>
                    <span className={main.miniTitle}><span className={main.miniIcon}></span><p>미니맵</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>
                      <span className={main.miniMapImage}></span>
                    </div>

                    </PopupDraggable>

                </div>
            </>
        );
    }
}

export default MiniMap;