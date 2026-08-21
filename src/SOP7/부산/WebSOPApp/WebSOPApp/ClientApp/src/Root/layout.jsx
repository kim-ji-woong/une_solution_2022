import React, { Component } from 'react';
import { Container } from 'reactstrap';
import TitleBar from './titleBar';
import ProjectResource from './resource/id';
import $ from 'jquery';



class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        
        return (
            <main id="main">
                <TitleBar
                    className={"titleBar + UI_Section"}
                    menuEvent={this.props.menuEvent}
                    target={this.props.target}
                    getWebSocket={this.props.getWebSocket}
                    sdms={this.props.sdms}
                />
                <Container id="layoutContainer">
                    {this.props.children}
                </Container>
            </main>
        );
    }
}

export default Layout;