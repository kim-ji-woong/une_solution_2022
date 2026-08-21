import ProjectResource from "../../Root/resource/id";
import { MainJsonManager } from "./mainJsonManager";

export default class MainController {
    static async requestRackNItems(dataCenterID) {
        try {
            const jsonData = MainJsonManager.makeRequestRackNItems(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestRackNItems 실패"];
    }

    static async requestRackTypeList() {
        try {
            const jsonData = MainJsonManager.makeRequestRackTypeList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.rackTypes, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestRackTypeList 실패"];
    }

    static async requestItemTypeList() {
        try {
            const jsonData = MainJsonManager.makeRequestItemTypeList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.itemTypes, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestItemTypeList 실패"];
    }

    static async requestFacilityTypeList() {
        try {
            const jsonData = MainJsonManager.makeRequestFacilityTypeList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.facilityTypes, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestFacilityTypeList 실패"];
    }

    static async requestSensorTypeList() {
        try {
            const jsonData = MainJsonManager.makeRequestSensorTypeList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.sensorTypes, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestSensorTypeList 실패"];
    }

    static async requestGetOption(UserID, Category) {
        try {
            const jsonData = MainJsonManager.makeRequestGetOption(UserID, Category);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, result.options];
                } else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, 'requestGetOption 실패'];
    }

    static async requestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        try {
            const jsonData = MainJsonManager.makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4);
            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                //데이터가 성공적으로 삽입 되면 primary id를 반환 받는다.
                if (result.success) {
                    return [true, result.options]
                } else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [false, 'requestSaveOption 실패'];
    }

    static async requestSaveViewport(dataCenterID, posX, posY, posZ, rotationX, rotationY, rotationZ) {
        try {
            const jsonData = MainJsonManager.makeRequestSaveViewport(dataCenterID, posX, posY, posZ, rotationX, rotationY, rotationZ);
            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ""]
                } else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [false, 'requestSaveViewport 실패'];
    }

    static async requestViewport(dataCenterID) {
        try {
            const jsonData = MainJsonManager.makeRequestViewport(dataCenterID);
            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""]
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [null, 'requestViewport 실패'];
    }

    static async requestItemDetails(dataCenterID, itemType) {
        try {
            const jsonData = MainJsonManager.makeRequestItemDetails(dataCenterID, itemType);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestItemDetails 실패"];
    }

    //requestSaveItemDetails
    static async requestSaveItemDetails(dataCenterID, itemDetails, itemType) {
        try {
            const jsonData = MainJsonManager.makeRequesSavetItemDetails(dataCenterID, itemDetails, itemType);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestSaveItemDetails 실패"];
    }

    static async requestEmptyItemDetails() {
        try {
            const jsonData = MainJsonManager.makeRequestEmptyItemDetails();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestEmptyItemDetails 실패"];
    }

    static async requestUploadITPropertyDetail(file, dataCenterID, typeName) {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const blob = new Blob([dataCenterID, typeName], { type: 'text/plain' });
            formData.append('files', blob, dataCenterID.toString() + "," + typeName);

            const res = await fetch('/api/Main/UploadITPropertyDetail', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestWorkData(dataCenterID) {
        try {
            const jsonData = MainJsonManager.makeRequestWorkData(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestWorkData 실패"];
    }

    static async requestCFDImages(dataCenterID) {
        try {
            const jsonData = MainJsonManager.makeRequestCFDImages(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestCFDImages 실패"];
    }

    static async requestCompanyList() {
        try {
            const jsonData = MainJsonManager.makeRequestCompanyList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.companies, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestCompanyList 실패"];
    }

    static async requestItem(dataCenterID, itemID) {
        try {
            const jsonData = MainJsonManager.makeRequestItem(dataCenterID, itemID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestItem 실패"];
    }
}
