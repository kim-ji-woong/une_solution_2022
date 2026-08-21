import React, { Component } from 'react';

import $, { event } from 'jquery';
import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';

class VDCMemoBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            top: this.props.top,
            left: this.props.left,

            textMemo: props.memo
        }

        this.refMemo = React.createRef();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    saveMemo = () => {
        if (this.props.enableEdit) {
            const memo = this.refMemo.current.value;
            this.props.saveMemo(memo);
        }
        else {
            this.closeMemoBox();
        }
    }

    closeMemoBox = () => {
        this.props.closeMemoBox();
    }

    onChangeText(e) {
        this.setState({ textMemo: e.target.value });
    }

    getTextArea() {
        if (this.props.enableEdit) {
            return (
                <textarea ref={this.refMemo} onChange={(e) => this.onChangeText(e)} autoFocus>{this.state.textMemo}</textarea>
            );
        }

        return (
            <textarea ref={this.refMemo} disabled className={dash.opacityBack}>{this.state.textMemo}</textarea>
        );
    }

    render() {
        const boxLeft = (this.state.left-465) + 'px';
        const boxTop = (this.state.top-452) + 'px'

        return (
            <>
                <span className={dash.vdsMemoContents} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className={dash.vdsMemoBox} style={{ height: '20px', transform: `translate(0, -20%)` }}>
                        <span className={dash.vdsMemoTitle}>메모작성</span>
                        <span className={dash.vdsMemoCloseIcon} onClick={this.closeMemoBox}></span>
                    </div>
                    {
                        this.getTextArea()
                    }
                    <div className={dash.vdsMemoBtn} onClick={this.saveMemo}>확인</div>
                </span>
            </>
        )
    }
}

export default VDCMemoBox;