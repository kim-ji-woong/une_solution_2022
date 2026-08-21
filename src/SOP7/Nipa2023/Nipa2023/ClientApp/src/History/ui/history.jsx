import React, { Component } from 'react';

import { HistoryComponent } from '../styled/historyStyled';

import ProjectResource from '../../Root/resource/id';
import HistoryResource from '../resource/id';

import { SdmsController } from '../../SDMS/services/sdmsController';

import SensorDetectHistory from './sensorDetectHistory';
import SensorDetectAnalysis from './sensorDetectAnalysis';
import SOPHistory from './SOPHistory';
import SdmsResource from '../../SDMS/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import { SopHistoryController } from '../../SOPSimulator/services/sopHistoryController';

class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content: HistoryResource.ID.menu.sensorDetectHistory,
            sensorType: SdmsResource.ID.sensor,
            buildingGroupList: [],

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

        this.initDatas();
        this.initSOPDatas();
    }

    async initDatas() {
        const campusID = ProjectResource.campusID;

        if (campusID) {
            const [sensorList, errorMessage] = await SdmsController.requestSensorList(campusID);

            if (sensorList) {
                const [buildingGroupList, outdoorZones, errorMessage2] = await SdmsController.requestBuildingGroupList(campusID);

                if (buildingGroupList) {
                    this.setState({ buildingGroupList: buildingGroupList[0], outdoorZones, sensorList });
                }
                else {
                    console.log(errorMessage2);
                }
            }
            else {
                console.log(errorMessage);
            }
        }

        this.setState({ campusID: campusID });
    }

    async initSOPDatas() {
        const campusID = ProjectResource.campusID;

        if (campusID) {
            const [sopSubDisasterCategory, sopDisasterMessage] = await SopHistoryController.requestSopSubDisasterCategoryList(campusID);
            //const [sopDisasterCategory, sopDisasterMessage] = await SopHistoryController.requestSopDisasterCategoryList(campusID);

            if (sopSubDisasterCategory) {
                
                const [actionStepName, actionStepNameMessage] = await SopHistoryController.requestStandardActionStepNameList();

                if (actionStepName) {
                    this.setState({ sopSubDisasterCategory, actionStepName })
                    //this.setState({ sopDisasterCategory, actionStepName })
                }
                else {
                    console.log(actionStepNameMessage);
                }
            }
            else {
                console.log(sopDisasterMessage);
            }
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    changeContent = (content) => {
        this.setState({ content });
    }

    getMenuUI() {
        let menu = [];

        if (this.state.content === HistoryResource.ID.menu.sensorDetectHistory) {
            menu.push(
                <SensorDetectHistory 
                    key='history_SensorDetectHistory' 
                    changeContent={this.changeContent}
                    buildingGroupList={this.state.buildingGroupList}
                    outdoorZones={this.state.outdoorZones}
                    sensorType={this.state.sensorType}
                    showConfirmDialog={this.showConfirmDialog}
                />
            );
        }
        else if (this.state.content === HistoryResource.ID.menu.sensorDetectAnalysis) {
            menu.push(
                <SensorDetectAnalysis 
                    key='history_SensorDetectAnalysis' 
                    changeContent={this.changeContent} 
                    buildingGroupList={this.state.buildingGroupList}
                    outdoorZones={this.state.outdoorZones}
                    sensorType={this.state.sensorType}
                    showConfirmDialog={this.showConfirmDialog}
                />
            );
        }
        else if (this.state.content === HistoryResource.ID.menu.sopHistory) {
            menu.push(
                <SOPHistory 
                    key='history_SOPHistory' 
                    changeContent={this.changeContent} 
                    sopSubDisasterCategory={this.state.sopSubDisasterCategory}
                    //sopDisasterCategory={this.state.sopDisasterCategory}
                    actionStepName={this.state.actionStepName}
                    showConfirmDialog={this.showConfirmDialog}
                />
            );
        }

        return menu;
    }

    render() {
        const menuUI = this.getMenuUI();

        return (
            <>
            <HistoryComponent className='UI_Section'>
                {menuUI}
            </HistoryComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            </>
        );
    }
}

export default History;