import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';

import * as ExcelJS from 'exceljs'; /* 엑셀 만들기 */
import { saveAs } from 'file-saver'; /* 엑셀 다운로드 */
import SopController from '../../../SOPManager/services/sopController';
import HistoryController from '../../../History/services/historyController';

class EndPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
			sopRunData: this.props.sopRunData,
			endTime: null,
			selectUserName: null,
        }

		this.props = props;

		this.props.setEndPopupState(true);
    }

	componentDidMount() {

        //this.timerHandle = setTimeout(() => {
        //    this.onClose();
        //}, 100000);
		this.setEndTime();
	}

	setEndTime = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const date = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');

		const dt = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

		this.setState({ endTime: dt });

		return;
	}

    onClose = () => {
        //if (this.timerHandle) {
        //    clearTimeout(this.timerHandle);
        //}
		const history = this.props.sopRunData.sopData.currentActionStep._ActionStepHistory;
        this.props.closeSOP(null, history.id, history.endTime, this.props.loginUser.id);
        this.props.changeContent('');
    }

	onClickClose = () => {

		this.props.setEndPopupState(false);
		this.props.changeContent('');
        //this.onClose();
    }

    componentWillUnmount = () => {
        //if (this.timerHandle) {
        //    clearTimeout(this.timerHandle);
        //}
	}

	async getDataSource(sensorZoneHistoryID) {

		if (!sensorZoneHistoryID) {
			sensorZoneHistoryID = 0;
		}

		const dataSource = await HistoryController.DisplaySOPHistories2(sensorZoneHistoryID);
		
		return dataSource;
	}

	async onClickDownload(isCheckedDownload) {
		const title = 'SOP 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:J2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const sopRunData = this.state.sopRunData;
		
		if (sopRunData === null || sopRunData === undefined) {
			return;
		}

		const sopData = sopRunData.sopData;
		const currentActionStep = sopRunData.sopData.currentActionStep;

		const disaster = sopData.disaster;

		// Sop 실행시간 , 종료시간
		let beginDt = this.state.sopRunData.sopData.currentActionStep._ActionStepHistory.beginTime.replace('T', ' ');
		let endDt = this.state.endTime;

		let realMode = '테스트';

		if (currentActionStep._ActionStepHistory.realMode) {
			realMode = '상황발생';
		}

		// 조회기간은 종료된 당일로 한다.
		worksheet.addRow(['조회기간 : ' + endDt + ' ~ ' + endDt]);
		worksheet.addRow(['재난타입 : ' + disaster.disasterName]);
		worksheet.addRow(['위기경보단계 : ' + currentActionStep.stepName]);
		worksheet.addRow(['모드 : ' + realMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', 'SOP유형', 'SOP이름', '위기경보 단계', 'SOP모드', '센서명', '위치', '시작 시간', '종료 시간', '이름']);
		columnRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '#A24B40' }
			};
			cell.style = {
				alignment: { vertical: 'middle', horizontal: 'center' }
			};
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}

		});

		// column key 설정 
		worksheet.columns = [
			{ key: "no", width: 5 },
			{ key: "disasterName", width: 20 },
			{ key: "sopName", width: 15 },
			{ key: "actionStepName", width: 15 },
			{ key: "realMode", width: 15 },
			{ key: "sensorName", width: 30 },
			{ key: "position", width: 25 },
			{ key: "beginTime", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "userName", width: 15 }
		];

		let sensorZoneHistoryID = this.state.sopRunData.sensorZoneHistoryID;	

		const dataSource = await this.getDataSource(sensorZoneHistoryID);


		

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = dataSource[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const disasterName = dataSource[i].disasterName;
				const sopName = dataSource[i].sopName;
				const actionStepName = dataSource[i].actionStepName;
				const realMode = dataSource[i].realMode;
				const sensorName = dataSource[i].sensorName;
				const position = dataSource[i].position;
				const beginTime = dataSource[i].beginTime;
				const endTime = dataSource[i].endTime;
				const userName = dataSource[i].userName;

				data.no = no;
				data.disasterName = disasterName;
				data.sopName = sopName;
				data.actionStepName = actionStepName;
				data.realMode = realMode;
				data.sensorName = (!sensorName || sensorName.length === 0) ? '-' : sensorName;
				data.position = position;
				data.beginTime = beginTime;
				data.endTime = endTime;
				data.userName = userName;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					disasterName: item.disasterName,
					sopName: item.sopName,
					actionStepName: item.actionStepName,
					realMode: item.realMode,
					sensorName: item.sensorName,
					position: item.position,
					beginTime: item.beginTime,
					endTime: item.endTime,
					userName: item.userName
				}).alignment = { vertical: 'middle', horizontal: 'center' };
			})
		}

		// 다운로드 
		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
		const time = this.getMakeTime(dtNow).replace(/:/gi, '');

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");

		/*this.onClickClose();*/
	}

	getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();                   //d
		day = day >= 10 ? day : '0' + day;

		let strDate = year + '-' + month + '-' + day;
		return strDate;
	}

	getMakeTime(dateTime) {
		let hour = dateTime.getHours();
		hour = hour >= 10 ? hour : '0' + hour;
		let min = dateTime.getMinutes();
		min = min >= 10 ? min : '0' + min;
		let sec = dateTime.getSeconds();
		sec = sec >= 10 ? sec : '0' + sec;

		let strDate = hour + ':' + min + ':' + sec;
		return strDate;
	}

    render() {
        const sopRunData = this.state.sopRunData;
        const detectTime = sopRunData.sopData.currentActionStep?._ActionStepHistory?.detectTime.replace('T', ' ') ? sopRunData.sopData.currentActionStep?._ActionStepHistory?.detectTime.replace('T', ' ') : '';
        const beginTime = sopRunData.sopData.currentActionStep?._ActionStepHistory?.beginTime.replace('T', ' ') ? sopRunData.sopData.currentActionStep?._ActionStepHistory?.beginTime.replace('T', ' ') : '';
        /*const endTime = sopRunData.sopData.currentActionStep._ActionStepHistory.endTime.replace('T', ' ');*/
		let endTime = null;

        if (sopRunData.sopData.currentActionStep.ActionStepHistory !== null && sopRunData.sopData.currentActionStep.ActionStepHistory !== undefined) {
            endTime = sopRunData.sopData.currentActionStep.ActionStepHistory.endTime.replace('T', ' ');
		}

		if (endTime === null || endTime === undefined) {
			endTime = this.state.endTime;
		}

        return (
            <div className={uneStyles.endBox}>
                <div className={uneStyles.endBoxTop}>
                    <p><p className={uis.leftBorder}>SOP 결과 요약</p></p>
                    {/* <a onClick={() => this.onClickClose()}>닫기</a> */}
                </div>
                <div className={uneStyles.endBoxCont}>
                    {/*<dl>*/}
                    {/*    <dt>1.SOP 유형 :</dt>*/}
                    {/*    <dd>기상특보*/}{/* -{sopRunData.sopData.disaster.disasterName} */}{/*</dd>*/}
                    {/*</dl>*/}
                    {/*<dl>*/}
                    {/*    <dt>2.재난 위치 :</dt>*/}
                    {/*    <dd>여수소방서 화학119구조대 옥상*/}{/* -{sopRunData.position} */}{/*</dd>*/}
                    {/*</dl>*/}
                    {/*<dl>*/}
                    {/*    <dt>3.발생시간 :</dt>*/}
                    {/*    <dd>2023-01-09 17:18:11*/}{/* -{detectTime} */}{/*</dd>*/}
                    {/*</dl>*/}
                    {/*<dl>*/}
                    {/*    <dt>4.SOP 시작시간 :</dt>*/}
                    {/*    <dd>2023-07-09 17:18:11*/}{/* -{beginTime} */}{/*</dd>*/}
                    {/*</dl>*/}
                    {/*<dl>*/}
                    {/*    <dt>5.SOP 종료시간 :</dt>*/}
                    {/*    <dd>2023-07-09 17:18:13*/}{/* -{endTime} */}{/*</dd>*/}
                    {/*</dl>*/}
                    {/*<dl>*/}
                    {/*    <dt>6.단계 :</dt>*/}
                    {/*    <dd>심각*/}{/* -{sopRunData.sopData.currentActionStep.stepName} */}{/*</dd>*/}
                    {/*</dl>*/}

                    <dl>
                        <dt>1.SOP 유형 :</dt>
                        <dd> -{sopRunData.sopData.disaster.disasterName}</dd>
                    </dl>
                    <dl>
                        <dt>2.재난 위치 :</dt>
                        <dd> -{sopRunData.position} </dd>
                    </dl>
                    <dl>
                        <dt>3.발생시간 :</dt>
                        <dd> -{detectTime}</dd>
                    </dl>
                    <dl>
                        <dt>4.SOP 시작시간 :</dt>
                        <dd> -{beginTime}</dd>
                    </dl>
                    <dl>
                        <dt>5.SOP 종료시간 :</dt>
                        <dd> -{endTime}</dd>
                    </dl>
                    <dl>
                        <dt>6.단계 :</dt>
                        <dd> -{sopRunData.sopData.currentActionStep.stepName}</dd>
                    </dl>

                </div>
                <div className={uneStyles.endBoxBtn}>
                    <a className={uneStyles.endBoxDownload} onClick={() => this.onClickDownload()}>다운로드</a>
                    <a className={uneStyles.endBoxClose} onClick={() => this.onClickClose()}>닫기</a>
                    {/*<a className={uneStyles.endBoxDetail}>상세보기</a>*/}
                </div>
            </div>
        );
    }
}

export default EndPopup;