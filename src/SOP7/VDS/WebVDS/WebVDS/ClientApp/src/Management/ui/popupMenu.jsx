import React, { Component } from 'react';
import dash from '../../Dashboard/css/dash.module.css';
import Management from './management';

class PopupMenu extends Component {
    static menu = {
        none: 0,
        cloneVdc: 1
    }

    static bodyID = "managementPopupMenuBody";

    constructor(props) {
        super(props);

        this.state = {
        }

        this.refBody = React.createRef();
    }

    componentDidMount() {
        this.setPosition();
        document.addEventListener('mouseup', this.onMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    componentDidUpdate() {
        this.setPosition();
    }

    onMouseUp = (e) => {
        if (e.target.id !== PopupMenu.bodyID &&
            e.target.parentElement.id !== PopupMenu.bodyID &&
            e.target.parentElement.parentElement.id !== PopupMenu.bodyID) {
            this.props.onClose();
        }
    }

    setPosition() {
        if (this.refBody.current) {
            const baseElement = document.getElementById(Management.baseID);

            if (baseElement) {
                const rect = baseElement.getBoundingClientRect();
                const x = this.props.x - rect.x;
                const y = this.props.y - rect.y;

                this.refBody.current.style.top = y + "px";
                this.refBody.current.style.left = x + "px";
            }
        }
    }

    getMenuElement() {
        if (this.props.menu === PopupMenu.menu.cloneVdc) {
            return (
                <div id={PopupMenu.bodyID} ref={this.refBody} className={dash.reproductionBox}>
                    <div className={dash.reproductTitle} onClick={() => this.props.onAction(this.props.menu, this.props.parameter)}>VDC 복제</div>
                </div>
            );
        }

        return <></>;
    }

    render() {
        return (
            this.getMenuElement()
        )
    }
}
export default PopupMenu;