import React, { Component } from 'react';

import { SOPHistoryDetailInfoComponent } from '../../styled/historyStyled';
import { ModalBackground } from '../../../Root/styled/theme';
import { SopHistoryController } from '../../../SOPSimulator/services/sopHistoryController';
import { ExcelDownloader } from '../../services/excelDownloader';

class SOPHistoryDetailInfo extends Component {

	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,
			selectComponentHistoryID: null
		}

		this.props = props;
	}

	componentDidMount() {
		this.display();
	}

	async display() {
		const [dataSource, message] = await SopHistoryController.requestComponentHistories(this.props.selectedData.actionStepHistoryID);

		if (dataSource && dataSource.length > 0) {			
			this.setState({ dataSource: dataSource, selectComponentHistoryID: dataSource[0].componentHistoryID });
		}
		else {
			this.setState({ dataSource: dataSource });
			console.log(message);
        }
	}

    onClose = () => {
		this.props.changeSubContent(null);
    }

	onClickhsmDtl = (componentHistoryID) => {
		this.setState({ selectComponentHistoryID: componentHistoryID });
	}

	getGridData() {
		let grid1 = [];
		let grid2 = [];

		if (!this.state.dataSource) {
			return [grid1, grid2];
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		for (let j = 0; j < datacount; j++) {
			grid1.push(
				<tr 
					key={'grid1_' + j}
					onClick={() => this.onClickhsmDtl(dataSource[j].componentHistoryID)}
				>
					<td>{j + 1}</td>
					<td>{dataSource[j].sectionName}</td>
					<td>{dataSource[j].teamList.join(', ')}</td>
					<td>{dataSource[j].time}</td>
					<td>{dataSource[j].strStatus}</td>
				</tr>
			);

			if (this.state.selectComponentHistoryID === dataSource[j].componentHistoryID) {
				const missionDatas = dataSource[j].missionDatas;
				const missionCount = missionDatas.length;

				for (let i = 0; i < missionCount; i++) {
					grid2.push(
						<tr key={'grid2_' + i}>
							<td>{i + 1}</td>
							<td>{missionDatas[i].sectionName}</td>
							<td>
								<div className={"scroll-wrapper hsmScr"}>
							      <span className={'hsmScrBox'}>
									{missionDatas[i].missionText}
								  </span>
								</div>
							</td>
							<td>{missionDatas[i].time}</td>
							<td>{missionDatas[i].completion}</td>
						</tr>
					);
                }
            }
        }

		return [grid1, grid2];
	}

	onClickAllDownload = () => {
		if (this.state.dataSource) {
			ExcelDownloader.downloadSOPDetail(this.state.dataSource, this.props.selectedData);
		}
	}

	render() {
		const [grid1, grid2] = this.getGridData();

		return (
            <ModalBackground>
			<SOPHistoryDetailInfoComponent id={'hsMmo'} className={'popup'}>
				<div>
					<div>
						<div className={'hsmCont sop'}>
							<div className={'hsmTitle'}>
								<h3>SOP 상세정보</h3>
								<button onClick={this.onClickAllDownload} className={'hsmExl'}>다운로드</button>
									<a href="javascript:void(0)" onClick={this.onClose} className={'hsmCls'}>닫기</a>
							</div>
							<div className={"scroll-wrapper hsmPrc"}>
								<table className={'hsmTb'}>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '40%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '15%' }} />
									</colgroup>
									<thead>
										<tr>
											<th>No.</th>
											<th>프로세스 제목</th>
											<th>전파 대상자</th>
											<th>시간</th>
											<th>완료여부</th>
										</tr>
									</thead>
									<tbody>
										{grid1}
									</tbody>
								</table>
							</div>
							<div className={"scroll-wrapper hsmDtl"} id={'hsmDtl1'}>
								<table className={'hsmTb'}>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '40%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '15%' }} />
									</colgroup>
									<thead>
										<tr>
											<th>No.</th>
											<th>임무 제목</th>
											<th>세부 임무/전파 메시지</th>
											<th>시간</th>
											<th>완료여부</th>
										</tr>
									</thead>
									<tbody>
										{grid2}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</SOPHistoryDetailInfoComponent>
            </ModalBackground>
		);
	}
}

export default SOPHistoryDetailInfo;