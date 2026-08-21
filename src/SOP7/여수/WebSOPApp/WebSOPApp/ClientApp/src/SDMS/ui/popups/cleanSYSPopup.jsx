import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import content from '../../../Common/css/content.module.css';
import SDMSResource from '../../resource/id';
import uis from '../../../Common/css/ui.module.css';

import { AtmosphereCityPopupTop, SensorCityTitle, SensorCityTime, CityCloseIcon, CleanTable } from './../../styled';



class CleanSYSPopup extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            cleanSYS: this.props.cleanSYS
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.cleanSYS !== this.props.cleanSYS) {
            this.setState({ cleanSYS: this.props.cleanSYS });
        }
    }

    onClickCloseIcon = (type) => {
        this.props.onClickCloseDataPop(type);
    }

    getElements = () => {

        let elements = [];

        if (!this.state.cleanSYS) {
            return elements;
        }

        const csDatas = this.state.cleanSYS;

        let factoryName = null;
        let areaCode = null;

        let tspValue = null;
        let soxValue = null;
        let noxValue = null;
        let hclValue = null;
        let hfValue = null;
        let nh3Value = null;
        let coValue = null;

        for (let i = 0; i < csDatas.length; i++) {
            let csData = csDatas[i];

            factoryName = csData.factManageNM ? csData.factManageNM : 'Null';
            areaCode = csData.stackCode ? this.isValueNaN(csData.stackCode) : 'Null';
            tspValue = csData.tspMeasureValue ? this.isValueNaN(csData.tspMeasureValue) : 'Null';
            soxValue = csData.soxMeasureValue ? this.isValueNaN(csData.soxMeasureValue) : 'Null';
            noxValue = csData.noxMeasureValue ? this.isValueNaN(csData.noxMeasureValue) : 'Null';
            hclValue = csData.hclMeasureValue ? this.isValueNaN(csData.hclMeasureValue) : 'Null';
            hfValue = csData.hfMeasureValue ? this.isValueNaN(csData.hfMeasureValue) : 'Null';
            nh3Value = csData.nh3MeasureValue ? this.isValueNaN(csData.nh3MeasureValue) : 'Null';
            coValue = csData.coMeasureValue ? this.isValueNaN(csData.coMeasureValue) : 'Null';


            /*
            * Name
            * SiteCode
            */ 
            let element = <tr className="itemBoxTdLine">
                <td className="itemBoxTd1">{factoryName}</td>
                <td className="itemBoxTd1">{areaCode}</td>
                <td className="itemBoxTd1">{tspValue}</td>
                <td className="itemBoxTd1">{soxValue}</td>
                <td className="itemBoxTd1">{noxValue}</td>
                <td className="itemBoxTd1">{hclValue}</td>
                <td className="itemBoxTd1">{hfValue}</td>
                <td className="itemBoxTd1">{nh3Value}</td>
                <td className="itemBoxTd1">{coValue}</td>
            </tr>

            elements.push(element)
        }

        return elements;

    }

    isValueNaN = (value) => {
        let num = parseFloat(value);
        return isNaN(num) ? " " : num; 
    }

    getDt = () => {
        let dt = new Date();

        const year = dt.getFullYear();
        const month = dt.getMonth();
        const day = dt.getDate();
        const hours = dt.getHours();
        const minutes = dt.getMinutes();

        let result = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        return result;
    }

    render() {

        const elements = this.getElements();
        const dt = this.getDt();

        return (
            <>
              <div id={uis.ITpropertyPop}>
                  <div>
                  <div>
                    <div id={this.props.popupType} className={content.cleanSYSPopup + " " + SDMSResource.UISection}>
                        <AtmosphereCityPopupTop>
                            <SensorCityTitle>CleanSYS</SensorCityTitle>
                                    <SensorCityTime>{dt}기준</SensorCityTime>
                            <CityCloseIcon onClick={() => this.onClickCloseIcon(1)} ></CityCloseIcon>
                        </AtmosphereCityPopupTop>

                        <CleanTable>
                            <table>
                                <thead>
                                    <tr className="itemBoxTrLine" style={{ borderBottom: 'solid 1px #808080' }}>
                                        <th className="itemBoxTh">사업장 이름</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>배출구 코드</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>먼지</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>황산화물</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>질소산화물</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>염화수소</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>불화수소</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>암모니아</th>
                                        <th className="itemBoxTh" style={{ width: '90px' }}>일산화탄소</th>
                                    </tr>
                                </thead>
                                <tbody>
                                            {elements}
                                </tbody>
                            </table>
                        </CleanTable>

                    </div>
                 </div>
                 </div>
              </div>
            </>
        )
    }
}

export default CleanSYSPopup;

