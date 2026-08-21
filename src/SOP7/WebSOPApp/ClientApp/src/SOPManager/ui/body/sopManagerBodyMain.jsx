import React, { Component } from 'react';

import styles from '../../../Common/css/style.module.css';
import bodyStyles from '../../css/body.module.css';
import sectionStyles from '../../../Common/css/section.module.css';

import PanelAreas from '../panelAreas';
import SopDataManager from '../../services/sopDataManager';
import ProcessImage from '../../../Common/img/sub/sop_component01.png';
import DecisionImage from '../../../Common/img/sub/sop_component02.png';
import AnnotationImage from '../../../Common/img/sub/sop_component03.png';
import EndpointImage from '../../../Common/img/sub/sop_component04.png';
import InternalImage from '../../../Common/img/sub/sop_component05.png';
import SopController from '../../services/sopController';
import ComponentProperties from '../components/componentProperties';
import SopManager from '../sopManager';

import { SopManagerBodyMainComponent } from '../../styled/sopManagerStyled';

import SopManagerResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class SopManagerBodyMain extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.props = props;

		this.state =
		{
			currentMenu: { menuType: "" },
			sopData: this.props.sopData,
			menuType: SopManagerBodyMain.Menu_None,
			menuDatas: null,
			// 복사, 붙여넣기, 잘라내기등을 위한 데이터
			editDatas:
			{
				command: "",
				sectionCellDatas: null
            },
			selectedSectionData: [],
			selectedArrowData: [],
			actionStepName: SopManagerBodyMain.getActionStepName(this.props.sopData),
			loading: true,
			rowCount: SopManagerBodyMain.getRowCount(this.props.sopData),
			columnCount: SopManagerBodyMain.getColumnCount(this.props.sopData),
			specialMessage:
			{
				messages: [],
				currentID: -1,
				currentMessage: "",
			},
			prevProps: this.props
		};

		this.refSpLft = React.createRef();
		this.refSpWrap = React.createRef();
		this.refDTActionStep = React.createRef();
		this.refDDActionStep = React.createRef();
		this.refDDComponent = React.createRef();
		this.refDDSpecialCharacter = React.createRef();
		this.refUserDefined = React.createRef();
		this.refRadioActionStep1 = React.createRef();
		this.refRadioActionStep2 = React.createRef();
		this.refRadioActionStep3 = React.createRef();
		this.refRadioActionStep4 = React.createRef();
		this.refRadioNormal = React.createRef();
		this.refRadioAbnormal = React.createRef();
		this.refProcessImage = React.createRef();
		this.refDecisionImage = React.createRef();
		this.refAnnotationImage = React.createRef();
		this.refEndpointImage = React.createRef();
		this.refInternalImage = React.createRef();

		this.selectedCells = {};
	}

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		return {
			currentMenu: { menuType: "" },
			sopData: props.sopData,
			menuType: SopManagerBodyMain.Menu_None,
			menuDatas: null,
			// 복사, 붙여넣기, 잘라내기등을 위한 데이터
			editDatas: state.editDatas,
			selectedSectionData: [],
			selectedArrowData: [],
			actionStepName: SopManagerBodyMain.getActionStepName(props.sopData),
			loading: true,
			rowCount: SopManagerBodyMain.getRowCount(props.sopData),
			columnCount: SopManagerBodyMain.getColumnCount(props.sopData),
			specialMessage: state.specialMessage,
			prevProps: props
		};
	}

	static getActionStepName(sopData) {
		if (sopData?.actionStepDatas) {
			if (sopData.currentActionStep?.stepName) {
				return sopData.currentActionStep.stepName;
			}

			const actionStepCount = sopData.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = sopData.actionStepDatas[i];

				if (actionStepData.actionStep) {
					return actionStepData.stepName;
                }
            }
		}

		return SopManagerResource.actionStep._1st;
    }

	onSelectComponent = (sectionData, actionStep) => {
		if (sectionData) {
			this.props.sopData.selectedTime = new Date();
		}

		this.setState({ selectedSectionData: [sectionData, actionStep], selectedArrowData: [] });
	}

	onSelectArrow = (arrow, actionStep) => {
		this.setState({ selectedArrowData: [arrow, actionStep], selectedSectionData: [] });
    }

	componentDidMount() {
		if (this.state.sopData?.disaster) {
			this.init(this.state.sopData.disaster);
		}
		
		this.refProcessImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.component.프로세스));
		this.refDecisionImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.component.판단));
		this.refAnnotationImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.component.설명));
		this.refEndpointImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.component.시작_끝));
		this.refInternalImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.component.상황전파));
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.editDatas.command === prevState.editDatas.command && this.state.editDatas.command.length > 0) {
			this.setState({
				editDatas:
				{
					command: "",
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
        }
	}

	static getRowCount(sopData) {
		if (sopData) {
			if (sopData.currentActionStep) {
				if (sopData.currentActionStep.stepMemberDatas) {
					if (sopData.currentActionStep.stepMemberDatas.length > 0) {
						const stepMemberData = sopData.currentActionStep.stepMemberDatas[0];

						if (stepMemberData.grid) {
							if (stepMemberData.grid.rows) {
								return stepMemberData.grid.rows.length;
							}
						}
					}
				}
			}
		}

		return 30;
	}

	static getColumnCount(sopData) {
		if (sopData) {
			if (sopData.currentActionStep) {
				if (sopData.currentActionStep.stepMemberDatas) {
					if (sopData.currentActionStep.stepMemberDatas.length > 0) {
						const stepMemberData = sopData.currentActionStep.stepMemberDatas[0];

						if (stepMemberData.grid) {
							if (stepMemberData.grid.columns) {
								return stepMemberData.grid.columns.length;
							}
						}
					}
				}
			}
		}

		return 30;
	}

	onDragStart(event, imgName)
	{
		event.dataTransfer.setData("text/plain", imgName);
		/*const img = new Image();
		img.src = event.target.src;
		event.dataTransfer.setDragImage(img, 0, 0);*/
		event.dataTransfer.dropEffect = "copy";
    }

	init(disasterData) {
		this.onClickDt(this.refDTActionStep.current, this.refDDActionStep);

		/*this.initActionSteps(disasterData);
		
		if (disasterData.version) {
			this.setState({ isNormal: disasterData.version.isNormal });
        }*/
	}

	initActionSteps(disasterData) {
		if (disasterData.actionSteps && disasterData.actionSteps.length > 0) {
			const actionStepCount = disasterData.actionSteps.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStep = disasterData.actionSteps[i];

				if (actionStep.actionStep === null) {
					actionStep.actionStep = SopDataManager.makeNewActionStep(actionStep.stepName, disasterData.disaster ? disasterData.disaster.id : -1);
				}
			}
		}
		else {
			disasterData.actionSteps = [];
			let actionStepName = "";

			for (let i = 0; i < 4; i++) {
				if (i === 0) {
					actionStepName = SopManagerResource.actionStep._1st;
				}
				else if (i === 1) {
					actionStepName = SopManagerResource.actionStep._2nd;
				}
				else if (i === 2) {
					actionStepName = SopManagerResource.actionStep._3rd;
				}
				else/* if (i === 3)*/ {
					actionStepName = SopManagerResource.actionStep._4th;
				}

				const actionStep = SopDataManager.makeNewActionStep(actionStepName, disasterData.disaster ? disasterData.disaster.id : -1);
				const actionStepData = SopDataManager.makeNewActionStepData(actionStepName, actionStep);
				disasterData.actionSteps.push(actionStepData);
			}
        }

		const firstActionStep = disasterData.actionSteps[0];
		this.selectActionStep(firstActionStep.stepName);
    }

	OnClickSplTgl = (event) => {
		if (event.target.classList.contains('on')) {
			event.target.classList.remove('on');
			this.refSpWrap.current.classList.remove('on');
			this.refSpLft.current.classList.remove('on');
			/*this.refSpWrap.current.animate({ 'left': '0px' });
			this.refSpLft.current.animate({ 'padding-left': '410px' });*/
		}
		else {
			event.target.classList.add('on');
			this.refSpWrap.current.classList.add('on');
			this.refSpLft.current.classList.add('on');
			/*this.refSpWrap.current.animate({ 'left': '-390px' });
			this.refSpLft.current.animate({ 'padding-left': '20px' });*/
		}
	}

	onAddComponent = (sectionData, actionStep) => {
		if (sectionData === null) {
			return;
		}

		this.addComponent(sectionData, actionStep);
	}

	async addComponent(sectionData, actionStep) {
		let stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember === null) {
			const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStep);

			if (stepMemberData === null) {
				alert(message);
				return;
			}

			stepMember = stepMemberData;
		}

		if (stepMember !== null) {
			const _sectionData = SopDataManager.getSectionData(stepMember, sectionData.gridColumnIndex, sectionData.gridRowIndex);

			if (_sectionData === null) {
				stepMember.sections.push(sectionData);
			}
			else {
				SopDataManager.copySectionData(sectionData, _sectionData);
			}

			if (sectionData.gridColumnIndex === this.state.columnCount - 1) {
				this.setState({ columnCount: this.state.columnCount + 1 });
			}
			else if (sectionData.gridRowIndex === this.state.rowCount - 1) {
				this.setState({ rowCount: this.state.rowCount + 1 });
			}
			else {
				this.setState({ loading: false });
			}
		}
	}

	onRemoveComponent = (columnIndex, rowIndex, actionStep) => {
		this.removeComponent(columnIndex, rowIndex, actionStep);
	}

	async removeComponent(columnIndex, rowIndex, actionStep) {
		const stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember === null) {
			const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStep);

			if (stepMemberData === null) {
				alert(message);
				return;
			}

			stepMember = stepMemberData;
		}

		if (stepMember !== null) {
			if (stepMember.sections) {
				for (let i = 0; i < stepMember.sections.length; i++) {
					const sectionData = stepMember.sections[i];

					if (sectionData.gridColumnIndex === columnIndex && sectionData.gridRowIndex === rowIndex) {
						this.removeArrows(columnIndex, rowIndex, stepMember);
						stepMember.sections.splice(i, 1);
						this.setState({ selectedSectionData: [] });
						break;
					}
				}
			}
		}
	}

	removeArrow(arrowData, actionStep) {
		const stepMemberCount = actionStep.stepMemberDatas.length;

		for (let i = 0; i < stepMemberCount; i++) {
			const stepMember = actionStep.stepMemberDatas[i];
			const arrowCount = stepMember.arrows.length;

			for (let j = arrowCount - 1; j >= 0; j--) {
				const arrow = stepMember.arrows[j];

				if (arrow.beginCell === arrowData.beginCell &&
					arrow.endCell === arrowData.endCell &&
					arrow.beginPosition === arrowData.beginPosition &&
					arrow.endPosition === arrowData.endPosition) {
					stepMember.arrows.splice(j, 1);
					this.setState({ selectedSectionData: [] });
					return;
                }
            }
        }
    }

	removeArrows(columnIndex, rowIndex, stepMember) {
		const arrowCount = stepMember.arrows.length;

		for (let i = arrowCount - 1; i >= 0; i--) {
			const arrow = stepMember.arrows[i];

			if ((arrow.getColumnIndex(true) === columnIndex && arrow.getRowIndex(true) === rowIndex) ||
				(arrow.getColumnIndex(false) === columnIndex && arrow.getRowIndex(false) === rowIndex)) {
				stepMember.arrows.splice(i, 1);
            }
        }
    }

	selectActionStep(actionStepName) {
		if (this.state.sopData?.actionStepDatas) {
			const actionStepCount = this.state.sopData.actionStepDatas.length;
			const sopData = this.state.sopData;

			if (actionStepName === SopManagerResource.actionStep._1st && actionStepCount > 0) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[0];
			}
			else if (actionStepName === SopManagerResource.actionStep._2nd && actionStepCount > 1) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[1];
			}
			else if (actionStepName === SopManagerResource.actionStep._3rd && actionStepCount > 2) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[2];
			}
			else if (actionStepName === SopManagerResource.actionStep._4th && actionStepCount > 3) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[3];
			}
		}

		this.setState({actionStepName: actionStepName});
	}

	getSOPName() {
		if (this.state.sopData?.disaster?.disaster) {
			const sopName = this.state.sopData.disaster.disaster.disasterName;

			if (this.state.sopData.disaster.version) {
				const mode = this.state.sopData.disaster.version.isNormal ? "(" + i18n.t('sopManager.formText.주간') + ")" : "(" + i18n.t('sopManager.formText.야간') + ")";
				return sopName + mode;
			}

			return sopName;
		}

		return "";
	}

	onClickDt(cascading, show) {
		if (cascading === i18n.t('sopManager.formText.특수문자 입력 형식') && show) {
			this.readSpecialMessages();
		}

		this.props.changeCascadingMode(cascading, show);
	}

	async readSpecialMessages() {
		const prevSpecialMessage = { ...this.state.specialMessage };
		const [specialMessages, errorMessage] = await SopController.requestSpecialMessageList();

		if (specialMessages) {
			prevSpecialMessage.messages = specialMessages;

			let findID = false;
			const messageCount = specialMessages.length;

			for (let i = 0; i < messageCount; i++) {
				if (prevSpecialMessage.currentID === specialMessages[i].id) {
					prevSpecialMessage.currentMessage = specialMessages[i].message;
					findID = true;
					break;
                }
            }

			if (findID === false) {
				if (messageCount > 0) {
					prevSpecialMessage.currentID = specialMessages[0].id;
					prevSpecialMessage.currentMessage = specialMessages[0].message;
				}
				else {
					prevSpecialMessage.currentID = -1;
					prevSpecialMessage.currentMessage = "";
				}
            }
			
			this.setState({ specialMessage: prevSpecialMessage });
		}
		else if (errorMessage) {
			alert(errorMessage);
        }
    }

	onClickEditMenu(menu, data) {
		if (menu === SopManagerResource.editMenu.복사 ||
			menu === SopManagerResource.editMenu.잘라내기 ||
			menu === SopManagerResource.editMenu.삭제) {
			this.setState({
				editDatas:
				{
					command: menu,
					sectionCellDatas: null
				}
			});
		}
		else if (menu === SopManagerResource.editMenu.붙여넣기) {
			this.setState({
				editDatas:
				{
					command: menu,
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
		}
	}

	onApplyComponentProperty = async (sectionData, actionStep, shouldUpdate) => {
		const stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember !== null) {
			const [success, errorMessage] = await SopController.checkSectionValidation(sectionData, stepMember.stepMember?.id);

			if (!success) {
				this.props.showConfirmDialog(i18n.t('common.오류'), [errorMessage], null, null);
				return;
			}

			// 화살표
			if (sectionData.beginCell && sectionData.endCell) {
				this.setArrow(stepMember, sectionData);

				if (shouldUpdate) {
					const selectedSectionData = this.state.selectedSectionData.length > 0 && this.state.selectedArrowData.length === 0 ? this.state.selectedSectionData : [];
					this.setState({ selectedSectionData: selectedSectionData/*, selectedArrowData: []*/ });
				}
				return;
			}

			// Section
			const _sectionData = SopDataManager.getSectionData(stepMember, sectionData.gridColumnIndex, sectionData.gridRowIndex);

			if (_sectionData === null) {
				return;
			}
			else {
				SopDataManager.copySectionData(sectionData, _sectionData);
			}

			if (shouldUpdate) {
				const currentMenu = { ...this.state.currentMenu };

				const selectedArrowData = this.state.selectedArrowData.length > 0 && this.state.selectedSectionData.length === 0 ? this.state.selectedArrowData : [];
				const selectedSectionData = this.needClearSectionData() ? [] : this.state.selectedSectionData;
				this.setState({ currentMenu: currentMenu, selectedSectionData, selectedArrowData, loading: false });
			}
		}
	}

	needClearSectionData() {
		const selectedSectionDatas = [...this.state.selectedSectionData];

		if (selectedSectionDatas.length < 2) {
			return true;
		}

		const selectedSectionData = selectedSectionDatas[0];

		if (!selectedSectionData) {
			return true;
		}

		const selectedCells = { ...this.selectedCells };

		for (const columnIndex in selectedCells) {
			const _columnIndex = parseInt(columnIndex);
			const rowIndices = selectedCells[columnIndex];

			for (const rowIndex of rowIndices) {
				if (selectedSectionData.gridRowIndex === rowIndex && selectedSectionData.gridColumnIndex === _columnIndex) {
					return false;
				}
			}
		}

		return true;
	}

	setArrow(stepMember, arrowData) {
		const arrowCount = stepMember.arrows.length;

		for (let i = 0; i < arrowCount; i++) {
			const arrow = stepMember.arrows[i];

			if (arrow.beginPosition === arrowData.beginPosition && arrow.endPosition === arrowData.endPosition &&
				arrow.beginVertex.x === arrowData.beginVertex.x && arrow.beginVertex.y === arrowData.beginVertex.y &&
				arrow.endVertex.x === arrowData.endVertex.x && arrow.endVertex.y === arrowData.endVertex.y) {
				arrow.text = arrowData.text;
				break;
            }
        }
    }

	onProcessEdit = (command, sectionCellDatas) =>
	{
		if (command === sectionCellDatas) {
			this.onClickEditMenu(command, null);
			return;
		}

		if (command === SopManagerResource.editMenu.복사 ||
			command === SopManagerResource.editMenu.잘라내기 ||
			command === SopManagerResource.editMenu.삭제) {
			this.setState({
				editDatas: {
					command: "",
					sectionCellDatas: sectionCellDatas
				}
			});
		}
		else {
			this.setState({
				editDatas: {
					command: "",
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
        }
	}

	onChangeGrid = (menuType, index) => {
		if (this.props.sopData) {
			const actionStep = this.props.sopData.currentActionStep;

			if (actionStep) {
				const stepMemberCount = actionStep.stepMemberDatas.length;

				for (let i = 0; i < stepMemberCount; i++) {
					const stepMemberData = actionStep.stepMemberDatas[i];

					if (stepMemberData.grid) {
						if (menuType === SopManagerResource.contextMenu.왼쪽_열_추가) {
							SopDataManager.addToPrev(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === SopManagerResource.contextMenu.열_삭제) {
							SopDataManager.deleteArray(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === SopManagerResource.contextMenu.오른쪽_열_추가) {
							SopDataManager.addToNext(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === SopManagerResource.contextMenu.위쪽_행_추가) {
							SopDataManager.addToPrev(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
						else if (menuType === SopManagerResource.contextMenu.행_삭제) {
							SopDataManager.deleteArray(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
						else if (menuType === SopManagerResource.contextMenu.아래쪽_행_추가) {
							SopDataManager.addToNext(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
					}
				}
			}
		}
	}

	getActionStepClassName() {

		if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
			if (this.state.actionStepName === SopManagerResource.actionStep._1st) {
				return 'grnTlb';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._2nd) {
				return 'ylwTlb';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._3rd) {
				return 'orgTlb';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._4th) {
				return 'hpkTlb';
			}
			return 'ylwTlb';

		} else {
			if (this.state.actionStepName === SopManagerResource.actionStep._1st) {
				return 'grn';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._2nd) {
				return 'ylw';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._3rd) {
				return 'org';
			}
			else if (this.state.actionStepName === SopManagerResource.actionStep._4th) {
				return 'hpk';
			}
			return 'grn';
		}
	}

	getSectionArrowData() {
		let sectionData = null, actionStep = null, arrowData = null;

		if (this.state.selectedSectionData && this.state.selectedSectionData.length >= 2) {
			sectionData = this.state.selectedSectionData[0];
			actionStep = this.state.selectedSectionData[1];
		}

		if (this.state.selectedArrowData && this.state.selectedArrowData.length >= 2) {
			arrowData = this.state.selectedArrowData[0];

			if (actionStep === null) {
				actionStep = this.state.selectedArrowData[1];
            }
        }

		return [sectionData, arrowData, actionStep];
	}

	checkCurrentActionStep() {
		if (this.state.sopData?.disaster && this.state.sopData?.actionStepDatas/* && !this.state.sopData.currentActionStep*/) {
			const actionStepCount = this.state.sopData?.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = this.state.sopData.actionStepDatas[i];

				if (actionStepData.stepName === this.state.actionStepName) {
					if (!actionStepData.actionStep) {
						actionStepData.actionStep = SopDataManager.makeNewActionStep(actionStepData.stepName, this.state.sopData?.disaster.id);
					}

					const sopData = this.state.sopData;
					sopData.currentActionStep = actionStepData;
					break;
				}
			}
		}
	}

	getSpecialMessageElements() {
		const specialMessage = { ...this.state.specialMessage };
		const messageCount = specialMessage.messages.length;

		if (messageCount > 0) {
			return (
				<select onChange={this.onSelectSpecialMessage}>
					{
						specialMessage.messages.map((message, index) => {
							const key = "select_" + index;
							const value = index;
							return <option key={key} value={value}>{message.category}</option>
                        })
					}
				</select>
				);
		}

		return <></>
	}

	onSelectSpecialMessage = (event) => {
		const specialMessage = { ...this.state.specialMessage };
		const index = parseInt(event.target.value);

		if (index !== null && index !== undefined) {
			const message = specialMessage.messages[index];

			if (message) {
				specialMessage.currentID = message.id;
				specialMessage.currentMessage = message.message;
				this.setState({ specialMessage: specialMessage });
            }
        }
	}

	onSelectedCells = (cells) => {
		this.selectedCells = cells;
	}

	render() {
		const sopName = i18nUtil.convertText(this.state.sopData?.disaster?.disasterName);
		const [sectionData, arrowData, actionStep] = this.getSectionArrowData();
		const cascadingActionStep = this.props.showCascading.actionStep ? 'on' : "";
		const cascadingAddComponent = this.props.showCascading.addComponent ? 'on' : "";
		const cascadingSpecialCharacter = this.props.showCascading.specialCharacter ? 'on' : "";
		const cascadingUserDefinedDT = this.props.showCascading.userDefined ? " " + 'on' : "";
		const cascadingUserDefinedDD = this.props.showCascading.userDefined ? 'on' : "";

		const isNormal = this.state.sopData?.version ? this.state.sopData.version.isNormal : true;
		const sopMode = isNormal ? i18n.t('sopManager.formText.주간') : i18n.t('sopManager.formText.야간');

		this.checkCurrentActionStep();

		return (
			<SopManagerBodyMainComponent ref={this.refSpWrap} id={'spWrap'}>
				<div ref={this.refSpLft} id={'spLft'}>
					<button id={'splTgl'} onClick={this.OnClickSplTgl}>{i18n.t('common.닫기')}</button>
					<div className={'scrollbarOuter'}>
						<dl className={'sopAcdn'}>
							<dt ref={this.refDTActionStep} className={cascadingActionStep} onClick={(event) => this.onClickDt(SopManagerResource.cascadingMenu.SOP_단계, !this.props.showCascading.actionStep)}>{i18n.t('sopManager.formText.SOP 단계')}</dt>
							<dd ref={this.refDDActionStep} className={cascadingActionStep}>
								<div className={'sopEdt1'}>
									<div className={'sopEdtTitle'}>
										<span className={this.getActionStepClassName()}>{this.state.actionStepName}</span>
										<h4>{this.getSOPName()}</h4>
									</div>
									<ul className={'sopEdtRdo col4'}>
										{
											SopManagerResource.actionStep._1st.length > 0 &&
											<li>
												<label className={'clickable'}>
													<input ref={this.refRadioActionStep1} type="radio" name="rdo01" id={'rdo0101'} checked={this.state.actionStepName === SopManagerResource.actionStep._1st} onChange={() => this.selectActionStep(SopManagerResource.actionStep._1st)} />
												&nbsp;{SopManagerResource.actionStep._1st}
												</label>
											</li>
										}
										{
											SopManagerResource.actionStep._2nd.length > 0 &&
											<li>
												<label className={'clickable'}>
													<input ref={this.refRadioActionStep2} type="radio" name="rdo01" id={'rdo0102'} checked={this.state.actionStepName === SopManagerResource.actionStep._2nd} onChange={() => this.selectActionStep(SopManagerResource.actionStep._2nd)} />
												&nbsp;{SopManagerResource.actionStep._2nd}
												</label>
											</li>
										}
										{
											SopManagerResource.actionStep._3rd.length > 0 &&
											<li>
												<label className={'clickable'}>
													<input ref={this.refRadioActionStep3} type="radio" name="rdo01" id={'rdo0103'} checked={this.state.actionStepName === SopManagerResource.actionStep._3rd} onChange={() => this.selectActionStep(SopManagerResource.actionStep._3rd)} />
												&nbsp;{SopManagerResource.actionStep._3rd}
												</label>
											</li>
										}
										{
											SopManagerResource.actionStep._4th.length > 0 &&
											<li>
												<label className={'clickable'}>
													<input ref={this.refRadioActionStep4} type="radio" name="rdo01" id={'rdo0104'} checked={this.state.actionStepName === SopManagerResource.actionStep._4th} onChange={() => this.selectActionStep(SopManagerResource.actionStep._4th)} />
												&nbsp;{SopManagerResource.actionStep._4th}
												</label>
											</li>
										}
									</ul>
									<ul className={'sopEdtRdo inline'}>
										<li>
											<label className={'sopMode'}>{sopMode}</label>
										</li>
									</ul>
								</div>
							</dd>
							<dt className={cascadingAddComponent} onClick={(event) => this.onClickDt(SopManagerResource.cascadingMenu.컴포넌트_추가, !this.props.showCascading.addComponent)}>{i18n.t('sopManager.formText.컴포넌트 추가')}</dt>
							<dd ref={this.refDDComponent} className={cascadingAddComponent}>
								<div className={'sopEdt2'}>
									<ul className={'sopEdtCpnt'}>
										<li><img ref={this.refProcessImage} className={'clickable'} src={ProcessImage} alt="" /><span className={'clickable'}>{i18n.t('sopManager.formText.프로세스')}</span></li>
										<li><img ref={this.refDecisionImage} className={'clickable'} src={DecisionImage} alt="" /><span className={'clickable'}>{i18n.t('sopManager.formText.판단')}</span></li>
										<li><img ref={this.refAnnotationImage} className={'clickable'} src={AnnotationImage} alt="" /><span className={'clickable'}>{i18n.t('sopManager.formText.설명')}</span></li>
										<li><img ref={this.refEndpointImage} className={'clickable'} src={EndpointImage} alt="" /><span className={'clickable'}>{i18n.t('sopManager.formText.시작/끝')}</span></li>
										<li><img ref={this.refInternalImage} className={'clickable'} src={InternalImage} alt="" /><span className={'clickable'}>{i18n.t('sopManager.formText.상황전파')}</span></li>
									</ul>
								</div>
							</dd>
							<dt className={cascadingSpecialCharacter} onClick={(event) => this.onClickDt(SopManagerResource.cascadingMenu.특수문자_입력_형식, !this.props.showCascading.specialCharacter)}>{i18n.t('sopManager.formText.특수문자 입력 형식')}</dt>
							<dd ref={this.refDDSpecialCharacter} className={cascadingSpecialCharacter}>
								<div className={'sopEdt3'}>
									<div className={'sopEdtTpy'}>
										<span>{i18n.t('sopManager.formText.타입선택')}</span>
										{
											this.getSpecialMessageElements()
										}
									</div>
									<textarea cols="30" rows="10" className={'sopEdtText scrollbarOuter'} value={this.state.specialMessage.currentMessage} onChange={() => {} }>
									</textarea>
								</div>
							</dd>
							{
							/*<dt className={SopManagerBodyMain.cssStyles.last + cascadingUserDefinedDT} onClick={(event) => this.onClickDt(SopManagerResource.cascadingMenu.사용자_정의_인자, !this.props.showCascading.userDefined)}>{SopManagerResource.ID.cascadingMenu.userDefined}</dt>
							<dd ref={this.refUserDefined} className={cascadingUserDefinedDD}>
								<div className={SopManagerBodyMain.cssStyles.sopEdt4}>
									<ul className={SopManagerBodyMain.cssStyles.sopEdtSel + " " + SopManagerBodyMain.cssStyles.col1}>
										<li>
											<select name="" id="">
												<option value="">{SopManagerResource.ID.common.notUse}</option>
											</select>
										</li>
									</ul>
									<dl className={SopManagerBodyMain.cssStyles.sopEdtMdfy}>
										<dt><input type="checkbox" name="" id={SopManagerBodyMain.cssStyles.chk01} /><label htmlFor="chk01">{SopManagerResource.ID.common.edit}</label></dt>
										<dd><a href="#">{SopManagerResource.ID.common.add}</a></dd>
										<dd><a href="#">{SopManagerResource.ID.common.delete}</a></dd>
									</dl>
									<div className={SopManagerBodyMain.cssStyles.sopEdtTb}>
										<table>
											<caption>{SopManagerResource.ID.specialCharacter.tableDescription}</caption>
											<colgroup>
												<col className={bodyStyles.col10Pro} />
												<col className={bodyStyles.col30Pro} />
												<col className={bodyStyles.col30Pro} />
												<col className={bodyStyles.col30Pro} />
											</colgroup>
											<thead>
												<tr>
													<th><input type="checkbox" /></th>
													<th>{SopManagerResource.ID.specialCharacter.columnHeader.variable}</th>
													<th>{SopManagerResource.ID.specialCharacter.columnHeader.type}</th>
													<th>{SopManagerResource.ID.specialCharacter.columnHeader.description}</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><input type="checkbox" /></td>
													<td>DeadCount</td>
													<td>
														<select name="" id="">
															<option value="">{SopManagerResource.ID.userDefinedVariable.type.integer}</option>
														</select>
													</td>
													<td>사망자 숫자</td>
												</tr>
												<tr>
													<td><input type="checkbox" /></td>
													<td>Temp</td>
													<td>
														<select name="" id="">
															<option value="">{SopManagerResource.ID.userDefinedVariable.type.boolean}</option>
														</select>
													</td>
													<td>부상자 숫자</td>
												</tr>
												<tr>
													<td><input type="checkbox" /></td>
													<td>DeadCount</td>
													<td>
														<select name="" id="">
															<option value="">{SopManagerResource.ID.userDefinedVariable.type.integer}</option>
														</select>
													</td>
													<td>사망자 숫자</td>
												</tr>
												<tr>
													<td><input type="checkbox" /></td>
													<td>Temp</td>
													<td>
														<select name="" id="">
															<option value="">{SopManagerResource.ID.userDefinedVariable.type.boolean}</option>
														</select>
													</td>
													<td>부상자 숫자</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div className={SopManagerBodyMain.cssStyles.sopEdtOk}>
										<a href="#">{SopManagerResource.ID.common.save}</a>
									</div>
								</div>
							</dd>*/
							}
						</dl>
					</div>
				</div>


				<div id={'spCent'}>
					<ul className={'spcTop'}>
						{
						//<li><a className={'spctUndo clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.뒤로가기, null)}>{i18n.t('sopManager.formText.뒤로가기')}</a></li>
						//<li><a className={'spctRedo clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.되돌리기, null)}>{i18n.t('sopManager.formText.되돌리기')}</a></li>
						}						
						<li><a className={'spctCopy clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.복사, null)}>{i18n.t('sopManager.formText.복사')}</a></li>
						<li><a className={'spctCut clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.잘라내기, null)}>{i18n.t('sopManager.formText.잘라내기')}</a></li>
						<li><a className={'spctPaste clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.붙여넣기, null)}>{i18n.t('sopManager.formText.붙여넣기')}</a></li>
						<li><a className={'spctDel clickable'} onClick={() => this.onClickEditMenu(SopManagerResource.editMenu.삭제, null)}>{i18n.t('common.삭제')}</a></li>
						{/* <li><a></a></li>
						<li><a></a></li> */}
					</ul>
					<div className={'sopTitle'}>{sopName}</div>
					<div className={'spcCont'}>
						<PanelAreas panelCount="1"
							currentMenu={this.state.currentMenu}
							sopData={this.state.sopData}
							loginUser={this.props.loginUser}
							selectedSectionData={sectionData}
							selectedArrowData={arrowData}
							editDatas={this.state.editDatas}
							onProcessEdit={this.onProcessEdit}
							rowCount={this.state.rowCount}
							columnCount={this.state.columnCount}
							content={this.props.content}
							onSelectComponent={this.onSelectComponent}
							onSelectArrow={this.onSelectArrow}
							onAddComponent={this.onAddComponent}
							onRemoveComponent={this.onRemoveComponent}
							onChangeGrid={this.onChangeGrid}
							onSelectedCells={this.onSelectedCells}
							showConfirmDialog={this.props.showConfirmDialog}
						/>
					</div>
				</div>

				<div id={'spRht'}>
					<ComponentProperties sectionData={sectionData} arrowData={arrowData} actionStep={actionStep} sopData={this.state.sopData} onApplyComponentProperty={this.onApplyComponentProperty} onSelectComponent={this.onSelectComponent} selectedSiteID={this.props.selectedSiteID} />
				</div>


			</SopManagerBodyMainComponent>
		);
	}
}

export default withTranslation()(SopManagerBodyMain);