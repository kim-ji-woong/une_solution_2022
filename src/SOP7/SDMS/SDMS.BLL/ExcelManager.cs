using SDMS.BLL.Excel.Reader;
using SDMS.BLL.Excel.Writer;
using SDMS.BLL.Models.Response;
using SDMS.IDAL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SDMS.BLL
{
    public enum DataMode { None = 0, FacilityInfo = 1, BuildingData, BuildingGroupData, RegularTeamData };

    public class ExcelManager
    {
        private IDataManager m_dataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private ProcessManager m_processManager = null;

        public ExcelManager(IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager, ProcessManager processManager)
        {
            this.m_dataManager = dataManager;
            this.m_teamDataManager = teamDataManager;
            this.m_sopDataManager = sopDataManager;
            this.m_processManager = processManager;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo UploadBuildingData(string strFilePath, int siteID)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelReader reader = ExcelReader.MakeInstance(DataMode.BuildingData, strFilePath, m_dataManager, m_teamDataManager, m_sopDataManager, siteID);

            if (reader == null)
            {
                result.Message = "ExcelReader 생성 실패";
                result.Success = false;
                return result;
            }

            if (!reader.Run(out strErrorMessage, siteID))
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo UploadBuildingGroupData(string strFilePath, int siteID)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelReader reader = ExcelReader.MakeInstance(DataMode.BuildingGroupData, strFilePath, m_dataManager, m_teamDataManager, m_sopDataManager, siteID);

            if (reader == null)
            {
                result.Message = "ExcelReader 생성 실패";
                result.Success = false;
                return result;
            }

            if (!reader.Run(out strErrorMessage, siteID))
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo UploadFacilityInfo(string strFilePath, int siteID)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelReader reader = ExcelReader.MakeInstance(DataMode.FacilityInfo, strFilePath, m_dataManager, m_teamDataManager, m_sopDataManager, siteID);

            if (reader == null)
            {
                result.Message = "ExcelReader 생성 실패";
                result.Success = false;
                return result;
            }

            if (!reader.Run(out strErrorMessage, siteID))
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo UploadRegularTeam(string strFilePath, int? siteID)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelReader reader = ExcelReader.MakeInstance(DataMode.RegularTeamData, strFilePath, m_dataManager, m_teamDataManager, m_sopDataManager, siteID);

            if (reader == null)
            {
                result.Message = "ExcelReader 생성 실패";
                result.Success = false;
                return result;
            }

            if (!reader.Run(out strErrorMessage, siteID))
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo DownloadBuildingData(List<int> siteIDs)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelWriter reader = ExcelWriter.MakeInstance(DataMode.BuildingData, m_dataManager, m_teamDataManager);

            if (reader == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = reader.Run(siteIDs, out strErrorMessage);

            if (bytes == null)
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Bytes = bytes;
            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo DownloadBuildingGroupData(List<int> siteIDs)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelWriter reader = ExcelWriter.MakeInstance(DataMode.BuildingGroupData, m_dataManager, m_teamDataManager);

            if (reader == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = reader.Run(siteIDs, out strErrorMessage);

            if (bytes == null)
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Bytes = bytes;
            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo DownloadFacilityInfo(List<int> siteIDs)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelWriter reader = ExcelWriter.MakeInstance(DataMode.FacilityInfo, m_dataManager, m_teamDataManager);

            if (reader == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = reader.Run(siteIDs, out strErrorMessage);

            if (bytes == null)
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Bytes = bytes;
            result.Success = true;
            return result;
        }

        public SOPManager.BLL.Models.Response.ResponseExcelInfo DownloadRegularTeam(List<int> siteIDs)
        {
            string strErrorMessage = "";

            SOPManager.BLL.Models.Response.ResponseExcelInfo result = new SOPManager.BLL.Models.Response.ResponseExcelInfo();
            ExcelWriter reader = ExcelWriter.MakeInstance(DataMode.RegularTeamData, m_dataManager, m_teamDataManager);

            if (reader == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = reader.Run(siteIDs, out strErrorMessage);

            if (bytes == null)
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Bytes = bytes;
            result.Success = true;
            return result;
        }
    }
}
