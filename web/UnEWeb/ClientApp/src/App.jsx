import React, { Component , useState } from 'react';
//import { Router } from 'react-router';
import { Layout } from './components/Layout';
//import Home from './components/Home.jsx';
import home from '../src/components/css/home.module.css';

import HomeKor from '../src/components/HomeKor.jsx';
import HomeEng from '../src/components/HomeEng.jsx';
import DirectionsKor from './CompanyIntro/DirectionsKor.jsx';
import DirectionsEng from './CompanyIntro/DirectionsEng.jsx';
import CompanySectionKor from './CompanyIntro/CompanySectionKor.jsx';
import CompanySectionEng from './CompanyIntro/CompanySectionEng.jsx';
import PerformanceSectionKor from './BusinessIntro/PerformanceSectionKor.jsx';
import PerformanceSectionEng from './BusinessIntro/PerformanceSectionEng.jsx';
import BusinessSectionKor from './BusinessIntro/BusinessSectionKor.jsx';
import BusinessSectionEng from './BusinessIntro/BusinessSectionEng.jsx';
import Report from './CompanyNews/Report.jsx';
import ContactSectionKor from './CustomerSupport/ContactSectionKor.jsx';
import ContactSectionEng from './CustomerSupport/ContactSectionEng.jsx';
import ProductSectionKor from './ProductIntro/ProductSectionKor.jsx';
import ProductSectionEng from './ProductIntro/ProductSectionEng.jsx';
import ProjectResource from './components/resource/id';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
//import SwiperCore, { Autoplay, Navigation } from 'swiper';
import Resource from '../src/resource/id';
import $ from 'jquery';


class App extends Component{

    constructor(props) {
        super(props)

        this.state = {
            language: null,
        }

        this.initLanguage();
    }

    initLanguage = () => {
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        this.state.language = language;
    }


    onChangeLanguage = (e) => {
       //Resource.setLanguage(e.target.value);

        localStorage.setItem('Language', e.target.value);
        this.setState({ language: e.target.value });
    }

    componentDidMount() {

    }


    displayLanguage = () => {
        let displayLanguage = [];
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        if (language === Resource.Language.ko) {
            displayLanguage = <>
                <Route exact path={ProjectResource.path.root} component={HomeKor} />
                {/* <Route path={ProjectResource.path.NavMenu} component={NavMenuKor} /> */}
                <Route path={ProjectResource.path.Directions} component={DirectionsKor} />
                <Route path={ProjectResource.path.CompanySection} component={CompanySectionKor} />
                <Route path={ProjectResource.path.PerformanceSection} component={PerformanceSectionKor} />
                <Route path={ProjectResource.path.BusinessSection} component={BusinessSectionKor} />
                <Route path={ProjectResource.path.Report} component={Report} />
                <Route path={ProjectResource.path.ContactSection} component={ContactSectionKor} />
                <Route path={ProjectResource.path.ProductSection} component={ProductSectionKor} />
            </>;
        } else {
            displayLanguage = <>
                <Route exact path={ProjectResource.path.root} component={HomeEng} />
                {/* <Route path={ProjectResource.path.NavMenu} component={NavMenuEng} /> */}
                <Route path={ProjectResource.path.Directions} component={DirectionsEng} />
                <Route path={ProjectResource.path.CompanySection} component={CompanySectionEng} />
                <Route path={ProjectResource.path.PerformanceSection} component={PerformanceSectionEng} />
                <Route path={ProjectResource.path.BusinessSection} component={BusinessSectionEng} />
                <Route path={ProjectResource.path.Report} component={Report} />
                <Route path={ProjectResource.path.ContactSection} component={ContactSectionEng} />
                <Route path={ProjectResource.path.ProductSection} component={ProductSectionEng} />
            </>;
        }

        return displayLanguage;
    }


    render() {
        
        let language = this.displayLanguage();

        return (
              <Router>
                 <Switch>
                    <Layout>
                        {language}
                        <select className={home.footerSelect} defaultValue={this.state.language} onChange={(e) => this.onChangeLanguage(e)}>
                            <option value={Resource.Language.ko}>KOR</option>
                            <option value={Resource.Language.en}>ENG</option>
                        </select>
                    </Layout>
                 </Switch>
             </Router > 
        );
    }
}
export default App;
