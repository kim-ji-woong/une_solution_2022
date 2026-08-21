import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';

import '../../css/simulator.css';


class BeginOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCurrent:true,
            year: null,
            month: null,
            day: null,
            hour: null,
            min: null,
            sec: null
        }

        this.props = props;

    }

    componentDidMount() {
        //this.getDisasterCategories()
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
        $('.' + uis.sqpDown).css({ 'color': '#000000' });
         //각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        this.setCurrentDate();

        /* 0629 */
        $('.tabsSopStage div').hide();
        $('.tabsSopStage div:first').show();
        $('.sopTabsNav li:first').addClass('tabActive');

        $('.sopTabsNav span').on('click', function (event) {
            event.preventDefault();
            $('.sopTabsNav li').removeClass('tabActive');
            $(this).parent().addClass('tabActive');
            $('.tabsSopStage div').hide();
            $($(this).attr('href')).show();
        });
    }

    setCurrentDate = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();

        this.setState({ year: year, month: month, day: day, hour: hour, min: min, sec: sec });
    }

    onChangeTimeMode(isCurrent) {
        if (isCurrent) {
            this.setCurrentDate();
        }

        this.setState({ isCurrent });
    }

    setDateTime() {
        if (this.state.year === null) {
            return [[], [], [], [], []];
        }

        let yearTag = [];        
        for (let i = this.state.year - 1; i <= this.state.year + 1; i++) {

            if (this.state.year === i) {
                yearTag.push(<option key={'year_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                yearTag.push(<option key={'year_' + i} value={i}>{i}</option>);
            }
        }
        
        let monthTag = [];
        for (let i = 0; i <= 11; i++) {
            if (this.state.month === i) {
                monthTag.push(<option key={'month_' + i + 1} value={i} defaultValue>{i + 1}</option>);
            }
            else {
                monthTag.push(<option key={'month_' + i + 1} value={i}>{i + 1}</option>);
            }
        }
                
        const lastDay = new Date(this.state.year, this.state.month, 0).getDate();
        let dayTag = [];
        for (let i = 1; i <= lastDay; i++) {
            if (this.state.day === i) {
                dayTag.push(<option key={'day_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                dayTag.push(<option key={'day_' + i} value={i}>{i}</option>);
            }
        }

        let hourTag = [];
        for (let i = 0; i <= 23; i++) {
            if (this.state.hour === i) {
                hourTag.push(<option key={'hour_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                hourTag.push(<option key={'hour_' + i} value={i}>{i}</option>);
            }
        }

        let minTag = [];
        for (let i = 0; i <= 59; i++) {
            if (this.state.min === i) {
                minTag.push(<option key={'min_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                minTag.push(<option key={'min_' + i} value={i}>{i}</option>);
            }
        }

        return [yearTag, monthTag, dayTag, hourTag, minTag];
    }

    onClickBegin = () => {

        const position = document.getElementById('txtPosition').value;
        if (!position || position.length === 0) {
            alert('재난 발생 위치를 입력하세요');
            return;
        }
        else if (position.length > 50) {
            alert('재난 발생 위치 길이는 50자를 초과할 수 없습니다. (현재:' + position.length + ')');
            return;
        }
        else {
            let beginTime = '';
            if (this.state.isCurrent) {
                const now = new Date();

                const year = now.getFullYear();
                const month = now.getMonth();
                const day = now.getDate();
                const hour = now.getHours();
                const min = now.getMinutes();
                const sec = now.getSeconds();

                beginTime = new Date(year, month, day, hour, min, sec);
            }
            else {
                beginTime = new Date(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.min, 0);
            }

            this.props.beginSOP(beginTime, position);
        }
    }

    onClickClose = () => {
        this.props.changeContent('');
    }

    beginEnterKey = () => {
        if (window.event.keyCode === 13) {
            this.onClickBegin();
        }
    }

    onChangeDate = (type, target) => {
        switch (type) {
            case 'year':
                this.setState({ year: Number(target.value) });
                break;
            case 'month':
                this.setState({ month: Number(target.value) });
                break;
            case 'day':
                this.setState({ day: Number(target.value) });
                break;
            case 'hour':
                this.setState({ hour: Number(target.value) });
                break;
            case 'min':
                this.setState({ min: Number(target.value) });
                break;                
        }
        
    }

    render() {
        const [yearTag, monthTag, dayTag, hourTag, minTag] = this.setDateTime();
        return (
            <>
                <div className={uis.sqPop}>
                    {/* <div className={uis.sqpTop}>
                        <h4>시작 이벤트 옵션</h4>
                        <p>{this.props.title}</p>
                        <a onClick={() => this.onClickClose()}>닫기</a>
                    </div> */}
                    <div className={uis.sqpCont}>
                        <div style={{ display: 'flex' }}>
                            <span className={uis.disasterTitle}>재난 위치</span>
                            <div className={uis.sqpUp}>
                            {
                                <input type="text" id="txtPosition" className={uis.sqpSel} onKeyUp={this.beginEnterKey}  />
                            }
                            </div>
                        </div>

                    {/*  <div className={uis.sqpDown}>
                        <ul className={uis.sqpRdo}>
                            <li><input type="radio" name="sqpRdo" id="sqpRdo01" onChange={() => this.onChangeTimeMode(true)} checked={this.state.isCurrent} /><label htmlFor="sqpRdo01">현재 시간을 재난발생시간으로 설정</label></li>
                            <li><input type="radio" name="sqpRdo" id="sqpRdo02" onChange={() => this.onChangeTimeMode(false)}/><label htmlFor="sqpRdo02">재난발생 시간 입력</label></li>
                        </ul>

                        <ul className={uis.sqpTime + " " + uneStyles.sqpTime}>
                            <li>
                                <select name="" id="" value={this.state.year||''} onChange={(e) => this.onChangeDate('year', e.target)}>
                                    {yearTag}
                                </select>
                            </li>
                            <li>년</li>
                            <li>
                                <select name="" id="" value={this.state.month || ''} onChange={(e) => this.onChangeDate('month', e.target)}>
                                    {monthTag}
                                </select>
                            </li>
                            <li>월</li>
                            <li>
                                <select name="" id="" value={this.state.day || ''} onChange={(e) => this.onChangeDate('day', e.target)}>
                                    {dayTag}
                                </select>
                            </li>
                            <li>일</li>
                            <li>
                                <select name="" id="" value={this.state.hour || ''} onChange={(e) => this.onChangeDate('hour', e.target)}>
                                    {hourTag}
                                </select>
                            </li>
                            <li>:</li>
                            <li>
                                <select name="" id="" value={this.state.min || ''} onChange={(e) => this.onChangeDate('min', e.target)}>
                                    {minTag}
                                </select>
                            </li>
                        </ul> 
                                    
                        <ul className={uis.sqpBtn}>
                            <li><a className={uis.bk} onClick={this.onClickBegin}>시작</a></li>
                            <li><a className={uis.gry} onClick={this.onClickClose}>취소</a></li>
                        </ul>
                    </div> */}

                    <div className="sopTabArea">
                        <div className="sopTabs">
                                <ul className="sopTabsNav">
                                    <li style={{ width: '50%' }}><span className="sopTabsli" href="#tab1" onClick={() => this.onChangeTimeMode(true)}>현재 시간을 재난발생시간으로 설정</span></li>
                                    <li style={{ width: '50%' }}><span className="sopTabsli" href="#tab2" onClick={() => this.onChangeTimeMode(false)}>재난발생 시간 입력</span></li>
                            </ul>
                            <div className="tabsSopStage">
                                <div id="tab1">
                                        <span className="tabTextBox"><input type="text" placeholder={this.state.year} />년</span>
                                        <span className="tabTextBox"><input type="text" placeholder={this.state.month + 1} />월</span>
                                        <span className="tabTextBox"><input type="text" placeholder={this.state.day} />일</span>
                                        <span className="tabTextBox"><input type="text" placeholder={this.state.hour} />시</span>
                                        <span className="tabTextBox"><input type="text" placeholder={this.state.min} />분</span>
                                    <span className="tabBtn" onClick={this.onClickBegin}>적용</span>
                                </div>
                                <div id="tab2">
                                        <span className="tabTextBox">
                                            <select name="" id="" value={this.state.year || ''} onChange={(e) => this.onChangeDate('year', e.target)}>
                                                {yearTag}
                                            </select>
                                            년
                                        </span>
                                        <span className="tabTextBox">
                                            <select name="" id="" value={this.state.month || ''} onChange={(e) => this.onChangeDate('month', e.target)}>
                                                {monthTag}
                                            </select>
                                            월
                                        </span>
                                        <span className="tabTextBox">
                                            <select name="" id="" value={this.state.day || ''} onChange={(e) => this.onChangeDate('day', e.target)}>
                                                {dayTag}
                                            </select>
                                            일
                                        </span>
                                        <span className="tabTextBox">
                                            <select name="" id="" value={this.state.hour || ''} onChange={(e) => this.onChangeDate('hour', e.target)}>
                                                {hourTag}
                                            </select>
                                            시
                                        </span>
                                        <span className="tabTextBox">
                                            <select name="" id="" value={this.state.min || ''} onChange={(e) => this.onChangeDate('min', e.target)}>
                                                {minTag}
                                            </select>
                                            분
                                        </span>
                                    <span className="tabBtn" onClick={this.onClickBegin}>적용</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
          </>
        );
    }

}

export default BeginOption;