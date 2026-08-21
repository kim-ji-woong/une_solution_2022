import React, { Component } from 'react';
import space from './../../css/space.module.css';
import $ from 'jquery';

class PopupMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedSensor: this.props.selectedSensor,
            miniPopInfo: this.props.miniPopInfo,

            windDirection: 0,
            windSpeed: 0,
            temp: 0,
            humidity: 0,
        }

        this.refBody = React.createRef();
    }

    componentDidMount() {
        this.refBody.current.style.left = this.props.x + "px";
        this.refBody.current.style.top = this.props.y + "px";

        const _this = this;

        // 다른 곳 클릭했을때 이벤트 발생
        $('#main').click(function (e) {
            let targetName = e.target.className;

            if (targetName !== space.btn && targetName !== space.spn) {
                _this.props.showPopupMenu(null, null, null, null, null);
            }
        });
    }

    componentDidUpdate() {
        this.refBody.current.style.left = this.props.x + "px";
        this.refBody.current.style.top = this.props.y + "px";
    }

    onClick() {
        const method = this.props.method;
        let needClear = true;

        if (method) {
            if (this.props.parameter) {
                needClear = method(this.props.parameter);
            }
            else {
                needClear = method();
            }
        }

        if (needClear) {
            this.props.showPopupMenu(null, null, null, null, null);
        }
    }

    render() {
        return (
            <div ref={this.refBody} className={space.popupMenu}>
                <div className={space.btn}>
                    <span className={space.spn} onClick={() => this.onClick()}>{this.props.text}</span>
                </div>
            </div>
            );
    }
}

export default PopupMenu;