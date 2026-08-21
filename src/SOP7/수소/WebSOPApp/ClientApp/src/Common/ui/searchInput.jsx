import React, { Component } from 'react';
import styled from "styled-components";
import { i18n, withTranslation } from '../../language/i18n';

import searchClose from '../../Common/img/imghydrogen/main/searchClose.svg';
import magnifier_icon from '../../Common/img/imghydrogen/main/magnifier_icon.svg';
import magnifier_icon_white from '../../Common/img/imghydrogen/main/magnifier_icon_white.svg';

class SearchInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
            isFocused: false,
        }

        this.refSearchText = React.createRef();
    }

    handleTextChange = (event) => {
        this.setState({ inputText: event.target.value });
    }

    handleFocus = (value) => {
        this.setState({ isFocused: value });
    }

    clearInputText = () => {
		const text = this.refSearchText.current;

        if (text) {
            text.value = '';
            text.focus();
            this.setState({ inputText: '' });
        }
	}

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {            
            this.props.search();
        }
    }

    search = () => {
        this.props.search();
    } 

    render() {
        const { isFocused, inputText } = this.state;

        return (
            <SearchInputComponent className={'searchWrap'}>
                <input 
                    ref={this.refSearchText} 
                    type="text" 
                    id='searchWrapInput'
                    className={isFocused ? 'searchWrapInput on' : 'searchWrapInput'}
                    onChange={this.handleTextChange} 
                    onKeyUp={this.searchEnterKey} 
                    onFocus={() => this.handleFocus(true)}
                    onBlur={() => this.handleFocus(false)}
                    placeholder={i18n.t('sdms.statusInfo.검색어를 입력하세요')} 
                />
                <button 
                    id={'searchCloseBtn'} 
                    className={'searchCloseBtn'} 
                    onClick={() => this.clearInputText()} 
                    style={{ display: inputText.length > 0 ? 'inline-block' : 'none' }}
                >
                    내용 삭제
                </button>
                <button 
                    id={'searchBtn'} 
                    className={isFocused ? 'searchBtn on' : 'searchBtn'}
                    onClick={this.search} 
                >
                    검색
                </button>
            </SearchInputComponent>
        );
    }
}

export default withTranslation()(SearchInput);


export const SearchInputComponent = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    position: relative;

    .searchWrapInput{
        height: 40px;
        padding: 8px;
        background: none;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        padding-right: 60px;
    }

    .searchWrapInput.on{
        display: block;
        border: 1px solid #0095FF;
    }

    .searchCloseBtn{
        position: absolute;
        right: 42px;
        top: 12px;
        width: 16px;
        height: 16px;
        background: url(${searchClose})no-repeat center center;
        text-indent: -9999px;
    }

    .searchBtn{
        width: 24px;
        height: 24px;
        position: absolute;
        right: 8px;
        top: 8px;
        text-indent: -9999px;
        border-radius: 2px;
        border: 1px solid #464B4E; 
        background: #7E878B url(${magnifier_icon})no-repeat center center;
        cursor: pointer;
        text-indent: -9999px;
    }

    .searchBtn.on{
        width: 24px;
        height: 24px;
        background: #0095FF url(${magnifier_icon_white})no-repeat center center;
    }
`;