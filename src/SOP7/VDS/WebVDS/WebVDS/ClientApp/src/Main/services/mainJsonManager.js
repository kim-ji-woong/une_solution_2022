import InventoryManagement from '../ui/inventoryManagement';

export class MainJsonManager {
    static makeRequestRackNItems(centerID) {
        const json = {
            "requestRackNItems": {
                dataCenterID: centerID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestRackTypeList() {
        const json = {
            "requestRackTypeList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestItemTypeList() {
        const json = {
            "requestItemTypeList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityTypeList() {
        const json = {
            "requestFacilityTypeList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorTypeList() {
        const json = {
            "requestSensorTypeList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestGetOption(UserID, Category) {
        const json = {
            "requestOption":
            {
                "userID": UserID,
                "category": Category

            }
        }
        return JSON.stringify(json);
    }

    static makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        const json = {
            "requestSaveOption":
            {
                'saveOption': {
                    "id": ID,
                    "userID": UserID,
                    "category": Category,
                    "subCategory": SubCategory,
                    "propertyValue1": PropertyValue1,
                    "propertyValue2": PropertyValue2,
                    "propertyValue3": PropertyValue3,
                    "propertyValue4": PropertyValue4,
                }
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestSaveViewport(dataCenterID, posX, posY, posZ, rotationX, rotationY, rotationZ) {
        const json = {
            "requestSaveViewport":
            {
                'dataCenterID': dataCenterID,
                'positionX': posX,
                'positionY': posY,
                'positionZ': posZ,
                'rotationX': rotationX,
                'rotationY': rotationY,
                'rotationZ': rotationZ
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestViewport(dataCenterID) {
        const json = {
            "requestViewport":
            {
                'dataCenterID': dataCenterID
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestItemDetails(centerID, itemType) {
        const json = {
            "requestItemDetails": {
                dataCenterID: centerID,
                itemType: itemType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequesSavetItemDetails(centerID, itemDetails, itemType) {
        const json = {
            "requesSavetItemDetails": {
                dataCenterID: centerID,
                itemType: itemType,
                backups: itemDetails[InventoryManagement.itemType.BackUp],
                boxs: itemDetails[InventoryManagement.itemType.Box],
                etcs: itemDetails[InventoryManagement.itemType.Etc],
                networks: itemDetails[InventoryManagement.itemType.Network],
                sanSwitchs: itemDetails[InventoryManagement.itemType.SanSwitch],
                securitys: itemDetails[InventoryManagement.itemType.Security],
                storages: itemDetails[InventoryManagement.itemType.Storage],
                itemServers: itemDetails[InventoryManagement.itemType.Server]
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEmptyItemDetails() {
        const json = {
            "requestEmptyItemDetails": true
        };

        return JSON.stringify(json);
    }

    static makeRequestWorkData(dataCenterID) {
        const json = {
            "requestWorkData": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestCFDImages(dataCenterID) {
        const json = {
            "requestCFDImages": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestCompanyList() {
        const json = {
            "requestCompanyList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestItem(dataCenterID, itemID) {
        const json = {
            "requestItem": {
                "dataCenterID": dataCenterID,
                "itemID": itemID
            }
        };

        return JSON.stringify(json);
    }
}