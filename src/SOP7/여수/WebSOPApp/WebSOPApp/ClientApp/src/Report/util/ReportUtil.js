import * as Exceljs from "exceljs";
import { saveAs } from "file-saver";
import {Col} from "reactstrap";

export default class ReportUtil {
    
    static getZoneName = (sensorDatas, key) => {
        for (const sensor of sensorDatas) {
            if (sensor.zoneID === parseInt(key)) {
                return sensor.sensorName;
            }
        }
    }
    static async downloadExcelFile(dataSource, title, beginDate, endDate, searchZones, searchMaterials, sensorDatas, materials) {
        
        const workbook = new Exceljs.Workbook();
        const worksheet = workbook.addWorksheet(title);
        
        // title
        let titleRow = worksheet.getCell("A1");
        titleRow.value = "보고서 및 통계";
        titleRow.alignment = { vertical: "middle", horizontal: "center" };
        titleRow.font = { name: "맑은 고딕", size: 20, bold: true, family: 4 };
        worksheet.mergeCells("A1:E2");
        
        worksheet.getCell('A1:E2').border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };
        
        let strSearchZones = "";
        const firstZone = searchZones[0];
        for (let i = 0; i < sensorDatas.length; i++) {
            if (firstZone === sensorDatas[i].zoneID) {
                strSearchZones = sensorDatas[i].sensorName;
                break;
            }
        }
        
        strSearchZones = strSearchZones + (searchZones.length > 1 ? " 외 " + (searchZones.length - 1) + "개소" : "");
        
        worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
        worksheet.addRow(['조회범위 : ' + strSearchZones]);
        
        let periodCell = worksheet.getCell('A3');
        let sensorRangeCell = worksheet.getCell('A4');
        
        periodCell.alignment = { vertical: "middle", horizontal: "left" };
        periodCell.font = { name: "맑은 고딕", size: 8, bold: true, family: 3 };
        
        sensorRangeCell.alignment = { vertical: "middle", horizontal: "left" };
        sensorRangeCell.font = { name: "맑은 고딕", size: 8, bold: true, family: 3 };
        
        worksheet.addRow([]);
        worksheet.addRow([]);
        
        let columnRow = worksheet.addRow(['측정소', '측정일시', '측정물질명', '측정값', '비고']);
        
        columnRow.alignment = { vertical: "middle", horizontal: "center" };
        columnRow.font = { size: 15, bold: true };
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: {vertical: "middle", horizontal: "center"}
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFC7C7C7'}
            };
            cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
        })
        
        let lastRowNum = 8;// start rowNum = 8
        
        for (const key in dataSource) {
            const datas = dataSource[key];
            const rowCount = datas.length;
            // get cell from last added row

            worksheet.columns = [
                {key: 'sensorName', width: 40},
                {key: 'timeStamp', width: 30},
                {key: 'materialName', width: 30},
                {key: 'sensorValue', width: 30}
            ];

            // add cell value B8: datas[0].timeStamp , C8: datas[0].materialName, D8: datas[0].value
            for (let i = 0; i < rowCount; i++) {
                worksheet.addRow(['', datas[i].timeStamp, datas[i].materialName, datas[i].sensorValue], '').eachCell((cell, number) => {
                    cell.border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    };
                });
            }
            
            worksheet.mergeCells(lastRowNum, 1, lastRowNum + rowCount - 1, 1);
            const mergedCells = worksheet.getCell(lastRowNum, 1);
            
            mergedCells.value = ReportUtil.getZoneName(sensorDatas, key);
            mergedCells.alignment = { vertical: "middle", horizontal: "center" };
            mergedCells.border = {
                top: {style:'thick'},
                left: {style:'thick'},
                bottom: {style:'thick'},
                right: {style:'thick'}
            };
            
            worksheet.addRow([]); // add empty row
            lastRowNum += rowCount + 1;
        } 
        
        // DownLoad
        const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: mimeType });
        saveAs(blob, title + ".xlsx");
    }
    
}