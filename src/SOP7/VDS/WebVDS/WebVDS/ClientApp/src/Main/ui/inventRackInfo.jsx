import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import ProjectResource from '../../Root/resource/id';
import PopupDraggable from './popupDraggable';


class ITVentRackInfo extends Component {
    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    getRackSize(rack) {
        if (rack.rackType?.height && rack.rackType?.width && rack.rackType?.depth) {
            const height = Math.round(rack.rackType.height / 10);
            const width = Math.round(rack.rackType.width / 10);
            const depth = Math.round(rack.rackType.depth / 10);

            return height + " x " + width + " x " + depth + "(cm)";
        }

        return "";
    }

    static getRegDate(rack) {
        if (rack.changeDate) {
            return ITVentRackInfo.getDate(rack.changeDate);
        }

        return ITVentRackInfo.getDate(rack.regDate);
    }

    static getDate(date) {
        if (!date) {
            return "-";
        }

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        return year + "." + month + "." + day;
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    render() {
        const rack = this.props.selected.rack;

        return (
            <>
                <div id={this.props.popupType} className={main.inventRackInfoPopup + " " + main.inventoryInfoBox}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={302}
                        popupMinHeight={263}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                    <div style={{ padding: '17px' }}>
                        <span className={main.inventInfoTitle}><p>{ProjectResource.ID.main.inventoryRackInfo}</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>
                        <div className={main.inventInfoContent}>
                            <span className={main.rackInfoTitle}>{rack.name}</span>
                            <div className={main.kind}><span>{ProjectResource.ID.main.inventoryRackInfoDetail.kind}</span><span>:</span><span>{rack.rackType.type}</span></div>
                            <div className={main.size}><span>{ProjectResource.ID.main.inventoryRackInfoDetail.size}</span><span>:</span><span>{this.getRackSize(rack)}</span></div>
                            <div className={main.unit}><span>{ProjectResource.ID.main.inventoryRackInfoDetail.unit}</span><span>:</span><span>{rack.rackType.unit}</span></div>
                            <div className={main.installation}><span>{ProjectResource.ID.main.inventoryRackInfoDetail.regDate}</span><span>:</span><span>{ITVentRackInfo.getRegDate(rack)}</span></div>
                        </div>
                    </div> 

                    </PopupDraggable>
                </div>
            </>
       );
    }

}

export default ITVentRackInfo;