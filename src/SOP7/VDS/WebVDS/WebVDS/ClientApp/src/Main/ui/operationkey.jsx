import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import '../../Main/css/main.css';
import $ from 'jquery';


class OperationKey extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        }
    }

    componentDidMount() {
        $(document).ready(function () {
            $(".slide-toggle2").click(function () {
                $(".box2").animate({
                    width: "toggle"
                });
            });
        });
    }

    render() {
        return (
            <>
                <div id="vdsOperationKey">
                    <button className="slide-toggle2"></button>
                    <div className="box2">
                        <ul className="vdsOperationMenu box-inner">
                            <li><a onClick={() => { }}></a><span>전진</span></li>
                            <li><a onClick={() => { }}></a><span>후진</span></li>
                            <li><a onClick={() => { }}></a><span>왼쪽 이동</span></li>
                            <li><a onClick={() => { }}></a><span>오른쪽 이동</span></li>
                            <li><a onClick={() => { }}></a><span>앉기</span></li>
                            <li><a onClick={() => { }}></a><span>서기</span></li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

export default OperationKey;