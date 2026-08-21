//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import newStyles from "../../../Common/css/newStyle.module.css";
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import SettingsStore from '../../../Settings/settingsStore';

import HistoryController from '../../services/historyController';


class SensorDetectHistoryMemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			popupMinWidth: 340, // 팝업 최소 너비
            popupMinHeight: 320, // 팝업 최소  높이

            top: this.props.memoY,
            left: this.props.memoX,

			displayMemo: this.props.popupMemoContent,

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
        }
		this.props = props;
        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
	}

    componentDidMount() {
        if (!this.props.fromHistoryMenu) {
            // 팝업 마우스 드래그 이벤트 리스너
            this.popupDragMouseMove = (event) => {
                var mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                }

                //움직여야할 좌표
                let moveX = mousePosition.x + this.state.dragOffsetX;
                let perMoveX = ((moveX / this.state.maxScreenWidth) * 100);

                let moveY = mousePosition.y + this.state.dragOffsetY;
                let perMoveY = ((moveY / this.state.maxScreenHeight) * 100);

                // 팝업 너비
                let width = this.state.popup.clientWidth;
                let left = this.state.popup.offsetLeft;

                // 팝업 높이
                let height = this.state.popup.clientHeight;
                let top = this.state.popup.offsetTop;

                let popupRightPos = width + left;   // 현재 위치에서 오른쪽 끝 절대 좌표
                let popupBottomPos = height + top;  // 현재 위치에서 아래쪽 끝 절대 좌표

                // 팝업이 화면밖으로 안나가도록 처리
                if (moveX > 0 && moveX + width < this.state.maxScreenWidth) {
                    this.state.popup.style.left = perMoveX + '%';
                } else if (moveX + width > this.state.maxScreenWidth) {
                    // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 끝지점이 우측 화면 밖을 벗어나게 될 때
                    if (popupRightPos < this.state.maxScreenWidth) {
                        // 팝업을 우측 변에 고정
                        let lim = ((this.state.maxScreenWidth - width) / this.state.maxScreenWidth) * 100;
                        this.state.popup.style.left = lim + '%';
                    } else if (this.state.preMousePosition.x > mousePosition.x) {
                        // 화면 오른쪽으로 팝업이 이미 벗어나 있을 때
                        this.state.popup.style.left = perMoveX + '%';
                    }
                } else if (moveX <= 0) {
                    // 드래그 도중 팝업 시작점이 좌측 화면 밖을 벗어나게 될 때
                    if (left > 0) {
                        this.state.popup.style.left = '0%';
                    } else if (this.state.preMousePosition.x < mousePosition.x) {
                        // 화면 왼쪽으로 팝업이 이미 벗어나 있을 때
                        this.state.popup.style.left = perMoveX + '%';
                    }
                }

                if (moveY > 60 && moveY + height < this.state.maxScreenHeight) {
                    this.state.popup.style.top = perMoveY + '%';
                } else if (moveY + height > this.state.maxScreenHeight) {
                    // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 하단 끝지점이 화면 밖을 벗어나게 될 때
                    if (popupBottomPos < this.state.maxScreenHeight) {
                        // 팝업을 아랫 변에 고정
                        let lim = ((this.state.maxScreenHeight - height) / this.state.maxScreenHeight) * 100;
                        this.state.popup.style.top = lim + '%';
                    } else if (this.state.preMousePosition.y > mousePosition.y) {
                        // 화면 아래쪽으로 팝업이 이미 벗어나 있을 때
                        this.state.popup.style.top = perMoveY + '%';
                    }
                } else if (moveY <= 60) {
                    // 드래그 도중 상단 끝지점이 화면 밖을 벗어나게 될 때
                    if (top > 60) {
                        // 팝업을 윗 변에 고정
                        //상단 툴바는 항상 높이 60 고정이기 때문에 현재 화면 사이즈에서 60px의 비율을 계산한다.
                        let lim = (60 / this.state.maxScreenHeight) * 100;
                        this.state.popup.style.top = lim + '%';
                    } else if (this.state.preMousePosition.y < mousePosition.y) {
                        //화면 위쪽으로 팝업이 이미 벗어나 있을 때
                        this.state.popup.style.top = perMoveY + '%';
                    }
                }
            }

            //팝업 리사이즈 이벤트 리스너
            this.popupResizeMouseMove = (event) => {
                let sizeX = 0;
                let sizeY = 0;

                switch (this.state.resizeType) {
                    // 수평
                    case 'h-r': // 오른쪽 수평
                        sizeX = event.pageX - this.state.popup.getBoundingClientRect().left;

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';
                        }
                        break;
                    case 'h-l': //왼쪽 수평
                        sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';

                            let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                            this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                        }
                        break;
                    // 수직
                    case 'v-b': // 바텀 수직
                        sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;

                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px';
                        }
                        break;
                    case 'v-t': //탑 수직
                        sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px'

                            let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                            this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                        }
                        break;
                    // 대각
                    case 'd-rb': // 오른쪽 하단 대각
                        sizeX = event.pageX - this.state.popup.getBoundingClientRect().left;
                        sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';
                        }

                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px';
                        }
                        break;
                    case 'd-rt': //오른쪽 상단 대각
                        sizeX = this.state.originalWidth + (event.pageX - this.state.originalMouseX);
                        sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';
                        }

                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px';

                            let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                            this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                        }
                        break;

                    case 'd-lb': //왼쪽 하단 대각
                        sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;
                        sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';

                            let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                            this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                        }

                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px';
                        }
                        break;

                    case 'd-lt': //왼쪽 상단 대각
                        sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);
                        sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                        if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                            this.state.popup.style.width = sizeX + 'px';

                            let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                            this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                        }
                        if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                            this.state.popup.style.height = sizeY + 'px';

                            let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                            this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                        }
                        break;
                    default:
                }

            }
            this.initPopupState();

            this.props.setActiveDragPopup(this.props.popupType);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardAlarmMemo)[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('SensorDetectHistoryMemo changed', popup.style.zIndex);
        }
    }

	initPopupState() {
        var popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardAlarmMemo)[0];

		//DB에 값이 있을 경우에만
		if (typeof this.props.popupState !== 'undefined') {
			popup.style.left = this.props.popupState.x;
			popup.style.top = this.props.popupState.y;
			popup.style.width = this.props.popupState.width;
			popup.style.height = this.props.popupState.height;
		}

		this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.alarmMemo;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardAlarmMemo)[0];
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    // 팝업 드래그 시작(팝업을 누르고 있을 때)
    popupDragMousePress(event) {
        if (this.props.fromHistoryMenu) {
            return;
        }

        if (event.button == 0) {
            //마우스 조작중에 브라우저의 크기를 조절할 수 없으므로
            // 이 시점에 도큐먼트 전체 크기를 호출한다.
            this.setState({
                maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
                maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
                dragOffsetX: this.state.popup.offsetLeft - event.clientX,
                dragOffsetY: this.state.popup.offsetTop - event.clientY,
                preMousePosition: {
                    x: event.clientX,
                    y: event.clientY
                }
            });

            document.addEventListener('mousemove', this.popupDragMouseMove);
            document.addEventListener('mouseup', this.popupDragMouseUp);

            // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
            this.props.setActiveDragPopup(this.props.popupType);
        }
    }

    // 팝업 드래그 종료(mouse up)
    popupDragMouseUp = () => {
        console.log('popup drag false')
        document.removeEventListener('mousemove', this.popupDragMouseMove);
        document.removeEventListener('mouseup', this.popupDragMouseUp);
        // 팝업 정보 DB 작성
        this.setPopupState();

    }

    // 팝업 리사이징(누르고 있을 때)
    popupResizeMousePress(event, resizeType) {
        /* resizeType
         * h-r      오른쪽 수평
         * h-l      왼쪽 수평
         * v-b      바텀 수직
         * v-t      탑 수직
         * d-rt     우측 상단 대각
         * d-rb     우측 하단 대각
         * d-lt     좌축 상단 대각
         * d-lb     좌측 하단 대각
        */

        console.log('popupResizeMousePress');
        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: parseFloat(getComputedStyle(this.state.popup, null).getPropertyValue('width').replace('px', '')),
            originalHeight: parseFloat(getComputedStyle(this.state.popup, null).getPropertyValue('height').replace('px', '')),
            originalX: this.state.popup.getBoundingClientRect().left,
            originalY: this.state.popup.getBoundingClientRect().top
        });

        document.addEventListener('mousemove', this.popupResizeMouseMove);

        document.addEventListener('mouseup', this.popupResizeMouseUp);
        // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
        this.props.setActiveDragPopup(this.props.popupType);

    }

    popupResizeMouseUp = () => {
        console.log('popup resize false');
        document.removeEventListener('mousemove', this.popupResizeMouseMove);
        document.removeEventListener('mouseup', this.popupResizeMouseUp);
        this.setState({ resizeType: null });
        this.setPopupState();
    }

    setPopupState() {
        // 팝업 정보 DB 작성
        let perX = ((this.state.popup.offsetLeft / this.state.maxScreenWidth) * 100);
        let perY = ((this.state.popup.offsetTop) / this.state.maxScreenHeight * 100);
        let width = this.state.popup.offsetWidth;
        let height = this.state.popup.offsetHeight;

        //팝업 비활성화 될 때 컴포넌트가 사라져 계산식이 0으로 되는 현상이 발생함. 이때 DB 등록되는것을 방지
        if (perX > 0 && perY > 0 && width > 0 && height > 0) {
            let popupState = {
                id: typeof this.props.popupState !== 'undefined' ? this.props.popupState.id : -1,
                x: perX + '%',
                y: perY + '%',
                height: height + 'px',
                width: width + 'px'
            }
            this.props.setPopupState(this.props.popupType, popupState);
        }
    }

	onChangeMemo = (e) => {
		this.setState({ displayMemo: e.target.value });
    }

	onSave = async () => {
		const result = await HistoryController.UpdateAlarmMemo(this.props.actionStepHistoryID, this.state.displayMemo);
		if (result) {
			this.props.setPopupMemo(false, this.props.actionStepHistoryID, this.state.displayMemo);
		}
		else {
			this.showConfirmDialog("오류", '메모를 저장 할 수 없습니다.', null, null);
        }
	}

	showConfirmDialog = (title, messages, buttons, onClickButton) => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = true;
		confirmMessage.title = title;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;

		if (!messages) {
			confirmMessage.messages = [""];
		}
		else if (Array.isArray(messages)) {
			confirmMessage.messages = messages;
		}
		else {
			confirmMessage.messages = [messages];
		}

		this.setState({ confirmMessage });
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    render() {
        let hsMmoName = newStyles.hsMmo;
        if (!this.props.fromHistoryMenu) {
            hsMmoName = null;
        }

        let hsMmoClassName = null;
        if (!this.props.fromHistoryMenu) {
            hsMmoClassName = content.viewDashboardBoxD + ' ' + content.viewDashboardAlarmMemo;
        }

		return (
			<>
                <div id={hsMmoName} className={hsMmoClassName} style={{ top: this.state.top + 'px', right: '1%' } }>
                    {
                        (!this.props.fromHistoryMenu) ?                        
                        <>
                            <div className={content.popupSizingAreaRight} onMouseDown={(e) => this.popupResizeMousePress(e, 'h-r')} ></div>
                            <div className={content.popupSizingAreaLeft} onMouseDown={(e) => this.popupResizeMousePress(e, 'h-l')}></div>
                            <div className={content.popupSizingAreaBottom} onMouseDown={(e) => this.popupResizeMousePress(e, 'v-b')}></div>
                            <div className={content.popupSizingAreaTop} onMouseDown={(e) => this.popupResizeMousePress(e, 'v-t')}></div>
                            <div className={content.popupSizingAreaRightTopPoint} onMouseDown={(e) => this.popupResizeMousePress(e, 'd-rt')}></div>
                            <div className={content.popupSizingAreaRightBottomPoint} onMouseDown={(e) => this.popupResizeMousePress(e, 'd-rb')}></div>
                            <div className={content.popupSizingAreaLeftTopPoint} onMouseDown={(e) => this.popupResizeMousePress(e, 'd-lt')}></div>
                            <div className={content.popupSizingAreaLeftBottomPoint} onMouseDown={(e) => this.popupResizeMousePress(e, 'd-lb')}></div>
                        </>
                        : null
                    }
					
                        <div className={content.dslTop /* + " " + content.dslGrd */}>
                            <h5 className={content.dslTitle} onMouseDown={(e) => this.popupDragMousePress(e)}>
                                메모 작성 ({this.props.actionStepHistoryID})
                            </h5>
                            <a className={content.dslX} onClick={() => this.props.setPopupMemo(false)}></a>
                        </div>
						<div className={newStyles.memoContents}>
                            <textarea name="" id="" cols="20" rows="6" className={"scroll-wrapper" + newStyles.memoTxt + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}
                               value={(this.state.displayMemo && this.state.displayMemo.length > 0) ? this.state.displayMemo : ''}
                               placeholder="텍스트를 입력해주세요"
                            >
							</textarea>
						</div>
						<ul className={newStyles.memoBtn}>
							<li><a onClick={() => this.props.setPopupMemo(false)}>취소</a></li>
							<li><a onClick={() => this.onSave()}>저장</a></li>
						</ul>    

						{
							//<div className={newStyles.hisMemoSaveBox}>
							//	<span>솔브레인의 메세지</span>
							//	<span>메모를 저장할까요?</span>
							//	<ul className={newStyles.hisMemoBtn}>
							//		<li><a>확인</a></li>
							//		<li><a onClick={() => this.onSave()}>취소</a></li>
							//	</ul>
							//</div>
						}
				</div>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
}

export default SensorDetectHistoryMemo;