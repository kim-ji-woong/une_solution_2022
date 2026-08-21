import React, { Component, useState } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import $ from 'jquery';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import ProjectResource from '../../Root/resource/id';
import Vertex2D from '../../Common/util/Vertex2D';
import Geometry from '../../Common/util/Geometry';
import Vertex3D from '../../Common/util/Vertex3D';
import Interchange from '../../Root/interchange';
import VDCList from './vdsList';
//import am4geodata_krGov2018 from "@amcharts/amcharts4-geodata/krGov2018";

am4core.useTheme(am4themes_animated);


class MapBox extends Component {
    static SelectedTag = "_selected";
    static IconVisibleZoomLevel = 8;
    static RotationMaxSeconds = 2;

    componentDidMount() {
        // Set License
        am4core.addLicense("CH405233156");
        am4core.addLicense("MP405233156");

        // Create map instance
        const chart = am4core.create("chartdiv", am4maps.MapChart);
        // Set map definition
        chart.geodata = am4geodata_worldLow;
        //chart.geodata = am4geodata_krGov2018;

        // Set projection
        chart.geodataSource.url = "/path/to/myCustomMap.json";

        //chart.zoomControl = new am4maps.ZoomControl();
        //chart.zoomControl.slider.height = 100;

        // Create map polygon series
        const polygonSeries = new am4maps.MapPolygonSeries();
        polygonSeries.useGeodata = true;
        chart.series.push(polygonSeries);

        const polygonTemplate = polygonSeries.mapPolygons.template;
        //polygonTemplate.tooltipText = "{name}: {value}";
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am4core.color("#d7d7d7");

        // Create hover state and set alternative fill color
        const hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#d7d7d738");

        // 남극을 뺄것인가?
        polygonSeries.exclude = ["AQ"];
        //polygonSeries.include = ["PT", "ES", "FR", "DE", "BE", "NL", "IT", "AT", "GB", "IE", "CH", "LU"];

        polygonSeries.data = [];
        //polygonSeries.data = [{
        //    "id": "KR",
        //    "name": "대한민국",
        //    /* "value": 100, */
        //    "fill": am4core.color("#00B5F7")
        //}];

        polygonTemplate.propertyFields.fill = "fill";

        this.chart = chart;
        this.initDataCenterIcons(chart);
        this.initNationCode(polygonSeries);

        const _this = this;
        this.zoomLevel = chart.zoomLevel;

        chart.events.on("zoomlevelchanged", function (e) {
            _this.zoomLevelChanged(e.target.zoomLevel);
        });

        chart.events.on("hit", function (e) {
            _this.stopAutoRotation();
        });

        polygonTemplate.events.on("hit", function (e) {
            _this.onClickCountry(e.target);
        });

        this.aqMapPolygon = null;
        this.first2DMap = true;

        //this.set3DMap(chart);
        this.set2DMap(chart);
    }

    componentDidUpdate() {
        const selectedDataCenterImage = this.changeDataCenterIcon();

        if (selectedDataCenterImage) {
            this.goDataCenter(this.props.selectedCenter, selectedDataCenterImage);
        }
    }

    componentWillUnmount() {
        /*if (this.chart) {
            this.chart.dispose();
            //am4core.disposeAllCharts();
        }*/
    }

    set3DMap(chart) {
        chart.projection = new am4maps.projections.Orthographic();
        chart.panBehavior = "rotateLongLat";

        chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#aadaff");
        chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

        const graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
        graticuleSeries.mapLines.template.line.stroke = am4core.color("#67b7dc");
        graticuleSeries.mapLines.template.line.strokeOpacity = 0.2;
        graticuleSeries.fitExtent = false;

        if (this.aqMapPolygon) {
            /*this.aqMapPolygon.hidden = false;
            this.aqMapPolygon.visible = true;*/
        }

        this.mode3D = true;
        this.setState({});
    }

    set2DMap(chart) {
        this._set2DMap(chart);
        this.set3DMap(chart);
        this._set2DMap(chart);
    }

    _set2DMap(chart) {
        chart.projection = new am4maps.projections.Miller();
        chart.panBehavior = "move";

        chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#d7d7d7");
        chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0;

        const seriesCount = chart.series.length;

        for (let i = 0; i < seriesCount; i++) {
            const series = chart.series.values[i];

            if (series.className === "GraticuleSeries") {
                chart.series.removeIndex(i);
                break;
            }
        }

        this.mode3D = false;

        if (this.first2DMap) {
            this.first2DMap = false;

            this.set3DMap(chart);
            this.set2DMap(chart);
        }

        if (this.aqMapPolygon) {
            /*this.aqMapPolygon.hidden = true;
            this.aqMapPolygon.visible = false;*/
        }

        this.setState({});
    }

    zoomLevelChanged(zoomLevel) {
        if (this.zoomLevel < MapBox.IconVisibleZoomLevel) {
            if (zoomLevel >= MapBox.IconVisibleZoomLevel) {
                this.imageSeries.show();
                this.imageSeriesSelected.show();
            }
        }
        else {
            if (zoomLevel < MapBox.IconVisibleZoomLevel) {
                this.imageSeries.hide();
                this.imageSeriesSelected.hide();
            }
        }

        this.zoomLevel = zoomLevel;
    }

    onClickCountry(target) {
        if (this.mode3D) {            
            const vCurrent = this.positionToVertex3D(this.chart.deltaLongitude, this.chart.deltaLatitude);
            const vTarget = this.positionToVertex3D(-target.visualLongitude, -target.visualLatitude);

            const angle = Geometry.getAngle3(vCurrent.x, vCurrent.y, vCurrent.z, 0, 0, 0, vTarget.x, vTarget.y, vTarget.z);
            const targetSeconds = MapBox.RotationMaxSeconds * angle / Math.PI;

            this.rotateTo(-target.visualLongitude, -target.visualLatitude, targetSeconds * 1000, target);
        }
        else {
            this.chart.zoomToMapObject(target);
        }

        const index = target.parent.children.values.indexOf(target);

        if (index >= 2) {
            const nation = this.props.nations[index - 2];
            this.props.selectNation(nation, ProjectResource.getNationName(nation), null);
        }
    }

    changeDataCenterIcon() {
        const selectedCenter = this.props.selectedCenter;
        let selectedDataCenterImage = null;

        if (!selectedCenter) {
            for (const image of this.imageSeriesSelected.mapImages.values) {
                if (!image.hidden) {
                    image.hide();
                    image.hidden = true;
                }
            }

            for (const image of this.imageSeries.mapImages.values) {
                if (image.hidden) {
                    image.show();
                    image.hidden = false;

                    image.showTooltipOn = "hover";
                }
            }
        }
        else {
            for (const image of this.imageSeriesSelected.mapImages.values) {
                if (image.id === "DataCenter_" + selectedCenter.id + MapBox.SelectedTag) {
                    if (image.hidden) {
                        image.show();
                        image.hidden = false;
                        selectedDataCenterImage = image;

                        image.showTooltipOn = "always";
                    }
                }
                else {
                    if (!image.hidden) {
                        image.hide();
                        image.hidden = true;
                    }
                }
            }

            for (const image of this.imageSeries.mapImages.values) {
                if (image.id === "DataCenter_" + selectedCenter.id) {
                    if (!image.hidden) {
                        image.hide();
                        image.hidden = true;
                    }
                }
                else {
                    if (image.hidden) {
                        image.show();
                        image.hidden = false;

                        image.showTooltipOn = "hover";
                    }
                }
            }
        }

        return selectedDataCenterImage;
    }

    initDataCenterIcons(chart) {
        const user = ProjectResource.getUserInfo();

        if (!user) {
            return;
        }

        const imageSeries = this.makeImageSeries(chart, ProjectResource.baseUrl + "/resource/image/icon/disablePOI.png");
        const imageSeriesSelected = this.makeImageSeries(chart, ProjectResource.baseUrl + "/resource/image/icon/activePOI.png");

        imageSeries.mapImages.template.tooltipY = -50;

        imageSeriesSelected.mapImages.template.showTooltipOn = "always";
        imageSeriesSelected.tooltip.label.interactionsEnabled = true;
        imageSeriesSelected.tooltip.hoverable = true;
        imageSeriesSelected.mapImages.template.tooltipY = -50;

        this.imageSeries = imageSeries;
        this.imageSeriesSelected = imageSeriesSelected;

        const dataCenterTitle = {};
        const dataCenters = { ...this.props.dataCenters };

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];
            const siteID = VDCList.getSiteID(site);

            if (VDCList.isSiteUser(user, siteID) === false) {
                continue;
            }

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                if (VDCList.belongToNation(user, nation) === false) {
                    continue;
                }

                for (const centerName in nation.centers) {
                    const dataCenter = nation.centers[centerName];

                    if (VDCList.belongToDataCenter(user, dataCenter) === false) {
                        continue;
                    }

                    imageSeries.data.push(
                        {
                            "id": dataCenter.id + "_" + dataCenter.name,
                            "title": dataCenter.name,
                            "latitude": dataCenter.latitude,
                            "longitude": dataCenter.longitude,
                            "scale": 1,
                            "minZoomLevel": 5
                        }
                    );

                    const title = ProjectResource.moveTo(dataCenter.name);
                    dataCenterTitle[title] = dataCenter;

                    imageSeriesSelected.data.push(
                        {
                            "id": dataCenter.id + "_" + dataCenter.name + MapBox.SelectedTag,
                            "title": title,
                            "latitude": dataCenter.latitude,
                            "longitude": dataCenter.longitude,
                            "scale": 1,
                            "minZoomLevel": 5
                        }
                    );
                }
            }
        }

        this.dataCenterTitle = dataCenterTitle;
        const _this = this;

        imageSeriesSelected.tooltip.label.events.on("hit", function (e) {
            const title = e.target.currentText;
            const dataCenter = _this.dataCenterTitle[title];

            if (dataCenter) {
                _this.props.onChangeMode(Interchange.Mode.main, _this.props.makeParameter(Interchange.paramType.dataCenter, ProjectResource.makeClone(dataCenter)));
            }
        });

        imageSeriesSelected.tooltip.getFillFromObject = false;
        imageSeriesSelected.tooltip.background.fill = am4core.color("#00B9FF");
        imageSeriesSelected.hide();
        MapBox.checkSelectedImages(imageSeriesSelected, imageSeriesSelected.data.length, imageSeries, dataCenters, this);
        // SVG Icon
        /*const interfaceColors = new am4core.InterfaceColorSet();
        const targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

        // Add images
        const imageSeries = chart.series.push(new am4maps.MapImageSeries());
        const imageTemplate = imageSeries.mapImages.template;
        imageTemplate.tooltipText = "{title}";
        imageTemplate.nonScaling = true;

        const marker = imageTemplate.createChild(am4core.Sprite);
        marker.path = targetSVG;
        marker.horizontalCenter = "middle";
        marker.verticalCenter = "middle";
        marker.scale = 0.7;
        marker.fill = interfaceColors.getFor("alternativeBackground");
        
        imageTemplate.propertyFields.latitude = "latitude";
        imageTemplate.propertyFields.longitude = "longitude";
        imageSeries.data = [{
            "id": "전주",
            "svgPath": targetSVG,
            "title": "전주",
            "latitude": 35.8241,
            "longitude": 127.1481,
            "scale": 1
        }];
        */
    }

    selectDataCenter = (center, image, selected) => {
        if (!selected) {
            this.props.selectDataCenter(center);
        }
        else {
            this.props.onChangeMode(Interchange.Mode.main, this.props.makeParameter(Interchange.paramType.dataCenter, ProjectResource.makeClone(center)));
        }
    }

    // 아이콘 이미지가 로딩되면 초기화한다.
    static checkSelectedImages(imageSeriesSelected, imageCount, imageSeries, dataCenters, mapBox) {
        if (imageSeriesSelected.mapImages.values.length < imageCount) {
            setTimeout(() => MapBox.checkSelectedImages(imageSeriesSelected, imageCount, imageSeries, dataCenters, mapBox), 500);
        }
        else {
            const imageCount = imageSeriesSelected.mapImages.values.length;
            const dataCount = imageSeriesSelected.data.length;

            for (let i = 0; i < imageCount && i < dataCount; i++) {
            //for (const image of imageSeriesSelected.mapImages.values) {
                const image = imageSeriesSelected.mapImages.values[i];
                const data = imageSeriesSelected.data[i];

                image.hide();
                image.hidden = true;

                /*image.events.on("hit", function (e) {
                    mapBox.selectDataCenter(e.target.id, true);
                });*/

                const dataCenter = MapBox.getDataCenter2(data, dataCenters);

                if (dataCenter) {
                    image.id = "DataCenter_" + dataCenter.id + MapBox.SelectedTag;

                    image.events.on("hit", function (e) {
                        mapBox.selectDataCenter(dataCenter, image, true);
                    });
                }
            }

            const imageCount2 = imageSeries.mapImages.values.length;
            const dataCount2 = imageSeries.data.length;

            for (let i = 0; i < imageCount2 && i < dataCount2; i++) {
            //for (const image of imageSeries.mapImages.values) {
                const image = imageSeries.mapImages.values[i];
                const data = imageSeries.data[i];

                const dataCenter = MapBox.getDataCenter2(data, dataCenters);

                if (dataCenter) {
                    image.id = "DataCenter_" + dataCenter.id;

                    image.events.on("hit", function (e) {
                        mapBox.selectDataCenter(dataCenter, image, false);
                    });
                }
            }

            if (mapBox.chart.zoomLevel < MapBox.IconVisibleZoomLevel) {
                imageSeries.hide();
                imageSeriesSelected.hide();
            }
            else {
                imageSeries.show();
                imageSeriesSelected.show();
            }
        }
    }

    // 국가별 MapPolygon 생성이 완료되었는지 확인한다.
    static checkMapDatas(mapBox) {
        const dataCount = mapBox.polygonSeries.data.length;

        if (dataCount > 0 && mapBox.polygonSeries.data[dataCount - 1].multiPolygon) {
            mapBox.setNationPosition(dataCount);

            if (mapBox.mode3D) {
                mapBox.rotateAuto();

                mapBox.chart.seriesContainer.events.on("down", function () {
                    if (mapBox.animation) {
                        mapBox.animation.stop();
                        mapBox.animation = null;
                    }
                });
            }

            let aqIndex = -1;
            const dataCount2 = mapBox.polygonSeries.data.length;

            for (let i = 0; i < dataCount2; i++) {
                const data = mapBox.polygonSeries.data[i];

                if (data.id === "AQ") {
                    aqIndex = i;
                    break;
                }
            }

            if (aqIndex >= 0) {
                mapBox.aqMapPolygon = mapBox.polygonSeries.mapPolygons.values[aqIndex];
            }
        }
        else {
            setTimeout(() => MapBox.checkMapDatas(mapBox), 500);
        }
    }

    setNationPosition(dataCount) {
        const nationPositions = {};

        for (let i = 0; i < dataCount; i++) {
            const data = this.polygonSeries.data[i];

            if (!data.multiPolygon) {
                continue;
            }

            const polygonCount = data.multiPolygon.length;

            let maxIndex = -1, maxCount = 0;

            for (let j = 0; j < polygonCount; j++) {
                const vertexCount = this.getVertexCount(data.multiPolygon[j]);

                if (vertexCount > maxCount) {
                    maxIndex = j;
                    maxCount = vertexCount;
                }
            }

            if (maxIndex >= 0) {
                nationPositions[data.id] = this.getCenterPosition(data.multiPolygon[maxIndex]);
            }
        }

        this.nationPositions = nationPositions;
    }

    getVertexCount(polygon) {
        let vertexCount = 0;

        for (const vertices of polygon) {
            const count = vertices.length;

            if (count > vertexCount) {
                vertexCount = count;
            }
        }

        return vertexCount;
    }

    getCenterPosition(polygon) {
        let left = null, right = null, bottom = null, top = null;

        for (const vertices of polygon) {
            for (const vertex of vertices) {
                const x = vertex[0];
                const y = vertex[1];

                if (left === null) {
                    left = x;
                    right = x;
                    bottom = y;
                    top = y;
                }
                else {
                    if (x < left) {
                        left = x;
                    }

                    if (x > right) {
                        right = x;
                    }

                    if (y < bottom) {
                        bottom = y;
                    }

                    if (y > top) {
                        top = y;
                    }
                }
            }
        }

        if (left !== null) {
            return [(left + right) / 2, (bottom + top) / 2];
        }

        return [0, 0];
    }

    static getDataCenter(image, dataCenters) {
        let center = null;
        let min = null;

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                for (const centerName in nation.centers) {
                    const dataCenter = nation.centers[centerName];

                    const x = dataCenter.latitude - image.latitude;
                    const y = dataCenter.longitude - image.longitude;
                    const len = x * x + y * y;

                    if (min === null || min > len) {
                        min = len;
                        center = dataCenter;
                    }
                }
            }
        }

        return center;
    }

    static getDataCenter2(data, dataCenters) {
        const index = data.id.indexOf('_');

        if (index < 0) {
            return null;
        }

        const id = parseInt(data.id.substring(0, index).trim());

        if (isNaN(id)) {
            return null;
        }

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                for (const centerName in nation.centers) {
                    const dataCenter = nation.centers[centerName];

                    if (dataCenter.id === id) {
                        return dataCenter;
                    }
                }
            }
        }

        return null;
    }

    makeImageSeries(chart, href) {
        const imageSeries = chart.series.push(new am4maps.MapImageSeries());

        const imageTemplate = imageSeries.mapImages.template;
        imageTemplate.tooltipText = "{title}";
        imageTemplate.nonScaling = true;

        const poi = imageTemplate.createChild(am4core.Image);
        poi.href = href;
        poi.tooltipText = "{title}";
        poi.horizontalCenter = "middle";
        poi.verticalCenter = "bottom";

        imageTemplate.propertyFields.latitude = "latitude";
        imageTemplate.propertyFields.longitude = "longitude";

        imageSeries.data = [];
        return imageSeries;
    }

    initNationCode(polygonSeries) {
        this.polygonSeries = polygonSeries;

        const nations = this.props.nations;
        const nationMaps = {};
        const centerNations = {};

        for (const nation of nations) {
            nationMaps[nation.name] = nation;
        }

        const dataCenters = this.props.dataCenters;

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];

            for (const nationName in site.nations) {
                const nation = nationMaps[nationName];

                if (nation) {
                    centerNations[nation.tag2] = nation;
                }
            }
        }

        if (nations && ProjectResource.targetLanguage === "ko") {
            for (const nation of nations) {
                /*if (nation.tag2 === "KR") {
                    continue;
                }*/
                const _nation = centerNations[nation.tag2];
                const data = {
                    "id": nation.tag2,
                    "name": nation.name
                }

                if (_nation) {
                    data["fill"] = am4core.color("#00B5F7");
                }
                else {
                    data["fill"] = am4core.color("#C9C9C9");
                }

                polygonSeries.data.push(data);
            }
        }

        MapBox.checkMapDatas(this);
    }

    zoom(zoomIn) {
        if (zoomIn) {
            this.chart.zoomIn(this.chart.zoomGeoPoint);
        }
        else {
            this.chart.zoomOut(this.chart.zoomGeoPoint);
        }
    }

    goHome() {
        if (this.chart) {
            this.chart.goHome();

            if (this.mode3D) {
                this.rotateAuto();
            }
        }
    }

    toggleViewMode() {
        if (this.mode3D) {
            if (this.animation) {
                this.animation.stop();
            }

            this.set2DMap(this.chart);
        }
        else {
            this.set3DMap(this.chart);
        }
    }

    goNation(nation) {
        if (this.mode3D) {
            const pos = this.nationPositions[nation.tag2];

            if (pos) {
                const vCurrent = this.positionToVertex3D(this.chart.deltaLongitude, this.chart.deltaLatitude);
                const vTarget = this.positionToVertex3D(-pos[0], -pos[1]);

                const angle = Geometry.getAngle3(vCurrent.x, vCurrent.y, vCurrent.z, 0, 0, 0, vTarget.x, vTarget.y, vTarget.z);
                const targetSeconds = MapBox.RotationMaxSeconds * angle / Math.PI;

                this.rotateTo(-pos[0], -pos[1], targetSeconds * 1000, nation.tag2);
            }
            else {
                this.chart.zoomToMapObject(this.polygonSeries.getPolygonById(nation.tag2));
            }
        }
        else {
            this.chart.zoomToMapObject(this.polygonSeries.getPolygonById(nation.tag2));
        }
    }

    goDataCenter(dataCenter, centerImage) {
        if (this.mode3D) {
            const nationTag = dataCenter?.nation?.tag2;

            if (nationTag) {
                const vCurrent = this.positionToVertex3D(this.chart.deltaLongitude, this.chart.deltaLatitude);
                const vTarget = this.positionToVertex3D(-centerImage.longitude, -centerImage.latitude);

                const angle = Geometry.getAngle3(vCurrent.x, vCurrent.y, vCurrent.z, 0, 0, 0, vTarget.x, vTarget.y, vTarget.z);
                const targetSeconds = MapBox.RotationMaxSeconds * angle / Math.PI;

                this.rotateTo(-centerImage.longitude, -centerImage.latitude, targetSeconds * 1000, nationTag, centerImage);
            }
            else {
                this.chart.zoomToMapObject(centerImage, 18);
            }
        }
        else {
            this.chart.zoomToMapObject(centerImage, 18);
        }
    }

    positionToVertex3D(lon, lat) {
        const radius = 100;

        const theta = this.degToRad(lon);
        const x = radius * Math.sin(theta);
        const y = -radius * Math.cos(theta);

        const delta = this.degToRad(lat);
        const z = radius * Math.sin(delta);

        const len = radius * Math.cos(delta);

        const vOrigin = new Vertex2D(0, 0);
        const v1 = new Vertex2D(x, y);

        const vTarget = vOrigin.getLinearVertex(v1, len);
        return new Vertex3D(vTarget.x, vTarget.y, z);
    }

    degToRad(deg) {
        return deg * Math.PI / 180;
    }

    stopAutoRotation() {
        if (this.animation) {
            this.animation.stop();
        }
    }

    rotateAuto() {
        if (this.animation) {
            this.animation.stop();
        }

        this.animation = this.chart.animate({ property: "deltaLongitude", to: 100000 }, 20000000);
    }

    rotateTo(lon, lat, targetMilliSeconds, tag, centerImage) {
        if (this.animation) {
            this.animation.stop();
        }

        this.animation = this.chart.animate([{
            property: "deltaLongitude",
            to: lon
        }, {
            property: "deltaLatitude",
            to: lat
            }], targetMilliSeconds);

        if (tag) {
            if (centerImage) {
                setTimeout(() => this.chart.zoomToMapObject(centerImage, 18), targetMilliSeconds);
            }
            else if (typeof (tag) === "string") {
                setTimeout(() => this.chart.zoomToMapObject(this.polygonSeries.getPolygonById(tag)), targetMilliSeconds);
            }
            else {
                setTimeout(() => this.chart.zoomToMapObject(tag), targetMilliSeconds);
            }
        }
    }

    render() {
        this.props.setMapBox(this);
        const viewPointClassName = this.mode3D ? dash.viewpoint3DIcon : dash.viewpoint2DIcon;

        return (
            <>
                <div className={dash.mapBox} style={{ position: "relative" }}>
                    <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>
                    <div className={dash.iconBox}>
                        <span className={dash.addIcon} onClick={() => this.zoom(true)}></span>
                        <span className={dash.mIcon} onClick={() => this.zoom(false)}></span>
                        <span className={dash.directionIcon} onClick={() => this.props.goHome()}></span>
                        <span className={viewPointClassName} onClick={() => {this.toggleViewMode()}}></span>
                    </div>
                </div> 
            </>
        )
    }
}

export default MapBox;