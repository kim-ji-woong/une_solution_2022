import React, { Component } from 'react';
import $ from 'jquery';
import HistoryResource from '../resource/id';

import { SensorDetectHistoryComponent } from '../styled/historyStyled';
import { EventExitMemoComponent } from '../../SDMS/styled/sdmsPopupsStyled';
import { ModalBackground } from '../../Root/styled/theme';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendar from '../images/dashboard_calendar.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import memo_icon from '../images/memo_icon.png';

import ProjectResource from '../../Root/resource/id';
import { HistoryController } from '../services/historyController';
import { ExcelDownloader } from '../services/excelDownloader';

class SensorDetectHistory extends Component {
	static facilityTypes = {
		gas: 216,
		atmosphere: 240,
		emergencyBell: 114,
		cctv: 3,
		worker: 251,
		fire: 0
    }

    constructor(props) {
		super(props);

		this.state = {
			content: HistoryResource.ID.menu.sensorDetectHistory,
			facilityType: -1,
			
			selectedBuildingGroupID: -1,
			selectedBuildingID: -1,
			selectedZoneID: -1,
			
			dataSource: null,

			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),	

			searchBeginDate: "",
			searchEndDate: "",
			searchBuildingName: "",
			searchZoneName: "",
			
			maxRowCount: 15,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index

			loadingIndicator: false, // 새로고침중인지 표시

			prevProps: null,
			workerMemo: '',
			showMemoPopup: false
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.currentPageMinID = -1;
		this.currentPageMaxID = -1;

		this.refSelectedBuilding = React.createRef();
		this.refSelectedZone = React.createRef();
	}

	componentDidMount() {
		this.onClickSearch();
	}

	onClickFacilityType = (facilityType) => {
		this.setState({ facilityType });
	}

	facilityTypeToSensorType(facilityType) {
		if (facilityType < 0) {
			return "전체";
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.gas) {
			return this.props.sensorType.gas;
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.atmosphere) {
			return this.props.sensorType.atmosphere;
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.emergencyBell) {
			return this.props.sensorType.emergencyBell;
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.cctv) {
			return this.props.sensorType.thermalCamera;
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.worker) {
			return this.props.sensorType.worker;
		}
		else if (facilityType === SensorDetectHistory.facilityTypes.fire) {
			return this.props.sensorType.fire;
		}

		return "";
    }

    getSensorTypeUI = () => {
		const sensorType = this.props.sensorType;
		let sensorTypeUI = [];

        sensorTypeUI.push(
			<>
				<li><input type="radio" name="hscsType" id="hscsType216" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.gas)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.gas} /><label htmlFor="hscsType216">{sensorType.gas}</label></li>
				<li><input type="radio" name="hscsType" id="hscsType240" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.atmosphere)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.atmosphere} /><label htmlFor="hscsType240">{sensorType.atmosphere}</label></li>
				<li><input type="radio" name="hscsType" id="hscsType114" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.emergencyBell)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.emergencyBell} /><label htmlFor="hscsType114">{sensorType.emergencyBell}</label></li>
				<li><input type="radio" name="hscsType" id="hscsType3" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.cctv)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.cctv} /><label htmlFor="hscsType3">{sensorType.thermalCamera}</label></li>
				<li><input type="radio" name="hscsType" id="hscsType251" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.worker)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.worker} /><label htmlFor="hscsType251">{sensorType.worker}</label></li>
				<li><input type="radio" name="hscsType" id="hscsType0" onChange={() => this.onClickFacilityType(SensorDetectHistory.facilityTypes.fire)} checked={this.state.facilityType === SensorDetectHistory.facilityTypes.fire} /><label htmlFor="hscsType0">{sensorType.fire}</label></li>
			</>
		);

		return sensorTypeUI;
	}

	onChangeBuilding = (target) => {
		this.setState({ selectedBuildingID: Number(target.value), selectedZoneID: -1 });
	}

	onChangeZone = (target) => {
		this.setState({ selectedZoneID: Number(target.value) });
	}

	getSpatailUI() {
		const buildingGroupList = this.props.buildingGroupList;
		const outdoorZones = this.props.outdoorZones;

		let buildingUI = [];
		let zoneUI = [];

		buildingUI.push(<option key={'buildingOption_-1'} value="-1">건물 전체</option>);
		zoneUI.push(<option key={'zoneOption_-1'} value="-1">층 전체</option>);

		if (!buildingGroupList) {
			return [buildingUI, zoneUI];
		}
		else {
			const buildingLength = buildingGroupList.buildingDatas?.length;

			for (let i = 0; i < buildingLength; i++) {
				const building = buildingGroupList.buildingDatas[i];

				if (this.state.selectedBuildingID === building.id) {
					buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id} selected>{building.displayText}</option>);
	
					const zoneLength = building.zoneDatas.length;

					for (var j = 0; j < zoneLength; j++) {
						const zone = building.zoneDatas[j];

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

			if(outdoorZones) {
				const outdoorZone = outdoorZones[0];

				buildingUI.push(<option key={'buildingOption_' + outdoorZone.id} value={outdoorZone.id}>{outdoorZone.displayText}</option>);

				if (this.state.selectedBuildingID === outdoorZone.id) {
					zoneUI.push(<option key={'zoneOption_' + outdoorZone.id} value={outdoorZone.id}>{outdoorZone.displayText}</option>);
				}
			}
	
			return [buildingUI, zoneUI];
		}
	}

	onChangeBegin = (date) => {
		this.setState({ beginDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		// let year = date.getFullYear();
		// let month = date.getMonth() + 1;
		// let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		// let year = date.getFullYear();
		// let month = date.getMonth() + 1;
		// let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
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

		// let year = today.getFullYear();
		// let month = today.getMonth() + 1;
		// let day = today.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		this.setState({ beginDate: date, endDate: today, dateType: dateType });
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
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={'on'}><a href="javascript:void(0)" onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
			else {
				ui.push(<li key={'pageIndex_' + (pageIndex)}><a href="javascript:void(0)" onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
		}

		return ui;
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

	getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();                   //d
		day = day >= 10 ? day : '0' + day;

		let strDate = year + '-' + month + '-' + day;
		return strDate;
	}

	onClickSearch = async () => {
		const campusID = ProjectResource.campusID;

		if(campusID) {

			$("body").css("cursor", "wait");
	
			const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
			const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';
	
			if (beginDate > endDate) {
				$("body").css("cursor", "default");
				this.props.showConfirmDialog(['조회 기간을 다시 선택하세요'], null, null, 'error');
				return;
			}
	
			await this.setState({ loadingIndicator: true })
			
			const buildingGroupID = this.state.selectedBuildingGroupID;
			const buildingID = this.state.selectedBuildingID;
			const zoneID = this.state.selectedZoneID;
			const facilityType = this.state.facilityType;
			
			const [dataSource, message] = await HistoryController.requestDetectHistories(facilityType, buildingGroupID, buildingID, zoneID, beginDate, endDate, -1, campusID); 

			if (message !== '' || message?.length > 0) {
				this.props.showConfirmDialog([message], null, null, 'error');	
				$("body").css("cursor", "default");	
				await this.setState({ loadingIndicator: false });
				return;
			}

			const datacount = dataSource?.length;
			const value1 = parseInt(datacount / this.state.maxRowCount);
			const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
			let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);
				
			$("body").css("cursor", "default");

			this.setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false, searchBuildingName: this.getSelectedBuildingText(), searchZoneName: this.getSelectedZoneText(), searchBeginDate: beginDate, searchEndDate: endDate });
		}
	}

	getSelectedBuildingText() {
		const selectedBuildingID = this.refSelectedBuilding.current.value;

		for (const option of this.refSelectedBuilding.current.options) {
			if (option.value === selectedBuildingID) {
				return option.text;
            }
		}

		return "";
	}

	getSelectedZoneText() {
		const selectedZoneID = this.refSelectedZone.current.value;

		for (const option of this.refSelectedZone.current.options) {
			if (option.value === selectedZoneID) {
				return option.text;
			}
		}

		return "";
	}

	onCheckedRow(checked, index) {
		const dataSource = this.state.dataSource;
		const datacount = dataSource?.length;
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

	onClickShowMemo = (memo, value) => {
		this.setState({ workerMemo: memo, showMemoPopup: value });
	}

	getGridData() {		
		let ui = [];
		if (!this.state.dataSource) {
			return [ui, false];
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource?.length;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부
		let trClassName = '';

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (this.state.pageIndex > 1) {
			beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
		}
		
		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			if (dataSource[i].checked) {
				trClassName = 'on';
			}
			else {
				trClassName = '';
			}

			ui.push(
				<tr key={'dataSource_' + (i)} className={trClassName}>
					<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{i + 1}</td>
					{/* <td>{dataSource[i].sensorZoneHistoryID}</td> */}
					<td>{dataSource[i].time}</td>
					<td>{dataSource[i].endTime ? dataSource[i].endTime : '-'}</td>
					<td>{dataSource[i].type}</td>
					<td>{dataSource[i].sensorName}</td>
					<td>{dataSource[i].zoneName}</td>
					<td>{dataSource[i].detectInfo}</td>
					<td>{dataSource[i].alarmLevel}</td>
					<td>{dataSource[i].sopName ? dataSource[i].sopName : '-'}</td>
					<td className='memo'>
						{
							dataSource[i].memo ?
								<button onClick={() => this.onClickShowMemo(dataSource[i].memo, true)}><img src={memo_icon} alt='조치사항 상세보기' /></button>
								: '-'
						}
					</td>
				</tr>
			);

			rowCount++;
			if (allChecked && !dataSource[i].checked) {
				allChecked = false;
            }
		}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
        }

		return [ui, allChecked];
	}

	onClickDownload = () => {
		ExcelDownloader.downloadDetectSensor(this.state.dataSource, this.state.searchBeginDate, this.state.searchEndDate, this.state.searchBuildingName + " " + this.state.searchZoneName, this.facilityTypeToSensorType(this.state.facilityType), false);
	}

	onClickSelectDownload = () => {
		ExcelDownloader.downloadDetectSensor(this.state.dataSource, this.state.searchBeginDate, this.state.searchEndDate, this.state.searchBuildingName + " " + this.state.searchZoneName, this.facilityTypeToSensorType(this.state.facilityType), true);
    }

    render() {
		const [buildingUI, zoneUI] = this.getSpatailUI();
        const sensorTypeUI = this.getSensorTypeUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const dataSource = this.state.dataSource;

        return (
			<>
            <SensorDetectHistoryComponent id={'hsback'} $tbheight={dataSource?.length > 0}>
                <div id={'hsty'}>						
                    <div id={'hsLft'}>
                        <ul className={'hslMenu'}>								
                            <li><a href="javascript:void(0)" onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectHistory)} className={'on'}>센서 탐지 이력</a></li>
                            <li><a href="javascript:void(0)" onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectAnalysis)}>센서 탐지 분석</a></li>
                            <li><a href="javascript:void(0)" onClick={() => this.props.changeContent(HistoryResource.ID.menu.sopHistory)}>SOP 이력</a></li>
                        </ul>
                    </div>
                    <div className={'hsScr'}>
                        <div id={'hsCont'}>
                            <form action="">
                                <div className={'hscSch'}>
                                    <dl>
                                        <dt>센서유형</dt>
                                        <dd>
                                            <ul className={'hscsRdo'}>
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">전체</label></li>
                                                {sensorTypeUI}
                                            </ul>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>위치</dt>
                                        <dd>
                                            <ul className={'hscsLoc'}>
                                                <li>
													<select ref={this.refSelectedBuilding} name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'selWh'}>
                                                        {buildingUI}
                                                    </select>
                                                </li>
                                                <li>
													<select ref={this.refSelectedZone} name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'selWh'}>
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
                                                        <img src={btnCalendar} alt="" className={'btnCalendar'} onClick={this.onClickDatepicker01} />
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
                                                        <img src={btnCalendar} alt="" className={'btnCalendar'} onClick={this.onClickDatepicker02} />
                                                    </div>
                                                </li>
                                            </ul>
                                            <ul className={'hscsRdo right'}>
                                                <li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
                                                <li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
                                                <li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
                                                <li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
                                                <li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">1년</label></li>
                                            </ul>
                                        </dd>
                                    </dl>
                                    {
                                        this.state.loadingIndicator === true ?
                                            <a href="javascript:void(0)" className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
                                            :
                                            <a href="javascript:void(0)" onClick={() => this.onClickSearch()} className={'hscsSbmt'}><span><span>검색</span></span></a>
                                    }
                                </div>
                            </form>

							{
								this.state.loadingIndicator === true ?
									<ul className={'hscExl'}>
										<li><a href="javascript:void(0)" className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
										<li><a href="javascript:void(0)" className={'exl'} id={'hscsSbmting'}>다운로드</a></li>
									</ul>
									:
									<ul className={'hscExl'}>
										<li><a href="javascript:void(0)" onClick={() => this.onClickDownload()} className={'all'}>전체 다운로드</a></li>
										<li><a href="javascript:void(0)" onClick={() => this.onClickSelectDownload()} className={'exl'}>다운로드</a></li>
									</ul>
							}

                            <div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '3%' }} />
											<col style={{ width: '4%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '13%' }} />
											<col style={{ width: '7%' }} />
											<col style={{ width: '7%' }} />
											<col style={{ width: '17%' }} />
											<col style={{ width: '5%' }} />
										</colgroup>
										<thead>
											<tr>
												{
                                                    this.state.dataSource?.length > 0 ? 
                                                    <th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)}/></th>
                                                    : <th><input type="checkbox" checked={false} disabled /></th>
                                                }
												<th>No.</th>
												<th>일시</th>
												<th>종료일시</th>
												<th>유형</th>
												<th>센서명</th>
												<th>위치</th>
												<th>탐지정보</th>
												<th>단계</th>
                                                <th>대응SOP</th>
                                                <th>조치사항</th>
											</tr>
										</thead>
										<tbody>
											{
												dataSource?.length > 0 ?
													gridUI :
													<tr className='noData'>
														<td colSpan={11}>조회된 데이터가 없습니다.</td>
													</tr>
											}
										</tbody>
									</table>
								</div>
								{
										(this.state.dataSource && this.state.dataSource?.length > 0) ?
											<div className={'hscNav'}>
												<a href="javascript:void(0)" className={'first'} onClick={() => this.setPageIndex(1)}>맨앞</a>
												<a href="javascript:void(0)" className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>
												<ul>
													{pageIndexUI}
												</ul>
												<a href="javascript:void(0)" className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a>
												<a href="javascript:void(0)" className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>맨뒤</a>
											</div>
											: <> </>
									}
							</div>
                        </div>
                    </div>
                </div>
            </SensorDetectHistoryComponent>
			{
				this.state.showMemoPopup &&
				<WorkerMemoPopup
					workerMemo={this.state.workerMemo}
					onClickShowMemo={this.onClickShowMemo}
				/>
			}
			</>
        );
    }
}

export default SensorDetectHistory;

// 작업자 조치사항 팝업
class WorkerMemoPopup extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        return (
            <ModalBackground className='UI_Section'>
            <EventExitMemoComponent className='UI_Section'>
                <div className={'dslTop'}>
                    <h5 className={'dslTitle'} >
                        조치사항
                    </h5>
                    <div className={'dslX'} onClick={() => this.props.onClickShowMemo('', false)}>
                        <a href="javascript:void(0)">닫기버튼</a>
                    </div>
                </div>

                <div className='dslCont history'>
					<div>
						<p>{this.props.workerMemo}</p>
					</div>
                </div>
            </EventExitMemoComponent>
            </ModalBackground>
        );
    }
}