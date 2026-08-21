import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataInternal from '../../models/sections/sectionDataInternal.js';
import sectionStyles from '../../css/section.module.css';
import SectionData from '../../models/sections/sectionData';
import SectionGridCell from '../sectionGridCell';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import hoistStatics from 'hoist-non-react-statics';

class Internal extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    getTranstypeElement() {
        return (
            <div className={"sectionMarkArea"}>
                {
                    this.props.sectionData.isBroadcast &&
                    <div className={"sectionMark" + " " + "broad" + " " + "internal"}><span className={'markBoardCast'}>{i18n.t('common.방송')}</span></div>
                }
                {
                    this.props.sectionData.isSMS &&
                    <div className={"sectionMark" + " " + "sms" + " " + "internal"}>{i18n.t('common.문자')}</div>
                }                
                {
                    this.props.sectionData.isEmail &&
                    <div className={"sectionMark" + " " + "email" + " " + "internal"}>{i18n.t('common.메일')}</div>
                }
                {
                    this.props.sectionData.checked &&
                    <div className={"sectionMark" + " " + "internal" + " " + "checkComponent"}></div>
                }
            </div>
        );
        
        /*if (this.props.sectionData.isSMS) {
            return <div className={sectionStyles.sectionMark + " " + sectionStyles.sms + " " + sectionStyles.internal}>{SopManagerResource.ID.sectionMark.sms}</div>
        }
        else if (this.props.sectionData.isBroadcast) {
            return <div className={sectionStyles.sectionMark + " " + sectionStyles.broad + " " + sectionStyles.internal}>{SopManagerResource.ID.sectionMark.broadcast}</div>
        }
        else if (this.props.sectionData.isEmail) {
            return <div className={sectionStyles.sectionMark + " " + sectionStyles.email + " " + sectionStyles.internal}>{SopManagerResource.ID.sectionMark.email}</div>
        }

        return <></>*/
    }

    getAutoElement() {
        if (this.props.sectionData.autoRun) {
            return <div className={"sectionMark" + " " + "auto" + " " + "internal"}>{i18n.t('sopManager.formText.자동')}</div>
        }

        return <></>
    }

    render() {
        const styleValue = this.getStyleValue("internal");
        const arrowButtons = this.makeArrowButtons();
        let sectionClassName = "internalOuter";
        let sectionClassName2 = "sectionComponent" + " " + "internal";
        let statusClass = "";
        let statusBorder = "";

        if (this.props.isSelected) {
            if (SectionGridCell.isEditMode(this.props.mode)) {
                sectionClassName += " " + "selected";
                sectionClassName2 += " " + "selected";
            }
            else {
                sectionClassName += " " + "current";
                sectionClassName2 += " " + "current";
            }
        }

        if (this.props.status === SectionData.Status_Run) {
            statusClass = " " + "runComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "runBorder";
            }
            //statusBorder = " " + sectionStyles.runBorder;
        } else if (this.props.status === SectionData.Status_Done) {
            statusClass = " " + "doneComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "doneBorder";
            }
            //statusBorder = " " + sectionStyles.doneBorder;
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "waitBorder";
            }
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass = " " + "skipComponent";
            sectionClassName += " " + "exec";
        }

        return (
            <div className={"sectionInternal"}>
                {
                    this.getTranstypeElement()
                }
                <div className={"internalArrowBox"}>
                    <div className={sectionClassName + statusBorder}>
                        <div className={sectionClassName2 + statusClass} /* style={styleValue} */ onClick={() => this.props.onClickComponent(this.getSectionData())}>
                            {
                                (this.props.mode === "exec") ? this.props.sectionData.sectionNumber + '.' : ''
                            }
                            {i18nUtil.convertText(this.props.sectionData.text)}
                        </div>
                    </div>
                    {arrowButtons}
                </div>
                {
                    this.getAutoElement()
                }
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataInternal();
    }
}

export default hoistStatics(withTranslation()(Internal), Internal);