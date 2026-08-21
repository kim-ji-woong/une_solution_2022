import React, { Component } from 'react';
import { Tools3DComponent } from '../../styled/lnbStyled';


class Tool3D extends Component{
    constructor(props) {
        super(props);

        this.state = {
            openToolBox: false,
        }

        this.props = props;
    }

    openToolBox = () => {
        const ToolBtn = document.getElementById('3dToolBtn');
        const ToolBox = document.getElementById('3dToolBox');

        if(ToolBox){
            if (ToolBox.classList.contains('on')) {
                ToolBtn.classList.remove('on');
                ToolBox.classList.remove('on');
            }
            else {
                ToolBtn.classList.add('on');
                ToolBox.classList.add('on');
            }
        }
    }

    onClickHome = () => {
        const disableHome = document.getElementById('home');

        if(disableHome){
            if(disableHome.classList.contains('on')){
                disableHome.classList.remove('on');
            }
            else{
                disableHome.classList.add('on');
            }
        }
    }

    onClickBasicView = () => {
        const disableBasicView = document.getElementById('basicView');

        if(disableBasicView){
            if(disableBasicView.classList.contains('on')){
                disableBasicView.classList.remove('on');
            }
            else{
                disableBasicView.classList.add('on');
            }
        }
    }

    onClickZoomIn = () => {
        const disableZoomIn = document.getElementById('zoomIn');

        if(disableZoomIn){
            if(disableZoomIn.classList.contains('on')){
                disableZoomIn.classList.remove('on');
            }
            else{
                disableZoomIn.classList.add('on');
            }
        }
    }

    onClickZoomOut = () => {
        const disableZoomOut = document.getElementById('zoomOut');

        if(disableZoomOut){
            if(disableZoomOut.classList.contains('on')){
                disableZoomOut.classList.remove('on');
            }
            else{
                disableZoomOut.classList.add('on');
            }
        }
    }

    onClickRotate = () => {
        const disableRotate = document.getElementById('rotate');

        if(disableRotate){
            if(disableRotate.classList.contains('on')){
                disableRotate.classList.remove('on');
            }
            else{
                disableRotate.classList.add('on');
            }
        }
    }

    render(){

        return(
            <Tools3DComponent>
                <span id='tooltip'>
                    <button id={'3dToolBtn'} className={'3dToolBtn'} onClick={this.openToolBox} data-tooltip-text="3D Tool"></button>
                </span>
                    <div id={'3dToolBox'}>
                        <ul>
                            <li id={'home'} className={'home'} onClick={this.onClickHome} data-tooltip-poitext="Initial Screen"><a></a></li>
                            <li id={'basicView'} className={'basicView'} onClick={this.onClickBasicView} data-tooltip-poitext="Basic View"><a></a></li>
                            <li id={'zoomIn'} className={'zoomIn'} onClick={this.onClickZoomIn} data-tooltip-poitext="Expansion"><a></a></li>
                            <li id={'zoomOut'} className={'zoomOut'} onClick={this.onClickZoomOut} data-tooltip-poitext="Reduce"><a></a></li>
                            <li id={'rotate'} className={'rotate'} onClick={this.onClickRotate} data-tooltip-poitext="Rotation"><a></a></li>
                        </ul>
                    </div>
            </Tools3DComponent>
        );
    }
}

export default Tool3D;