export class EditJsonManager {
    static makeRequestRackNItemTypes() {
        const json = {
            "requestRackNItemTypes": true
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateEditData(dataCenterID, addItems, removeItems, addRackItems, updateRackItems, removeRackItems, updateRacks, addRacks, removeRacks, addRackGroups, addFacilities, removeFacilities, updateFacilities, addSensors, removeSensors, updateSensors) {
        const json = {
            "requestUpdateEditData": {
                "dataCenterID": dataCenterID,
                "removeLinkedItems": EditJsonManager.getLinkedItems(removeItems),
                "addLinkedItems": EditJsonManager.getLinkedItems(addItems),
                "addRackItems": EditJsonManager.getRackItems(addRackItems),
                "updateRackItems": EditJsonManager.getRackItems(updateRackItems),
                "removeRackItems": EditJsonManager.getRackItems(removeRackItems),
                "updateRacks": EditJsonManager.getRacks(updateRacks),
                "addRacks": EditJsonManager.getRacks(addRacks),
                "removeRacks": EditJsonManager.getRacks(removeRacks),
                "addRackGroups": EditJsonManager.getRackGroups(addRackGroups),
                "addFacilities": EditJsonManager.getFacilities(addFacilities),
                "removeFacilities": EditJsonManager.getFacilities(removeFacilities),
                "updateFacilities": EditJsonManager.getFacilities(updateFacilities),
                "addSensors": EditJsonManager.getSensors(addSensors),
                "removeSensors": EditJsonManager.getSensors(removeSensors),
                "updateSensors": EditJsonManager.getSensors(updateSensors)
            }
        };

        return JSON.stringify(json);
    }

    static getSensors(sensors) {
        const _sensors = [];

        for (const id in sensors) {
            const sensor = sensors[id];
            _sensors.push(sensor);
        }

        return _sensors;
    }

    static getFacilities(facilities) {
        const _facilities = [];

        for (const id in facilities) {
            const facility = facilities[id];
            _facilities.push(facility);
        }

        return _facilities;
    }

    static getRackGroups(rackGroups) {
        const _rackGroups = [];

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const _rackGroup = { ...rackGroup };

            delete _rackGroup.racks;

            _rackGroups.push(_rackGroup);
        }

        return _rackGroups;
    }

    static getRacks(racks) {
        const _racks = [];

        for (const rackID in racks) {
            const rack = racks[rackID];
            const _rack = { ...rack };

            if (rack.rackGroup) {
                _rack.rackGroupID = rack.rackGroup.id;
            }

            delete _rack.items;
            delete _rack.rackGroup;
            delete _rack.rackType;

            _racks.push(_rack);
        }

        return _racks;
    }

    static getRackItems(rackItems) {
        const datas = [];

        for (const rackID in rackItems) {
            const items = rackItems[rackID];

            const data = {
                "rackID": parseInt(rackID),
                "items": []
            };

            for (const item of items) {
                const _item = { ...item };

                delete _item.linkedItemIDs;
                delete _item.linkedItems;
                delete _item.itemType;
                delete _item.rack;

                data.items.push(_item);
            }

            datas.push(data);
        }

        return datas;
    }

    static getLinkedItems(items) {
        const datas = [];

        for (const id in items) {
            const linkedIDs = items[id];

            const data = {
                "id": parseInt(id),
                "linkedIDs": linkedIDs
            };

            datas.push(data);
        }

        return datas;
    }

    static makeRequestNewItem(itemTypeID, uPos, dataCenterID, rackID) {
        const json = {
            "requestNewItem": {
                "itemTypeID": itemTypeID,
                "unitPosition": uPos,
                "dataCenterID": dataCenterID,
                "rackID": rackID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewRack(dataCenterID, rackTypeID, x, y) {
        const json = {
            "requestNewRack": {
                "rackTypeID": rackTypeID,
                "dataCenterID": dataCenterID,
                "x": x,
                "y": y
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewRackGroup(dataCenterID) {
        const json = {
            "requestNewRackGroup": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewRacks(dataCenterID, rackTypeID, rotation, rackCount) {
        const json = {
            "requestNewRacks": {
                "rackTypeID": rackTypeID,
                "dataCenterID": dataCenterID,
                "rackCount": rackCount,
                "rotation": rotation
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewFacility(dataCenterID, facilityTypeID, x, y) {
        const json = {
            "requestNewFacility": {
                "facilityTypeID": facilityTypeID,
                "dataCenterID": dataCenterID,
                "x": x,
                "y": y
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewSensor(dataCenterID, sensorTypeID, x, y) {
        const json = {
            "requestNewSensor": {
                "sensorTypeID": sensorTypeID,
                "dataCenterID": dataCenterID,
                "x": x,
                "y": y
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadITProperty(dataCenterID) {
        const json = {
            "requestDownloadITProperty": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadRack(dataCenterID) {
        const json = {
            "requestDownloadRack": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestItemDetails(centerID) {
        const json = {
            "requestItemDetails": {
                dataCenterID: centerID,
                itemType: null
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorTypes() {
        const json = {
            "requestSensorTypes": true
        };

        return JSON.stringify(json);
    }

    static makeCheckValidItemName(itemName, itemID, dataCenterID) {
        const json = {
            "checkValidItemName": {
                dataCenterID: dataCenterID,
                itemID: itemID,
                itemName: itemName
            }
        };

        return JSON.stringify(json);
    }
}