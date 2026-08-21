import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import $ from 'jquery';
import ProjectResource from '../../Root/resource/id';
import Interchange from '../../Root/interchange';

import Tooltip from '../../Main/ui/tooltip';

class VDCList extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            centerTooltipShow: false,
            controlcenterTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',
            controltooltipContent: '',
        }
    }

    componentDidMount() {

        // 트리 열고 닫기
        $('.' + dash.dsiTreeW + ' h5 div ').click(function () {
            if ($(this).is('.' + dash.on)) {
                $(this).removeClass(dash.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(dash.on);
                $(this).parent().next().show();
            };
        });

        $('.' + dash.dsiTreeW + ' h5 span ').click(function () {
            if ($(this).is('.' + dash.on)) {
                $(this).removeClass(dash.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(dash.on);
                $(this).parent().next().show();
            };
        });

        this.refSelectedSite = React.createRef();
        this.refSelectedNation = React.createRef();
        this.refSelectedCenter = React.createRef();
    }

    handleTooltip = (param, e, content) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
                tooltipContent: content
            });
        } else if (param === 'controlcenter') {
            this.setState({
                controlcenterTooltipShow: !this.state.controlcenterTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
                controltooltipContent: content
            });
        } 
    }

    expandElement(element) {
        if ($(element).is('.' + dash.on) === false) {
            $(element).addClass(dash.on);
            $(element).parent().next().show();
        }
    }

    getSiteCount(dataCenters) {
        let siteCount = 0;

        for (const siteName in dataCenters) {
            siteCount++;
        }

        return siteCount;
    }

    getNationCount(site) {
        let nationCount = 0;

        for (const nationName in site.nations) {
            nationCount++;
        }

        return nationCount;
    }

    getCenterCount(user, nation) {
        let centerCount = 0;

        for (const centerName in nation.centers) {
            const dataCenter = nation.centers[centerName];

            if (VDCList.belongToDataCenter(user, dataCenter)) {
                centerCount++;
            }
        }

        return centerCount;
    }

    static expandSelectedDataCenter(vdcList) {
        if (vdcList.refSelectedCenter.current && vdcList.refSelectedNation.current && vdcList.refSelectedSite.current) {
            vdcList.expandElement(vdcList.refSelectedSite.current);
            vdcList.expandElement(vdcList.refSelectedNation.current);
            vdcList.expandElement(vdcList.refSelectedCenter.current);
        }
    }

    static getSiteID(site) {
        for (const nationName in site.nations) {
            const nation = site.nations[nationName];

            for (const centerName in nation.centers) {
                const dataCenter = nation.centers[centerName];
                return dataCenter.siteID;
            }
        }

        return null;
    }

    static isSiteUser(user, siteID) {
        if (!user.dataCenters) {
            return false;
        }

        for (const dataCenter of user.dataCenters) {
            if (dataCenter.siteID === siteID) {
                return true;
            }
        }

        return false;
    }

    static belongToNation(user, nation) {
        if (!user.dataCenters) {
            return false;
        }

        for (const centerName in nation.centers) {
            const dataCenter = nation.centers[centerName];

            for (const center of user.dataCenters) {
                if (center.id === dataCenter.id) {
                    return true;
                }
            }
        }

        return false;
    }

    static belongToDataCenter(user, dataCenter) {
        if (!user.dataCenters) {
            return false;
        }

        for (const center of user.dataCenters) {
            if (center.id === dataCenter.id) {
                return true;
            }
        }

        return false;
    }

    moveToDataCenter(dataCenter) {
        this.props.onChangeMode(Interchange.Mode.main, this.props.makeParameter(Interchange.paramType.dataCenter, ProjectResource.makeClone(dataCenter)));
    }

    getSubDataCenterElements(children, depth) {
        if (!children) {
            return <></>
        }

        const subDataCenterElements = [];

        for (const dataCenter of children) {
            subDataCenterElements.push(this.getSubDataCenterElement(dataCenter, depth));
        }

        if (subDataCenterElements.length === 0) {
            return <></>
        }

        return (
            <ul>
                {
                    subDataCenterElements
                }
            </ul>
            );
    }

    getControlClassName(depth) {
        if (depth === 1) {
            return dash.controlName1;
        }
        else if (depth === 2) {
            return dash.controlName2;
        }
        else if (depth === 3) {
            return dash.controlName3;
        }
        else if (depth === 4) {
            return dash.controlName4;
        }
        else if (depth === 5) {
            return dash.controlName5;
        }
        else if (depth === 6) {
            return dash.controlName6;
        }
        else if (depth === 7) {
            return dash.controlName7;
        }
        else if (depth === 8) {
            return dash.controlName8;
        }
        else if (depth === 9) {
            return dash.controlName9;
        }
        else if (depth === 10) {
            return dash.controlName10;
        }

        return dash.controlName1;
    }

    getControlCenterName(dataCenter, dataCenterConts, hidden) {
        if (dataCenter.length > 18) {
            dataCenterConts = dataCenter;
            dataCenter = dataCenter.substring(0, 18) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipControlCenterName">
                        <span className="tooltipControlCenterNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('controlcenter', e, dataCenterConts)}
                            onMouseLeave={() => this.setState({ controlcenterTooltipShow: false })}>
                            {dataCenter}
                        </span>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{dataCenter}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{dataCenter}</div>
            );
        }

        return (
            <div>{dataCenter}</div>
        );
    }


    getSubDataCenterElement(dataCenter, depth = 1) {
        const subDataCenterElements = this.getSubDataCenterElements(dataCenter.children, depth + 1);

        if (dataCenter === this.props.selectedCenter) {
            return (
                <li>
                    <h5 style={{ padding: '5px 0px 8px 0px' }}>
                        <span className={this.getControlClassName(depth) + " " + dash.selected} onClick={() => this.props.selectDataCenter(dataCenter)}>{this.getCloneElement(dataCenter)}
                            <p className={dash.controlCenter}>
                                {
                                    this.getControlCenterName(ProjectResource.getDataCenterName(dataCenter), true)
                                }
                            </p>
                        </span>
                        <p className={dash.moveBtn} onClick={() => this.moveToDataCenter(dataCenter)}>이동</p>
                    </h5>
                    {
                        subDataCenterElements
                    }
                </li>
                );
        }

        return (
            <li>
                <h5 style={{ padding: '5px 0px 8px 0px' }}>
                    <span className={this.getControlClassName(depth)} onClick={() => this.props.selectDataCenter(dataCenter)}>{this.getCloneElement(dataCenter)}
                        <p className={dash.controlCenter}>
                            {/* {ProjectResource.getDataCenterName(dataCenter)} */}
                            {
                                this.getControlCenterName(ProjectResource.getDataCenterName(dataCenter), true)
                            }
                        </p>
                    </span>
                    <p className={dash.moveBtn} onClick={() => this.moveToDataCenter(dataCenter)}>이동</p>
                </h5>
                {
                    subDataCenterElements
                }
            </li>
        );
    }

    getSubDataCenterItems(center, subCenterItems) {
        const subItems = subCenterItems[center.id];

        if (subItems) {
            return (
                <ul>
                    {
                        subItems
                    }
                </ul> 
            );
        }

        return (
            <></>
        );
    }

    getCenterName(centerName, centerNameConts, hidden) {
        if (centerName.length > 18) {
            centerNameConts = centerName;
            centerName = centerName.substring(0, 18) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipCenterName">
                        <span className="tooltipCenterNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('center', e, centerNameConts)}
                            onMouseLeave={() => this.setState({ centerTooltipShow: false })}>
                            {centerName}
                        </span>
                        
                    </div>
                    
                </div>
            );
        } else {
            return (
                <div>{centerName}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{centerName}</div>
            );
        }

        return (
            <div>{centerName}</div>
        );
    }

    getItems() {
        const user = ProjectResource.getUserInfo();

        if (!user) {
            return <></>
        }

        const dataCenters = { ...this.props.dataCenters };
        const siteCount = this.getSiteCount(dataCenters);
        let siteIndex = 0;

        const items = [];
        const selectedSiteName = this.props.selectedSite;
        const selectedNationName = this.props.selectedNation;

        for (const siteName in dataCenters) {
            siteIndex++;

            const site = dataCenters[siteName];
            const siteID = VDCList.getSiteID(site);

            if (VDCList.isSiteUser(user, siteID) === false) {
                continue;
            }

            const nationCount = this.getNationCount(site);

            const listItems = [];
            const siteClassName = siteName === selectedSiteName ? dash.buildingName + " " + dash.selected : dash.buildingName;

            if (siteName === selectedSiteName) {
                listItems.push(
                    <h5>
                        <div ref={this.refSelectedSite} style={{ display: 'flex' }}>
                            <p className={siteClassName} onClick={() => this.props.selectSite(siteName)}>{siteName}</p>
                            <p className={dash.peopleNumBox}>
                                {/*<p className={dash.greenFont}>{nationCount}</p>*/}
                            </p>
                        </div>
                    </h5>
                );
            }
            else {
                listItems.push(
                    <h5>
                        <div style={{ display: 'flex' }}>
                            <p className={siteClassName} onClick={() => this.props.selectSite(siteName)}>{siteName}</p>
                            <p className={dash.peopleNumBox}>
                                {/*<p className={dash.greenFont}>{nationCount}</p>*/}
                            </p>
                        </div>
                    </h5>
                );
            }

            const childListItems = [];

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                if (VDCList.belongToNation(user, nation) === false) {
                    continue;
                }

                const nationItems = [];
                const centerCount = this.getCenterCount(user, nation);

                let _nation = null;
                const nationClassName = siteName === selectedSiteName && nationName === selectedNationName ? dash.buildingName2 + " " + dash.selected : dash.buildingName2;

                for (const centerName in nation.centers) {
                    const center = nation.centers[centerName];
                    _nation = center.nation;
                    break;
                }

                if (siteName === selectedSiteName && nationName === selectedNationName) {
                    nationItems.push(
                        <h5>
                            <span ref={this.refSelectedNation} className={nationClassName} onClick={() => this.props.selectNation(_nation, nationName, siteName)}><p className={dash.flexFull}>{nationName}</p></span>
                            <p className={dash.peopleNumBox}>
                                <p className={dash.whiteFont}>{centerCount}</p>
                            </p>
                        </h5>
                    );
                }
                else {
                    nationItems.push(
                        <h5>
                            <span className={nationClassName} onClick={() => this.props.selectNation(_nation, nationName, siteName)}><p className={dash.flexFull}>{nationName}</p></span>
                            <p className={dash.peopleNumBox}>
                                <p className={dash.whiteFont}>{centerCount}</p>
                            </p>
                        </h5>
                    );
                }

                const subCenterItems = {};
                const nationCenters = this.copyDataCenters(nation.centers);

                for (const centerName in nationCenters) {
                    const center = nationCenters[centerName];

                    if (center.data?.isClone && center.data?.parentID) {
                        let centerItems = subCenterItems[center.data.parentID];

                        if (!centerItems) {
                            centerItems = [];
                            subCenterItems[center.data.parentID] = centerItems;
                        }

                        centerItems.push(
                            this.getSubDataCenterElement(center)
                        );
                    }
                }

                const centerItems = [];

                for (const centerName in nationCenters) {
                    const center = nationCenters[centerName];
                    delete center.children;

                    if (VDCList.belongToDataCenter(user, center) === false) {
                        continue;
                    }

                    if (center.data?.isClone && center.data?.parentID) {
                        continue;
                    }

                    const subItems = this.getSubDataCenterItems(center, subCenterItems);

                    if (center === this.props.selectedCenter) {
                        centerItems.push(
                            <li>
                                <h5>
                                    <span ref={this.refSelectedCenter} className={dash.localName + " " + dash.selected}>{this.getCloneElement(center)}
                                       <p className={dash.centerName}>
                                        {/*  {centerName} */}
                                        {
                                            this.getCenterName(centerName, true)
                                        } 
                                       </p>
                                    </span>
                                    <p className={dash.moveBtn} onClick={() => this.moveToDataCenter(center)}>이동</p>
                                </h5>
                                {
                                    subItems
                                }
                            </li>
                        );
                    }
                    else {
                        centerItems.push(
                            <li>
                                <h5>
                                    <span className={dash.localName} onClick={() => this.props.selectDataCenter(center)}>{this.getCloneElement(center)}
                                        <p className={dash.centerName}> 
                                            {/*  {centerName} */}
                                             {
                                                this.getCenterName(centerName, true)
                                            }
                                        </p> 
                                    </span>
                                    <p className={dash.moveBtn} onClick={() => this.moveToDataCenter(center)}>이동</p>
                                </h5>
                                {
                                    subItems
                                }
                            </li>

                        );
                    }
                }

                nationItems.push(
                    <ul>
                        {centerItems}
                    </ul>
                );

                childListItems.push(
                    <li>
                        {nationItems}
                    </li>
                );
            }

            listItems.push(
                <ul style={{ marginBottom: '10px' }}>
                    {childListItems}
                </ul>
            );

            if (siteIndex === siteCount) {
                items.push(
                    <li>
                        {listItems}
                    </li>
                );
            }
            else {
                items.push(
                    <li style={{ borderBottom: 'dashed 1px #d7d7d733' }}>
                        {listItems}
                    </li>
                );
            }
        }

        return items;
    }

    copyDataCenters(centers) {
        const dataCenters = { ...centers };
        const centerMap = {};

        for (const centerName in dataCenters) {
            const center = dataCenters[centerName];
            centerMap[center.id] = center;
        }

        for (const centerName in dataCenters) {
            const center = dataCenters[centerName];

            if (center.data?.isClone && center.data?.parentID) {
                const parentCenter = centerMap[center.data.parentID];

                if (parentCenter) {
                    if (!parentCenter.children) {
                        parentCenter.children = [];
                    }

                    parentCenter.children.push(center);
                }
            }
        }

        return dataCenters;
    }

    getCloneElement(dataCenter) {
        if (dataCenter.data?.isClone) {
            return (
                <p className={dash.controlIcon}></p>
            );
        }

        return <></>
    }


    render() {
        this.props.setVdcList(this);

        return (
            <>
                <div id='tooltip-area'>
                    <Tooltip
                        show={this.state.centerTooltipShow}
                        message={this.state.tooltipContent}
                        top={this.state.tooltipTop}
                        left={this.state.tooltipLeft}
                        className={"tooltipCenterNameConts tooltip-left"}
                    >
                        {this.state.tooltipContent}
                    </Tooltip>
                    <Tooltip
                        show={this.state.controlcenterTooltipShow}
                        message={this.state.controltooltipContent}
                        top={this.state.tooltipTop}
                        left={this.state.tooltipLeft}
                        className={"tooltipControlCenterNameConts tooltip-left"}
                    >
                        {this.state.controltooltipContent}
                    </Tooltip>
                </div>
                {/* <div id={this.props.popupType} className={dash.vdcListPopup}> */}
                <div className={dash.vdcListBox}>
                    <span className={dash.vdcTitle}>{ProjectResource.ID.dashboard.vdcList}</span>
                    <span className={dash.underLine}></span>

                    <div className={dash.workerConts1Tree + " " + dash.vdcListScroll} /* style={{ display: 'none' }} */>
                        {/* <div style={{ height: 'calc(100vh - 400px)', overflowX: 'hidden', marginRight: '4px' }}> */}

                        <ul className={dash.dsiTreeW}>
                            {
                                this.getItems()
                            } 
                        </ul>  
                    </div>
                </div>
            </>
        )
    }
}

export default VDCList;