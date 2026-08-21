import React, { Component } from 'react';
import $ from 'jquery';
import newStyles from '../../../Common/css/newStyle.module.css';
import SettingResource from '../../resource/id';

class CheckPW extends Component {
    constructor(props) {
        super(props);

        this.refPW = React.createRef();

        this.state = {
            
        }

        this.props = props;
    }

    render() {
        console.log(this.props.settings);

        return (
            <div className={newStyles.passwordBoxBack}>
                <div className={newStyles.passwordBox}>
                    <span className={newStyles.closeIcon} onClick={() => this.props.onClickClose(SettingResource.closeMode.cancle)}></span>
                <div className={newStyles.passwordLeftBox}>
                  <span className={newStyles.questionIcon}></span>
                  <span className={newStyles.passwordInputArea}>
                    <p className={newStyles.passwordText}>비밀번호를 입력해주세요.</p>
                    <input type="text" ref={this.refPW} />
                  </span>
                </div>
                    <span className={newStyles.passwordConfirm} onClick={() => this.props.onClickCheckPW(this.refPW.current.value)}><a>확인</a></span>
              </div>
            </div>
            );
    }
}

export default CheckPW;