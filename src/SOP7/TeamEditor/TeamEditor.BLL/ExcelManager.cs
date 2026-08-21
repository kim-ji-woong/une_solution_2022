//using SDMS.IDAL;
using TeamEditor.BLL.Excel.Reader;
using TeamEditor.BLL.Excel.Writer;

namespace TeamEditor.BLL
{
    public enum DataMode { None = 0, FacilityInfo = 1, BuildingData, BuildingGroupData, RegularTeamData };

    public class ExcelManager
    {
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private ProcessManager m_processManager = null;

        public ExcelManager(TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager, ProcessManager processManager)
        {
            this.m_teamDataManager = teamDataManager;
            this.m_sopDataManager = sopDataManager;
            this.m_processManager = processManager;
        }
                
        public BLL.Models.Response.ResponseExcelInfo UploadRegularTeam(string strFilePath)
        {
            string strErrorMessage = "";

            BLL.Models.Response.ResponseExcelInfo result = new BLL.Models.Response.ResponseExcelInfo();
            ExcelReader reader = ExcelReader.MakeInstance(DataMode.RegularTeamData, strFilePath, m_teamDataManager, m_sopDataManager);

            if (reader == null)
            {
                result.Message = "ExcelReader 생성 실패";
                result.Success = false;
                return result;
            }

            if (!reader.Run(out strErrorMessage))
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Success = true;
            return result;
        }

        public TeamEditor.BLL.Models.Response.ResponseExcelInfo DownloadRegularTeam()
        {
            string strErrorMessage = "";

            BLL.Models.Response.ResponseExcelInfo result = new BLL.Models.Response.ResponseExcelInfo();
            ExcelWriter reader = ExcelWriter.MakeInstance(DataMode.RegularTeamData, m_teamDataManager);

            if (reader == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = reader.Run(out strErrorMessage);

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
