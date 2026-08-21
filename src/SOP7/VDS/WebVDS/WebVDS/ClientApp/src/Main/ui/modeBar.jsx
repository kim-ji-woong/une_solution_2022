import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import ProjectResource from '../../Root/resource/id';
import Main from './main';
//import SDMSResource from '../../SDMS/resource/id'
import CommonResource from '../../Common/resource/id';


class ModeBar extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    getViewModeText() {
        if (this.props.modeFPS) {
            return ProjectResource.ID.quickButton.modeFps;
        }

        return ProjectResource.ID.quickButton.modeBird;
    }

    toggleVisible(item) {
        this.props.setVisiblePopups(item, !this.props.getVisiblePopups(item));
    }

    getOnOffClassName(visible) {
        if (visible) {
            return main.on;
        }

        return "";
    }

    render() {
        const visibleInventory = this.props.getVisiblePopups(Main.popupLayer.inventory);
        const visibleChangeDisorder = this.props.getVisiblePopups(Main.popupLayer.changeDisorder);
        const visibleModelComparison = this.props.getVisiblePopups(Main.popupLayer.modelComparison);
        const visibleMinimap = this.props.getVisiblePopups(Main.popupLayer.miniMap);

        return (
            <>
                <div id={main.vdsModebar} className={CommonResource.UISection}>
                    <button onClick={this.popupBtm}></button>
                    <ul ref={this.refQuickButton}>
                        <li><a onClick={() => {this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info)}}></a></li>
                        <li><a className={this.getOnOffClassName(visibleInventory)} onClick={() => { this.toggleVisible(Main.popupLayer.inventory) }}></a></li>
                        <li><a className={this.getOnOffClassName(visibleChangeDisorder)} onClick={() => { this.toggleVisible(Main.popupLayer.changeDisorder) }}></a></li>
                        <li><span className={main.modeChange} onClick={() => this.props.changeModeFps(!this.props.modeFPS)}>{this.getViewModeText()}</span></li>
                        <li><a className={this.getOnOffClassName(visibleModelComparison)} onClick={() => { this.toggleVisible(Main.popupLayer.modelComparison) }}></a></li>
                        <li><a className={this.getOnOffClassName(visibleMinimap)} onClick={() => { this.toggleVisible(Main.popupLayer.miniMap) }}></a></li>
                        <li><a onClick={() => {this.props.onClickEditMode()}}></a></li>
                    </ul>
                </div>
            </>
        );
    }
}

export default ModeBar;