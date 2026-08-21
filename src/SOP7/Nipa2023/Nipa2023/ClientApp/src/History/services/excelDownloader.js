import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

export class ExcelDownloader {
	static async downloadDetectSensor(sensorDetectHistoryDatas, beginDate, endDate, searchZoneName, sensorType, checkedOnly) {
        const title = '센서 탐지 이력';

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:K2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		worksheet.addRow(['센서유형 : ' + sensorType]);
		worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회범위 : ' + searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '종료일시', '유형', '센서명', '위치', '실제/테스트', '탐지 유형', '탐지 정보', '위험경보 단계', '대응 SOP']);
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
			{ key: "time", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "type", width: 15 },
			{ key: "sensorName", width: 25 },
			{ key: "zoneName", width: 30 },
			{ key: "realMode", width: 15 },
			{ key: "detectType", width: 15 },
			{ key: "detectInfo", width: 15 },
			{ key: "alarmLevel", width: 15 },
			{ key: "sopName", width: 40 }
		];

		/*const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
			, this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			-1, -1, true, this.props.selectedSiteID);*/

		if (sensorDetectHistoryDatas) {
			let arrDatas = [];
			const dataLength = sensorDetectHistoryDatas.length;
			let no = 0;

			for (let i = 0; i < dataLength; i++) {
				const data = [];

				if (checkedOnly && !sensorDetectHistoryDatas[i].checked) {
					continue;
                }

				no++;
				//const no = arrDatas.length + 1;
				const time = sensorDetectHistoryDatas[i].time;
				const endTime = sensorDetectHistoryDatas[i].endTime;
				const type = sensorDetectHistoryDatas[i].type;
				const sensorName = sensorDetectHistoryDatas[i].sensorName;
				const zoneName = sensorDetectHistoryDatas[i].zoneName;
				const realMode = sensorDetectHistoryDatas[i].realMode;
				const detectType = sensorDetectHistoryDatas[i].detectType;
				const detectInfo = sensorDetectHistoryDatas[i].detectInfo;
				const alarmLevel = sensorDetectHistoryDatas[i].alarmLevel;
				const sopName = sensorDetectHistoryDatas[i].sopName;

				data.no = no;
				data.time = time;
				data.endTime = endTime;
				data.type = type;
				data.sensorName = sensorName;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? '실제' : '테스트';
				data.detectType = detectType;
				data.detectInfo = detectInfo;
				data.alarmLevel = alarmLevel;
				data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					endTime: item.endTime,
					type: item.type,
					sensorName: item.sensorName,
					zoneName: item.zoneName,
					realMode: item.realMode,
					detectType: item.detectType,
					detectInfo: item.detectInfo,
					alarmLevel: item.alarmLevel,
					sopName: item.sopName
				}).alignment = { vertical: 'middle', horizontal: 'center' };
			})
		}

		// 다운로드 
		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = ExcelDownloader.getMakeDateTime(dtNow).replace(/-/gi, '');
		const time = ExcelDownloader.getMakeTime(dtNow).replace(/:/gi, '');

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
	}

	static async downloadDetectAnalysis(sensorDetectAnalysisDatas, beginDate, endDate, searchZoneName, sensorType, selectedDate, allDetectCount, allMalfunctionRate, maxCountSensorName, checkedOnly) {
		const title = '센서 탐지 분석';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:I2');
		worksheet.getCell('A1:I2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		worksheet.addRow(['센서유형 : ' + sensorType]);
		worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회범위 : ' + searchZoneName]);
		worksheet.addRow([]);
		
		let content = selectedDate + '동안 ';
		content += searchZoneName + '의 센서 탐지 횟수는' + allDetectCount + '회 이며 ';
		content += '오작동률은 ' + allMalfunctionRate + ' % 입니다.'
		let content2 = '가장 많은 오작동을 일으킨 센서는 ' + maxCountSensorName + '입니다.';

		worksheet.addRow([content]);
		worksheet.addRow([content2]);

		const chart = document.getElementById('chart_analysis2');

		if (chart) {
			let img = chart.toDataURL(1.0);
			let img2 = workbook.addImage({ base64: img, extension: 'png' });
			worksheet.addImage(img2, 'A9:I14');
		}

		// 빈칸 10칸 띄우기
        for (let i = 0; i < 10; i++) {
			worksheet.addRow([]);
        }		

		// column
		let columnRow = worksheet.addRow(['No', '유형', '위치', '센서명', '탐지횟수', '오작동', '현장복구', '자동복구', '오작동률(%)']);
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
			{ key: "type", width: 15 },
			{ key: "zoneName", width: 20 },
			{ key: "sensorName", width: 25 },
			{ key: "detectCount", width: 13 },
			{ key: "malfunctionCount", width: 13 },
			{ key: "endCount", width: 13 },
			{ key: "timeoutCount", width: 13 },
			{ key: "malfunctionRate", width: 13 }
		];

		if (sensorDetectAnalysisDatas) {
			let arrDatas = [];
			const dataLength = sensorDetectAnalysisDatas.length;
			let no = 0;

			for (let i = 0; i < dataLength; i++) {
				const data = [];

				if (checkedOnly && !sensorDetectAnalysisDatas[i].checked) {
					continue;
				}

				no++;
				const type = sensorDetectAnalysisDatas[i].type;
				const zoneName = sensorDetectAnalysisDatas[i].zoneName;
				const sensorName = sensorDetectAnalysisDatas[i].sensorName;
				const detectCount = sensorDetectAnalysisDatas[i].detectCount;
				const malfunctionCount = sensorDetectAnalysisDatas[i].malfunctionCount;
				const endCount = sensorDetectAnalysisDatas[i].endCount;
				const malfunctionRate = sensorDetectAnalysisDatas[i].malfunctionRate;
				const timeoutCount = sensorDetectAnalysisDatas[i].timeoutCount;

				data.no = no;
				data.type = type;
				data.zoneName = zoneName;
				data.sensorName = sensorName;
				data.detectCount = detectCount;
				data.malfunctionCount = malfunctionCount;
				data.endCount = endCount;
				data.timeoutCount = timeoutCount;
				data.malfunctionRate = malfunctionRate;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					type: item.type,
					zoneName: item.zoneName,
					sensorName: item.sensorName,
					detectCount: item.detectCount,
					malfunctionCount: item.malfunctionCount,
					endCount: item.endCount,
					timeoutCount: item.timeoutCount,
					malfunctionRate: item.malfunctionRate
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
	}

	static async downloadSOPHistory(soptHistoryDatas, beginDate, endDate, selectDisasterType, selectActionStep, checkedOnly) {
			const title = 'SOP 이력';
	
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(title); // sheet 이름
	
			// title		
			let titleRow = worksheet.getCell('A1');
			titleRow.value = title;
	
			titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
			worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
	
			worksheet.mergeCells('A1:I2');
			worksheet.getCell('A1:H2').border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}
	
			worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
			worksheet.addRow(['SOP유형 : ' + selectDisasterType]);
			worksheet.addRow(['SOP단계 : ' + selectActionStep]);
			worksheet.addRow([]);
	
			// column
			let columnRow = worksheet.addRow(['No', 'SOP유형', 'SOP이름', 'SOP단계', '센서명', '위치', '시작 시간', '종료 시간', '실행자']);
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
				{ key: "sensorName", width: 30 },
				{ key: "position", width: 25 },			
				{ key: "beginTime", width: 20 },
				{ key: "endTime", width: 20 },
				{ key: "userName", width: 15 }
			];
	
			if (soptHistoryDatas) {
				let arrDatas = [];
				const dataLength = soptHistoryDatas.length;
				let no = 0;
	
				for (let i = 0; i < dataLength; i++) {
					const data = [];
	
					if (checkedOnly && !soptHistoryDatas[i].checked) {
						continue;
					}
	
					no++;
					const disasterName = soptHistoryDatas[i].disasterName;
					const sopName = soptHistoryDatas[i].sopName;
					const actionStepName = soptHistoryDatas[i].actionStepName;
					const sensorName = soptHistoryDatas[i].sensorName;
					const position = soptHistoryDatas[i].position;				
					const beginTime = soptHistoryDatas[i].beginTime;
					const endTime = soptHistoryDatas[i].endTime;
					const userName = soptHistoryDatas[i].userName;
	
					data.no = no;
					data.disasterName = disasterName;
					data.sopName = sopName;
					data.actionStepName = actionStepName;
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
	}

	static async downloadSOPDetail(dataSource, selectedData) {
		const title = 'SOP 상세 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:E2');
		worksheet.getCell('A1:E2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		worksheet.addRow(['시간 : ' + selectedData.beginTime]);
		worksheet.addRow(['SOP유형 : ' + selectedData.disasterName]);
		worksheet.addRow(['위기경보단계 : ' + selectedData.actionStepName]);
		worksheet.addRow(['SOP모드 : ' + selectedData.realMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '프로세스 제목', '전파 대상자/전파 메시지', '시간', '완료 여부']);
		columnRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '#0595D5' }
			};
			cell.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
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
			{ key: "sectionName", width: 15 },
			{ key: "msg", width: 40 },
			{ key: "time", width: 20 },
			{ key: "status", width: 13 }
		];

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const no = i + 1;
				const sectionName = dataSource[i].sectionName;
				const msg = dataSource[i].teamList.join(', ');
				const time = dataSource[i].time;
				const status = dataSource[i].strStatus;

				data.no = no;
				data.sectionName = sectionName;
				data.msg = msg;
				data.time = time;
				data.status = status;

				arrDatas.push(data);

				// 세부
				const missionDatas = dataSource[i].missionDatas;
				const missionCount = missionDatas.length;

				if (missionCount > 0) {
					for (let j = 0; j < missionCount; j++) {
						const data2 = [];

						const noDetail = (i + 1) + '-' + (j + 1);
						const sectionNameDetail = dataSource[i].missionDatas[j].sectionName;
						const msgDetail = dataSource[i].missionDatas[j].missionText;
						const timeDetail = dataSource[i].missionDatas[j].time;
						const statusDetail = dataSource[i].missionDatas[j].completion;

						data2.no = noDetail;
						data2.sectionName = sectionNameDetail;
						data2.msg = msgDetail;
						data2.time = timeDetail;
						data2.status = statusDetail;

						arrDatas.push(data2);
					}
				}
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					sectionName: item.sectionName,
					msg: item.msg,
					time: item.time,
					status: item.status
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
	}

	static getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();                   //d
		day = day >= 10 ? day : '0' + day;

		let strDate = year + '-' + month + '-' + day;
		return strDate;
	}

	static getMakeTime(dateTime) {
		let hour = dateTime.getHours();
		hour = hour >= 10 ? hour : '0' + hour;
		let min = dateTime.getMinutes();
		min = min >= 10 ? min : '0' + min;
		let sec = dateTime.getSeconds();
		sec = sec >= 10 ? sec : '0' + sec;

		let strDate = hour + ':' + min + ':' + sec;
		return strDate;
	}
}