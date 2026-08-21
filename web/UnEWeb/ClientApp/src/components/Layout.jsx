import React, { Component } from 'react';
import { withRouter} from "react-router-dom";

import Resource from '../resource/id';

import NavMenuKor from '../components/NavMenuKor.jsx';
import NavMenuEng from '../components/NavMenuEng.jsx';


export class Layout extends Component {
    static displayName = Layout.name;

    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            //disUI: this.displayUI(),
            language: null,
        }

        this.initLanguage();
    }
    
    scrollToHash = (hash, retryCount = 0) => {
        if (!hash) return;

        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (retryCount < 3) {
            setTimeout(() => {
                this.scrollToHash(hash, retryCount + 1);
            }, 500);
        }
    }

    /* onChangeLanguage = (e) => {
        Resource.setLanguage(e.target.value);
        this.setState({});
    } */

    initLanguage = () => {
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        this.state.language = language;
    }


    /* resizeUI() {
        this.setState({ disUI: this.displayUI() });
    } */

    componentDidMount() {
       // window.addEventListener('resize', () => this.resizeUI());
        
        // 초기 hash 스크롤 처리
        setTimeout(() => {
            const hash = window.location.hash;
            if (hash) {
                this.scrollToHash(hash);
            }
        }, 500);
        
        this.handleHashChange = () => {
            const hash = window.location.hash;
            this.scrollToHash(hash);
        }
        
        window.addEventListener('hashchange', this.handleHashChange);
    }

    componentDidUpdate(prevProps) {
        // URL 변경 시 hash 확인
        if (this.props.location !== prevProps.location) {
            setTimeout(() => {
                const hash = this.props.location.hash;
                if (hash) {
                    this.scrollToHash(hash);
                }
            }, 300);
        }
    }

    componentWillUnmount() {
        if (this.handleHashChange) {
            window.removeEventListener('hashchange', this.handleHashChange);
        }
    }


    /* displayUI = () => {
        let displayUI = [];

        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayUI.push(
                <>
                    <NavMenu />
                      {this.props.children}
                    <Footer />
                </>
            );
        } else if (widthSize >= 1025) {
            displayUI.push(
                <>
                    <NavMenu />
                      {this.props.children}
                </>
            );
        } else {
            displayUI.push(
                <></>
            );
        }
        return displayUI;
    } */

    displaynavLanguage = () => {
        let displaynavLanguage = [];
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        if (language === Resource.Language.ko) {
            displaynavLanguage = <>
                <NavMenuKor />
            </>;
        } else {
            displaynavLanguage = <>
                <NavMenuEng />
            </>;
        }

        return displaynavLanguage;

    }

    render() {
        let navLanguage = this.displaynavLanguage();

        //setTimeout(() => { this.resizeUI() }, 500);
        //let displayUI = this.state.disUI;

        return (
           <>
             {/* <NavMenu /> */}
               {navLanguage}
             {this.props.children}
           </>
        );
    }
}

export default withRouter(Layout);