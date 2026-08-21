import React, { Component } from 'react';
import SectionPanel from '../../Common/sections/sectionPanel';
import sectionStyles from '../../Common/css/section.module.css';

import { SectionPanels } from '../../SOPSimulator/styled/ChartStyled';

class PanelAreas extends Component {
    render() {
        const panels = [];

        for (let i=0;i<this.props.panelCount;i++)
        {
            panels.push(<SectionPanel
                key={i}
                currentMenu={this.props.currentMenu}
                selectedSectionData={this.props.selectedSectionData}
                editDatas={this.props.editDatas}
                onProcessEdit={this.props.onProcessEdit}
                onSelectComponent={this.props.onSelectComponent}
                selectedArrowData={this.props.selectedArrowData}
                onAddComponent={this.props.onAddComponent}
                onRemoveComponent={this.props.onRemoveComponent}
                onSelectArrow={this.props.onSelectArrow}
                sopData={this.props.sopData}
                loginUser={this.props.loginUser}
                rowCount={this.props.rowCount}
                columnCount={this.props.columnCount}
                onChangeGrid={this.props.onChangeGrid}
                content={this.props.content}
                showConfirmDialog={this.props.showConfirmDialog}
            />);
        }

        const sopName = this.props.sopData?.disaster?.disaster?.disasterName;

        return (
            <>
            <section className={sectionStyles.panelAreas}>
              <div className={sectionStyles.sectionPanels}>
                {panels}
              </div>
            </section>
            {/* <section className={'panelAreas'}>
              <SectionPanels className={'sectionPanels'}>
                {panels}
              </SectionPanels>
            </section> */}
            </>
        );
    }
}


export default PanelAreas;