import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

export default class ExcelDownload {
    static async downloadItemDetailFile(itemData) {
        const title = "IT자산 상세정보";

        const workbook = new ExcelJS.Workbook();

        let itemServers = [];
        let boxs = [];
        let networks = [];
        let sanSwitchs = [];
        let securitys = [];
        let backups = [];
        let storages = [];
        let etcs = [];

        if (itemData?.itemServers?.length > 0)
            itemServers = itemData.itemServers;
        if (itemData?.boxs?.length > 0)
            boxs = itemData.boxs;
        if (itemData?.networks?.length > 0)
            networks = itemData.networks;
        if (itemData?.sanSwitchs?.length > 0)
            sanSwitchs = itemData.sanSwitchs;
        if (itemData?.securitys?.length > 0)
            securitys = itemData.securitys;
        if (itemData?.backups?.length > 0)
            backups = itemData.backups;
        if (itemData?.storages?.length > 0)
            storages = itemData.storages;
        if (itemData?.etcs?.length > 0)
            etcs = itemData.etcs;

        // 시트 및 데이터 생성
        ExcelDownload.makeServerSheet(workbook, itemServers);
        ExcelDownload.makeBoxSheet(workbook, boxs);
        ExcelDownload.makeNetworkSheet(workbook, networks);
        ExcelDownload.makeSanSwitchSheet(workbook, sanSwitchs);
        ExcelDownload.makeSecuritySheet(workbook, securitys);
        ExcelDownload.makeBackupSheet(workbook, backups);
        ExcelDownload.makeEtcSheet(workbook, etcs);
        ExcelDownload.makeStorageSheet(workbook, storages);


        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static async downloadServerFile(itemData) {
        const title = "서버 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeServerSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static makeServerSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "서버 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , , , , , , , , , , , , ,
            '관리정보',
            '하드웨어정보', , , , , , , , , , , , , , ,
            '이중화정보', , , ,
            '소프트웨어정보', , , , , ,
            '네트워크정보', , , , , , , , , , , , ,
            '백업정보', , , , , , , , ,
        ]);
        columnRow.eachCell((cell, number) => {

            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true },
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:Z1');
        worksheet.mergeCells('AB1:AP1');
        worksheet.mergeCells('AQ1:AT1');
        worksheet.mergeCells('AU1:AZ1');
        worksheet.mergeCells('BA1:BM1');
        worksheet.mergeCells('BN1:BX1');

        columnRow = worksheet.addRow([
            '서버명(필수)', '서버구분', '관련BOX명(필수)', '제품군', '업무시스템명', '시스템명', '서버종류', '운영구분(필수)', '서버등급', '서버등급', '서버등급(필수)', '입고일자', '설치일자', '상태(필수)', '용도(필수)', '가상화종류', 'DR구분', '자산구분', '담당', '담당', '담당', '위치', '위치', '위치', '주관부서', '운영부서',
            'GIMS',
            'OS Type', 'OS(필수)', 'OS Version(필수)', 'OS Patch L', 'OS 설치일자', 'OS 계정ID', 'Kernel bit', 'EOS 여부', 'EOS Date', '계정 TPAM적용여부', 'Logical Core수', 'Usable Disk용량(GB)', 'Logical Memory용량(MB)', '네트워크속도', '서버 이중화여부',
            '이중화유형 ', '이중화솔루션(VM)', '이중화솔루션(서비스)', '이중화서버(VM)',
            '계정관리등록', '서버접근제어 설치', 'DCA적용여부', '백신 설치 유무', '설치 백신명', '설치 S/W',
            'Zone', '서비스 IP Address', '서비스 IP 이중화 유무', 'Heart Beat IP Address', 'Heart Beat IP 이중화 유무', '백업 IP Address', '백업 IP 이중화 유무', '관리용 IP Address(필수)', '관리용 IP 이중화 유무', '기타1 IP Address', '기타1 IP 이중화 유무', '기타2 IP Address', '기타2 IP 이중화 유무',
            'Internal OS 백업 유무', 'Internal OS 백업 S/W', 'External 백업 수행 유무', 'External 백업 S/W 종류', 'External 원격 소산 여부', 'External 원격 소산 위치', 'Internal OS 백업 S/W', 'External 백업 수행 유무', 'External 백업 S/W 종류', 'External 원격 소산 여부', 'External 원격 소산 위치'
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('I2:K2');
        worksheet.mergeCells('S2:U2');
        worksheet.mergeCells('V2:X2');


        columnRow = worksheet.addRow([
            '서버명(필수)', '서버구분', '관련BOX명(필수)', '제품군', '업무시스템명', '시스템명', '서버종류', '운영구분(필수)', '서버등급(필수)', '[Year - 1]년', '[Year]년', '입고일자', '설치일자', '상태(필수)', '용도(필수)', '가상화종류', 'DR구분', '자산구분', '관리담당자', '운영담당자', '서비스담당자', 'site', '단위동', '랙/상세위치', '주관부서', '운영부서',
            'GIMS',
            'OS Type', 'OS(필수)', 'OS Version(필수)', 'OS Patch L', 'OS 설치일자', 'OS 계정ID', 'Kernel bit', 'EOS 여부', 'EOS Date', '계정 TPAM적용여부', 'Logical Core수', 'Usable Disk용량(GB)', 'Logical Memory용량(MB)', '네트워크속도', '서버 이중화여부',
            '이중화유형 ', '이중화솔루션(VM)', '이중화솔루션(서비스)', '이중화서버(VM)',
            '계정관리등록', '서버접근제어 설치', 'DCA적용여부', '백신 설치 유무', '설치 백신명', '설치 S/W',
            'Zone', '서비스 IP Address', '서비스 IP 이중화 유무', 'Heart Beat IP Address', 'Heart Beat IP 이중화 유무', '백업 IP Address', '백업 IP 이중화 유무', '관리용 IP Address(필수)', '관리용 IP 이중화 유무', '기타1 IP Address', '기타1 IP 이중화 유무', '기타2 IP Address', '기타2 IP 이중화 유무',
            'Internal OS 백업 유무', 'Internal OS 백업 S/W', 'External 백업 수행 유무', 'External 백업 S/W 종류', 'External 원격 소산 여부', 'External 원격 소산 위치', 'Internal OS 백업 S/W', 'External 백업 수행 유무', 'External 백업 S/W 종류', 'External 원격 소산 여부', 'External 원격 소산 위치'
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if ((number < 9 || number > 11) && (number < 19 || number > 24))
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_ServerName", width: 30 },
            { key: "basic_ServerCategory", width: 30 },
            { key: "basic_BoxName", width: 30 },
            { key: "basic_ProductGroup", width: 30 },
            { key: "basic_WorkSystemName", width: 30 },
            { key: "basic_SystemName", width: 30 },
            { key: "basic_ServerType", width: 30 },
            { key: "basic_OperationType", width: 30 },
            { key: "basic_ServerLevel", width: 30 },
            { key: "basic_ServerLevelYear_1", width: 30 },
            { key: "basic_ServerLevelYear", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_VirtualType", width: 30 },
            { key: "basic_DRType", width: 30 },
            { key: "basic_PropertyType", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "manage_ServiceManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_Region", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_GIMS", width: 30 },
            { key: "hW_OSType", width: 30 },
            { key: "hW_OS", width: 30 },
            { key: "hW_OSVersion", width: 30 },
            { key: "hW_OSPatchLevel", width: 30 },
            { key: "hW_OSInstallDate", width: 30 },
            { key: "hW_OSAccountID", width: 30 },
            { key: "hW_KernelBit", width: 30 },
            { key: "hW_EOS", width: 30 },
            { key: "hW_EOSDate", width: 30 },
            { key: "hW_AccountTPAM", width: 30 },
            { key: "hW_LogicalCoreCount", width: 30 },
            { key: "hW_UsableDiskVolumeGB", width: 30 },
            { key: "hW_LogicalMemoryVolumeMB", width: 30 },
            { key: "hW_NetworkSpeed", width: 30 },
            { key: "hW_ServerDual", width: 30 },
            { key: "dual_DualType", width: 30 },
            { key: "dual_DualSolutionVM", width: 30 },
            { key: "dual_DualSolutionService", width: 30 },
            { key: "dual_DualServerVM", width: 30 },
            { key: "sW_AccountManage", width: 30 },
            { key: "sW_ServerAccessInstall", width: 30 },
            { key: "sW_DCA", width: 30 },
            { key: "sW_VaccineInstall", width: 30 },
            { key: "sW_InstallVaccineName", width: 30 },
            { key: "sW_InstallSWName", width: 30 },
            { key: "nW_Zone", width: 30 },
            { key: "nW_ServiceIPAddr", width: 30 },
            { key: "nW_ServiceIPDual", width: 30 },
            { key: "nW_HeartBeatIPAddr", width: 30 },
            { key: "nW_HeartBeatIPDual", width: 30 },
            { key: "nW_BackupIPAddr", width: 30 },
            { key: "nW_BackIPDual", width: 30 },
            { key: "nW_ManageIPAddr", width: 30 },
            { key: "nW_ManageIPDual", width: 30 },
            { key: "nW_Etc1IPAddr", width: 30 },
            { key: "nW_Etc1IPAddrDual", width: 30 },
            { key: "nW_Etc2IPAddr", width: 30 },
            { key: "nW_Etc2IPDual", width: 30 },
            { key: "backup_InternalOSBackup", width: 30 },
            { key: "backup_InternalOSBackupSW", width: 30 },
            { key: "backup_ExternalBackupRun", width: 30 },
            { key: "backup_ExternalBackupSWType", width: 30 },
            { key: "backup_ExternalRemote", width: 30 },
            { key: "backup_ExternalRemotePosition", width: 30 },

            { key: "backup_InternalOSBackupSW2", width: 30 },
            { key: "backup_ExternalBackupRun2", width: 30 },
            { key: "backup_ExternalBackupSWType2", width: 30 },
            { key: "backup_ExternalRemote2", width: 30 },
            { key: "backup_ExternalRemotePosition2", width: 30 }

        ];



        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_ServerName: item.basic_ServerName,
                    basic_ServerCategory: item.basic_ServerCategory,
                    basic_BoxName: item.boxName,
                    basic_ProductGroup: item.basic_ProductGroup,
                    basic_WorkSystemName: item.basic_WorkSystemName,
                    basic_SystemName: item.basic_SystemName,
                    basic_ServerType: item.basic_ServerType,
                    basic_OperationType: item.basic_OperationType,
                    basic_ServerLevel: item.basic_ServerLevel,
                    basic_ServerLevelYear_1: item.basic_ServerLevelYear_1,
                    basic_ServerLevelYear: item.basic_ServerLevelYear,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_Status: item.basic_Status,
                    basic_Usage: item.basic_Usage,
                    basic_VirtualType: item.basic_VirtualType,
                    basic_DRType: item.basic_DRType,
                    basic_PropertyType: item.basic_PropertyType,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    manage_ServiceManager: item.manage_ServiceManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_Region: item.position_Region,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_GIMS: item.basic_GIMS,
                    hW_OSType: item.hW_OSType,
                    hW_OS: item.hW_OS,
                    hW_OSVersion: item.hW_OSVersion,
                    hW_OSPatchLevel: item.hW_OSPatchLevel,
                    hW_OSInstallDate: ExcelDownload.getDate(item.hW_OSInstallDate),
                    hW_OSAccountID: item.hW_OSAccountID,
                    hW_KernelBit: item.hW_KernelBit,
                    hW_EOS: item.hW_EOS,
                    hW_EOSDate: ExcelDownload.getDate(item.hW_EOSDate),
                    hW_AccountTPAM: item.hW_AccountTPAM,
                    hW_LogicalCoreCount: item.hW_LogicalCoreCount,
                    hW_UsableDiskVolumeGB: item.hW_UsableDiskVolumeGB,
                    hW_LogicalMemoryVolumeMB: item.hW_LogicalMemoryVolumeMB,
                    hW_NetworkSpeed: item.hW_NetworkSpeed,
                    hW_ServerDual: item.hW_ServerDual,
                    dual_DualType: item.dual_DualType,
                    dual_DualSolutionVM: item.dual_DualSolutionVM,
                    dual_DualSolutionService: item.dual_DualSolutionService,
                    dual_DualServerVM: item.dual_DualServerVM,
                    sW_AccountManage: item.sW_AccountManage,
                    sW_ServerAccessInstall: item.sW_ServerAccessInstall,
                    sW_DCA: item.sW_DCA,
                    sW_VaccineInstall: item.sW_VaccineInstall,
                    sW_InstallVaccineName: item.sW_InstallVaccineName,
                    sW_InstallSWName: item.sW_InstallSWName,
                    nW_Zone: item.nW_Zone,
                    nW_ServiceIPAddr: item.nW_ServiceIPAddr,
                    nW_ServiceIPDual: item.nW_ServiceIPDual,
                    nW_HeartBeatIPAddr: item.nW_HeartBeatIPAddr,
                    nW_HeartBeatIPDual: item.nW_HeartBeatIPDual,
                    nW_BackupIPAddr: item.nW_BackupIPAddr,
                    nW_BackIPDual: item.nW_BackIPDual,
                    nW_ManageIPAddr: item.nW_ManageIPAddr,
                    nW_ManageIPDual: item.nW_ManageIPDual,
                    nW_Etc1IPAddr: item.nW_Etc1IPAddr,
                    nW_Etc1IPAddrDual: item.nW_Etc1IPAddrDual,
                    nW_Etc2IPAddr: item.nW_Etc2IPAddr,
                    nW_Etc2IPDual: item.nW_Etc2IPDual,
                    backup_InternalOSBackup: item.backup_InternalOSBackup,
                    backup_InternalOSBackupSW: item.backup_InternalOSBackupSW,
                    backup_ExternalBackupRun: item.backup_ExternalBackupRun,
                    backup_ExternalBackupSWType: item.backup_ExternalBackupSWType,
                    backup_ExternalRemote: item.backup_ExternalRemote,
                    backup_ExternalRemotePosition: item.backup_ExternalRemotePosition,
                    backup_InternalOSBackupSW2: item.backup_InternalOSBackupSW,
                    backup_ExternalBackupRun2: item.backup_ExternalBackupRun,
                    backup_ExternalBackupSWType2: item.backup_ExternalBackupSWType,
                    backup_ExternalRemote2: item.backup_ExternalRemote,
                    backup_ExternalRemotePosition2: item.backup_ExternalRemotePosition



                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }


    static async downloadBoxFile(itemData) {
        const title = "Box 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeBoxSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static makeBoxSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "Box 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        // column
        let cell = worksheet.getCell('A1');
        cell.value = "기본정보";
        cell.font = { name: '맑은 고딕', family: 4, size: 12, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A1:V1');
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const column2 = worksheet.getCell('W1');
        column2.value = "유지보수정보";
        column2.font = { name: '맑은 고딕', family: 4, size: 12, bold: true };
        worksheet.getCell('W1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('W1:AF1');
        worksheet.getCell('W1:AF1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const column3 = worksheet.getCell('AG1');
        column3.value = "하드웨어정보";
        column3.font = { name: '맑은 고딕', family: 4, size: 12, bold: true };
        worksheet.getCell('AG1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('AG1:CH1');
        worksheet.getCell('AG1:CH1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const column4 = worksheet.getCell('CI1');
        column4.value = "네트워크정보";
        column4.font = { name: '맑은 고딕', family: 4, size: 12, bold: true };
        worksheet.getCell('CI1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('CI1:CL1');
        worksheet.getCell('CI1:CL1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const column5 = worksheet.getCell('CM1');
        column5.value = "연결정보";
        column5.font = { name: '맑은 고딕', family: 4, size: 12, bold: true };
        worksheet.getCell('CM1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('CM1:DC1');
        worksheet.getCell('CM1:DC1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        let columnRow = worksheet.addRow([
            'Box명(필수)', 'Box 등급(필수)', 'Box제조사(필수)', 'Box모델명(필수)', '장비구분', '시리얼번호', '자산구분', '입고일자', '설치일자', '주관부서', '상태(필수)', '용도(필수)', '담당자', '담당자', '파티션 가능유무', '파티션 명', '도입년차(년)', '위치', '위치', '운영부서', '폐기일자', '사용년한 초과여부',
            'Warranty기간', 'Warranty 만료일자', 'EOL Date', 'EOSL Date', 'EOSL 여부', '유지보수 여부', '유지보수업체', '유지보수 시작 일자', '유지보수 종료 일자', '공급업체',
            'Box파티션구분', 'Power이중화여부', '콘솔유무',
            'CPU', , , , , , , ,
            'Memory', , , , , , , , , , , , ,
            'Internal DISK', , , , , , ,
            'External DISK', , , , ,
            'Power Supply', , , ,
            'FAN', ,
            'Network Card', , , , , , , , , , , ,
            '관리 IP 주소', 'IP 주소 2', 'IP 주소 3', 'IP 주소 4',
            'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'NW장비-5', 'NW장비-6', 'NW장비-7', 'NW장비-8', '스토리지-1', '스토리지-2', '백업장비-1', '백업장비-2', '백업장비-3', '백업장비-4'
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('M2:N2');
        worksheet.mergeCells('R2:S2');
        worksheet.mergeCells('AJ2:AQ2');
        worksheet.mergeCells('AR2:BD2');
        worksheet.mergeCells('BE2:BK2');
        worksheet.mergeCells('BL2:BP2');
        worksheet.mergeCells('BQ2:BT2');
        worksheet.mergeCells('BU2:BV2');
        worksheet.mergeCells('BW2:CH2');



        columnRow = worksheet.addRow([
            'Box명(필수)', 'Box 등급(필수)', 'Box제조사(필수)', 'Box모델명(필수)', '장비구분', '시리얼번호', '자산구분', '입고일자', '설치일자', '주관부서', '상태(필수)', '용도(필수)', '관리담당자', '운영담당자', '파티션 가능유무', '파티션 명', '도입년차(년)', '설치지역/단위동', '랙/상세위치', '운영부서', '폐기일자', '사용년한 초과여부',
            'Warranty기간', 'Warranty 만료일자', 'EOL Date', 'EOSL Date', 'EOSL 여부', '유지보수 여부', '유지보수업체', '유지보수 시작 일자', '유지보수 종료 일자', '공급업체',
            'Box파티션구분', 'Power이중화여부', '콘솔유무',
            '모델명(필수)', 'Clock Speed(필수)', 'Socket수', 'CPU당 Core수', '전체 slot 수', '사용 slot 수', 'HT 지원유무', '총 Core 수(필수)',
            '전체 Slot수', '1GB (EA)', '2GB (EA)', '4GB (EA)', '8GB (EA)', '16GB (EA)', '32GB (EA)', '64GB (EA)', '128GB (EA)', '256GB (EA)', '사용Slot수', 'Memory 수', '총 Memory 용량(필수)',
            'Internal Disk용량(GB)', 'Internal Disk수', 'Internal Disk Usable Disk용량(GB)', 'Internal Disk 전체 slot 수', 'Internal Disk 사용 slot 수', 'Internal Disk RAID 종류', 'Internal Disk Size(GB)',
            'External DISK 제조사', 'External DISK 모델', 'External DISK RAID 종류', 'External DISK Size(GB)', 'External DISK MultiPath 솔루션',
            'Power Supply 개수', 'Power Supply 용량(W)', 'Power Supply PDU 이중화 여부', 'Power Supply RACK 전원 이중화 여부',
            'FAN 개수', 'FAN 이중화 유무',
            'NIC속도', 'NIC타입', 'NIC포트', 'NIC수', 'NIC 사용 Port수', 'Onboard NIC Port수', 'Onboard NIC 사용Port수', 'HBA속도', 'HBA타입', 'HBA포트', 'HBA수', '사용중인 HBA Port수량',
            '관리 IP 주소', 'IP 주소 2', 'IP 주소 3', 'IP 주소 4',
            'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'NW장비-5', 'NW장비-6', 'NW장비-7', 'NW장비-8', '스토리지-1', '스토리지-2', '백업장비-1', '백업장비-2', '백업장비-3', '백업장비-4'
        ]);

        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if ((number < 13 || number > 14) && (number < 18 || number > 19) && (number < 36 || number > 86))
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });



        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_Company", width: 30 },
            { key: "basic_ModelName", width: 30 },
            { key: "basic_EquipType", width: 30 },
            { key: "basic_SerialNumber", width: 30 },
            { key: "basic_PropertyType", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "basic_PartitionAble", width: 30 },
            { key: "basic_PartitionName", width: 30 },
            { key: "basic_ReceiveYears", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_DiscardDate", width: 30 },
            { key: "basic_OverUsedYear", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_EOLDate", width: 30 },
            { key: "maintenance_EOSLDate", width: 30 },
            { key: "maintenance_EOSL", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "hW_BoxPartitionType", width: 30 },
            { key: "hW_PowerDual", width: 30 },
            { key: "hW_ConsoleUse", width: 30 },
            { key: "cpU_ModelName", width: 30 },
            { key: "cpU_ClockSpeed", width: 30 },
            { key: "cpU_SocketCount", width: 30 },
            { key: "cpU_CoreCountPerCPU", width: 30 },
            { key: "cpU_TotalSlotCount", width: 30 },
            { key: "cpU_UseSlotCount", width: 30 },
            { key: "cpU_HTUse", width: 30 },
            { key: "cpU_TotalCoreCount", width: 30 },
            { key: "mem_TotalSlotCount", width: 30 },
            { key: "mem_EA_1GB", width: 30 },
            { key: "mem_EA_2GB", width: 30 },
            { key: "mem_EA_4GB", width: 30 },
            { key: "mem_EA_8GB", width: 30 },
            { key: "mem_EA_16GB", width: 30 },
            { key: "mem_EA_32GB", width: 30 },
            { key: "mem_EA_64GB", width: 30 },
            { key: "mem_EA_128GB", width: 30 },
            { key: "mem_EA_256GB", width: 30 },
            { key: "mem_UseSlotCount", width: 30 },
            { key: "mem_MemoryCount", width: 30 },
            { key: "mem_TotalMemoryVolume", width: 30 },
            { key: "internal_InternalDiskVolumeGB", width: 30 },
            { key: "internal_InternalDiskCount", width: 30 },
            { key: "internal_InternalDiskUsableVolumeGB", width: 30 },
            { key: "internal_InternalDiskTotalSlotCount", width: 30 },
            { key: "internal_InternalDiskUseSlot", width: 30 },
            { key: "internal_InternalDiskRaidType", width: 30 },
            { key: "internal_InternalDiskSizeGB", width: 30 },
            { key: "external_ExternalDiskCompanyName", width: 30 },
            { key: "external_ExternalDiskModel", width: 30 },
            { key: "external_ExternalDiskRaidType", width: 30 },
            { key: "external_ExternalDiskSizeGB", width: 30 },
            { key: "external_ExternalDiskMultiPathSolution", width: 30 },
            { key: "pS_PowerSupplyCount", width: 30 },
            { key: "pS_PowerSupplyVolumeW", width: 30 },
            { key: "pS_PowerSupplyPduDual", width: 30 },
            { key: "pS_PowerSupplyRackPowerDual", width: 30 },
            { key: "fan_FanCount", width: 30 },
            { key: "fan_FanDual", width: 30 },
            { key: "nic_NicSpeed", width: 30 },
            { key: "nic_NicType", width: 30 },
            { key: "nic_NicPort", width: 30 },
            { key: "nic_NicCount", width: 30 },
            { key: "nic_NicUsePortCount", width: 30 },
            { key: "nic_OnboardNicPortCount", width: 30 },
            { key: "nic_OnboardNicUsePortCount", width: 30 },
            { key: "nic_HBASpeed", width: 30 },
            { key: "nic_HBAType", width: 30 },
            { key: "nic_HBAPort", width: 30 },
            { key: "nic_HBACount", width: 30 },
            { key: "nic_UsingHBAPortCount", width: 30 },
            { key: "nW_ManageIPAddr", width: 30 },
            { key: "nW_IPAddr2", width: 30 },
            { key: "nW_IPAddr3", width: 30 },
            { key: "nW_IPAddr4", width: 30 },
            { key: "connect_SanSwitch1", width: 30 },
            { key: "connect_SanSwitch2", width: 30 },
            { key: "connect_SanSwitch3", width: 30 },
            { key: "connect_NWEquip1", width: 30 },
            { key: "connect_NWEquip2", width: 30 },
            { key: "connect_NWEquip3", width: 30 },
            { key: "connect_NWEquip4", width: 30 },
            { key: "connect_NWEquip5", width: 30 },
            { key: "connect_NWEquip6", width: 30 },
            { key: "connect_NWEquip7", width: 30 },
            { key: "connect_NWEquip8", width: 30 },
            { key: "connect_Storage1", width: 30 },
            { key: "connect_Storage2", width: 30 },
            { key: "connect_Backup1", width: 30 },
            { key: "connect_Backup2", width: 30 },
            { key: "connect_Backup3", width: 30 },
            { key: "connect_Backup4", width: 30 }
        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_Company: item.basic_Company,
                    basic_ModelName: item.basic_ModelName,
                    basic_EquipType: item.basic_EquipType,
                    basic_SerialNumber: item.basic_SerialNumber,
                    basic_PropertyType: item.basic_PropertyType,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_Status: item.basic_Status,
                    basic_Usage: item.basic_Usage,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    basic_PartitionAble: item.basic_PartitionAble,
                    basic_PartitionName: item.basic_PartitionName,
                    basic_ReceiveYears: item.basic_ReceiveYears,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_DiscardDate: ExcelDownload.getDate(item.basic_DiscardDate),
                    basic_OverUsedYear: item.basic_OverUsedYear,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_EOLDate: ExcelDownload.getDate(item.maintenance_EOLDate),
                    maintenance_EOSLDate: ExcelDownload.getDate(item.maintenance_EOSLDate),
                    maintenance_EOSL: item.maintenance_EOSL,
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    hW_BoxPartitionType: item.hW_BoxPartitionType,
                    hW_PowerDual: item.hW_PowerDual,
                    hW_ConsoleUse: item.hW_ConsoleUse,
                    cpU_ModelName: item.cpU_ModelName,
                    cpU_ClockSpeed: item.cpU_ClockSpeed,
                    cpU_SocketCount: item.cpU_SocketCount,
                    cpU_CoreCountPerCPU: item.cpU_CoreCountPerCPU,
                    cpU_TotalSlotCount: item.cpU_TotalSlotCount,
                    cpU_UseSlotCount: item.cpU_UseSlotCount,
                    cpU_HTUse: item.cpU_HTUse,
                    cpU_TotalCoreCount: item.cpU_TotalCoreCount,
                    mem_TotalSlotCount: item.mem_TotalSlotCount,
                    mem_EA_1GB: item.mem_EA_1GB,
                    mem_EA_2GB: item.mem_EA_2GB,
                    mem_EA_4GB: item.mem_EA_4GB,
                    mem_EA_8GB: item.mem_EA_8GB,
                    mem_EA_16GB: item.mem_EA_16GB,
                    mem_EA_32GB: item.mem_EA_32GB,
                    mem_EA_64GB: item.mem_EA_64GB,
                    mem_EA_128GB: item.mem_EA_128GB,
                    mem_EA_256GB: item.mem_EA_256GB,
                    mem_UseSlotCount: item.mem_UseSlotCount,
                    mem_MemoryCount: item.mem_MemoryCount,
                    mem_TotalMemoryVolume: item.mem_TotalMemoryVolume,
                    internal_InternalDiskVolumeGB: item.internal_InternalDiskVolumeGB,
                    internal_InternalDiskCount: item.internal_InternalDiskCount,
                    internal_InternalDiskUsableVolumeGB: item.internal_InternalDiskUsableVolumeGB,
                    internal_InternalDiskTotalSlotCount: item.internal_InternalDiskTotalSlotCount,
                    internal_InternalDiskUseSlot: item.internal_InternalDiskUseSlot,
                    internal_InternalDiskRaidType: item.internal_InternalDiskRaidType,
                    internal_InternalDiskSizeGB: item.internal_InternalDiskSizeGB,
                    external_ExternalDiskCompanyName: item.external_ExternalDiskCompanyName,
                    external_ExternalDiskModel: item.external_ExternalDiskModel,
                    external_ExternalDiskRaidType: item.external_ExternalDiskRaidType,
                    external_ExternalDiskSizeGB: item.external_ExternalDiskSizeGB,
                    external_ExternalDiskMultiPathSolution: item.external_ExternalDiskMultiPathSolution,
                    pS_PowerSupplyCount: item.pS_PowerSupplyCount,
                    pS_PowerSupplyVolumeW: item.pS_PowerSupplyVolumeW,
                    pS_PowerSupplyPduDual: item.pS_PowerSupplyPduDual,
                    pS_PowerSupplyRackPowerDual: item.pS_PowerSupplyRackPowerDual,
                    fan_FanCount: item.fan_FanCount,
                    fan_FanDual: item.fan_FanDual,
                    nic_NicSpeed: item.nic_NicSpeed,
                    nic_NicType: item.nic_NicType,
                    nic_NicPort: item.nic_NicPort,
                    nic_NicCount: item.nic_NicCount,
                    nic_NicUsePortCount: item.nic_NicUsePortCount,
                    nic_OnboardNicPortCount: item.nic_OnboardNicPortCount,
                    nic_OnboardNicUsePortCount: item.nic_OnboardNicUsePortCount,
                    nic_HBASpeed: item.nic_HBASpeed,
                    nic_HBAType: item.nic_HBAType,
                    nic_HBAPort: item.nic_HBAPort,
                    nic_HBACount: item.nic_HBACount,
                    nic_UsingHBAPortCount: item.nic_UsingHBAPortCount,
                    nW_ManageIPAddr: item.nW_ManageIPAddr,
                    nW_IPAddr2: item.nW_IPAddr2,
                    nW_IPAddr3: item.nW_IPAddr3,
                    nW_IPAddr4: item.nW_IPAddr4,
                    connect_SanSwitch1: item.connect_SanSwitch1,
                    connect_SanSwitch2: item.connect_SanSwitch2,
                    connect_SanSwitch3: item.connect_SanSwitch3,
                    connect_NWEquip1: item.connect_NWEquip1,
                    connect_NWEquip2: item.connect_NWEquip2,
                    connect_NWEquip3: item.connect_NWEquip3,
                    connect_NWEquip4: item.connect_NWEquip4,
                    connect_NWEquip5: item.connect_NWEquip5,
                    connect_NWEquip6: item.connect_NWEquip6,
                    connect_NWEquip7: item.connect_NWEquip7,
                    connect_NWEquip8: item.connect_NWEquip8,
                    connect_Storage1: item.connect_Storage1,
                    connect_Storage2: item.connect_Storage2,
                    connect_Backup1: item.connect_Backup1,
                    connect_Backup2: item.connect_Backup2,
                    connect_Backup3: item.connect_Backup3,
                    connect_Backup4: item.connect_Backup4
                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }


    static async downloadNetworkFile(itemData) {
        const title = "네트워크 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeNetworkSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static makeNetworkSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "네트워크 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , , ,
            '하드웨어정보', , , , , , , , , , , , , , , , , ,
            '연결정보', , , ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:S1');
        worksheet.mergeCells('T1:AB1');
        worksheet.mergeCells('AC1:AT1');
        worksheet.mergeCells('AU1:AX1');


        columnRow = worksheet.addRow([
            '네트워크장비명(필수)', '상태(필수)', '네트워크장비상세분류(필수)', '네트워크운영등급(필수)', '입고일자', '설치일자', '용도(필수)', '자산구분', '주관부서', '운영부서', '사용연한초과여부', 'Stock여부', '구분 I', '구분 II', '메모', '담당자', '담당자', '위치', '위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', 'EOL Date', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'OS Version', 'IP-01', 'IP-02', 'IP-03', 'IP-04', 'IP-05', 'IP-06', 'IP-07', 'IP-08', 'Rack', 'Power 이중화여부', 'Zone', '상세용도', 'NMS 적용여부', 'NW회선명',
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

        });

        worksheet.mergeCells('P2:Q2');
        worksheet.mergeCells('R2:S2');



        columnRow = worksheet.addRow([
            '네트워크장비명(필수)', '상태(필수)', '네트워크장비상세분류(필수)', '네트워크운영등급(필수)', '입고일자', '설치일자', '용도(필수)', '자산구분', '주관부서', '운영부서', '사용연한초과여부', 'Stock여부', '구분 I', '구분 II', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', 'EOL Date', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'OS Version', 'IP-01', 'IP-02', 'IP-03', 'IP-04', 'IP-05', 'IP-06', 'IP-07', 'IP-08', 'Rack', 'Power 이중화여부', 'Zone', '상세용도', 'NMS 적용여부', 'NW회선명',
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if (number < 16 || number > 19)
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_EquipDetailClass", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_OverUsedYear", width: 30 },
            { key: "basic_Stock", width: 30 },
            { key: "basic_Type1", width: 30 },
            { key: "basic_Type2", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_EOLDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_OSVersion", width: 30 },
            { key: "hW_IP_01", width: 30 },
            { key: "hW_IP_02", width: 30 },
            { key: "hW_IP_03", width: 30 },
            { key: "hW_IP_04", width: 30 },
            { key: "hW_IP_05", width: 30 },
            { key: "hW_IP_06", width: 30 },
            { key: "hW_IP_07", width: 30 },
            { key: "hW_IP_08", width: 30 },
            { key: "hW_Rack", width: 30 },
            { key: "hW_PowerDual", width: 30 },
            { key: "hW_Zone", width: 30 },
            { key: "hW_DetailUsage", width: 30 },
            { key: "hW_NMS", width: 30 },
            { key: "hW_NWLineName", width: 30 },
            { key: "connect_NWEquip_1", width: 30 },
            { key: "connect_NWEquip_2", width: 30 },
            { key: "connect_NWEquip_3", width: 30 },
            { key: "connect_NWEquip_4", width: 30 }
        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_EquipDetailClass: item.basic_EquipDetailClass,
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_OverUsedYear: item.basic_OverUsedYear,
                    basic_Stock: item.basic_Stock,
                    basic_Type1: item.basic_Type1,
                    basic_Type2: item.basic_Type2,
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_EOLDate: ExcelDownload.getDate(item.maintenance_EOLDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_OSVersion: item.hW_OSVersion,
                    hW_IP_01: item.hW_IP_01,
                    hW_IP_02: item.hW_IP_02,
                    hW_IP_03: item.hW_IP_03,
                    hW_IP_04: item.hW_IP_04,
                    hW_IP_05: item.hW_IP_05,
                    hW_IP_06: item.hW_IP_06,
                    hW_IP_07: item.hW_IP_07,
                    hW_IP_08: item.hW_IP_08,
                    hW_Rack: item.hW_Rack,
                    hW_PowerDual: item.hW_PowerDual,
                    hW_Zone: item.hW_Zone,
                    hW_DetailUsage: item.hW_DetailUsage,
                    hW_NMS: item.hW_NMS,
                    hW_NWLineName: item.hW_NWLineName,
                    connect_NWEquip_1: item.connect_NWEquip_1,
                    connect_NWEquip_2: item.connect_NWEquip_2,
                    connect_NWEquip_3: item.connect_NWEquip_3,
                    connect_NWEquip_4: item.connect_NWEquip_4


                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }

    static async downloadSanSwitchFile(itemData) {
        const title = "San 스위치 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeSanSwitchSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }


    static makeSanSwitchSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "San 스위치 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , ,
            '하드웨어정보', , , , , , , , , , , , , , , , , , ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:N1');
        worksheet.mergeCells('O1:V1');
        worksheet.mergeCells('W1:AO1');



        columnRow = worksheet.addRow([
            'SAN 스위치명(필수)', '상태(필수)', '입고일자', '설치일자', 'SAN 스위치 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '메모', '담당자', '담당자', '위치', '위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', '펌웨어 버전', '이중화여부', '이중화대상 SAN 스위치명', 'Interface Type', 'Interface', 'FC 포트 개수(최대포트수)(필수)', 'FC 포트 사용개수(최대포트수)(필수)', 'FC Port 여유', 'GBIC 포트개수', '이중화 BOX 시리얼', '보안구분', 'FAN 개수', 'FAN 이중화여부', 'Power Supply 이중화여부', '연결 PDU 이중화여부', 'RACK 전원 이중화여부',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

        });

        worksheet.mergeCells('K2:L2');
        worksheet.mergeCells('M2:N2');



        columnRow = worksheet.addRow([
            'SAN 스위치명(필수)', '상태(필수)', '입고일자', '설치일자', 'SAN 스위치 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', '펌웨어 버전', '이중화여부', '이중화대상 SAN 스위치명', 'Interface Type', 'Interface', 'FC 포트 개수(최대포트수)(필수)', 'FC 포트 사용개수(최대포트수)(필수)', 'FC Port 여유', 'GBIC 포트개수', '이중화 BOX 시리얼', '보안구분', 'FAN 개수', 'FAN 이중화여부', 'Power Supply 이중화여부', '연결 PDU 이중화여부', 'RACK 전원 이중화여부',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if (number < 11 || number > 14)
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_FirmwareVersion", width: 30 },
            { key: "hW_Dual", width: 30 },
            { key: "hW_DualSanSwitchName", width: 30 },
            { key: "hW_InterfaceType", width: 30 },
            { key: "hW_Interface", width: 30 },
            { key: "hW_FCPortCount", width: 30 },
            { key: "hW_FCPortUseCount", width: 40 },
            { key: "hW_FCPortFree", width: 30 },
            { key: "hW_GBICPortCount", width: 30 },
            { key: "hW_DualBoxSerial", width: 30 },
            { key: "hW_SecurityType", width: 30 },
            { key: "hW_FanCount", width: 30 },
            { key: "hW_FanDual", width: 30 },
            { key: "hW_PowerSupplyDual", width: 30 },
            { key: "hW_ConnectPDUDual", width: 30 },
            { key: "dual_RackPowerDualUse", width: 30 }

        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_FirmwareVersion: item.hW_FirmwareVersion,
                    hW_Dual: item.hW_Dual,
                    hW_DualSanSwitchName: item.hW_DualSanSwitchName,
                    hW_InterfaceType: item.hW_InterfaceType,
                    hW_Interface: item.hW_Interface,
                    hW_FCPortCount: item.hW_FCPortCount,
                    hW_FCPortUseCount: item.hW_FCPortUseCount,
                    hW_FCPortFree: item.hW_FCPortFree,
                    hW_GBICPortCount: item.hW_GBICPortCount,
                    hW_DualBoxSerial: item.hW_DualBoxSerial,
                    hW_SecurityType: item.hW_SecurityType,
                    hW_FanCount: item.hW_FanCount,
                    hW_FanDual: item.hW_FanDual,
                    hW_PowerSupplyDual: item.hW_PowerSupplyDual,
                    hW_ConnectPDUDual: item.hW_ConnectPDUDual,
                    dual_RackPowerDualUse: item.dual_RackPowerDualUse


                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }

    }





    static async downloadSecurityFile(itemData) {
        const title = "보안 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeSecuritySheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static makeSecuritySheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "보안 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , ,
            '하드웨어정보', , , , ,
            '연결정보', ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:P1');
        worksheet.mergeCells('Q1:X1');
        worksheet.mergeCells('Y1:AC1');
        worksheet.mergeCells('AD1:AE1');


        columnRow = worksheet.addRow([
            '보안장비명(필수)', '상태(필수)', '보안장비구분', '보안장비상세분류', '입고일자', '설치일자', '보안 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '메모', '담당자', '담당자', '위치', '위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'Version', 'IP',
            'NW장비-1', 'NW장비-2',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });


        worksheet.mergeCells('M2:N2');
        worksheet.mergeCells('O2:P2');



        columnRow = worksheet.addRow([
            '보안장비명(필수)', '상태(필수)', '보안장비구분', '보안장비상세분류', '입고일자', '설치일자', '보안 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warranty기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'Version', 'IP',
            'NW장비-1', 'NW장비-2',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if (number < 13 || number > 16)
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_EquipType", width: 30 },
            { key: "basic_EquipDetailClass", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_FirmwareVersion", width: 30 },
            { key: "hW_IP", width: 30 },
            { key: "connect_NWEquip_1", width: 30 },
            { key: "connect_NWEquip_2", width: 30 }

        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_EquipType: item.basic_EquipType,
                    basic_EquipDetailClass: item.basic_EquipDetailClass,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_FirmwareVersion: item.hW_FirmwareVersion,
                    hW_IP: item.hW_IP,
                    connect_NWEquip_1: item.connect_NWEquip_1,
                    connect_NWEquip_2: item.connect_NWEquip_2

                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }




    static async downloadBackupFile(itemData) {
        const title = "백업 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeBackupSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }


    static makeBackupSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "백업 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , ,
            '하드웨어정보', , , , , , , , , , , , , , , , , ,
            '연결정보', , , , , , , ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:O1');
        worksheet.mergeCells('P1:W1');
        worksheet.mergeCells('X1:AO1');
        worksheet.mergeCells('AP1:AW1');



        columnRow = worksheet.addRow([
            '백업장비명(필수)', '상태(필수)', '입고일자', '설치일자', '백업 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사용연한 초과여부', '메모', '담당자', , '위치', ,
            '공급업체', 'Warranty 기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', '펌웨어 버전', '라이브러리 구분', '구성 Topology', 'IP (Management)', 'Disk Drive', , , , , , , 'Tape Media', , , ,
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'SAN스위치-4',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });


        worksheet.mergeCells('L2:M2');
        worksheet.mergeCells('N2:O2');
        worksheet.mergeCells('AE2:AK2');
        worksheet.mergeCells('AL2:AO2');



        columnRow = worksheet.addRow([
            '백업장비명(필수)', '상태(필수)', '입고일자', '설치일자', '백업 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사용연한 초과여부', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warranty 기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', '펌웨어 버전', '라이브러리 구분', '구성 Topology', 'IP (Management)', '설치일자', 'Disk Drive 종류', 'Disk Type용량(GB)', 'Disk 수', '물리적용량(GB)', 'Usable용량(GB)(필수)', 'RAID 구성', '구매일자', '전체 Slot 수', 'Tape Media 종류', 'Tape Media 수',
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'SAN스위치-4',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if ((number < 12 || number > 15) && (number < 31 || number > 41))
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_OverUsedYear", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_FirmwareVersion", width: 30 },
            { key: "hW_DiskType", width: 30 },
            { key: "hW_Topology", width: 30 },
            { key: "hW_IP", width: 30 },
            { key: "hW_RegDate", width: 30 },
            { key: "hW_DiskDriveType", width: 30 },
            { key: "hW_DiskTypeVolumeGB", width: 30 },
            { key: "hW_DiskCount", width: 30 },
            { key: "hW_PhysicalVolumeGB", width: 30 },
            { key: "hW_UsableVolumeGB", width: 30 },
            { key: "hW_RaidType", width: 30 },
            { key: "hW_BuyDate", width: 30 },
            { key: "hW_TotalSlotCount", width: 30 },
            { key: "hW_TapeMediaType", width: 30 },
            { key: "hW_TapeMediaCount", width: 30 },
            { key: "connect_NWEquip_1", width: 30 },
            { key: "connect_NWEquip_2", width: 30 },
            { key: "connect_NWEquip_3", width: 30 },
            { key: "connect_NWEquip_4", width: 30 },
            { key: "connect_SanSwitch_1", width: 30 },
            { key: "connect_SanSwitch_2", width: 30 },
            { key: "connect_SanSwitch_3", width: 30 },
            { key: "connect_SanSwitch_4", width: 30 }


        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_OverUsedYear: item.basic_OverUsedYear,
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_FirmwareVersion: item.hW_FirmwareVersion,
                    hW_DiskType: item.hW_DiskType,
                    hW_Topology: item.hW_Topology,
                    hW_IP: item.hW_IP,
                    hW_RegDate: ExcelDownload.getDate(item.hW_RegDate),
                    hW_DiskDriveType: item.hW_DiskDriveType,
                    hW_DiskTypeVolumeGB: item.hW_DiskTypeVolumeGB,
                    hW_DiskCount: item.hW_DiskCount,
                    hW_PhysicalVolumeGB: item.hW_PhysicalVolumeGB,
                    hW_UsableVolumeGB: item.hW_UsableVolumeGB,
                    hW_RaidType: item.hW_RaidType,
                    hW_BuyDate: ExcelDownload.getDate(item.hW_BuyDate),
                    hW_TotalSlotCount: item.hW_TotalSlotCount,
                    hW_TapeMediaType: item.hW_TapeMediaType,
                    hW_TapeMediaCount: item.hW_TapeMediaCount,
                    connect_NWEquip_1: item.connect_NWEquip_1,
                    connect_NWEquip_2: item.connect_NWEquip_2,
                    connect_NWEquip_3: item.connect_NWEquip_3,
                    connect_NWEquip_4: item.connect_NWEquip_4,
                    connect_SanSwitch_1: item.connect_SanSwitch_1,
                    connect_SanSwitch_2: item.connect_SanSwitch_2,
                    connect_SanSwitch_3: item.connect_SanSwitch_3,
                    connect_SanSwitch_4: item.connect_SanSwitch_4

                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }


    static async downloadEtcFile(itemData) {
        const title = "기타 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeEtcSheet(workbook, itemData, title);

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    static makeEtcSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "기타 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , , ,
            '하드웨어정보', , , , , , , , , , , , , , , , , ,
            '연결정보', ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:S1');
        worksheet.mergeCells('T1:AB1');
        worksheet.mergeCells('AC1:AT1');
        worksheet.mergeCells('AU1:AV1');






        columnRow = worksheet.addRow([
            '기타장비명(필수)', '상태(필수)', '기타장비상세분류(필수)', '사용년한', '초과여부', '입고일자', '설치일자', '기타 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사업장 담당자', '폐기일자', '메모', '담당자', , '위치', ,
            '공급업체', 'Warrantly 기간', 'Warrantly 만료일자', '비용(구매)부서', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'Version', '다자간 라이센스', '마이크 수량(EA)', 'PAD여부', '거치대여부', '모니터 모델명', '모니터 타입', '모니터 화면크기(Inch)', '화상 IP', '호스트명', 'QoS 설정여부', 'QoS 할당량', '전용화상회선여부', '전용화상회사 B/W', '특이사항',
            'NW장비-1', 'NW장비-2',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });


        worksheet.mergeCells('P2:Q2');
        worksheet.mergeCells('R2:S2');



        columnRow = worksheet.addRow([
            '기타장비명(필수)', '상태(필수)', '기타장비상세분류(필수)', '사용년한', '초과여부', '입고일자', '설치일자', '기타 등급(필수)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사업장 담당자', '폐기일자', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warrantly 기간', 'Warrantly 만료일자', '비용(구매)부서', '유지보수업체', 'EOS 일자', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', '시리얼번호', 'Version', '다자간 라이센스', '마이크 수량(EA)', 'PAD여부', '거치대여부', '모니터 모델명', '모니터 타입', '모니터 화면크기(Inch)', '화상 IP', '호스트명', 'QoS 설정여부', 'QoS 할당량', '전용화상회선여부', '전용화상회사 B/W', '특이사항',
            'NW장비-1', 'NW장비-2',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if (number < 16 || number > 19)
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_EquipDetailClass", width: 30 },
            { key: "basic_LifeYear", width: 30 },
            { key: "basic_OverUsedYear", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_SiteManager", width: 30 },
            { key: "basic_DiscardDate", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_FinancialDepartment", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_FirmwareVersion", width: 30 },
            { key: "hW_MultiLicense", width: 30 },
            { key: "hW_MicCount", width: 30 },
            { key: "hW_PAD", width: 30 },
            { key: "hW_Rack", width: 30 },
            { key: "hW_MonitorModelName", width: 30 },
            { key: "hW_MonitorType", width: 30 },
            { key: "hW_MonitorScreenSizeInch", width: 30 },
            { key: "hW_ScreenIP", width: 30 },
            { key: "hW_HostName", width: 30 },
            { key: "hW_QoS", width: 30 },
            { key: "hW_QosVolume", width: 30 },
            { key: "hW_PrivateLine", width: 30 },
            { key: "hW_PrivateCompanyBW", width: 30 },
            { key: "hW_Special", width: 30 },
            { key: "connect_NWEquip_1", width: 30 },
            { key: "connect_NWEquip_2", width: 30 }

        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_EquipDetailClass: item.basic_EquipDetailClass,
                    basic_LifeYear: item.basic_LifeYear,
                    basic_OverUsedYear: item.basic_OverUsedYear,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_SiteManager: item.basic_SiteManager,
                    basic_DiscardDate: ExcelDownload.getDate(item.basic_DiscardDate),
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_FinancialDepartment: item.maintenance_FinancialDepartment,
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_FirmwareVersion: item.hW_FirmwareVersion,
                    hW_MultiLicense: item.hW_MultiLicense,
                    hW_MicCount: item.hW_MicCount,
                    hW_PAD: item.hW_PAD,
                    hW_Rack: item.hW_Rack,
                    hW_MonitorModelName: item.hW_MonitorModelName,
                    hW_MonitorType: item.hW_MonitorType,
                    hW_MonitorScreenSizeInch: item.hW_MonitorScreenSizeInch,
                    hW_ScreenIP: item.hW_ScreenIP,
                    hW_HostName: item.hW_HostName,
                    hW_QoS: item.hW_QoS,
                    hW_QosVolume: item.hW_QosVolume,
                    hW_PrivateLine: item.hW_PrivateLine,
                    hW_PrivateCompanyBW: item.hW_PrivateCompanyBW,
                    hW_Special: item.hW_Special,
                    connect_NWEquip_1: item.connect_NWEquip_1,
                    connect_NWEquip_2: item.connect_NWEquip_2

                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }
    }

    static async downloadStorageFile(itemData) {
        const title = "스토리지 인벤토리 상세정보";

        const workbook = new ExcelJS.Workbook();

        // 시트 및 데이터 생성
        ExcelDownload.makeStorageSheet(workbook, itemData, title);


        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = ExcelDownload.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = ExcelDownload.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }


    static makeStorageSheet(workbook, itemData, sheetName) {
        if (!workbook)
            return;

        if (!sheetName)
            sheetName = "스토리지 인벤토리 상세정보";

        const worksheet = workbook.addWorksheet(sheetName); // sheet 이름

        let columnRow = worksheet.addRow([
            '기본정보', , , , , , , , , , , , , , , , , ,
            '유지보수정보', , , , , , , , , , ,
            '하드웨어정보', , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,
            '연결정보', , , , , , , , , , , ,
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });

        worksheet.mergeCells('A1:R1');
        worksheet.mergeCells('S1:AC1');
        worksheet.mergeCells('AD1:CJ1');
        worksheet.mergeCells('CK1:CV1');






        columnRow = worksheet.addRow([
            '스토리지명(필수)', '상태(필수)', '입고일자', '설치일자', 'Storage 등급(필수)', '도입년차(년)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사업장 담당자', '폐기일자', '사용연한 초과여부', '메모', '담당자', , '위치', ,
            '공급업체', 'Warranty 기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', 'EOL Date', 'EOSL 여부', 'EOSL Date', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', 'Cache Memory', '시리얼번호', 'Disk Type(필수)', '컨트롤러 펌웨어 버전', 'Total Physical 용량', 'Total Usable 용량(필수)', 'Logical 용량(GB)', '여유 용량(GB)', 'MultiPath 도입여부', 'MultiPath 자산명', 'Available 용량', '할당 용량(GB)', '할당율', '이중화', , , , , , , , , , , , '용량', , , , , , , 'Spare Disk Drive', , , 'IP', , , 'Port', , , , , '연결 서버', , , , , , , , , , , , , ,
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'SAN스위치-4', 'SAN스위치-5', 'SAN스위치-6', 'SAN스위치-7', 'SAN스위치-8',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };
        });


        worksheet.mergeCells('O2:P2');
        worksheet.mergeCells('Q2:R2');
        worksheet.mergeCells('AS2:BD2');
        worksheet.mergeCells('BE2:BK2');

        worksheet.mergeCells('BL2:BN2');
        worksheet.mergeCells('BO2:BQ2');
        worksheet.mergeCells('BR2:BV2');
        worksheet.mergeCells('BW2:CJ2');

        columnRow = worksheet.addRow([
            '스토리지명(필수)', '상태(필수)', '입고일자', '설치일자', 'Storage 등급(필수)', '도입년차(년)', '용도(필수)', '자산구분', '주관부서', '운영부서', '사업장 담당자', '폐기일자', '사용연한 초과여부', '메모', '관리담당자(고객사)', '운영담당자(EDS)', '설치지역/단위동', '랙/상세위치',
            '공급업체', 'Warranty 기간', 'Warranty 만료일자', '유지보수업체', 'EOS 일자', 'EOL Date', 'EOSL 여부', 'EOSL Date', '유지보수 계약여부', '유지보수 시작일자', '유지보수 종료일자',
            '모델명(필수)', '제조사(필수)', 'Cache Memory', '시리얼번호', 'Disk Type(필수)', '컨트롤러 펌웨어 버전', 'Total Physical 용량', 'Total Usable 용량(필수)', 'Logical 용량(GB)', '여유 용량(GB)', 'MultiPath 도입여부', 'MultiPath 자산명', 'Available 용량', '할당 용량(GB)', '할당율', '이중화여부', '이중화 유형', 'BOX 이중화여부', 'BOX 이중화 디스크 장비명', 'BOX 이중화솔루션', '컨트롤러 이중화여부', 'Power 이중화여부', 'PDU 이중화', 'Rack 전원 이중화', '내부복제 S/W 사용여부', '스토리지 복제여부', '스토리지 복제 방식', '설치 일자', 'Disk Type', '개별 Disk 용량', 'Disk 수', '물리적 용량', 'Usable 용량', 'RAID 구성', 'Disk Type', 'Disk 용량', 'Disk 수', 'IP 구분', 'IP', '네트워크 속도', '총 Ports', '사용 Ports', '연결 SAN 스위치', '도입일자', '대수', '서버명', '용도', '서비스 등급', '모델명', 'OS', '접속 Cable', '할당 용량', '실 사용 용량(AP / DB 파일)', '기타 용량 (관리)', '여유 용량', '월별 증가량', '접속방법', '연결 Channel Path 수', 'Path 이중화 솔루션',
            'NW장비-1', 'NW장비-2', 'NW장비-3', 'NW장비-4', 'SAN스위치-1', 'SAN스위치-2', 'SAN스위치-3', 'SAN스위치-4', 'SAN스위치-5', 'SAN스위치-6', 'SAN스위치-7', 'SAN스위치-8',
        ]);
        columnRow.eachCell((cell, number) => {
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' },
                font: { name: '맑은 고딕', family: 4, size: 12, bold: true }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getCell(cell._address).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFECECEC' }
            };

            if ((number < 15 || number > 18) && (number < 45 || number > 88))
                worksheet.mergeCells(cell.row, cell.col, cell.row - 1, cell.col);
        });




        // column key 설정 
        worksheet.columns = [
            { key: "basic_Name", width: 30 },
            { key: "basic_Status", width: 30 },
            { key: "basic_ReceiveDate", width: 30 },
            { key: "basic_RegDate", width: 30 },
            { key: "basic_ItemLevel", width: 30 },
            { key: "basic_ReceiveYears", width: 30 },
            { key: "basic_Usage", width: 30 },
            { key: "basic_OwnerCompanyName", width: 30 },
            { key: "basic_OwnDepartment", width: 30 },
            { key: "basic_OperationDepartment", width: 30 },
            { key: "basic_SiteManager", width: 30 },
            { key: "basic_DiscardDate", width: 30 },
            { key: "basic_OverUsedYear", width: 30 },
            { key: "basic_Memo", width: 30 },
            { key: "manage_SuperviseManager", width: 30 },
            { key: "manage_OperationManager", width: 30 },
            { key: "position_InstallRegion", width: 30 },
            { key: "position_RackDetailPosition", width: 30 },
            { key: "maintenance_ProvideCompanyName", width: 30 },
            { key: "maintenance_WarrantyMonth", width: 30 },
            { key: "maintenance_WarrantyExpiredDate", width: 30 },
            { key: "maintenance_MaintenanceCompanyName", width: 30 },
            { key: "maintenance_EOSDate", width: 30 },
            { key: "maintenance_EOLDate", width: 30 },
            { key: "maintenance_EOSL", width: 30 },
            { key: "maintenance_EOSLDate", width: 30 },
            { key: "maintenance_MaintenanceContract", width: 30 },
            { key: "maintenance_MaintenanceBeginDate", width: 30 },
            { key: "maintenance_MaintenanceEndDate", width: 30 },
            { key: "hW_ModelName", width: 30 },
            { key: "hW_Company", width: 30 },
            { key: "hW_CacheMemory", width: 30 },
            { key: "hW_SerialNumber", width: 30 },
            { key: "hW_DiskType", width: 30 },
            { key: "hW_ControllerFirmwareVersion", width: 30 },
            { key: "hW_TotalPhysicalVolume", width: 30 },
            { key: "hW_TotalUsableVolume", width: 30 },
            { key: "hW_LogicalVolumeGB", width: 30 },
            { key: "hW_FreeVolumeGB", width: 30 },
            { key: "hW_MultiPath", width: 30 },
            { key: "hW_MultiPathPropertyName", width: 30 },
            { key: "hW_AvailableVolume", width: 30 },
            { key: "hW_GivenVolumeGB", width: 30 },
            { key: "hW_GivenRate", width: 30 },
            { key: "dual_DualUse", width: 30 },
            { key: "dual_DualType", width: 30 },
            { key: "dual_BoxDualUse", width: 30 },
            { key: "dual_BoxDualDiskEquipmentName", width: 30 },
            { key: "dual_BoxDualSolutionName", width: 30 },
            { key: "dual_ControllerDualUse", width: 30 },
            { key: "dual_PowerDualUse", width: 30 },
            { key: "dual_PDUDualUse", width: 30 },
            { key: "dual_RackPowerDualUse", width: 30 },
            { key: "dual_InternalCopySWUse", width: 30 },
            { key: "dual_StorageCopyUse", width: 30 },
            { key: "dual_StorageCopyType", width: 30 },
            { key: "volume_RegDate", width: 30 },
            { key: "volume_DiskType", width: 30 },
            { key: "volume_EachDiskVolume", width: 30 },
            { key: "volume_DiskCount", width: 30 },
            { key: "volume_PhysicalVolume", width: 30 },
            { key: "volume_UsableVolume", width: 30 },
            { key: "volume_RaidSystem", width: 30 },
            { key: "extra_DiskType", width: 30 },
            { key: "extra_DiskVolume", width: 30 },
            { key: "extra_DiskCount", width: 30 },
            { key: "iP_IPType", width: 30 },
            { key: "iP_IPAddress", width: 30 },
            { key: "iP_NetworkSpeed", width: 30 },
            { key: "port_TotalPortCount", width: 30 },
            { key: "port_UsePortCount", width: 30 },
            { key: "port_LinkedSanSwitch", width: 30 },
            { key: "port_ReceiveDate", width: 30 },
            { key: "port_Count", width: 30 },
            { key: "connect_ServerName", width: 30 },
            { key: "connect_Usage", width: 30 },
            { key: "connect_ServiceLevel", width: 30 },
            { key: "connect_ModelName", width: 30 },
            { key: "connect_OS", width: 30 },
            { key: "connect_Cable", width: 30 },
            { key: "connect_GivenVolume", width: 30 },
            { key: "connect_RealUseVolume", width: 30 },
            { key: "connect_EtcVolume", width: 30 },
            { key: "connect_FreeVolume", width: 30 },
            { key: "connect_MonthlyIncrease", width: 30 },
            { key: "connect_ConnectType", width: 30 },
            { key: "connect_ChannelPathCount", width: 30 },
            { key: "connect_PathDualSolution", width: 30 },
            { key: "connect_NWEquip_1", width: 30 },
            { key: "connect_NWEquip_2", width: 30 },
            { key: "connect_NWEquip_3", width: 30 },
            { key: "connect_NWEquip_4", width: 30 },
            { key: "connect_SanSwitch_1", width: 30 },
            { key: "connect_SanSwitch_2", width: 30 },
            { key: "connect_SanSwitch_3", width: 30 },
            { key: "connect_SanSwitch_4", width: 30 },
            { key: "connect_SanSwitch_5", width: 30 },
            { key: "connect_SanSwitch_6", width: 30 },
            { key: "connect_SanSwitch_7", width: 30 },
            { key: "connect_SanSwitch_8", width: 30 }
        ];


        if (itemData?.length > 0) {
            itemData.forEach(function (item, index) {
                worksheet.addRow({
                    basic_Name: item.basic_Name,
                    basic_Status: item.basic_Status,
                    basic_ReceiveDate: ExcelDownload.getDate(item.basic_ReceiveDate),
                    basic_RegDate: ExcelDownload.getDate(item.basic_RegDate),
                    basic_ItemLevel: item.basic_ItemLevel,
                    basic_ReceiveYears: item.basic_ReceiveYears,
                    basic_Usage: item.basic_Usage,
                    basic_OwnerCompanyName: item.basic_OwnerCompanyName,
                    basic_OwnDepartment: item.basic_OwnDepartment,
                    basic_OperationDepartment: item.basic_OperationDepartment,
                    basic_SiteManager: item.basic_SiteManager,
                    basic_DiscardDate: ExcelDownload.getDate(item.basic_DiscardDate),
                    basic_OverUsedYear: item.basic_OverUsedYear,
                    basic_Memo: item.basic_Memo,
                    manage_SuperviseManager: item.manage_SuperviseManager,
                    manage_OperationManager: item.manage_OperationManager,
                    position_InstallRegion: item.position_InstallRegion,
                    position_RackDetailPosition: item.position_RackDetailPosition,
                    maintenance_ProvideCompanyName: item.maintenance_ProvideCompanyName,
                    maintenance_WarrantyMonth: item.maintenance_WarrantyMonth,
                    maintenance_WarrantyExpiredDate: ExcelDownload.getDate(item.maintenance_WarrantyExpiredDate),
                    maintenance_MaintenanceCompanyName: item.maintenance_MaintenanceCompanyName,
                    maintenance_EOSDate: ExcelDownload.getDate(item.maintenance_EOSDate),
                    maintenance_EOLDate: ExcelDownload.getDate(item.maintenance_EOLDate),
                    maintenance_EOSL: item.maintenance_EOSL,
                    maintenance_EOSLDate: ExcelDownload.getDate(item.maintenance_EOSLDate),
                    maintenance_MaintenanceContract: item.maintenance_MaintenanceContract,
                    maintenance_MaintenanceBeginDate: ExcelDownload.getDate(item.maintenance_MaintenanceBeginDate),
                    maintenance_MaintenanceEndDate: ExcelDownload.getDate(item.maintenance_MaintenanceEndDate),
                    hW_ModelName: item.hW_ModelName,
                    hW_Company: item.hW_Company,
                    hW_CacheMemory: item.hW_CacheMemory,
                    hW_SerialNumber: item.hW_SerialNumber,
                    hW_DiskType: item.hW_DiskType,
                    hW_ControllerFirmwareVersion: item.hW_ControllerFirmwareVersion,
                    hW_TotalPhysicalVolume: item.hW_TotalPhysicalVolume,
                    hW_TotalUsableVolume: item.hW_TotalUsableVolume,
                    hW_LogicalVolumeGB: item.hW_LogicalVolumeGB,
                    hW_FreeVolumeGB: item.hW_FreeVolumeGB,
                    hW_MultiPath: item.hW_MultiPath,
                    hW_MultiPathPropertyName: item.hW_MultiPathPropertyName,
                    hW_AvailableVolume: item.hW_AvailableVolume,
                    hW_GivenVolumeGB: item.hW_GivenVolumeGB,
                    hW_GivenRate: item.hW_GivenRate,
                    dual_DualUse: item.dual_DualUse,
                    dual_DualType: item.dual_DualType,
                    dual_BoxDualUse: item.dual_BoxDualUse,
                    dual_BoxDualDiskEquipmentName: item.dual_BoxDualDiskEquipmentName,
                    dual_BoxDualSolutionName: item.dual_BoxDualSolutionName,
                    dual_ControllerDualUse: item.dual_ControllerDualUse,
                    dual_PowerDualUse: item.dual_PowerDualUse,
                    dual_PDUDualUse: item.dual_PDUDualUse,
                    dual_RackPowerDualUse: item.dual_RackPowerDualUse,
                    dual_InternalCopySWUse: item.dual_InternalCopySWUse,
                    dual_StorageCopyUse: item.dual_StorageCopyUse,
                    dual_StorageCopyType: item.dual_StorageCopyType,
                    volume_RegDate: ExcelDownload.getDate(item.volume_RegDate),
                    volume_DiskType: item.volume_DiskType,
                    volume_EachDiskVolume: item.volume_EachDiskVolume,
                    volume_DiskCount: item.volume_DiskCount,
                    volume_PhysicalVolume: item.volume_PhysicalVolume,
                    volume_UsableVolume: item.volume_UsableVolume,
                    volume_RaidSystem: item.volume_RaidSystem,
                    extra_DiskType: item.extra_DiskType,
                    extra_DiskVolume: item.extra_DiskVolume,
                    extra_DiskCount: item.extra_DiskCount,
                    iP_IPType: item.iP_IPType,
                    iP_IPAddress: item.iP_IPAddress,
                    iP_NetworkSpeed: item.iP_NetworkSpeed,
                    port_TotalPortCount: item.port_TotalPortCount,
                    port_UsePortCount: item.port_UsePortCount,
                    port_LinkedSanSwitch: item.port_LinkedSanSwitch,
                    port_ReceiveDate: ExcelDownload.getDate(item.port_ReceiveDate),
                    port_Count: item.port_Count,
                    connect_ServerName: item.connect_ServerName,
                    connect_Usage: item.connect_Usage,
                    connect_ServiceLevel: item.connect_ServiceLevel,
                    connect_ModelName: item.connect_ModelName,
                    connect_OS: item.connect_OS,
                    connect_Cable: item.connect_Cable,
                    connect_GivenVolume: item.connect_GivenVolume,
                    connect_RealUseVolume: item.connect_RealUseVolume,
                    connect_EtcVolume: item.connect_EtcVolume,
                    connect_FreeVolume: item.connect_FreeVolume,
                    connect_MonthlyIncrease: item.connect_MonthlyIncrease,
                    connect_ConnectType: item.connect_ConnectType,
                    connect_ChannelPathCount: item.connect_ChannelPathCount,
                    connect_PathDualSolution: item.connect_PathDualSolution,
                    connect_NWEquip_1: item.connect_NWEquip_1,
                    connect_NWEquip_2: item.connect_NWEquip_2,
                    connect_NWEquip_3: item.connect_NWEquip_3,
                    connect_NWEquip_4: item.connect_NWEquip_4,
                    connect_SanSwitch_1: item.connect_SanSwitch_1,
                    connect_SanSwitch_2: item.connect_SanSwitch_2,
                    connect_SanSwitch_3: item.connect_SanSwitch_3,
                    connect_SanSwitch_4: item.connect_SanSwitch_4,
                    connect_SanSwitch_5: item.connect_SanSwitch_5,
                    connect_SanSwitch_6: item.connect_SanSwitch_6,
                    connect_SanSwitch_7: item.connect_SanSwitch_7,
                    connect_SanSwitch_8: item.connect_SanSwitch_8

                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }


    }

    static getDate(date) {
        if (!date) {
            return "";
        }

        let index = date.indexOf('T');

        if (index < 0) {
            index = date.indexOf(' ');

            if (index < 0) {
                return date;
            }
        }

        return date.substring(0, index);
    }

    static getMakeDateTime(dateTime) {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let strDate = year + '-' + month + '-' + day;
        return strDate;
    }

    static getMakeTime(dateTime) {
        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = hour + ':' + min + ':' + sec;
        return strDate;
    }
}