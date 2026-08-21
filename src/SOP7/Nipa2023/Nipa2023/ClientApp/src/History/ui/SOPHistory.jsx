import React, { Component } from 'react';
import $, { data } from 'jquery';
import HistoryResource from '../resource/id';
import styles from '../../Common/css/style.module.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendar from '../images/dashboard_calendar.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import ProjectResource from '../../Root/resource/id';
import { HistoryController } from '../services/historyController';

import { SOPHistoryComponent } from '../styled/historyStyled';
import SOPHistoryDetailInfo from './popup/SOPHistoryDetailInfo';
import { SopHistoryController } from '../../SOPSimulator/services/sopHistoryController';
import { ExcelDownloader } from '../services/excelDownloader';

class SOPHistory extends Component {
    constructor(props) {
		super(props);

		this.state = {
			content: HistoryResource.ID.menu.sopHistory,

			subContent: null,
			selectedData: null,

			facilityType: -1,
			
			dataSource: null,

			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),	
			
			selectDisasterType: -1,
			selectDisasterTypeName: '전체',
			selectActionStep: '전체',
			selectUserName: '',
			
			maxRowCount: 15,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index

			loadingIndicator: false, // 새로고침중인지 표시

			prevProps: null,

			showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.currentPageMinID = -1;
		this.currentPageMaxID = -1;

		this.props = props;
	}

	componentDidMount() {
		this.display();
	}

	handleTooltip = (e, data) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {

            this.setState({
                showTooltip: !this.state.showTooltip,
                tooltipTop: parentNode.top + 37,
                tooltipLeft: parentNode.left,
                tooltipContent: data
            });
        }
    }

    removeTooltip = () => {
        this.setState({ showTooltip: false });
    }

	async display() {
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
	
			await this.setState({ loadingIndicator: true });

			const selectDisasterType = parseInt(this.state.selectDisasterType);
			const selectActionStep = this.state.selectActionStep;
			const selectUserName = this.state.selectUserName;

			const [dataSource, message] = await SopHistoryController.requestSOPHistories(beginDate, endDate, selectDisasterType, selectActionStep, selectUserName, campusID);

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

			this.setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false, searchBeginDate: beginDate, searchEndDate: endDate });
		}
	}

    onChangeBegin = (date) => {
		this.setState({ beginDate: date });
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

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	onChangeDisasterType = (value) => {
		const disasterType = document.getElementById("disasterType");
		let text = (disasterType.options[disasterType.selectedIndex].text);

		this.setState({ selectDisasterType: value, selectDisasterTypeName: text });
    }

	onChangeStep = (value) => {
		this.setState({ selectActionStep: value });
	}

	onChangeSelectedUser = (value) => {
		this.setState({ selectUserName: value });
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

	onDetailInfo = (data) => {
		this.setState({ selectedData: data, subContent: HistoryResource.ID.menu.detailHistory });
	}

	changeSubContent = (subContent) => {
		this.setState({ subContent });
	}

	getSubDisasterCategories() {
		const sopSubDisasterCategory = this.props.sopSubDisasterCategory;

		let ui = [];
		ui.push(<option key={'disaster_all'} value="-1">전체</option>);

		if (sopSubDisasterCategory) {
			for (let i = 0; i < sopSubDisasterCategory.length; i++) {
				if (this.state.selectDisasterType === sopSubDisasterCategory[i].subCategoryName) {
					ui.push(<option key={'disaster_' + i} value={sopSubDisasterCategory[i].id} selected>{sopSubDisasterCategory[i].subCategoryName}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={sopSubDisasterCategory[i].id}>{sopSubDisasterCategory[i].subCategoryName}</option>);
				}
			}
		}

		return ui;
	}
	/*getDisasterCategories() {
		const sopDisasterCategory = this.props.sopDisasterCategory;

		let ui = [];
		ui.push(<option key={'disaster_all'} value="-1">전체</option>);

		if (sopDisasterCategory) {
			for (let i = 0; i < sopDisasterCategory.length; i++) {
				if (this.state.selectDisasterType === sopDisasterCategory[i].categoryName) {
					ui.push(<option key={'disaster_' + i} value={sopDisasterCategory[i].id} selected>{sopDisasterCategory[i].categoryName}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={sopDisasterCategory[i].id}>{sopDisasterCategory[i].categoryName}</option>);
				}
            }
        }

		return ui;
	}*/

	getActionStepNames() {
		const actionStepName = this.props.actionStepName;

		let ui = [];
		ui.push(<option key={'actionStep_all'} value="전체">전체</option>);

		if (actionStepName) {
			for (let i = 0; i < actionStepName.length; i++) {
				if (this.state.selectActionStep === actionStepName[i]) {
					ui.push(<option key={'actionStep_' + i} value={actionStepName[i]} selected>{actionStepName[i]}</option>);
				}
				else {
					ui.push(<option key={'actionStep_' + i} value={actionStepName[i]}>{actionStepName[i]}</option>);
				}
            }
        }

		return ui;
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
                    <td>{dataSource[i].disasterName}</td>
                    <td>{dataSource[i].sopName}</td>
                    <td>{dataSource[i].actionStepName}</td>
                    <td>{dataSource[i].sensorName ? dataSource[i].sensorName : '-'}</td>
                    <td>
						<span
							onMouseOver={(e) => this.handleTooltip(e, dataSource[i].position)}
							onMouseLeave={() => this.removeTooltip()}
						>
							{dataSource[i].position}
						</span>
					</td>
                    <td>{dataSource[i].beginTime}</td>
                    <td>{dataSource[i].endTime}</td>
                    <td>{dataSource[i].userName ? dataSource[i].userName : '-'}</td>
                    <td>
                        <button className='detailBtn' onClick={() => this.onDetailInfo(dataSource[i])}>상세정보</button>
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
		ExcelDownloader.downloadSOPHistory(this.state.dataSource, this.state.searchBeginDate, this.state.searchEndDate, this.state.selectDisasterTypeName, this.state.selectActionStep, false);
	}

	onClickSelectDownload = () => {
		ExcelDownloader.downloadSOPHistory(this.state.dataSource, this.state.searchBeginDate, this.state.searchEndDate, this.state.selectDisasterTypeName, this.state.selectActionStep, true);
    }

	render() {
		const categories = this.getSubDisasterCategories();
		//const categories = this.getDisasterCategories();
		const actionStepNamesUI = this.getActionStepNames();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const dataSource = this.state.dataSource;

		const {showTooltip, tooltipTop, tooltipLeft, tooltipContent} = this.state;

        return (
			<>
			{
                showTooltip &&
                <div id={styles.tooltipArea} style={{ top: tooltipTop, left: tooltipLeft }}>
                    {tooltipContent}
                </div>
            }
            <SOPHistoryComponent id={'hsback'} $tbheight={dataSource?.length > 0}>
                <div id={'hsty'}>						
                    <div id={'hsLft'}>
                        <ul className={'hslMenu'}>								
                            <li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectHistory)}>센서 탐지 이력</a></li>
                            <li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectAnalysis)}>센서 탐지 분석</a></li>
                            <li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sopHistory)} className={'on'}>SOP 이력</a></li>
                        </ul>
                    </div>

                    <div className={'hsScr'}>
                        <div id={'hsCont'}>
                            <form action="">
                                <div className={'hscSch'}>
                                    <ul className={'hscsHalf'}>
                                        <li>
                                            <dl>
                                                <dt>SOP유형</dt>
												<dd>
                                                    <select name="" id="disasterType" onChange={(e) => this.onChangeDisasterType(e.target.value)} className={'selWh'}>
                                                        {categories}
                                                    </select>
												</dd>
											</dl>
										</li>
                                        <li>
											<dl>
                                                <dt>SOP단계</dt>
												<dd>
                                                    <select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWh'}>
														{actionStepNamesUI}
													</select>
												</dd>
											</dl>
										</li>
                                        <li>
											<dl>
                                                <dt>실행자</dt>
												<dd>
                                                    <input type="text" name="" id="" onChange={(e) => this.onChangeSelectedUser(e.target.value)} onKeyUp={this.searchEnterKey}/>
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
                                            <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
                                            :
                                            <a onClick={() => this.display()} className={'hscsSbmt'}><span><span>검색</span></span></a>
                                    }
                                </div>
                            </form>
							{
								this.state.loadingIndicator === true ?
									<ul className={'hscExl'}>
										<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
										<li><a className={'exl'} id={'hscsSbmting'}>다운로드</a></li>
									</ul>
									:
									<ul className={'hscExl'}>
										<li><a onClick={() => this.onClickDownload()} className={'all'}>전체 다운로드</a></li>
										<li><a onClick={() => this.onClickSelectDownload()} className={'exl'}>다운로드</a></li>
									</ul>
							}
                            <div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '3%' }} />
											<col style={{ width: '4%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '15%' }} />
											<col style={{ width: '4%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '8%' }} />
											<col style={{ width: '6%' }} />
										</colgroup>
										<thead>
											<tr>
                                                {
                                                    this.state.dataSource?.length > 0 ? 
                                                    <th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)}/></th>
                                                    : <th><input type="checkbox" checked={false} disabled /></th>
                                                }
												<th>NO.</th>
												<th>SOP유형</th>
												<th>SOP이름</th>
												<th>SOP단계</th>
												<th>센서명</th>
												<th>위치</th>
												<th>시작시간</th>
												<th>종료시간</th>
												<th>실행자</th>
												<th>상세대응이력</th>
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
											<a className={'first'} onClick={() => this.setPageIndex(1)}>맨앞</a>
											<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>
											<ul>
												{pageIndexUI}
											</ul>
											<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a>
											<a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>맨뒤</a>
										</div>
										: <> </>
								}
							</div>
                        </div>
                    </div>
                </div>
            </SOPHistoryComponent>
			{
				(this.state.subContent && this.state.subContent === HistoryResource.ID.menu.detailHistory) ?
					<SOPHistoryDetailInfo
						changeSubContent={this.changeSubContent}
						selectedData={this.state.selectedData}
					/>
					: <> </>
			}
			</>
        );
    }
}

export default SOPHistory;