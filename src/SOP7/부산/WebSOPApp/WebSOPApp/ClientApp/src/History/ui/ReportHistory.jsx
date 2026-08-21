import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import HistoryResource from "../resource/id";
import CheckboxOptions from './components/checkboxOptions';
import ProjectResource from "../../Root/resource/id";

import { SDMSController } from "../../SDMS/services/sdmsController";

class ReportHistory extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,
			maxRowCount: 15, // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			pageSize: 15,
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),
			
			searchBeginDate: null,
			searchEndDate: null,

			filterType: 1,
			filterContent: '',

			loadingIndicator: false,

			prevProps: null,

			selectValue: [],
			
			sensorType: HistoryResource.ExternalSensorTypes.Entire,
			selectedBuildings: [HistoryResource.ExternalSensorTypes.Entire],
			selectedMaterials: [HistoryResource.ExternalSensorTypes.Entire],
			
			selectedPeriodType: true, // bool ( false: Hourly, true: 5Min )
			
			selectedBuildingID: null, // 로우 데이터를 보여주기 위한 빌딩 선택
			
			checkedBuildings: [], // 다운로드 할 building 리스트

			activeComboBox: null,
			
			sortingOptions: null,
			sortType: null,
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
			return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["선택된 센서가 없습니다."], null, null);
		}
		
		if (!selectedMaterials || selectedMaterials.length === 0) {
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

		this.setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false, searchBeginDate: beginDate, searchEndDate: endDate });
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

	onCheckedRow(checked, i) {
		const dataSource = this.state.dataSource;
		//const dataLength = dataSource.length;
		dataSource[i].checked = checked;

		this.setState({ dataSource });
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
		
		// 조회 기간
		const beginDate = this.state.searchBeginDate;
		const endDate = this.state.searchEndDate;
		
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);

		// 빈칸
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '원본일시', '센서유형', '센서명', '물질명', '값']);
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
			{ key: "no", width: 10 },
			{ key: "time", width: 20 },
			{ key: "originTime", width: 20 },
			{ key: "sensorType", width: 10 },
			{ key: "buildingName", width: 25 },
			{ key: "materialName", width: 20 },
			{ key: "value", width: 15 }
		];
		
		if (this.state.dataSource) {
			let arrDatas = [];
			for (let i = 0; i < this.state.dataSource?.length; i++) {
				const buildingID = this.state.dataSource[i].buildingID;
				const sensorDataHistories = this.state.dataSource[i].sensorDataHistories;
				
				if (sensorDataHistories.length === 0) {
					continue;
				}
				
				const building = this.props.buildingGroupList[0].buildingDatas.find(building => building.id === buildingID);
				const buildingName = building.buildingName;
				
				for (let j = 0; j < sensorDataHistories.length; j++) {
					const data = [];
					const no = arrDatas.length + 1;
					const time = sensorDataHistories[j].timeStamp;
					const originTime = sensorDataHistories[j].originTimeStamp;
					const sensorType = this.getSensorTypeFromID(sensorDataHistories[j].sensorID);
					const materialName = this.getMaterialNameFromID(sensorDataHistories[j].materialID);
					const value = sensorDataHistories[j].value;
					
					data.no = no;
					data.time = time;
					data.originTime = originTime;
					data.sensorType = sensorType;
					data.buildingName = buildingName;
					data.materialName = materialName;
					data.value = value;
					
					arrDatas.push(data);
				}
			}
			
			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					originTime: item.originTime,
					sensorType: item.sensorType,
					buildingName: item.buildingName,
					materialName: item.materialName,
					value: item.value
				}).alignment = { vertical: 'middle', horizontal: 'center' };
			});
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
	
	getMaterialNameFromID = (materialID) => {
		if (!this.props.materials || this.props.materials.length === 0)
			return '';
		
		const materials = this.props.materials;
		const material = materials.find(material => material.id === materialID);
		return material.materialName ? material.materialName : '';
	}
	
	getSensorTypeFromID = (sensorID) => {
		if (!this.props.etcSensorList?.length || !this.props.externalSensors?.length || !this.props.externalSensorTypes?.length) {
			return '';
		}

		const sensor = this.props.etcSensorList.find(sensor => sensor.id === sensorID);
		const externalSensor = this.props.externalSensors.find(sensor => sensor.zoneID === sensor?.zoneID);
		const sensorType = this.props.externalSensorTypes.find(sensorType => sensorType.id === externalSensor?.sensorType);

		return sensorType?.name || '';
	}

	// 하단 페이지 index 만들기
	getPageIndexUI() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		const pageArr = new Array();

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
		pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; if (a < b) return -1; });

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

	getGridData() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (this.state.pageIndex > 1) {
			beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			ui.push(<tr key={'dataSource_' + (i)}>
				<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
				<td>{i + 1}</td>
				<td>{dataSource[i].time}</td>
				<td>{dataSource[i].name}</td>
				<td>{dataSource[i].level}</td>
				<td>{dataSource[i].teamName}</td>
				<td>{dataSource[i].targetType}</td>
				<td >{dataSource[i].actionType}</td>
				<td style={{ textAlign: 'left' }}>{dataSource[i].historyContent}</td>
			</tr>);
		}

		return ui;
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	onClickRecentlybox = () => {
		const element = document.getElementById('recentlyCheckbox');
		const elementBox = document.getElementById('recentlyBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
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

	onClickCheckbox = (e, buildingID) => {
		// const element = document.getElementById('activeCheckbox');
		// const elementBox = document.getElementById('activeBoxArea');
		//
		// element.classList.toggle('on');
		// elementBox.classList.toggle('on');
		
		let checkedBuildings = [...this.state.checkedBuildings];
		
		if (e.target.checked) {
			if (checkedBuildings.includes(buildingID)) {
				checkedBuildings.filter(id => id !== buildingID);
			} else {
				checkedBuildings.push(buildingID);
			}
		} else {
			checkedBuildings = checkedBuildings.filter(id => id !== buildingID);
		}
		
		this.setState({ checkedBuildings });
	}
	
	onChangeSensorType = (sensorTypeID) => {
		if (this.state.sensorType !== parseInt(sensorTypeID)) {
			return this.setState({ sensorType: parseInt(sensorTypeID), selectedBuildings: [HistoryResource.ExternalSensorTypes.Entire] });
		}
			
		this.setState({ sensorType: parseInt(sensorTypeID) });
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
			
			if (sensorType === CheckboxOptions.EntireType) {
				
			}
			
			let strSensor = '';
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
	
	getBuildingGridData = () => {
		const dataSource = this.state.dataSource;
		const buildingGroupList = this.props.buildingGroupList;
		
		let ui = [];

		if (!dataSource || dataSource.length === 0) {
			return ui;
		}
		
		if (!buildingGroupList) {
			return ui;
		}
		
		const buildings = buildingGroupList[0].buildingDatas;
		let { pageIndex, pageSize } = this.state;
		let paginatedDataSource = [];
		
		paginatedDataSource = dataSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
		
		for (let i = 0; i < paginatedDataSource.length; i++) {
			let strID = "";
			let strClassName = "";
			const data = paginatedDataSource[i];
			let targetBuilding = buildings.find(building => building.id === paginatedDataSource[i].buildingID);
			
			if (data.sensorDataHistories.length > 0) {
				strID = "activeBoxArea";
				strClassName = "activeBoxArea";

				ui.push(
					<tr key={targetBuilding.id} id={strID} className={strClassName} onClick={() => this.onClickBuilding(targetBuilding.id)}>
						<td><input type="checkbox" id={strID} className={strClassName} checked={this.state.checkedBuildings.includes(targetBuilding.id)}
								   onChange={(e) => this.onClickCheckbox(e, targetBuilding.id)}/></td>
						<td>{i + 1 + ((pageIndex - 1) * 15)}</td>
						<td>{targetBuilding.buildingName}</td>
					</tr>
				)
			} else {
				strClassName = "checkDisable";
				ui.push(
					<tr key={targetBuilding.id} className={strClassName}>
						<td><input type={"checkbox"}/></td>
						<td>{i + 1 + ((pageIndex - 1) * 15)}</td>
						<td>{targetBuilding.buildingName}</td>
					</tr>
				)
			}
		}

		return ui;
	}
	
	onClickBuilding = (buildingID) => {
		this.setState({ selectedBuildingID: buildingID });
	}
	
	getRowGirdData = () => {
		const dataSource = this.state.dataSource;
		const selectedBuildingID = this.state.selectedBuildingID;
		const materials = this.props.materials;
		
		const sortType = this.state.sortType;
		
		let ui = [];
		
		if (!dataSource || dataSource.length === 0 || !materials || !selectedBuildingID)
			return ui;
		
		const targetDataSource = dataSource.find(data => data.buildingID === selectedBuildingID);
		if (!targetDataSource)
			return ui;
		
		const buildingID = targetDataSource.buildingID;
		let dataList = targetDataSource.sensorDataHistories.reduce((acc, curr) => {
			const timeKey = curr.timeStamp.substring(0, 16); // 'YYYY-MM-DD HH:MM' 형식으로 분단위까지 묶기
			if (!acc[timeKey]) {
				acc[timeKey] = [];
			}
			acc[timeKey].push(curr);
			return acc;
		}, {});
		
		if (sortType === -1) {
			const keys = Object.keys(dataList);
			keys.sort((a, b) => {
				return a > b ? -1 : 1;
			});
			
			let sortedDataList = {};
			keys.forEach(key => {
				sortedDataList[key] = dataList[key];
			});
			dataList = sortedDataList;
		}
		
		if (sortType && sortType !== -1) {
			const sortedEntries = Object.entries(dataList).sort((a, b) => {
				const aElement = a[1].find(element => element.materialID === sortType);
				const bElement = b[1].find(element => element.materialID === sortType);
				if (!aElement || !bElement)
					return 1;
				
				return aElement.value > bElement.value ? -1 : 1;
			});
			
			const sortedObj = Object.fromEntries(sortedEntries);
			dataList = sortedObj;
		}
		
		const findElement = (list, materialID) => {
			
			let target = list.find(element => element.materialID === materialID);
			if (!target)
				return ' ';
			
			if (materialID === HistoryResource.MeasureMentTypes.WindDirection) {
				let windDirection = target.value;
				
				let strWindDirection = '';
				if (windDirection >= 0 && windDirection < 22.5) {
					strWindDirection = '북';
				} else if (windDirection >= 22.5 && windDirection < 67.5) {
					strWindDirection = '북동';
				} else if (windDirection >= 67.5 && windDirection < 112.5) {
					strWindDirection = '동';
				} else if (windDirection >= 112.5 && windDirection < 157.5) {
					strWindDirection = '남동';
				} else if (windDirection >= 157.5 && windDirection < 202.5) {
					strWindDirection = '남';
				} else if (windDirection >= 202.5 && windDirection < 247.5) {
					strWindDirection = '남서';
				} else if (windDirection >= 247.5 && windDirection < 292.5) {
					strWindDirection = '서';
				} else if (windDirection >= 292.5 && windDirection < 337.5) {
					strWindDirection = '북서';
				} else {
					strWindDirection = '북';
				}
				return strWindDirection;
			}
			
			let value = target.value;
			
			return Number.isInteger(value) ? value.toString() : value.toFixed(5).replace(/\.?0+$/, '');
			
		}
		
		for (let key in dataList) {
			const data = dataList[key];
			ui.push(
				<li key={key}>
					<div><p>{key.replace('T', ' ')}</p></div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.Temperature)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.Humidity)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.CO2)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.NH3)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.H2S)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.VOC)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.PM10)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.PM25)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.WindDirection)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.WindSpeed)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.CO)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.NO2)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.SO2)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.UV)}</div>
					<div>{findElement(dataList[key], HistoryResource.MeasureMentTypes.O3)}</div>
				</li>
			);
		}

		return ui;
	}
	
	onClickSort = (materialID) => {
		if (this.state.sortType === materialID) {
			return this.setState({ sortType: null });
		}
		
		this.setState({ sortType: materialID });
	}

	getMaterialHeader = () => {
		const materials = this.props.materials;
		const externalMaterials = this.props.externalMaterials;
		let ui = [];
		if (!materials) {
			return ui;
		}
		
		let strOnDateClassName = this.state.sortType === -1 ? ' on' : '';
		
		ui.push(
			<div key={-1}><span className={'listText'}>측정일시</span><span className={'listIcon' + strOnDateClassName} onClick={() => this.onClickSort(-1)}></span></div>
		)

		for (let i = 0; i < materials.length; i++) {
			const material = materials[i];
			const externalMaterial = externalMaterials.find(externalMaterial => externalMaterial.materialID === material.id);
			let strOnMaterialClassName = '';
			if (this.state.sortType && this.state.sortType !== -1 && this.state.sortType === material.id) {
				strOnMaterialClassName = ' on';
			}
			
			if (!externalMaterial)
				continue;
			
			if ((!externalMaterial.min1 && !externalMaterial.max1 && !externalMaterial.min2 && !externalMaterial.max2) && !externalMaterial.info && // 임계치가 없는 물질들
				externalMaterial.materialID !== HistoryResource.MeasureMentTypes.WindDirection && externalMaterial.materialID !== HistoryResource.MeasureMentTypes.WindSpeed)
				continue;
			
			ui.push(
				<div key={material.id}><span className={'listText'}>{material.materialName}</span><span className={'listIcon' + strOnMaterialClassName} onClick={() => this.onClickSort(material.id)}></span></div>
			);
		}

		return ui;
	}

	onChangePeriodType = (periodType) => {
		this.setState({selectedPeriodType: parseInt(periodType) === 1 });
	}
	
	handlePageChange = (newPageIndex) => {
		const totalPageIndex = Math.ceil(this.state.dataSource.length / this.state.maxRowCount);
		if (newPageIndex < 1 || newPageIndex > totalPageIndex) {
			return;
		}
		this.setState({ pageIndex: newPageIndex });
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

	getMinDate = () => {
		const dtNow = new Date();
		dtNow.setMonth(dtNow.getMonth() - 1);

		return dtNow;
	}

	render() {
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		const sensorTypes = this.getSensorTypeUI();
		const materialHeader = this.getMaterialHeader();
		const gridRowData = this.getRowGirdData();
		
		const { pageIndex, pageSize } = this.state;
		
		const minDate = this.getMinDate();
		
		let totalPages = 0;
		if (this.state.dataSource && this.state.dataSource.length > 0) {
			totalPages = Math.ceil(this.state.dataSource.length / this.state.maxRowCount);
		}

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>센서 탐지 통계표</span>
						<form action="">
							<div className={'hscSch'}>
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
								{/*<a onClick={this.userHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
							</div>
						</form>

						{
							this.state.loadingIndicator === true ?
								<ul className={'hscExl'}>
									<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
									<li><a className={'all'} id={'hscsSbmting'}>선택 다운로드</a></li>
								</ul>
								:
								<ul className={'hscExl'}>
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'all'}>선택 다운로드</a></li>
								</ul>
						}

						<div className={'hscTb2'}>
							<div className={'hsTbFlex'}>
								<div className={'hsTbConts'}>
									<table>
										<colgroup>
											<col style={{ width: '15%' }} />
											<col style={{ width: '15%' }} />
											<col style={{ width: '70%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" /></th>
												<th>NO</th>
												<th>위치</th>
											</tr>
										</thead>
										<tbody>
											{this.getBuildingGridData()}
										</tbody>
									</table>
								</div>
								
								<div className={'hsTbContsNum'}>
									<ul className={'hsTbContList'}>
										<li className={'hsTbContListHead'}>
											{materialHeader}
										</li>
										<li className={'hsTbContListBody'}>
											<ul>
												{gridRowData}
											</ul>
										</li>
									</ul>
								</div>

							</div> {/* flex */}
							{
								(this.state.dataSource && this.state.dataSource.length > 0) ?
									<div className={'hscNav'}>
										<>
											<a className={'first'} onClick={() => this.handlePageChange(1)}>맨 앞</a>
											<a className={'prev'} onClick={() => this.handlePageChange(pageIndex - 1)}>이전</a>
										</>
										<ul>
											{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
												const startIndex = Math.max(0, Math.min(totalPages - 5, pageIndex - 3));
												const pageNumber = startIndex + i + 1;
												return (
													<li key={i} className={pageIndex === pageNumber ? 'on' : null}>
														<a onClick={() => this.handlePageChange(i + 1)}>{i + 1}</a>
													</li>
												);
											})
											}
										</ul>
										<>
											<a className={'next'} onClick={() => this.handlePageChange(pageIndex + 1)}>다음</a>
											<a className={'last'} onClick={() => this.handlePageChange(totalPages)}>맨 뒤</a>
										</>
									</div>
									: <> </>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ReportHistory;