import React, { Component } from 'react';
import $ from 'jquery';
import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';
import wsManager from '../../Root/services/wsManager';
import CommonResource from '../../Common/resource/id';

import Tooltip from '../../Main/ui/tooltip';

class VDCInfoBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            memo: false,
            memoText: null,
            prevMemoText: null,
            vdcNameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }

        this.handleChangeText = this.handleChangeText.bind(this);
    }

    componentDidMount() {
        $(document).ready(function () {
            $('.' + dash.vdcInfoMemoIcon).click(function () {
                $('.' + dash.vdsMemoContents).toggle();
            });
        });
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'vdcName') {
            this.setState({
                vdcNameTooltipShow: !this.state.vdcNameTooltipShow,
                tooltipTop: domRect.top - 60,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    toMeter(len, unit) {
        if (unit === wsManager.unitOfLength.mm) {
            return parseInt(len / 1000);
        }
        else if (unit === wsManager.unitOfLength.cm) {
            return parseInt(len / 100);
        }

        return len;
    }

    getSizeString(dataCenter) {
        const w = this.toMeter(dataCenter.width, dataCenter.unitOfLength);
        const d = this.toMeter(dataCenter.length, dataCenter.unitOfLength);
        const h = this.toMeter(dataCenter.height, dataCenter.unitOfLength);

        return w + "*" + d + "*" + h + "M";
    }

    getTileElevation(dataCenter) {
        if (dataCenter.unitOfLength === wsManager.unitOfLength.mm) {
            return dataCenter.tileElevation + "mm";
        }
        else if (dataCenter.unitOfLength === wsManager.unitOfLength.cm) {
            return dataCenter.tileElevation * 10 + "mm";
        }

        return dataCenter.tileElevation * 1000 + "mm";
    }

    getGridXY(dataCenter) {
        return dataCenter.beginGridX + "," + dataCenter.beginGridY;
    }

    onClickMemoIcon = () => {
        this.setState({ memo: !this.state.memo });
    }

    closeMemoBox = () => {
        this.setState({ memo: false });
    }

    handleChangeText(event) {
        this.setState({ prevMemoText: event.target.value });
    }

    onClickSave = () => {
        this.setState({ memoText: this.state.prevMemoText , memo: false });
    }

    getVDCName(vdcName, vdcNameConts, hidden) {
        if (vdcName.length > 8) {
            vdcNameConts = vdcName;
            vdcName = vdcName.substring(0, 8) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipvdcName">
                        <span className="tooltipvdcNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('vdcName', e)}
                            onMouseLeave={() => this.setState({ vdcNameTooltipShow: false })}>
                            {vdcName}
                        </span>
                        <Tooltip
                            show={this.state.vdcNameTooltipShow}
                            message={this.vdcNameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipvdcNameConts tooltip-left"}
                        >
                            {vdcNameConts}
                        </Tooltip>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{vdcName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{vdcName}</td>
            );
        }

        return (
            <td>{vdcName}</td>
        );
    }

    render() {
        const site = this.props.site;
        const nation = this.props.nation;
        const dataCenter = this.props.dataCenter;

        if (!site || !nation || !dataCenter) {
            return <></>
        }

        const savedMemo = this.state.memoText;
        const vdcName = ProjectResource.getDataCenterName(dataCenter);

        return (
            <>
                <div id='tooltip-area'></div>
                <div className={dash.vdcInfoBox + " " + CommonResource.UISection}>
                <div style={{ display: 'flex' }}>
                    <span className={dash.vdcInfoTitle}><p>VDC 정보</p></span>
                    <span className={dash.vdcInfoMemoIcon} onClick={this.onClickMemoIcon}></span>
                </div>
                <span className={dash.underLine}></span>
                <div className={dash.vdcInfoContents}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                        <span className={dash.arrowBox}>VDC소속사<span className={dash.paddingBox}>:</span>{ProjectResource.getSiteName(site)}</span>
                        <span className={dash.arrowBox}>국가<span className={dash.paddingBox}>:</span>{ProjectResource.getNationName(nation)}</span>
                            <span className={dash.arrowBox}>VDC명<span className={dash.paddingBox}>:</span>
                                <p>
                                    {/* {ProjectResource.getDataCenterName(dataCenter)} */}
                                    {
                                       this.getVDCName(vdcName, true)
                                    }
                                </p>
                            </span>
                    </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                            <span className={dash.arrowBox}>크기<span className={dash.paddingBox}>:</span>{this.getSizeString(dataCenter)}</span>
                            <span className={dash.arrowBox}>시작점<span className={dash.paddingBox}>:</span>{this.getGridXY(dataCenter)}</span>
                            <span className={dash.arrowBox}>이중마루<span className={dash.paddingBox}>:</span>{this.getTileElevation(dataCenter)}</span>
                        </div>
                    </div> 
                </div>

                {
                    this.state.memo &&
                    <span className={dash.vdsMemoContents + " " + CommonResource.UISection} > {/*style={{ display: 'none' }}*/}  
                        <div className={dash.vdsMemoBox}>
                            <span className={dash.vdsMemoTitle}>메모작성</span>
                            <span className={dash.vdsMemoCloseIcon} onClick={this.closeMemoBox}></span>
                            </div>
                            <textArea placeholder="메모작성입니다." onChange={this.handleChangeText}>{savedMemo}
                        </textArea>
                            <div className={dash.vdsMemoBtn} onClick={this.onClickSave}>확인</div>
                    </span>
                }
          </>
        );
    }
}
export default VDCInfoBox;