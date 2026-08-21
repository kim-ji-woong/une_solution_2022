import React, { useEffect, useState } from 'react';

import { FleeDashboardGGComponent, FleeAnnouncementGGComponent, FleeDashboardEndGGComponent } from '../../../styled/sdmsPopupsStyled';
import Loader from '../../../../Settings/ui/popups/loader';
import ProjectResource from '../../../../Root/resource/id';

function FleeDashboard_gg(props) {
    
    useEffect(() => {
        if (props.evacuationsCurrent?.status === 1) {
            setTimeout(() => {
                props.handleFleeDashboardPopup(props.evacuationsCurrent.siteID, 2);
            }, 10000);
        } else if (props.evacuationsCurrent?.status === 0) {
            setTimeout(() => {
                props.handleFleeDashboardPopup(props.evacuationsCurrent.siteID, 0);
            }, 10000);
        }
        
    }, [props.evacuationsPopupStatus]);

    const getDate = () => {
        const { evacuations, selectSiteID, evacuationsCurrent } = props;

        if (evacuations) {
            let evacuation = null;

            if (selectSiteID === ProjectResource.Site.GG_A) {
                evacuation = evacuations[evacuationsCurrent.siteID];
            }
            else {
                evacuation = evacuations[selectSiteID];
            }

            const date = evacuation.timeStamp.split('T');
            return date[0] + ' ' + date[1];
        }

        return null;
    }

    const getSiteName = () => {
        const { evacuations, selectSiteID, evacuationsCurrent } = props;

        if (evacuations) {
            let evacuation = null;

            if (selectSiteID === ProjectResource.Site.GG_A) {
                evacuation = evacuations[evacuationsCurrent.siteID];
            }
            else {
                evacuation = evacuations[selectSiteID];
            }

            const siteID = evacuation.siteID;

            let siteName = '';

            switch (siteID)
            {
                case ProjectResource.Site.GG_B:
                    siteName = '경기도청·도의회';
                    break;
                case ProjectResource.Site.GG_F:
                    siteName = '신용보증재단';
                    break;
            }

            return [ siteID, siteName ];
        }

        return '';
    }

    const getDisplayUI = () => {
        let ui = [];
        const { evacuationsPopupStatus, selectSiteID, evacuationsCurrent } = props;

        if ((evacuationsPopupStatus[selectSiteID] === 1) || 
            (selectSiteID === ProjectResource.Site.GG_A && evacuationsCurrent !== null && evacuationsCurrent.status === 1)) {
            
            const [ siteID, siteName ] = getSiteName();

            ui.push(
                <FleeDashboardGGComponent key={'FleeDashboard_1'}>
                    <div>
                        <div className='infoWrap'> 
                            <p>{getDate()}</p>
                            <p>[{siteName}] 피난유도시스템이 작동되었습니다.</p>
                        </div>
                        <div className='btnWrap'>
                            <button className='dslX' onClick={() => props.handleFleeDashboardPopup(siteID, 2)}>닫기</button>
                        </div>
                    </div>
                </FleeDashboardGGComponent>
            );
        } 
        else if (evacuationsPopupStatus[selectSiteID] === 2 && selectSiteID !== ProjectResource.Site.GG_A) {
            ui.push(
                <FleeAnnouncementGGComponent key={'FleeDashboard_2'}>
                    <p>피난유도시스템 작동중</p>
                    <Loader
                        size="18px"
                        borderSize="2px"
                        baseColor="#0E162D"
                        wheelColor="#2C8EFF"
                        speed="900"
                    />
                </FleeAnnouncementGGComponent>
            );
        }
        else if ((evacuationsPopupStatus[selectSiteID] === 0) || 
                (selectSiteID === ProjectResource.Site.GG_A && evacuationsCurrent !== null && evacuationsCurrent.status === 0)) {
            
            const [ siteID, siteName ] = getSiteName();
            
            ui.push(
                <FleeDashboardEndGGComponent key={'FleeDashboard_0'}>
                    <div>
                        <div className='infoWrap'> 
                            <p>{getDate()}</p>
                            <p>[{siteName}] 피난유도시스템이 종료되었습니다.</p>
                        </div>
                        <div className='btnWrap'>
                            <button className='dslX' onClick={() => props.handleFleeDashboardPopup(siteID, 0)}>닫기</button>
                        </div>
                    </div>
                </FleeDashboardEndGGComponent>
            );
        }

        return ui;
    }

    return (
        <>
            {getDisplayUI()}
        </>
    );
}

export default FleeDashboard_gg;