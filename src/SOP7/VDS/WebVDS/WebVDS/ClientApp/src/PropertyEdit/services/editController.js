import ProjectResource from "../../Root/resource/id";
import { EditJsonManager } from "./editJsonManager";

export default class EditController {
    static async requestRackNItemTypes() {
        try {
            const jsonData = EditJsonManager.makeRequestRackNItemTypes();

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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

        return [null, "requestRackNItemTypes 실패"];
    }

    static async requestUpdateEditData(dataCenterID, addItems, removeItems, addRackItems, updateRackItems, removeRackItems, updateRacks, addRacks, removeRacks, addRackGroups, addFacilities, removeFacilities, updateFacilities, addSensors, removeSensors, updateSensors) {
        try {
            const jsonData = EditJsonManager.makeRequestUpdateEditData(dataCenterID, addItems, removeItems, addRackItems, updateRackItems, removeRackItems, updateRacks, addRacks, removeRacks, addRackGroups, addFacilities, removeFacilities, updateFacilities, addSensors, removeSensors, updateSensors);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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

        return [null, "requestUpdateEditData 실패"];
    }

    static async requestNewItem(itemTypeID, uPos, dataCenterID, rackID) {
        try {
            const jsonData = EditJsonManager.makeRequestNewItem(itemTypeID, uPos, dataCenterID, rackID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.item, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewItem 실패"];
    }

    static async requestNewRack(dataCenterID, rackTypeID, x, y) {
        try {
            const jsonData = EditJsonManager.makeRequestNewRack(dataCenterID, rackTypeID, x, y);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.rack, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewRack 실패"];
    }

    static async requestNewRackGroup(dataCenterID) {
        try {
            const jsonData = EditJsonManager.makeRequestNewRackGroup(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.rackGroup, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewRackGroup 실패"];
    }

    static async requestNewRacks(dataCenterID, rackTypeID, rotation, rackCount) {
        try {
            const jsonData = EditJsonManager.makeRequestNewRacks(dataCenterID, rackTypeID, rotation, rackCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.racks, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewRacks 실패"];
    }

    static async requestNewFacility(dataCenterID, facilityTypeID, x, y) {
        try {
            const jsonData = EditJsonManager.makeRequestNewFacility(dataCenterID, facilityTypeID, x, y);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.facility, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewFacility 실패"];
    }

    static async requestNewSensor(dataCenterID, sensorTypeID, x, y) {
        try {
            const jsonData = EditJsonManager.makeRequestNewSensor(dataCenterID, sensorTypeID, x, y);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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
                    return [result.sensor, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestNewSensor 실패"];
    }

    static async requestDownloadITProperty(dataCenterID) {
        try {
            const jsonData = EditJsonManager.makeRequestDownloadITProperty(dataCenterID);

            const res = await fetch('/api/Edit/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await EditController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestDownloadRack(dataCenterID) {
        try {
            const jsonData = EditJsonManager.makeRequestDownloadRack(dataCenterID);

            const res = await fetch('/api/Edit/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await EditController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async downloadFile(response) {
        const fileName = EditController.getFileName(response);

        if (fileName.length === 0) {
            return;
        }

        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        window.URL.revokeObjectURL(blob);
    }

    static getFileName(response) {
        const result = response.headers.get('content-disposition');
        const tokens = result.split(';');

        const tokenCount = tokens.length;

        for (let i = 0; i < tokenCount; i++) {
            const token = tokens[i].trim();
            const index = token.indexOf('=');

            if (index > 0) {
                const key = token.substring(0, index).trim();
                const value = token.substring(index + 1).trim();

                if (key === 'filename*') {
                    const index2 = value.indexOf("''");

                    if (index2 >= 0) {
                        const uri = value.substring(index2 + 2).trim();
                        return decodeURI(uri);
                    }
                }
            }
        }

        return "";
    }

    static async requestUploadITProperty(file, dataCenterID) {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const blob = new Blob([dataCenterID], { type: 'text/plain' });
            formData.append('files', blob, dataCenterID.toString());

            const res = await fetch('/api/Edit/UploadITProperty', {
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

    static async requestItemDetails(dataCenterID) {
        try {
            const jsonData = EditJsonManager.makeRequestItemDetails(dataCenterID);

            const res = await fetch('/api/Edit/RequestData', {
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
            console.log(e);
        }

        return [null, ""];
    }

    static async requestSensorTypes() {
        try {
            const jsonData = EditJsonManager.makeRequestSensorTypes();

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
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

        return [null, "requestSensorTypes 실패"];
    }

    static async checkValidItemName(itemName, itemID, dataCenterID) {
        try {
            const jsonData = EditJsonManager.makeCheckValidItemName(itemName, itemID, dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Edit/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
        }

        return [false, "checkValidItemName 실패"];
    }
}
