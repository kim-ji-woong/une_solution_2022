import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import '../../Main/css/main.css';
import $ from 'jquery';
import Main from './main';
import ProjectResource from '../../Root/resource/id';


class RightMenubar extends Component {

    static modeRightMain = 0;
    static modeRightEdit = 1;

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        }
    }

    componentDidMount() {

        $(document).ready(function () {
            $(".slide-toggle3").click(function () {
                $(".box3").animate({
                    height: "toggle"
                });
            });

            $(".menuArrowTopIcon").click(function () {
                $(".menuModeIcon").removeClass("on");
                $(".box3").slideUp();
            });

            $(".menuArrowTopIconEdit").click(function () {
                $(".menuModeIconEdit").removeClass("on");
                $(".box3Edit").slideUp();
            });

            /* $(".simulationIcon").hover(function () {
                $(this).toggleClass("simulationIconImage");
            }); */

            $(document).ready(function () {
                /* $(".simulationIcon").hover(function () {
                    $(".simulationIcon").addClass('simulationIcon simulationIconImage');
                }); */

                /* $(".simulationIcon").mouseover(function () {
                    $(this).addClass("simulationIconImage");
                });
                $(".simulationIcon").mouseleave(function () {
                    $(this).removeClass("simulationIconImage");
                }); */

            });
        });

        // 경로에 따라 우측메뉴바 css 변경
        if (this.props.mode === RightMenubar.modeRightEdit) {
            /* $('.menuModeIcon').addClass("menuModeIconEdit");
            $('.box3').addClass("box3Edit");
            $('.menuArrowTopIcon').addClass("menuArrowTopIconEdit"); */

            $('#vdsRightMenu').hide();
        } else if (this.props.mode === RightMenubar.modeRightMain) {

        }
    }


    onClickNavigator = (event) => {
        const btn = event.target;

        if (btn.classList.contains("on")) {
            btn.classList.remove("on");
            $(btn).next().slideUp();
        }
        else {
            $(btn).next().slideDown();
            btn.classList.add("on");
        }
    }

    toggleVisible(item) {
        this.props.setVisiblePopups(item, !this.props.getVisiblePopups(item));
    }

    render() {
        return (
            <>
                {/* <div id={main.vdsNav}>
                    <button className={main.slideToggle}></button>
                    <div className={main.box}>
                        <ul className={main.vdsMenu + " " + main.boxInner}>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                        </ul>
                    </div>
                </div> */}

                <div id="vdsRightMenu">
                    <button className="menuModeIcon slide-toggle3" onClick={this.onClickNavigator}>
                        {/* <span className="menuIcon"></span>
                        <span className="menuText">menu</span>
                        <span className="menuArrowIcon"></span> */}
                    </button>
                    <div className="box3">
                        <ul className="vdsRMenu box-inner">
                            <li><a onClick={() => {this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info)}}></a></li>
                            <li><a onClick={() => { this.toggleVisible(Main.popupLayer.cfdViewer) }}></a></li>
                            <li><a onClick={() => {this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info)}}></a></li>
                            <li><a onClick={() => {this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info)}}></a></li>
                            <li><a onClick={() => {this.toggleVisible(Main.popupLayer.InventoryManagement) }} ></a></li>
                        </ul>
                        <span className="menuArrowTopIcon"></span>
                    </div>
                </div>
            </>
        );
    }
}

export default RightMenubar;