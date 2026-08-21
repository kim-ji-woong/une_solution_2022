import wsManager from "./wsManager";

export default class wsProcessManager {
    constructor(sdms) {
        this.sdms = sdms;
    }
    
    // ProcessManager에서 parameter로 들어오는 Content 객체 분리 및 SDMS에 전달
    
    selectPOI = (content) => {
        const spaceID = content.spaceId; // 공간 0: 외부 , 1~: 내부
        const poiID = content.POI.nodeID; // ExternalSensorsID
        
        this.sdms.onResponseSelectPOI(spaceID, poiID);
    }

    responseSpaceList = () => {
        this.sdms.onResponseSpaceList();
    }
    
    responsePOIList = () => {
        this.sdms.onResponsePOIList();
    }

    responseCurrentAlarmBuilding = () => {
        
    }
    
    processingLoading = (header, content) => {
        if (header === wsManager.appToWeb.header.StartLoading) {
            this.sdms.onProcessingLoading('start');
        } else if (header === wsManager.appToWeb.header.UpdateLoading) {
            this.sdms.onProcessingLoading('process', content?.value);
        } else if (header === wsManager.appToWeb.header.EndLoading) {
            this.sdms.onProcessingLoading('end');
        }
    }
}