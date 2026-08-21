import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import miniMapImg from '../../images/miniMap_backImg.svg';
import position from '../../images/position_icon.svg';
import alarm from '../../images/alarm_icon.svg';

class MiniMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
        }
    }

    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }

    render() {
        let opacity = this.state.opacity;
        let showPosition = true;
        let showAlarm = true;

        return (
            <MiniMapComponent id={this.props.popupType} className='UI_Section miniMap' $opacity={opacity} $resize={false} $showPosition={showPosition} $showAlarm={showAlarm}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={254}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.miniMap}
                        </h5>
                        <input
                            type="range"
                            className="rangeInput"
                            min={0.1}
                            max={1}
                            color="gray"
                            step={0.1}
                            defaultValue={opacity}
                            onChange={(e) => {this.changePopupOpacity(e.target.valueAsNumber)}}
                        />
                        <button className='dslX'>닫기</button>
                    </div>

                    <div className={'content'}>
                        <div>
                            <img src={miniMapImg} alt='미니맵 이미지' className='miniMode'/>
                            <img src={position} 
                                alt='포지션 아이콘' 
                                className='position' 
                                style={{ top: '70px', left: '110px' }}
                            />
                            <img src={alarm} 
                                alt='알람 아이콘' 
                                className='alarm'
                                style={{ top: '100px', left: '120px' }}
                            />
                        </div>
                    </div>
                </PopupDraggable>
            </MiniMapComponent>
        );
    }
}

export default MiniMap;