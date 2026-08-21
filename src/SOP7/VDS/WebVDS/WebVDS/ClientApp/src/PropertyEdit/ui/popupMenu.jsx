import React, { Component } from 'react';
import edit from '../../PropertyEdit/css/edit.module.css';
import $ from 'jquery';
import wsProcessManager from '../../Root/services/wsProcessManager';
import ProjectResource from '../../Root/resource/id';

class PopupMenu extends Component {
    static menu = {
        none: 0,
        selectRack: 1,
        selectRackNEdit: 2,
        selectRacks: 3,
        createNewRack: 4,
        mount: 5,
        moveNunmount: 6,
        inputGroupName: 7,
        selectFacilities: 8,
        selectSensors: 9,
        selectSensorNEdit: 10
    }

    static action = {
        none: 0,
        moveRack: 1,
        rotateRack: 2,
        repeatGridRack: 3,
        editITProperty: 4,
        mount: 5,
        unmount: 6,
        setRackName: 7,
        setRackNameCheck: 8,
        moveRacks: 9,
        makeRackGroup: 10,
        moveRackItem: 11,
        updateRackItem: 12,
        deleteRacks: 13,
        moveFacilites: 14,
        rotateFacilities: 15,
        deleteFacilities: 16,
        moveSensors: 17,
        deleteSensors: 18,
        setSensorName: 19
    }

    static bodyID = "popupMenu_body";

    constructor(props) {
        super(props);

        this.state = {
            ownMenu: null,
            ownParameter: []
        }

        this.x = null;
        this.y = null;
        this.parameter = [];
        this.editedText = "";

        this.refBody = React.createRef();
        this.refText = React.createRef();
    }

    componentDidMount() {
        this.setPosition();

        const _this = this;

        document.addEventListener('mouseup', this.onMouseUp);
        /*$(document).mouseup(function (e) {
            if (e.target.id !== PopupMenu.bodyID &&
                e.target.parentElement.id !== PopupMenu.bodyID &&
                e.target.parentElement.parentElement.id !== PopupMenu.bodyID) {
                _this.onClose();
            }
        });*/
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);

        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    componentDidUpdate() {
        this.setPosition();
    }

    onMouseUp = (e) => {
        if (e.target.id !== PopupMenu.bodyID &&
            e.target.parentElement.id !== PopupMenu.bodyID &&
            e.target.parentElement.parentElement.id !== PopupMenu.bodyID) {
            this.onClose();
        }
    }

    setPosition() {
        if (this.refBody.current) {
            this.refBody.current.style.top = this.y + "px";
            this.refBody.current.style.left = this.x + "px";
        }
    }

    onMount() {
        this.props.onAction(PopupMenu.action.mount, this.parameter);
    }

    onUnmount() {
        if (this.parameter && this.parameter.length > 0) {
            const item = this.parameter[0];
            const editDataManager = this.props?.edit?.editDataManager;

            if (editDataManager) {
                editDataManager.removeRackItem(item.rack, item);
                this.props.onAction(PopupMenu.action.none, null);
            }
        }
    }

    onMoveRackItem(rackItem) {
        this.props.onAction(PopupMenu.action.moveRackItem, rackItem);
    }

    onMakeRackGroup(rackIDs) {
        if (!wsProcessManager.checkMakeRackGroup(rackIDs, this.props.edit)) {
            this.props.onAction(PopupMenu.action.none, null);
            this.props.alertMessage(ProjectResource.ID.errorMessage.failMakeRackGroup);
            return;
        }

        if (this.refText.current) {
            this.refText.current.value = "";
        }

        this.setState({ ownMenu: PopupMenu.menu.inputGroupName, ownParameter: rackIDs });
    }

    onMoveSensors(sensorIDs) {
        this.props.onAction(PopupMenu.action.moveSensors, sensorIDs);
    }

    onDeleteSensors(sensorIDs) {
        this.props.onAction(PopupMenu.action.deleteSensors, sensorIDs);
    }

    onMoveFacilities(facilityIDs) {
        this.props.onAction(PopupMenu.action.moveFacilites, facilityIDs);
    }

    onRotateFacilities(facilityIDs) {
        this.props.onAction(PopupMenu.action.rotateFacilities, facilityIDs);
    }

    onDeleteFacilities(facilityIDs) {
        this.props.onAction(PopupMenu.action.deleteFacilities, facilityIDs);
    }

    onMoveRacks(rackIDs) {
        this.props.onAction(PopupMenu.action.moveRacks, rackIDs);
    }

    onMove() {
        this.props.onAction(PopupMenu.action.moveRack, this.parameter);
    }

    onRotate() {
        this.props.onAction(PopupMenu.action.rotateRack, this.parameter);
    }

    onDelete() {
        this.props.onAction(PopupMenu.action.deleteRacks, this.parameter);
    }

    onRotateRacks(rackIDs) {
        this.props.onAction(PopupMenu.action.rotateRack, rackIDs);
    }

    onDeleteRacks(rackIDs) {
        this.props.onAction(PopupMenu.action.deleteRacks, rackIDs);
    }

    onRepeatGrid() {
        this.props.onAction(PopupMenu.action.repeatGridRack, this.parameter);
    }

    onEditITProperty() {
        this.props.onAction(PopupMenu.action.editITProperty, this.parameter);
    }

    onKeyupHostName(e) {
        if (e.keyCode === 13) {
            // Enter Key
            const text = this.refText.current.value.trim();

            if (text.length === 0) {
                this.props.onAction(PopupMenu.action.none, null);
            }
            else {
                if (this.parameter.length >= 2) {
                    for (let i = this.parameter.length - 1; i >= 1; i--) {
                        this.parameter.splice(i, 1);
                    }
                }

                this.parameter.push(text);

                if (this.props.parameter.length >= 3) {
                    const params = [...this.props.parameter];
                    const id = params[params.length - 1].id;

                    if (id === 0 || id) {
                        params[params.length - 1] = id;
                    }
                    //params[params.length - 1] = params[params.length - 1].id;

                    this.props.onAction(PopupMenu.action.setRackName, this.parameter, false);
                    this.setState({ ownMenu: PopupMenu.menu.selectRack, ownParameter: params });
                }
            }
        }
        else if (e.keyCode === 27) {
            // ESC Key
            this.onClose();
        }
        else {
            this.editedText = this.refText.current.value.trim();
        }
    }

    onKeyupGroupName(e) {
        if (e.keyCode === 13) {
            // Enter Key
            const text = this.refText.current.value.trim();

            if (text.length === 0) {
                this.props.onAction(PopupMenu.action.makeRackGroup, this.parameter);
            }
            else {
                if (this.parameter.length >= 2) {
                    this.parameter[0] = text;
                    this.props.onAction(PopupMenu.action.makeRackGroup, this.parameter);
                }
            }
        }
        else if (e.keyCode === 27) {
            // ESC Key
            this.onClose();
        }
        else {
            this.editedText = this.refText.current.value.trim();
        }
    }

    onKeyupHostSensorName(e) {
        if (e.keyCode === 13) {
            // Enter Key
            const text = this.refText.current.value.trim();

            if (text.length === 0) {
                this.props.onAction(PopupMenu.action.none, null);
            }
            else {
                if (this.parameter.length >= 2) {
                    for (let i = this.parameter.length - 1; i >= 1; i--) {
                        this.parameter.splice(i, 1);
                    }
                }

                if (this.props.parameter.length >= 3) {
                    const params = [...this.props.parameter];
                    const id = parseInt(params[params.length - 1][0]);

                    this.parameter = [id, text];

                    this.props.onAction(PopupMenu.action.setSensorName, this.parameter, false);
                    this.setState({ ownMenu: PopupMenu.menu.selectSensors, ownParameter: params });
                }
            }
        }
        else if (e.keyCode === 27) {
            // ESC Key
            this.onClose();
        }
        else {
            this.editedText = this.refText.current.value.trim();
        }
    }

    onClickRackName(e, parameter) {
        if (e.detail === 2) {
            // onDoubleClick
            this.setState({ ownMenu: PopupMenu.menu.selectRackNEdit, ownParameter: parameter });
        }
    }

    onClickSensorName(e, parameter) {
        if (e.detail === 2) {
            // onDoubleClick
            this.setState({ ownMenu: PopupMenu.menu.selectSensorNEdit, ownParameter: parameter });
        }
    }

    getMenuElement() {
        if (this.state.ownMenu === PopupMenu.menu.selectRackNEdit) {
            if (this.state.ownParameter.length  >= 3) {
                this.x = this.state.ownParameter[0];
                this.y = this.state.ownParameter[1];
                const rackID = this.state.ownParameter[2];

                const rack = this.props.racks[rackID];

                if (!rack) {
                    return;
                }

                this.parameter = [rackID];

                return (
                    <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox2}>
                        <span className={edit.rackInputBox}><input ref={this.refText} type="text" placeholder="HOST명을 작성해주세요." defaultValue={rack.name} onKeyUp={(e) => this.onKeyupHostName(e)} /></span>
                        <span className={edit.moveBox} onClick={() => this.onMove()}>이동</span>
                        <span className={edit.rotateBox} onClick={() => this.onRotate()}>회전</span>
                        <span className={edit.rotateBox} onClick={() => this.onMakeRackGroup(this.parameter)}>그룹 만들기</span>
                        <span className={edit.repetitionGrid} onClick={() => this.onRepeatGrid()}>반복 그리드</span>
                        <span className={edit.itPropertyEdit} onClick={() => this.onEditITProperty()}>랙 인벤토리 정보 편집</span>
                    </div>
                );
            }
        }
        else if (this.state.ownMenu === PopupMenu.menu.selectRack) {
            return this.getMenuSelectRack(this.state.ownParameter);
        }
        else if (this.state.ownMenu === PopupMenu.menu.inputGroupName) {
            if (this.state.ownParameter.length >= 1) {
                const rackIDs = this.state.ownParameter;

                // 첫번째 요소는 RackGroupName
                const parameter = [""];

                for (const rackID of rackIDs) {
                    parameter.push(rackID);
                }

                this.parameter = parameter;

                return (
                    <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox3}>
                        <span className={edit.rackInputBox}><input ref={this.refText} type="text" placeholder="그룹명을 작성해주세요." onKeyUp={(e) => this.onKeyupGroupName(e)} /></span>
                    </div>
                );
            }
        }
        else if (this.state.ownMenu === PopupMenu.menu.selectSensorNEdit) {
            if (this.state.ownParameter.length >= 3) {
                this.x = this.state.ownParameter[0];
                this.y = this.state.ownParameter[1];
                const sensorID = this.state.ownParameter[2];

                const sensor = this.props.edit.sensors[sensorID];

                if (!sensor) {
                    return;
                }

                this.parameter = [sensorID];

                return (
                    <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackSensorBox}>
                        <span className={edit.rackInputBox}><input ref={this.refText} type="text" placeholder="HOST명을 작성해주세요." defaultValue={sensor.name} onKeyUp={(e) => this.onKeyupHostSensorName(e)} /></span>
                        <span className={edit.moveText} onClick={() => this.onMoveSensors(this.parameter)}>이동</span>
                        <span className={edit.moveText} onClick={() => this.onDeleteSensors(this.parameter)}>삭제</span>
                    </div>
                );
            }
        }

        //const parameterCount = this.props.parameter && this.props.parameter.length > 0 ? this.props.parameter.length : 0;

        if (this.props.menu === PopupMenu.menu.selectRack) {
            return this.getMenuSelectRack(this.props.parameter);
            /*let rackID = null;
            let rackName = "";

            if (parameterCount >= 3) {
                this.x = this.props.parameter[0];
                this.y = this.props.parameter[1];
                rackID = this.props.parameter[2];

                const rack = this.props.racks[rackID];

                if (!rack) {
                    return;
                }

                rackName = rack.name;
                this.parameter = [rackID];
            }

            return (
                <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox}>
                    <span className={edit.rackName} onClick={(e) => this.onClickRackName(e)}>{rackName}</span>
                    <span className={edit.moveBox} onClick={() => this.onMove()}>이동</span>
                    <span className={edit.rotateBox} onClick={() => this.onRotate()}>회전</span>
                    <span className={edit.repetitionGrid} onClick={() => this.onRepeatGrid()}>반복 그리드</span>
                    <span className={edit.itPropertyEdit} onClick={() => this.onEditITProperty()}>랙 인벤토리 정보 편집</span>
                </div>
            );*/
        }
        else if (this.props.menu === PopupMenu.menu.selectRacks) {
            return this.getMenuSelectRacks(this.props.parameter);
            /*let rackIDs = null;

            if (parameterCount >= 3) {
                this.x = this.props.parameter[0];
                this.y = this.props.parameter[1];
                rackIDs = this.props.parameter[2];
            }

            if (!rackIDs || rackIDs.length === 0) {
                return <></>
            }

            return (
                <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.groupBox}>
                    <span className={edit.moveText} onClick={() => this.onMoveRacks(rackIDs)}>이동</span>
                    <span className={edit.groupText} onClick={() => this.onMakeRackGroup(rackIDs)}>그룹</span>
                </div>
                );*/
        }
        else if (this.props.menu === PopupMenu.menu.createNewRack) {
            return this.getMenuCreateNewRack(this.props.parameter);
            /*if (parameterCount >= 3) {
                this.x = this.props.parameter[0];
                this.y = this.props.parameter[1];

                const rack = this.props.parameter[2];
                this.parameter = [rack.id];

                return (
                    <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox2}>
                        <span className={edit.rackInputBox}><input ref={this.refText} type="text" placeholder="HOST명을 작성해주세요." onKeyUp={(e) => this.onKeyupHostName(e)} /></span>
                        <span className={edit.moveBox} onClick={() => this.onMove()}>이동</span>
                        <span className={edit.rotateBox} onClick={() => this.onRotate()}>회전</span>
                        <span className={edit.repetitionGrid} onClick={() => this.onRepeatGrid()}>반복 그리드</span>
                        <span className={edit.itPropertyEdit} onClick={() => this.onEditITProperty()}>랙 인벤토리 정보 편집</span>
                    </div>
                    );
            }*/
        }
        else if (this.props.menu === PopupMenu.menu.mount) {
            return this.getMenuMount(this.props.parameter);
            /*if (parameterCount >= 2) {
                this.x = this.props.parameter[0];
                this.y = this.props.parameter[1];

                this.parameter = [];

                for (let i = 2; i < parameterCount; i++) {
                    this.parameter.push(this.props.parameter[i]);
                }
            }

            return (
                <div id={PopupMenu.bodyID} className={edit.mountBox}>
                    <span className={edit.mountText} onClick={() => this.onMount()}>mount</span>
                </div>
            );*/
        }
        else if (this.props.menu === PopupMenu.menu.moveNunmount) {
            return this.getMenuUnmount(this.props.parameter);
        }
        else if (this.props.menu === PopupMenu.menu.selectFacilities) {
            return this.getMenuSelectFacilities(this.props.parameter);
        }
        else if (this.props.menu === PopupMenu.menu.selectSensors) {
            return this.getMenuSelectSensors(this.props.parameter);
        }

        return <></>;
    }

    getMenuUnmount(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;
        let rackItem = null;

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];
            rackItem = parameter[2];
            
            this.parameter = [];

            for (let i = 2; i < parameterCount; i++) {
                this.parameter.push(parameter[i]);
            }
        }

        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.groupBox}>
                <span className={edit.moveText} onClick={() => this.onMoveRackItem(rackItem)}>이동</span>
                <span className={edit.groupText} onClick={() => this.onUnmount()}>Unmount</span>
            </div>
        );
    }

    getMenuMount(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        if (parameterCount >= 2) {
            this.x = parameter[0];
            this.y = parameter[1];

            this.parameter = [];

            for (let i = 2; i < parameterCount; i++) {
                this.parameter.push(parameter[i]);
            }
        }

        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.mountBox}>
                <span className={edit.mountText} onClick={() => this.onMount()}>Mount</span>
            </div>
        );
    }

    getMenuCreateNewRack(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];

            const rack = parameter[2];
            this.parameter = [rack.id];

            return (
                <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox2}>
                    <span className={edit.rackInputBox}><input ref={this.refText} type="text" placeholder="HOST명을 작성해주세요." onKeyUp={(e) => this.onKeyupHostName(e)} /></span>
                    <span className={edit.moveBox} onClick={() => this.onMove()}>이동</span>
                    <span className={edit.rotateBox} onClick={() => this.onRotate()}>회전</span>
                    <span className={edit.repetitionGrid} onClick={() => this.onRepeatGrid()}>반복 그리드</span>
                    {
                        this.props.isEditMode &&
                        <span className={edit.itPropertyEdit} onClick={() => this.onEditITProperty()}>랙 인벤토리 정보 편집</span>
                    }
                </div>
            );
        }

        return <></>
    }

    getMenuSelectSensors(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        let sensorIDs = null;

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];
            sensorIDs = parameter[2];
        }

        if (!sensorIDs || sensorIDs.length === 0) {
            return <></>
        }

        if (sensorIDs.length > 1) {
            return (
                <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackSensorBox}>
                    <span className={edit.moveText} onClick={() => this.onMoveSensors(sensorIDs)}>이동</span>
                    <span className={edit.moveText} onClick={() => this.onDeleteSensors(sensorIDs)}>삭제</span>
                </div>
            );
        }

        const sensor = this.props.edit.sensors[sensorIDs[0]];

        if (!sensor) {
            return <></>
        }


        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackSensorBox}>
                <span className={edit.sensorName} onClick={(e) => this.onClickSensorName(e, [...parameter])}>{sensor.name}</span>
                <span className={edit.moveText} onClick={() => this.onMoveSensors(sensorIDs)}>이동</span>
                <span className={edit.moveText} onClick={() => this.onDeleteSensors(sensorIDs)}>삭제</span>
            </div>
        );
    }

    getMenuSelectFacilities(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        let facilityIDs = null;

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];
            facilityIDs = parameter[2];
        }

        if (!facilityIDs || facilityIDs.length === 0) {
            return <></>
        }

        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.groupBox}>
                <span className={edit.moveText} onClick={() => this.onMoveFacilities(facilityIDs)}>이동</span>
                <span className={edit.moveText} onClick={() => this.onRotateFacilities(facilityIDs)}>회전</span>
                <span className={edit.moveText} onClick={() => this.onDeleteFacilities(facilityIDs)}>삭제</span>
            </div>
        );
    }

    getMenuSelectRacks(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        let rackIDs = null;

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];
            rackIDs = parameter[2];
        }

        if (!rackIDs || rackIDs.length === 0) {
            return <></>
        }

        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.groupBox}>
                <span className={edit.moveText} onClick={() => this.onMoveRacks(rackIDs)}>이동</span>
                <span className={edit.moveText} onClick={() => this.onRotateRacks(rackIDs)}>회전</span>
                <span className={edit.moveText} onClick={() => this.onDeleteRacks(rackIDs)}>삭제</span>
                <span className={edit.groupText} onClick={() => this.onMakeRackGroup(rackIDs)}>그룹 만들기</span>
            </div>
        );
    }

    getMenuSelectRack(parameter) {
        const parameterCount = parameter && parameter.length > 0 ? parameter.length : 0;

        let rackID = null;
        let rackName = "";

        if (parameterCount >= 3) {
            this.x = parameter[0];
            this.y = parameter[1];
            rackID = parameter[2];

            const rack = this.props.racks[rackID];

            if (!rack) {
                return <></>;
            }

            rackName = rack.name;
            this.parameter = [rackID];
        }

        return (
            <div id={PopupMenu.bodyID} ref={this.refBody} className={edit.rackEditBox}>
                <span className={edit.rackName} onClick={(e) => this.onClickRackName(e, [...parameter])}>{rackName}</span>
                <span className={edit.moveBox} onClick={() => this.onMove()}>이동</span>
                <span className={edit.rotateBox} onClick={() => this.onRotate()}>회전</span>
                <span className={edit.rotateBox} onClick={() => this.onDelete()}>삭제</span>
                <span className={edit.rotateBox} onClick={() => this.onMakeRackGroup(this.parameter)}>그룹 만들기</span>
                <span className={edit.repetitionGrid} onClick={() => this.onRepeatGrid()}>반복 그리드</span>

                {
                    this.props.isEditMode &&
                    <span className={edit.itPropertyEdit} onClick={() => this.onEditITProperty()}>랙 인벤토리 정보 편집</span>
                }
            </div>
        );
    }

    /*onPrevCloseSelectRack() {
        if (!this.editedText || this.editedText.length === 0) {
            return;
        }

        if (this.parameter.length >= 2) {
            for (let i = this.parameter.length - 1; i >= 1; i--) {
                this.parameter.splice(i, 1);
            }
        }

        this.parameter.push(this.editedText);
        this.props.onAction(PopupMenu.action.setRackName, this.parameter);
    }

    onPrevCloseGroupName() {
        if (this.parameter.length < 2) {
            return;
        }

        if (this.editedText && this.editedText.length > 0) {
            this.parameter[0] = this.editedText;
        }

        this.props.onAction(PopupMenu.action.makeRackGroup, this.parameter);
    }*/

    onClose(/*update = true*/) {
        /*if (update) {
            if (this.state.ownMenu === PopupMenu.menu.selectRack) {
                this.onPrevCloseSelectRack();
            }
            else if (this.state.ownMenu === PopupMenu.menu.inputGroupName) {
                this.onPrevCloseGroupName();
            }
        }*/

        this.props.onAction(PopupMenu.action.none, null);
        this.setState({ ownMenu: null, ownParameter: [] });
    }

    render() {
        return (
            this.getMenuElement()
        )
    }
}
export default PopupMenu;