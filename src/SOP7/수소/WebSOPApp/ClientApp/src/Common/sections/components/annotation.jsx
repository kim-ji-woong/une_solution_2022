import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataAnnotation from '../../models/sections/sectionDataAnnotation.js';
import sectionStyles from '../../css/section.module.css';
import SectionData from '../../models/sections/sectionData';
import i18nUtil from '../../../language/i18n';

class Annotation extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    render() {
        const styleValue = this.getStyleValue("annotation");
        const arrowButtons = this.makeArrowButtons();
        let sectionClassName = "sectionComponent" + " " + "annotation";
        let sectionID = "annotation";
        let statusFillClass = " ";
        let statusBorderClass = " ";

        if (this.props.isSelected) {
            if (this.props.mode !== "exec") {
                sectionClassName += " " + "selected";
                sectionID = "selectedComponent";
                statusFillClass += " " + "selected";
            }
        }

        // SOP �����忡���� ������ �����¿��߸� �Ѵ�.
        if (this.props.mode === "exec") {
            statusFillClass = " " + "waitAnnoFill";
            statusBorderClass += " " + "waitAnnoBorder";
        }

        return (
            <div className={"annotationArrowBox"}>
                <div id={sectionID} className={sectionClassName + statusBorderClass}>
                    <div className={"inner" + statusFillClass} /* style={styleValue} */ onClick={() => this.props.onClickComponent(this.getSectionData())}>
                        {i18nUtil.convertText(this.props.sectionData.text)}
                    </div>
                    <div id={sectionID} className={"edge"}></div>
                </div>
                {arrowButtons}
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataAnnotation();
    }
}

export default Annotation;