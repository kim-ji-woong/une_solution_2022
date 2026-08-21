import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import { SDMSController } from "../../SDMS/services/sdmsController.js";
import DatePicker from 'react-datepicker';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import { Line } from "react-chartjs-2";
import CheckboxOptions from "./components/checkboxOptions";
import HistoryResource from "../resource/id";
import ProjectResource from "../../Root/resource/id";
import LineChart from './components/lineChart';
import WindChart from './components/windChart';


class StatisticsHistory extends Component {

	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,
			maxRowCount: 13, // 한 페이지에 보여줄 data row 수
			maxPageCount: 9, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),

			filterType: 1,
			filterContent: '',

			loadingIndicator: false,
			
			sensorType: HistoryResource.ExternalSensorTypes.Entire,
			selectedBuildings: [HistoryResource.ExternalSensorTypes.Entire],
			selectedMaterials: [HistoryResource.ExternalSensorTypes.Entire],
			
			selectedPeriodType: true, // false: Hourly, true: 5Min
			
			prevProps: null,

			selectValue: [],
			
			activeComboBox: null,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();
		this.comboBoxRef01 = React.createRef();
		this.comboBoxRef02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
	}

	componentDidMount() {
		$('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });

		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

	handleComboBox = (id, event) => {
		this.setState(prevState => ({
			activeComboBox: prevState.activeComboBox === id ? null : id
		}));
	};

	handleClickOutside = (event) => {
		if ((this.comboBoxRef01.current && this.comboBoxRef01.current.contains(event.target)) ||
            (this.comboBoxRef02.current && this.comboBoxRef02.current.contains(event.target))) {
            return;
        }

        this.setState({ activeComboBox: null });
    };

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

		const selectedBuildings = this.getSearchBuildingIDs();
		const selectedMaterials = this.state.selectedMaterials;

		if (!selectedBuildings || selectedBuildings.length === 0) {
			$("body").css("cursor", "default");
			this.setState({loadingIndicator: false });
			return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["선택된 센서가 없습니다."], null, null);
		}

		if (!selectedMaterials || selectedMaterials.length === 0) {
			$("body").css("cursor", "default");
			this.setState({loadingIndicator: false });
			return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["선택된 측정값이 없습니다."], null, null);
		}

		const dataHistoryResult = await SDMSController.RequestSensorDataHistories(beginDate, endDate,  selectedBuildings, selectedMaterials, this.state.selectedPeriodType);
		let dataSource = null;
		let datacount = 0;
		if (dataHistoryResult?.success) {
			dataSource = dataHistoryResult.sensorDataHistories;
		}

		if (dataSource) {
			datacount = dataSource.length;
		}

		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		$("body").css("cursor", "default");

		this.setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false });
	}

	getSearchBuildingIDs = () => {
		const selectedBuildings = this.state.selectedBuildings;
		const sensorType = this.state.sensorType;
		const externalSensors = this.props.externalSensors;
		const buildingGroupList = this.props.buildingGroupList;
		let filteredBuildings = [];

		if (selectedBuildings.includes(HistoryResource.ExternalSensorTypes.Entire)) {
			if (sensorType === HistoryResource.ExternalSensorTypes.Entire) {
				return [-1];
			} else {
				const buildings = buildingGroupList[0].buildingDatas;
				for (let i = 0; i < buildings.length; i++) {
					const building = buildings[i];
					const targetSensor = externalSensors.find(sensor => sensor.zoneID === building.id);
					if (targetSensor && targetSensor.sensorType === sensorType) {
						filteredBuildings.push(building.id);
					}
				}

				return filteredBuildings;
			}
		}

		return selectedBuildings;
	}

	isAllCheckedBuildings = (selectedBuildings) => {
		const buildingGroupList = this.props.buildingGroupList;
		const buildingGroup = buildingGroupList[0];
		let buildings = buildingGroup.buildingDatas;
		const sensorType = this.state.sensorType;
		const externalSensors = this.props.externalSensors;

		if (selectedBuildings.indexOf(HistoryResource.ExternalSensorTypes.Entire) !== -1) {
			return true;
		}

		const filteredBuildings = buildings.filter(building => {
			if (sensorType === HistoryResource.ExternalSensorTypes.Entire) {
				return true;
			}

			for (let i = 0; i < externalSensors.length; i++) {
				const externalSensor = externalSensors[i];
				if (externalSensor.sensorType === HistoryResource.ExternalSensorTypes.Weather)
					continue;

				if (externalSensor.zoneID === building.id && externalSensor.sensorType === sensorType)
					return true;
			}
			return false;
		});

		for (let i = 0; i < filteredBuildings.length; i++) {
			const building = filteredBuildings[i];
			if (selectedBuildings.indexOf(building.id) === -1) {
				return false;
			}
		}
		return true;
	}

	isAllCheckedMaterials = (selectedMaterials) => {
		const materials = this.props.materials;

		if (selectedMaterials.indexOf(HistoryResource.ExternalSensorTypes.Entire) !== -1) {
			return true;
		}

		for (let i = 0; i < materials.length; i++) {
			const material = materials[i];
			if (selectedMaterials.indexOf(material.id) === -1) {
				return false;
			}
		}

		return true;
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
		
		const endDate = this.state.endDate;
		
		if (date > endDate) {
			this.setState({ beginDate: date, endDate: date })
		} else {
			this.setState({ beginDate: date });
		}
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
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

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ beginDate: date, endDate: today, dateType: dateType });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	onChangePeriodType = (periodType) => {
		this.setState({selectedPeriodType: parseInt(periodType) === 1 });
	}

	getMaterialNames = () => {
		const materials = this.props.materials;
		if (!materials)
			return "";

		const selectedMaterials = this.state.selectedMaterials;
		const sensorType = this.state.sensorType;

		if (selectedMaterials.includes(CheckboxOptions.EntireType)) {

			let strMaterials = '';
			let materialCount = 0;
			let isFirst = true;
			let isSecond = true;

			for (let i = 0; i < materials.length; i++) {
				const material = materials[i];

				if (isFirst) {
					strMaterials = material.materialName;
					isFirst = false;
				}

				if (isSecond) {
					isSecond = false;
					strMaterials += ' 외 ';
				}

				materialCount++;
			}
			return strMaterials + materialCount + '개';
		} else {
			selectedMaterials.sort((a,b) => a - b);
			let materialCount = selectedMaterials.length - 1;

			const firstMaterial = materials.find(material => material.id === selectedMaterials[0]);

			if (materialCount === 0) {
				return firstMaterial ? firstMaterial.materialName : '';
			}

			return firstMaterial ? firstMaterial.materialName + ' 외 ' + materialCount.toString() + '개' :
				'';
		}
	}

	getSensorNames = () => {
		const buildingGroupList = this.props.buildingGroupList;
		if (!buildingGroupList)
			return '선택';

		const buildings = buildingGroupList[0].buildingDatas;
		const selectedBuildings = this.state.selectedBuildings;
		const externalSensors = this.props.externalSensors;
		const sensorType = this.state.sensorType;

		if (selectedBuildings.includes(HistoryResource.ExternalSensorTypes.Entire)) {
			if (sensorType === CheckboxOptions.EntireType) {
				let strSensor = '';
				let sensorCount = 0;

				let isFirst = true;
				let isSecond = true;
				for (let i = 0; i < externalSensors.length; i++) {

					if (externalSensors[i].sensorType === HistoryResource.ExternalSensorTypes.Weather) {
						continue;
					}

					if (isFirst) {
						isFirst = false;
						strSensor = externalSensors[i].name;
					} else {
						if (isSecond) {
							isSecond = false;
							strSensor += ' 외 '
						}

						sensorCount++;
					}
				}
				return strSensor + sensorCount + '개소';
			} else {
				let strSensor = '';
				let sensorCount = 0;
				let isFirst = true;
				let isSecond = true;
				for (let i = 0; i < externalSensors.length; i++) {
					if (externalSensors[i].sensorType === sensorType) {
						if (isFirst) {
							strSensor = externalSensors[i].name;
							isFirst = false;
						} else {
							if (isSecond) {
								isSecond = false;
								strSensor += ' 외 '
							}

							sensorCount++;
						}
					}
				}
				return strSensor + sensorCount + '개소';
			}
		} else { // 전체 선택이 아닌 개별 선택일때
			let sensorCount = selectedBuildings.length - 1;

			if (sensorCount <= 0) {
				return "";
			}

			selectedBuildings.sort((a,b) => a - b);

			const firstSensor = externalSensors.find(sensor => sensor.zoneID === selectedBuildings[0]);
			return sensorCount > 1 ? firstSensor.name + ' 외 ' + sensorCount.toString() + '개소'
				: firstSensor.name;
		}
	}

	onChangeSensorType = (sensorTypeID) => {
		if (this.state.sensorType !== parseInt(sensorTypeID)) {
			return this.setState({ sensorType: parseInt(sensorTypeID), selectedBuildings: [HistoryResource.ExternalSensorTypes.Entire] });
		}

		this.setState({ sensorType: parseInt(sensorTypeID) });
	}

	getSensorTypeUI = () => {
		const externalSensorTypes = this.props.externalSensorTypes;

		let ui = [];
		if (!externalSensorTypes) {
			return ui;
		}

		ui.push(
			<option key={'sensorType_0'} value={HistoryResource.ExternalSensorTypes.Entire}>전체</option>
		)

		for (let i = 0; i < externalSensorTypes.length; i++) {
			const sensorType = externalSensorTypes[i];
			if (sensorType.id === HistoryResource.ExternalSensorTypes.Atmosphere ||
				sensorType.id === HistoryResource.ExternalSensorTypes.KWeather) {
				ui.push(<option key={'sensorType_' + (sensorType.id)} value={sensorType.id}>{sensorType.name}</option>);
			}
		}

		return ui;
	}

	setSelectedBuildings = (e, buildingID) => {

		const checked = e.target.checked;

		let selectedBuildings = [...this.state.selectedBuildings];

		// 전체 선택, 해제
		if (buildingID === HistoryResource.ExternalSensorTypes.Entire) {
			if (selectedBuildings.indexOf(HistoryResource.ExternalSensorTypes.Entire) === -1) {
				return this.setState({ selectedBuildings: [HistoryResource.ExternalSensorTypes.Entire] });
			} else {
				return this.setState({ selectedBuildings: [] });
			}
		}

		const sensorType = this.state.sensorType;
		const externalSensors = this.props.externalSensors;

		// 개별 선택, 해제
		if (selectedBuildings.includes(CheckboxOptions.EntireType)) {
			selectedBuildings = selectedBuildings.filter(id => id !== CheckboxOptions.EntireType);
			for (let i = 0; i < externalSensors.length; i++) {
				const externalSensor = externalSensors[i];
				if (externalSensor.sensorType === HistoryResource.ExternalSensorTypes.Weather)
					continue;
				if (sensorType === CheckboxOptions.EntireType || externalSensor.sensorType === sensorType) {
					selectedBuildings.push(externalSensor.zoneID);
				}
			}
			selectedBuildings = selectedBuildings.filter(id => id !== buildingID);
		} else {
			if (checked) {
				selectedBuildings.push(buildingID);
				if (this.isAllCheckedBuildings(selectedBuildings)) {
					selectedBuildings = [HistoryResource.ExternalSensorTypes.Entire];
				}
			}
			else
				selectedBuildings = selectedBuildings.filter(id => id !== buildingID);
		}


		this.setState({ selectedBuildings });
	}

	setSelectedMaterials = (e, materialID) => {
		let selectedMaterials = [...this.state.selectedMaterials];

		const materials = this.props.materials;

		if (selectedMaterials.includes(CheckboxOptions.EntireType)) {
			if (materialID === CheckboxOptions.EntireType) {
				selectedMaterials = [];
			} else {
				selectedMaterials = selectedMaterials.filter(id => id !== CheckboxOptions.EntireType);
				for (let i = 0; i < materials.length; i++) {
					selectedMaterials.push(materials[i].id);
				}
				selectedMaterials.filter(id => id !== materialID);
			}
			return this.setState({ selectedMaterials });
		}

		if (selectedMaterials.includes(materialID)) {
			selectedMaterials = selectedMaterials.filter(id => id !== materialID);
		} else {
			selectedMaterials.push(materialID);
		}

		if (this.isAllCheckedMaterials(selectedMaterials)) {
			selectedMaterials = [HistoryResource.ExternalSensorTypes.Entire];
		}

		this.setState({ selectedMaterials });
	}

	async onClickDownload(isCheckedDownload) {
		const title = '데이터 수정 이력';

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

		// 빈칸
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '이름', '권한', '소속', '수정 데이터', '수정 유형', '내용']);
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
			{ key: "name", width: 10 },
			{ key: "level", width: 15 },
			{ key: "teamName", width: 15 },
			{ key: "targetType", width: 15 },
			{ key: "actionType", width: 15 },
			{ key: "historyContent", width: 50 }
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
				const time = this.state.dataSource[i].time;
				const name = this.state.dataSource[i].name;
				const level = this.state.dataSource[i].level;
				const teamName = this.state.dataSource[i].teamName;
				const targetType = this.state.dataSource[i].targetType;
				const actionType = this.state.dataSource[i].actionType;
				const historyContent = this.state.dataSource[i].historyContent;

				data.no = no;
				data.time = time;
				data.name = name;
				data.level = level;
				data.teamName = teamName;
				data.targetType = targetType;
				data.actionType = actionType;
				data.historyContent = historyContent;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					name: item.name,
					level: item.level,
					teamName: item.teamName,
					targetType: item.targetType,
					actionType: item.actionType,
					historyContent: item.historyContent
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

	getBuildingNameById = (buildingID) => {
		const buildingGroupList = this.props.buildingGroupList;

		if (buildingGroupList) {
			for (let building of buildingGroupList[0].buildingDatas) {
				if (building.id === buildingID) {
					return building.buildingName;
				}
			}

			return '';
		}
	}

	// 풍향 String 구하기
	getStringWindDirection = (degree) => {
        const directions = [
            "북", "북북동", "북동", "동북동",
            "동", "동남동", "남동", "남남동",
            "남", "남남서", "남서", "서남서",
            "서", "서북서", "북서", "북북서"
        ];

        const angle = (degree % 360 + 360) % 360;

        const index = Math.floor(angle / 22.5);
        return directions[index];
    }

	getGridData = () => {
		let ui = [];
		const { materials } = this.props;
		const { dataSource, selectedMaterials } = this.state;

		if (!this.state.dataSource || this.state.dataSource?.length === 0) {
			return;
		}

		// 위치별 차트 컬러 지정
        const colors = ["#BC8F8F", "#F08080", "#CD5C5C", "#A52A2A", "#B22222", "#800000", "#8B0000", "#FF0000", "#FFE4E1", "#FA8072", "#FF6347", "#E9967A", "#FF7F50", "#FF4500", "#FFA07A", "#A0522D", "#FFF5EE", "#D2691E", "#8B4513", "#F4A460", "#FFFACD", "#F0E68C", "#EEE8AA", "#BDB76B", "#FFD700", "#F5F5DC", "#FFFFE0", "#FAFAD2", "#808000", "#FFFF00", "#6B8E23", "#9ACD32", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#228B22", "#32CD32", "#006400", "#008000", "#00FFFF", "#00BFFF", "#4682B4", "#1E90FF", "#708090", "#708090", "#4169E1", "#E6E6FA", "#00008B", "#0000FF", "#6A5ACD", "#9370DB", "#4B0082", "#BA55D3", "#D8BFD8", "#EE82EE", "#67B9EE", "#CEEDA5", "#9F6AE1", "#FEA26E", "#6BA48F", "#EA3535", "#8D96B7"];

		materials
			.filter(material => {
				// 풍향, 풍속 제외
				if (material.id === HistoryResource.MeasureMentTypes.WindDirection || material.id === HistoryResource.MeasureMentTypes.WindSpeed) {
					return false;
				}
				return true;
			})
			.map(material => {
				const validBuildingIndex = dataSource.findIndex(building =>
					building.sensorDataHistories.some(history => history.materialID === material.id)
				);
				
				let labels = [];
				const datasets = dataSource.map((building, buildingIndex) => {
					const data = building.sensorDataHistories
						.filter(history => history.materialID === material.id)
						.map(history => {
							if (buildingIndex === validBuildingIndex) {
								const date = new Date(history.timeStamp);
								const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
								const formattedTime = date.toTimeString().slice(0, 5); // 'HH:MM' 형식
								labels.push([formattedDate, formattedTime]);
							}
							
							return {
								x: new Date(history.timeStamp),
								y: history.value
							};
						})
						.sort((a, b) => a.x - b.x);

						const buildingName = this.getBuildingNameById(building.buildingID);

						return {
							label: buildingName,
							data: data,
							borderColor: colors[buildingIndex % colors.length],
							backgroundColor: colors[buildingIndex % colors.length],
							tension: 0.1,
							borderWidth: 1,
							fill: false,
						};
				});

				const chartData = {
					labels,
					datasets: datasets
				};

				// 차트 데이터가 존재하는 zone만 차트 표출
				if (labels.length > 0) {
					ui.push(
						<div className={'hsGraphBox line'} key={material.id}>
							<span className={'hsGraphTitle'}>[{material.materialName}]</span>
							<div className={'hsGraphArea'}>
								<LineChart
									key={material.materialName}
									data={chartData}
								/>
							</div>
						</div>
					);
				}
			}
		);
		
		// 풍향, 풍속 차트
		for (let data of dataSource) {
			let windDirectionDatas = [];
			let windSpeedDatas = [];
			let windDatasCount = 0;

			if (data.sensorDataHistories.length > 0) {
				for (let sensorData of data.sensorDataHistories) {
					if (sensorData.materialID === HistoryResource.MeasureMentTypes.WindDirection) {
						windDirectionDatas.push(sensorData.value);
						windDatasCount++;
					}	
					if (sensorData.materialID === HistoryResource.MeasureMentTypes.WindSpeed) {
						windSpeedDatas.push(sensorData.value);
						windDatasCount++;
					}	
				}
			}	

			// 풍향 풍속 데이터가 존재하는 zone만 차트 표출
			if (windDatasCount > 0) {
				const buildingName = this.getBuildingNameById(data.buildingID);
	
				ui.push(
					<div className={'hsGraphBox bar'} key={data.buildingID}>
						<span className={'hsGraphTitle'}>[{buildingName}]</span>
						<div className={'hsGraphArea'}>
							<WindChart
								key={buildingName}
								windDirectionDatas={windDirectionDatas}
								windSpeedDatas={windSpeedDatas}
								getStringWindDirection={this.getStringWindDirection}
							/>
						</div>
					</div>
				);
			}
		}

		return ui;
	}
	
	getMinDate = () => {
		const dtNow = new Date();
		dtNow.setMonth(dtNow.getMonth() - 1);
		
		return dtNow;
	}

	render() {
		const sensorTypes = this.getSensorTypeUI();
		const gridUI = this.getGridData();
		
		const minDate = this.getMinDate();
		
		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>센서 탐지 차트</span>
						<form action="">
							<div className={'hscSchStatistics'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>센서유형</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeSensorType(e.target.value)} className={'selWh'}>
													{sensorTypes}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>위치</dt>
											<dd ref={this.comboBoxRef01}>
												<button type="button" className={this.state.activeComboBox === 1 ? 'selWh button on' : 'selWh button'} onClick={(e) => this.handleComboBox(1, e)}>
													{this.getSensorNames()}
												</button>
												{
													this.state.activeComboBox === 1 &&
													<CheckboxOptions
														key='buildingUI'
														type='building'
														buildingGroupList={this.props.buildingGroupList}
														setSelectedBuildings={this.setSelectedBuildings}
														selectedBuildings={this.state.selectedBuildings}
														sensorType={this.state.sensorType}
														externalSensors={this.props.externalSensors}
													/>
												}
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>측정값</dt>
											<dd ref={this.comboBoxRef02}>
												<button type="button" className={this.state.activeComboBox === 2 ? 'selWh button on' : 'selWh button'} onClick={(e) => this.handleComboBox(2, e)}>
													{this.getMaterialNames()}
												</button>
												{
													this.state.activeComboBox === 2 &&
													<CheckboxOptions
														key='materialUI'
														type='material'
														materials={this.props.materials}
														setSelectedMaterials={this.setSelectedMaterials}
														selectedMaterials={this.state.selectedMaterials}
													/>
												}
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>집계방식</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangePeriodType(e.target.value)} className={'selWh'}>
													<option value={1}>5분</option>
													<option value={0}>1시간</option>
												</select>
											</dd>
										</dl>
									</li>
								</ul>
								<dl>
									<dt>조회기간</dt>
									<dd>
										<ul className={'hscsDate'}>
											<li>
												<div className={'datepicker'}>
													<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
														dateFormat="yyyy-MM-dd"
														locale={ko}
														minDate={minDate}
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
														minDate={this.state.beginDate}
														maxDate={new Date()}
														selected={this.state.endDate}
														onChange={date => this.onChangeEnd(date)} />
													<img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
												</div>
											</li>
										</ul>
										<ul className={'hscsRdoPeriod'}>
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
										</ul>
									</dd>
								</dl>
								{
									this.state.loadingIndicator === true
										? <a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										: <a onClick={this.display} className={'hscsSbmtSOP'}><span><span>검색</span></span></a>
								}
							</div>
						</form>

						{/*
							this.state.loadingIndicator === true ?
								<ul className={'hscExl'}>
									<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
								</ul>
								:
								<ul className={'hscExl'}>
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
								</ul>
						*/}

						<div className={'hscTb'}>
							{
								(gridUI && gridUI?.length > 0) ?
									gridUI
									: <div className='noData'>조회된 데이터가 없습니다</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StatisticsHistory;