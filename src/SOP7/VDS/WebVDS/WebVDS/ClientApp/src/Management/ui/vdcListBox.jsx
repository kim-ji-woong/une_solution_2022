import React, { Component } from 'react';
import $ from 'jquery';
import dash from '../../Dashboard/css/dash.module.css';
import Main from '../../Main/ui/main';
import CommonResource from '../../Common/resource/id';

import Tooltip from '../../Main/ui/tooltip';

class VDCListBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newNameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }

        this.refSelectedRackGroup = React.createRef();
        this.refSelectedRack = React.createRef();
    }

    componentDidMount() {
        /*$('.' + dash.vdcTree + ' h5 div ').click(function () {
            if ($(this).is('.' + dash.on)) {
                $(this).removeClass(dash.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(dash.on);
                $(this).parent().next().show();
            };
        });

        $('.' + dash.vdcTree + ' h5 span ').click(function () {
            if ($(this).is('.' + dash.on)) {
                $(this).removeClass(dash.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(dash.on);
                $(this).parent().next().show();
            };
        });*/
    }

    collapseElement(element, collapse) {
        const elementType = this.getElementType(element);

        if (collapse) {
            this.collapse(element);

            if (elementType === Main.RackGroup) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                    this.expandRackElement = null;
                }

                this.expandRackGroupElement = null;
            }
            else if (elementType === Main.Rack) {
                this.expandRackElement = null;
            }
        }
        else {
            this.expand(element);

            if (elementType === Main.RackGroup) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                    this.expandRackElement = null;
                }

                if (this.expandRackGroupElement && this.expandRackGroupElement !== element) {
                    this.collapse(this.expandRackGroupElement);
                }

                this.expandRackGroupElement = element;
            }
            else if (elementType === Main.Rack) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                }

                this.expandRackElement = element;
            }
        }
    }

    collapse(element) {
        $(element).removeClass(dash.on);

        const nextElementText = element.parentElement?.nextSibling?.innerHTML;

        if (nextElementText && nextElementText.startsWith("<li>")) {
            $(element).parent().next().hide();
        }
    }

    expand(element) {
        if (element.classList.contains(dash.on)) {
            return;
        }

        $(element).addClass(dash.on);
        $(element).parent().next().show();
    }

    getElementType(element) {
        const index1 = element.innerHTML.indexOf("RName");
        const index2 = element.innerHTML.indexOf("LName");

        if (index1 > 0 && index2 > 0) {
            if (index1 < index2) {
                return Main.Rack;
            }
            else {
                return Main.RackGroup;
            }
        }
        else if (index1 > 0) {
            return Main.Rack;
        }
        else if (index2 > 0) {
            return Main.RackGroup;
        }

        return 0;
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'newname') {
            this.setState({
                newNameTooltipShow: !this.state.newNameTooltipShow,
                tooltipTop: domRect.top - 60,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    newRackName(name, nameConts, hidden) {
        if (name.length > 40) {
            nameConts = name;
            name = name.substring(0, 40) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipNewRackName">
                        <span className="tooltipNewRackNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('newname', e, nameConts)}
                            onMouseLeave={() => this.setState({ newNameTooltipShow: false })}>
                            {name}
                        </span>
                        <Tooltip
                            show={this.state.newNameTooltipShow}
                            message={this.nameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipNewRackNameConts tooltip-left"}
                        >
                            {nameConts}
                        </Tooltip>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{name}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }

    getRackItems() {
        const rackGroups = { ...this.props.rackGroups };

        if (this.props.tempRackGroup.racks.length > 0) {
            rackGroups[this.props.tempRackGroup.groupName] = this.props.tempRackGroup;
        }

        const items = [];

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const listItems = [];
            const rackGroupClassName = rackGroup === this.props.selected.rackGroup ? dash.LNameN + " " + dash.selected : dash.LNameN;

            if (rackGroup === this.props.selected.rackGroup) {
                listItems.push(
                    <h5>
                        <div style={{ display: 'flex' }}>
                            <p ref={this.refSelectedRackGroup} className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>{groupName}</p>
                        </div>
                    </h5>
                );
            }
            else {
                listItems.push(
                    <h5>
                        <div style={{ display: 'flex' }}>
                            <p className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>
                               {groupName} 
                            </p>
                        </div>
                    </h5>
                );
            }

            if (rackGroup.racks.length > 0) {
                const rackItems = [];

                for (const rack of rackGroup.racks) {
                    const itemCount = rack.items.length;
                    const rackClassName = rack === this.props.selected.rack ? dash.RNameN + " " + dash.selected : dash.RNameN;

                    if (rack === this.props.selected.rack) {
                        rackItems.push(
                            <h5 style={{ padding: '5px 0px' }}>
                                <div>
                                    <p ref={this.refSelectedRack} className={rackClassName} onClick={(e) => this.onClickRack(e, rack)}>
                                        {rack.name}

                                        {/* {
                                           this.newRackName(rack.name, true)
                                        } */}
                                    </p>
                                    {/*<span className={dash.LNumBoxN}>
                                        <p className={dash.LFontN}>{validCount}</p>
                                    </span>*/}
                                </div>
                            </h5>
                        );
                    }
                    else {
                        rackItems.push(
                            <h5 style={{ padding: '5px 0px' }}>
                                <div>
                                    <p className={rackClassName} onClick={(e) => this.onClickRack(e, rack)}>
                                        {rack.name}

                                        {/* {
                                            this.newRackName(rack.name, true)
                                        } */}
                                    </p>
                                    {/*<span className={dash.LNumBoxN}>
                                        <p className={dash.LFontN}>{validCount}</p>
                                    </span>*/}
                                </div>
                            </h5>
                        );
                    }

                    if (rackItems.length > 0) {
                        listItems.push(
                            <ul style={{ marginBottom: '10px' }}>
                                <li>
                                    {rackItems}
                                </li>
                            </ul>
                        );
                    }
                }
            }

            items.push(
                <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                    {listItems}
                </li>
            );
        }

        return items;
    }

    onClickRackGroup(e, rackGroup) {
        const element = e.target.parentElement;

        if ($(element).is('.' + dash.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rackGroup, Main.RackGroup);
    }

    onClickRack(e, rack) {
        const element = e.target.parentElement;

        if ($(element).is('.' + dash.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rack, Main.Rack);
    }

    render() {
        return (
            <>
                <div className={dash.vdcListBoxN + " " + CommonResource.UISection}>
                <span className={dash.vdcListTitle}><span className={dash.inventIcon}></span><p>인벤토리 관리</p></span>
                <span className={dash.underLine}></span>

                <div className={dash.vdcTreeBox + " " + dash.vdcNScroll}>
                        <ul className={dash.vdcTree}>
                            {
                                this.getRackItems()
                            }
                            {/*<li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5>
                                <div style={{ display: 'flex' }}>
                                <p className={dash.LNameN}>L-1</p>
                                </div>
                            </h5>
                        </li>
                        <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5>
                                <div>
                                <p className={dash.LNameN}>L-2</p>
                                </div>
                            </h5>
                            <ul style={{ marginBottom: '10px' }}>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                            <div>
                                        <p className={dash.RNameN}>Rack01</p>
                                            <span className={dash.LNumBoxN}>
                                                <p className={dash.LFontN}>12</p>
                                            </span>
                                        </div>
                                    </h5>
                                </li>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}> 
                                        <div>
                                            <p className={dash.RNameN}>Rack02</p>
                                            <span className={dash.LNumBoxN}>
                                                <p className={dash.LFontN}>9</p>
                                            </span>
                                        </div>
                                    </h5>
                                    <ul style={{ marginBottom: '10px' }}>
                                        <li>
                                            <h5 style={{ padding: '5px 0px' }}> 
                                                <div className={dash.rackArea}>
                                                    <span className={dash.rackBox}>
                                                        <span className={dash.box1}>24</span>
                                                        <span className={dash.box2}>어플라이언스</span>
                                                        <span className={dash.box3}>Lenova</span>
                                                        <span className={dash.box4}>SG510-20-M5</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span className={dash.rackBox}>
                                                        <span className={dash.box1}>20</span>
                                                        <span className={dash.box2}>어플라이언스</span>
                                                        <span className={dash.box3}>Lenova</span>
                                                        <span className={dash.box4}>SG510-20-M5</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span className={dash.rackBox}>
                                                        <span className={dash.box1}>15</span>
                                                        <span className={dash.box2}>서버</span>
                                                        <span className={dash.box3}>DELL</span>
                                                        <span className={dash.box4}>R710</span>
                                                        <span className={dash.box5}>1U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span className={dash.rackBox}>
                                                        <span className={dash.box1}>13</span>
                                                        <span className={dash.box2}>어플라이언스</span>
                                                        <span className={dash.box3}>Lenova</span>
                                                        <span className={dash.box4}>SG510-20-M5</span>
                                                        <span className={dash.box5}>1U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span className={dash.rackBox}>
                                                        <span className={dash.box1}>30</span>
                                                        <span className={dash.box2}>네트워크</span>
                                                        <span className={dash.box3}>2980</span>
                                                        <span className={dash.box4}>30</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span className={dash.rackBox}>
                                                            <span className={dash.box1}>30</span>
                                                            <span className={dash.box2}>네트워크</span>
                                                            <span className={dash.box3}>2980</span>
                                                            <span className={dash.box4}>30</span>
                                                            <span className={dash.box5}>2U</span>
                                                            <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span id={dash.rackBox}>
                                                        <span className={dash.box1}>30</span>
                                                        <span className={dash.box2}>네트워크</span>
                                                        <span className={dash.box3}>2980</span>
                                                        <span className={dash.box4}>30</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span id={dash.rackBox}>
                                                        <span className={dash.box1}>30</span>
                                                        <span className={dash.box2}>네트워크</span>
                                                        <span className={dash.box3}>2980</span>
                                                        <span className={dash.box4}>30</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                    <span id={dash.rackBox}>
                                                        <span className={dash.box1}>30</span>
                                                        <span className={dash.box2}>네트워크</span>
                                                        <span className={dash.box3}>2980</span>
                                                        <span className={dash.box4}>30</span>
                                                        <span className={dash.box5}>2U</span>
                                                        <span className={dash.box6}><span className={dash.greenCircle}></span></span>
                                                    </span>
                                                </div>
                                            </h5>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div>
                                            <p className={dash.RNameN}>Rack03</p>
                                            <span className={dash.LNumBoxN}>
                                                <p className={dash.LFontN}>12</p>
                                            </span>
                                        </div>
                                    </h5>
                                </li>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div>
                                            <p className={dash.RNameN}>Rack04</p>
                                            <span className={dash.LNumBoxN}>
                                                <p className={dash.LFontN}>12</p>
                                            </span>
                                        </div>
                                    </h5>
                                </li>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div>
                                            <p className={dash.RNameN}>Rack05</p>
                                            <span className={dash.LNumBoxN}>
                                                <p className={dash.LFontN}>12</p>
                                            </span>
                                        </div>
                                    </h5>
                                </li>

                            </ul>
                        </li>
                        <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5> 
                                <div style={{ display: 'flex' }}>
                                    <p className={dash.LNameN}>L-3</p>
                                </div>
                            </h5>
                        </li>
                        <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5> 
                                <div style={{ display: 'flex' }}>
                                    <p className={dash.LNameN}>L-4</p>
                                </div>
                            </h5>
                        </li>
                        <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5> 
                                <div style={{ display: 'flex' }}>
                                    <p className={dash.LNameN}>L-5</p>
                                </div>
                            </h5>
                        </li>
                        <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                            <h5>
                                <div style={{ display: 'flex' }}>
                                    <p className={dash.LNameN}>L-6</p>
                                </div>
                            </h5>
                        </li>*/}
                    </ul>
                </div>
             </div>
          </>
        );
    }
}
export default VDCListBox;