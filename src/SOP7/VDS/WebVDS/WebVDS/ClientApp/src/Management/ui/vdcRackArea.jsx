import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import Edit from '../../PropertyEdit/ui/edit';


class VDCRackArea extends Component {
    onDragOverRackType = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    onDropRackType = (e) => {
        e.preventDefault();

        const [rackType, typeName] = this.props.getDragItem();
        this.props.setDragItem(null, null);

        if (!rackType || typeName !== Edit.dragType.rackType) {
            return;
        }

        if (this.props.wsManager) {
            this.props.wsManager.dropRackType(rackType);
        }
    }

    render() {
        return (
            <>
                <div id="app3D_newRegist" className={dash.vdcRackBackground} onDrop={(e) => this.onDropRackType(e)} onDragOver={this.onDragOverRackType}>
                </div>

                {/* 우측클릭창 */}
                {/*<div className={dash.rackHostEditBox}>
                    <input type="text" placeholder="HOST명을 작성해주세요."  />
                    <span className={dash.rackMoveEdit}>이동</span>
                    <span className={dash.rackRotateEdit}>회전</span>
                    <span className={dash.rackRepeatEdit}>반복그리드</span>
                </div>*/}

                {/* 이동창 */}
                {/*<div className={dash.moveBox}>
                   <div className={dash.moveTitle}>이동</div>
                   <div className={dash.coordinates}>
                     <span className={dash.coordinatesX}>X:30</span>
                     <span className={dash.coordinatesY}>Y:30</span>
                   </div>
                </div>*/}

                {/* 회전창 */}
                {/*<div className={dash.rotateBox}>
                    <div className={dash.rotateTitle}>회전</div>
                    <div className={dash.angle}>90</div>
                </div>*/}

                {/* 반복그리드창 */}
                {/*<div className={dash.gridBox}>
                    <div className={dash.gridTitle}>반복그리드</div>
                    <div className={dash.gridInterval}>간격:</div>
                    <div className={dash.gridNum}>횟수:</div>
                </div>*/}

                {/* 이동그룹창 */}
                {/*<div className={dash.moveGroupBox}>
                    <div className={dash.vdcMove}>이동</div>
                    <div className={dash.vdcGroup}>그룹</div>
                </div>*/}

                {/* 그룹명 작성창 */}
                {/*<div className={dash.groupWriterBox}>
                   <input type="text" placeholder="그룹명을 작성해주세요."  />
                </div>*/}
            </>
        );
    }
}
export default VDCRackArea;