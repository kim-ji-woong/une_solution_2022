import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';


class VDCRackContainer extends Component {

    render() {
        return (
            <>
                <div className={dash.vdcRackContainer}>
                  <div className={dash.vdcRackBox}>
                     <span className={dash.vdcRackTitle}>STR1-1</span>
                     <span className={dash.vdcRackIcon}></span>
                  </div>
                  <div className={dash.vdcRackContents}>
                    <div className={dash.vdcMainBox}>
                      <div className={dash.vdcMainFirstBox}>
                        <div className={dash.rackLocationBoxN}>
                          <span className={dash.rackLocationImageN}></span>
                        </div>
                        <div className={dash.connectItPropertyBox}>
                          <span className={dash.connectTitle}>연결IT자산</span>
                            <div id={dash.rackAreaITM}>
                                <span className={dash.rackNameIT}>Rack01</span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>24</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>20</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                            </div>
                            <div id={dash.rackAreaITM}>
                                <span className={dash.rackNameIT}>Rack15</span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>24</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>20</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>20</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                            </div>
                            <div id={dash.rackAreaITM}>
                                <span className={dash.rackNameIT}>Rack22</span>
                                <span id={dash.rackBoxIT}>
                                    <span className={dash.box1}>24</span>
                                    <span className={dash.box2}>어플라이언스</span>
                                    <span className={dash.box3}>Lenova</span>
                                    <span className={dash.box4}>2U</span>
                                    <span className={dash.box5}><span className={dash.greenCircle}></span></span>
                                </span>
                            </div>
                            <span className={dash.addIcon}></span>
                            <span className={dash.arrowDownIcon}></span>
                        </div>
                      </div>
                      <div className={dash.editMainSecondBox}>
                        <div className={dash.editModelTitle}><span>L2_RACK 12</span></div>
                        <div className={dash.editrackBox}>
                            <div className={dash.editrackModelImage}></div>
                            <div className={dash.editrackInfoBox}>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>41</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>40</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
                                <span className={dash.rackInfomation}>
                                    <span className={dash.rackNum}>42</span>
                                    <span className={dash.rackContent}></span>
                                </span>
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
export default VDCRackContainer;