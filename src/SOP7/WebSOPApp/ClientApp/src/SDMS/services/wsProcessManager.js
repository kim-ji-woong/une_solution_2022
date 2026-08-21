import wsManager from "./wsManager";

export default class wsProcessManager {
    onCloseCCTV(guid, wsMgr) {
        wsMgr.sdms.onWebsocketMessage(guid);
    }

    // parameter : guid, sensorZoneHistoryID 반복...
    receiveCCTVList(parameter, wsMgr) {

    }
}