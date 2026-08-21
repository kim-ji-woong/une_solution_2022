import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import newStyles from '../../Common/css/newStyle.module.css';
import uneStyles from "../../Common/css/uneCommon.module.css";
import { Bar } from 'react-chartjs-2';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';
import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';
//import SdmsResource from '../../SDMS/resource/id';


class SensorDetectHistory extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedBuildingGroupID: -1,
			selectedBuildingID: -1,
			selectedZoneID: -1,
			searchZoneName: '-',

			facilityType: -1, // -1:전체, 0:화재, 11:누출, 900:CCTV
			dataSource: null,
			maxRowCount: 5,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),

			selectedDate: null,
			allDetectCount: 0,
			allMalfunctionRate: 0,
			maxCountSensorName: '',

			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
				//tooltips 사용시
				//tooltips: {
				//	enabled: true,
				//	mode: "nearest",
				//	position: "average",
				//	intersect: false,
				//},
				scales: {
					xAxes: [
						{
							//   position: "top", //default는 bottom
							display: true,
							//scaleLabel: {
							//	display: true,
							//	labelString: "Step",
							//	fontFamily: "Montserrat",
							//	fontColor: "black",
							//},
							ticks: {
								// beginAtZero: true,
								maxTicksLimit: 10, //x축에 표시할 최대 눈금 수
							},
						},
					],
					yAxes: [
						{
							id: 'A',
							display: true,
							position: 'left',
							//   padding: 10,						
							ticks: {
								beginAtZero: true,
								stepSize: 20
							},
						},
						{
							id: 'B',
							display: true,
							type: 'linear',
							position: 'right',
							//   padding: 10,
							//scaleLabel: {
							//	display: true,
							//	labelString: "Coverage",
							//	fontFamily: "Montserrat",
							//	fontColor: "black",
							//},
							ticks: {
								beginAtZero: true,
								stepSize: 25,
								min: 0,
								max: 100,
								//y축 scale 값에 % 붙이기 위해 사용
								callback: function (value) {
									return value + "%";
								},
							},
						},
					],
				},
			}, // chart 옵션
			chartLegend: {
				display: true,
				//position: 'bottom',
				//align: 'start',
				position: 'top'
			},  // chart 옵션

			loadingIndicator: false,

			prevProps: null
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
	}

	componentDidMount() {
		if (this.props.selectedSiteID) {
			this.display();
		}
	}

	componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
            this.display();
        }
    }

	async display() {
		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
			return;
		}

		await this.setState({ loadingIndicator: true })

		const buildingGroupID = this.state.selectedBuildingGroupID;
		const buildingID = this.state.selectedBuildingID;
		const zoneID = this.state.selectedZoneID;

		const result = await HistoryController.DisplaySensorDetectAnalysis(beginDate, endDate, this.state.facilityType, buildingGroupID, buildingID, zoneID, this.props.selectedSiteID);
		if (!result) {
			$("body").css("cursor", "default");
			await this.setState({ loadingIndicator: false })			
			return;
        }

		const allDetectCount = result.allDetectCount;
		const allMalfunctionRate = result.allMalfunctionRate
		const maxCountSensorName = result.maxCountSensorName;
		const searchZoneName = result.searchZoneName;

		const dataSource = result.sensorDetectAnalysisDatas;
		const datacount = dataSource.length;
		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		const selectedDate = this.getMakeDateTime(this.state.beginDate) + ' ~ ' + this.getMakeDateTime(this.state.endDate);

		$("body").css("cursor", "default");

		this.setState({ dataSource, maxPageIndex, selectedDate, allDetectCount, allMalfunctionRate, maxCountSensorName, searchZoneName, pageIndex: 1, loadingIndicator: false });
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

	setPageIndex(index) {
		if (this.state.pageIndex === index) {
			return;
		}
		if (this.state.maxPageIndex < index || index < 1) {
			return;
		}

		this.setState({ pageIndex: index });
	}

	onChangeBegin = (date) => {
		this.setState({ beginDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeBuildingGroup = (target) => {
		this.setState({ selectedBuildingGroupID: Number(target.value), selectedBuildingID: -1, selectedZoneID: -1  });
	}
	onChangeBuilding = (target) => {
		this.setState({ selectedBuildingID: Number(target.value), selectedZoneID: -1 });
	}
	onChangeZone = (target) => {
		this.setState({ selectedZoneID: Number(target.value) });
	}

	onClickDateType = (type) => {
		let dateType = '';

		if (type === 'select') {
			dateType = 'select';
			this.setState({ dateType: dateType });
			return;
		}

		let today = new Date();
		let date = new Date();

		if (type === 'today') {
			dateType = 'today';
		}
		else if (type === 'week') {
			date.setDate(date.getDate() - 7);
			dateType = 'week';
		}
		else if (type === 'month') {
			date.setMonth(date.getMonth() - 1);
			dateType = 'month';
		}
		else if (type === 'year') {
			date.setFullYear(date.getFullYear() - 1);
			dateType = 'year';
		}

		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ beginDate: date, endDate: today, dateType: dateType });
	}

	async onClickDownload(isCheckedDownload) {
		const title = '센서 탐지 분석';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:H2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회 범위' + ' : ' + this.state.searchZoneName]);
		worksheet.addRow([]);

		let content1 = ('센서탐지분석 요약1', { selectedDate: this.state.selectedDate, searchZoneName: this.state.searchZoneName, allDetectCount: this.state.allDetectCount, allMalfunctionRate: this.state.allMalfunctionRate});
		let content2 = ('센서탐지분석 요약2', { maxCountSensorName: ((this.state.maxCountSensorName && this.state.maxCountSensorName.length > 0) ? this.state.maxCountSensorName : '-') });

		//let content = this.state.selectedDate + '동안 ';
		//content += this.state.searchZoneName + '의 센서 탐지 횟수는' + this.state.allDetectCount + '회 이며 ';
		//content += '오작동률은 ' + this.state.allMalfunctionRate + ' % 입니다.'
		//let content2 = '가장 많은 오작동을 일으킨 센서는 ' + ((this.state.maxCountSensorName && this.state.maxCountSensorName.length > 0) ? this.state.maxCountSensorName : '-') + '입니다.'

		worksheet.addRow([content1]);
		worksheet.addRow([content2]);

		const chart = document.getElementById('chart_analysis2');
		let img = chart.toDataURL(1.0);
		let img2 = workbook.addImage({ base64: img, extension: 'png' });
		worksheet.addImage(img2, 'A9:H14');

		// 빈칸 10칸 띄우기
        for (let i = 0; i < 10; i++) {
			worksheet.addRow([]);
        }		

		// column
		let columnRow = worksheet.addRow(['No', '유형', '위치', '센서명', '탐지 횟수', '오작동', '현장 복구', '오작동률(%)']);
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
			{ key: "malfunctionRate", width: 13 }
		];

		if (this.state.dataSource) {
			let arrDatas = [];
			const dataLength = this.state.dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = this.state.dataSource[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const type = this.state.dataSource[i].type;
				const zoneName = this.state.dataSource[i].zoneName;
				const sensorName = this.state.dataSource[i].sensorName;
				const detectCount = this.state.dataSource[i].detectCount;
				const malfunctionCount = this.state.dataSource[i].malfunctionCount;
				const endCount = this.state.dataSource[i].endCount;
				const malfunctionRate = this.state.dataSource[i].malfunctionRate;

				data.no = no;
				data.type = type;
				data.zoneName = zoneName;
				data.sensorName = sensorName;
				data.detectCount = detectCount;
				data.malfunctionCount = malfunctionCount;
				data.endCount = endCount;
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

	onClickFacilityType = (facilityType) => {
		this.setState({ facilityType });
    }

	// 하단 페이지 index 만들기
	getPageIndexUI() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		const pageArr = [];
		//const pageArr = new Array();

		let index = this.state.pageIndex;
		// 이전 페이지 넣기
		while (true) {
			index--;
			if (index < 1) {
				break;
			}
			if (this.state.pageIndex - 2 > index) {
				break;
			}

			pageArr.push(index);
		}
		index = this.state.pageIndex;
		pageArr.push(index);

		// 다음 페이지 넣기
		while (true) {
			if (pageArr.length === this.state.maxPageCount) {
				break;
			}

			index++;
			if (index > this.state.maxPageIndex) {
				break;
			}

			pageArr.push(index);
		}

		// 정렬
		pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; /*if (a < b)*/ return -1; });

		for (let i = 0; i < pageArr.length; i++) {
			let pageIndex = pageArr[i];
			if (pageIndex === this.state.pageIndex) {
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={'on'}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
			else {
				ui.push(<li key={'pageIndex_' + (pageIndex)}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
		}

		return ui;
	}

	onCheckedRow(checked, index) {
		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;
		if (index === -1) {
			let beginIndex = 0;
			if (this.state.pageIndex > 1) {
				beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
			}

			for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
				if (datacount < i + 1) {
					break;
				}
				dataSource[i].checked = checked;
			}
		}
		else {			
			dataSource[index].checked = checked;
		}
		this.setState({ dataSource });
	}

	getGridData() {
		let gridUI = [];
		let chartUI = [];
		if (!this.state.dataSource) {
			return [gridUI, chartUI, false];
		}

		const dataTemp = {};
		dataTemp.labels = [];
		dataTemp.detectCount = [];
		dataTemp.detectRate = [];

		/*let allDetectCount = 0;
		let allDetectRate = 0;*/
		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (this.state.pageIndex > 1) {
			beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			gridUI.push(<tr key={'dataSource_' + (i)}>
				<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
				<td>{i + 1}</td>
				<td>{dataSource[i].type}</td>
				<td>{dataSource[i].zoneName}</td>
				<td>{dataSource[i].sensorName}</td>
				<td>{dataSource[i].detectCount}</td>
				<td>{dataSource[i].malfunctionCount}</td>
				<td>{dataSource[i].endCount}</td>
				<td>{dataSource[i].userResetCount}</td>
				<td>{dataSource[i].malfunctionRate}%</td>
			</tr>);

			dataTemp.labels.push(dataSource[i].sensorName);
			dataTemp.detectCount.push(dataSource[i].detectCount);
			dataTemp.detectRate.push(dataSource[i].detectRate);

			//allDetectCount += dataSource[i].detectCount;

			rowCount++;
			if (allChecked && !dataSource[i].checked) {
				allChecked = false;
			}
		}

		//for (let i = 0; i < dataTemp.detectCount.length; i++) {
		//	allDetectRate += (dataTemp.detectCount[i] / this.state.allDetectCount) * 100;
		//	dataTemp.detectRate.push(allDetectRate);
		//}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
		}

		const data = {
			labels: dataTemp.labels,
			datasets: [
				{
					label: '탐지 횟수',
					data: dataTemp.detectCount,
					backgroundColor: 'rgba(219, 0, 0, 0.5)',
					fill: false,
					barThickness: 40,
					pointStyle: 'rectRounded',
					yAxisID: 'A'
				},
				{
					type: 'line',
					label: '누적 탐지율',
					data: dataTemp.detectRate,
					//backgroundColor: 'rgba(247, 169, 43, 0.8)',
					borderColor: 'rgba(247, 169, 43, 0.8)',
					//borderDash: [5, 5],
					//backgroundColor: "#e755ba",
					//pointBackgroundColor: "#55bae7",
					pointBorderColor: 'rgb(247, 169, 43)',
					pointRadius: 10, // 포인트 사이즈
					pointHoverRadius: 10, // 포인트 호버 사이즈
					//pointHoverBackgroundColor: "#55bae7",
					//pointHoverBorderColor: "#55bae7",
					fill: false,
					pointStyle: 'triangle',
					yAxisID: 'B'
				}
			]
		};

		chartUI.push(<Bar key={'chart_analysis2'} id='chart_analysis2' data={data} legend={this.state.chartLegend} options={this.state.chartOptions} />)

		return [gridUI, chartUI, allChecked];
	}

	getSpatailUI() {
		let buildingGroupUI = [];
		let buildingUI = [];
		let zoneUI = [];

		buildingGroupUI.push(<option key={'buildingGroupOption_-1'} value="-1">전체</option>);
		buildingUI.push(<option key={'buildingOption_-1'} value="-1">전체</option>);
		zoneUI.push(<option key={'zoneOption_-1'} value="-1">전체</option>);

		if (!this.props.buildingGroupList) {
			return [buildingGroupUI, buildingUI, zoneUI];
		}

		const buildingGroupLength = this.props.buildingGroupList.length;
		for (let i = 0; i < buildingGroupLength; i++) {
			const buildingGroup = this.props.buildingGroupList[i];

			if (this.state.selectedBuildingGroupID === buildingGroup.id) {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id} selected>{buildingGroup.displayText}</option>);

				const buildingLength = buildingGroup.buildingDatas.length;
				for (let j = 0; j < buildingLength; j++) {
					const building = buildingGroup.buildingDatas[j];					
					if (this.state.selectedBuildingID === building.id) {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id} selected>{building.displayText}</option>);

						const zoneLength = building.zoneDatas.length;
						for (var k = 0; k < zoneLength; k++) {
							const zone = building.zoneDatas[k];
							if (this.state.selectedZoneID === zone.id) {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id} selected>{zone.displayText}</option>);
							}
							else {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id}>{zone.displayText}</option>);
                            }
						}
					}
					else {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id}>{building.displayText}</option>);
                    }
				}
			}
			else {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
            }
        }

		return [buildingGroupUI, buildingUI, zoneUI];
    }

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	getSensorTypeUI = () => {
		let sensorTypeUI = [];

		if (this.props.useSensorTypes?.UseFire === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType0" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.FIRE)} checked={this.state.facilityType === SdmsResource.facilityType.FIRE} /><label htmlFor="hscsType0">화재</label></li>);
		}
		if (this.props.useSensorTypes?.UsePSM === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType11" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.PSM_SENSOR)} checked={this.state.facilityType === SdmsResource.facilityType.PSM_SENSOR} /><label htmlFor="hscsType11">누출</label></li>);
		}
		if (this.props.useSensorTypes?.UseETC === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType21" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.ETC)} checked={this.state.facilityType === SdmsResource.facilityType.ETC} /><label htmlFor="hscsType21">기타</label></li>);
		}

		if (this.props.useSensorTypes?.UseEnvironment === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType117" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Environment)} checked={this.state.facilityType === SdmsResource.facilityType.Environment} /><label htmlFor="hscsType117">환경설비</label></li>);
		}
		if (this.props.useSensorTypes?.UseManufacture === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType118" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Manufacture)} checked={this.state.facilityType === SdmsResource.facilityType.Manufacture} /><label htmlFor="hscsType118">제조설비</label></li>);
		}

		if (this.props.useSensorTypes?.UseSVMS === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType900" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Intrusion_S1)} checked={this.state.facilityType === SdmsResource.facilityType.Intrusion_S1} /><label htmlFor="hscsType900">SVMS</label></li>);
		}
		if (this.props.useSensorTypes?.UseEarthquake === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType50" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Earthquake)} checked={this.state.facilityType === SdmsResource.facilityType.Earthquake} /><label htmlFor="hscsType50">지진</label></li>);
		}
		if (this.props.useSensorTypes?.UseStrongWind === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType18" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.STRONG_WIND)} checked={this.state.facilityType === SdmsResource.facilityType.STRONG_WIND} /><label htmlFor="hscsType18">강풍</label></li>);
		}
		if (this.props.useSensorTypes?.UseBlackOut === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType17" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.BLACKOUT)} checked={this.state.facilityType === SdmsResource.facilityType.BLACKOUT} /><label htmlFor="hscsType17">정전</label></li>);
		}

		return sensorTypeUI;
	}

	onClickRecentlybox = () => {
		const element = document.getElementById('recentlyCheckbox');
		const elementBox = document.getElementById('recentlyBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}

	onClickCheckbox = () => {
		const element = document.getElementById('activeCheckbox');
		const elementBox = document.getElementById('activeBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}


	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, chartUI, allChecked] = this.getGridData();
		const sensorTypeUI = this.getSensorTypeUI();

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>센서 탐지 분석</span>
						<form action="">
							<div className={'hscSch'}>
								<dl>
									<dt>센서유형</dt>
									<dd>
										<ul className={'hscsRdo'}>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">전체</label></li>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">대기오염</label></li>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">저감설비</label></li>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">배출설비</label></li>
											{sensorTypeUI}
										</ul>
									</dd>
								</dl>
								<dl>
									<dt>위치</dt>
									<dd>
										<ul className={'hscsLoc'}>
											<li>
												<select name="" id="" onChange={(e) => this.onChangeBuildingGroup(e.target)} className={'selWh'}>
													{buildingGroupUI}
												</select>
											</li>
											<li>
												<select name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'selWh'}>
													{buildingUI}
												</select>
											</li>
											<li>
												<select name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'selWh'}>
													{zoneUI}
												</select>
											</li>
										</ul>
									</dd>
								</dl>
								<dl>
									<dt>조회기간</dt>
									<dd>
										<ul className={'hscsDate'}>
											<li>
												<div className={'datepicker'}>
													<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
														dateFormat="yyyy-MM-dd"
														locale={ko}
														maxDate={new Date()}
														selected={this.state.beginDate}
														onChange={date => this.onChangeBegin(date)} />
													<img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker01} />
												</div>
											</li>
											<li>~</li>
											<li>
												<div className={'datepicker'}>
													<DatePicker ref={this.refDatepicker02} name="datepicker02" id="datepicker02"
														dateFormat="yyyy-MM-dd"
														locale={ko}
														maxDate={new Date()}
														selected={this.state.endDate}
														onChange={date => this.onChangeEnd(date)} />
													<img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} /> 
												</div>
											</li>
										</ul>
										<ul className={'hscsRdoPeriod'}>
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo02">오늘</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo03">1주</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo04">1개월</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo05" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo05">1년</label></li>
										</ul>
									</dd>
								</dl>
								{
									this.state.loadingIndicator === true ?
										<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										:
										<a onClick={this.display} className={'hscsSbmt'}><span><span>검색</span></span></a>
								}
							</div>
						</form>

						{
							this.state.loadingIndicator === true ?
								<ul className={'hscExl'}>
									<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
									<li><a className={'exl'} id={'hscsSbmting'}>선택 다운로드</a></li>
								</ul>
								:
								<ul className={'hscExl'}>
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'exl'}>선택 다운로드</a></li>
								</ul>
						}

						<p className={'hscWng'}>
							<span>{this.state.selectedDate}</span> 동안 <span>{this.state.searchZoneName}</span>의 센서 탐지 횟수는 <span>{this.state.allDetectCount}</span>회 이며 오작동률은 <span>{this.state.allMalfunctionRate}%</span> 입니다.
									가장 많은 오작동을 일으킨 센서는 <span>{(this.state.maxCountSensorName && this.state.maxCountSensorName.length > 0) ? this.state.maxCountSensorName : '-'}</span> 입니다.
							</p>

						<div className={'hscCht'} id='chart_analysis'>
							{/*	{chartUI} */}
						</div>

						<div className={'hscTb'}>
							<div className={'scrAnalysisTb'}>
								<table>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '5%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '30%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
											<th>NO</th>
											<th>센서유형</th>
											<th>센서명</th>
											<th>위치</th>
											<th>탐지횟수</th>
											<th>오작동</th>
											<th>현장 복구</th>
											<th>사용자 복구</th>
											<th>오작동률(%)</th>
										</tr>
									</thead>
									<tbody>
										{/* {gridUI} */}

										<tr id={"recentlyBoxArea"} className={'recentlyBoxArea'}>
											<td><input type="checkbox" id={"recentlyCheckbox"} className={'recentlyCheckbox'} onClick={() => this.onClickRecentlybox()} /></td>
											<td>1</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr id={"activeBoxArea"} className={'activeBoxArea'}>
											<td><input type="checkbox" id={"activeCheckbox"} className={'activeCheckbox'} onClick={() => this.onClickCheckbox()} /></td>
											<td>2</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>3</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>4</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>5</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>6</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>7</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>8</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>9</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>10</td>
											<td>대기센서</td>
											<td>대기센서</td>
											<td>대경</td>
											<td>테스트</td>
											<td>심각</td>
											<td>-</td>
											<td>-</td>
											<td>-</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* {
								(this.state.dataSource && this.state.dataSource.length > 0) ?
									<div className={'hscNav'}>
										<a className={'first'} onClick={() => this.setPageIndex(1)}>맨 앞</a>
										<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>
										<ul>
											{pageIndexUI}
										</ul>
										<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a>
										<a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>맨 뒤</a>
									</div>
									: <> </>
							} */}

							<div className={'hscNav'}>
								<a className={'first'}>맨 앞</a>
								<a className={'prev'}>이전</a>
								<ul>
									<li className={'on'}><a>1</a></li>
									<li><a>2</a></li>
									<li><a>3</a></li>
									<li><a>4</a></li>
									<li><a>5</a></li>
								</ul>
								<a className={'next'}>다음</a>
								<a className={'last'}>맨 뒤</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
} export default SensorDetectHistory;
//npm install --save react-chartjs-2 chart.js