using VDS.IDAL;

namespace VDS.BLL
{
    using Models.Response;
    using Excel.Writer;
    using Excel.Reader;

    public class ExcelManager
    {
        private IDataManager m_dataManager = null;

        public ExcelManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExcelInfo DownloadITProperty(int dataCenterID, int userID)
        {
            int siteID;
            string strErrorMessage;
            
            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseExcelInfo(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(dataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseExcelInfo(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseExcelInfo(false, "허가되지 않은 VDC의 자산정보에 접근중입니다.");

            ExcelWriter writer = ExcelWriter.MakeInstance(ExcelWriter.Mode.ITProperty, m_dataManager, dataCenterID);

            if (writer == null)
                return new ResponseExcelInfo(false, "Excel 파일을 생성할 수 없습니다.");

            byte[] bytes = writer.Run(out strErrorMessage);

            if (bytes == null)
                return new ResponseExcelInfo(false, strErrorMessage);

            ResponseExcelInfo response = new ResponseExcelInfo(true, "");
            response.Bytes = bytes;
            return response;
        }

        public ResponseExcelInfo DownloadRacks(int dataCenterID, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseExcelInfo(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(dataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseExcelInfo(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseExcelInfo(false, "허가되지 않은 VDC의 Rack정보에 접근중입니다.");

            ExcelWriter writer = ExcelWriter.MakeInstance(ExcelWriter.Mode.Rack, m_dataManager, dataCenterID);

            if (writer == null)
                return new ResponseExcelInfo(false, "Excel 파일을 생성할 수 없습니다.");

            byte[] bytes = writer.Run(out strErrorMessage);

            if (bytes == null)
                return new ResponseExcelInfo(false, strErrorMessage);

            ResponseExcelInfo response = new ResponseExcelInfo(true, "");
            response.Bytes = bytes;
            return response;
        }

        public MessageResult UploadITProperty(string strFilePath, int nDataCenterID, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(nDataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "접근할 수 없는 VDC의 자산정보를 업로드하려고 시도하였습니다.");

            ExcelReader reader = ExcelReader.MakeInstance(ExcelWriter.Mode.ITProperty, strFilePath, m_dataManager, nDataCenterID);

            if (reader == null)
            {
                return new MessageResult(false, "Excel 파일을 읽을 수 없습니다.");
            }

            if (!reader.Run(out strErrorMessage))
            {
                return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        public MessageResult UploadITPropertyDetail(string strFilePath, int nDataCenterID, string strItemType, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(nDataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "접근할 수 없는 VDC의 자산 상세정보를 업로드하려고 시도하였습니다.");

            ExcelReader reader = ExcelReader.MakeInstance(GetDetailMode(strItemType), strFilePath, m_dataManager, nDataCenterID);

            if (reader == null)
            {
                return new MessageResult(false, "Excel 파일을 읽을 수 없습니다.");
            }

            if (!reader.Run(out strErrorMessage))
            {
                return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        private ExcelWriter.Mode GetDetailMode(string strItemType)
        {
            if (strItemType == "network")
                return ExcelWriter.Mode.ITPropertyDetail_Network;
            else if (strItemType == "security")
                return ExcelWriter.Mode.ITPropertyDetail_Security;
            else if (strItemType == "backup")
                return ExcelWriter.Mode.ITPropertyDetail_Backup;
            else if (strItemType == "server")
                return ExcelWriter.Mode.ITPropertyDetail_Server;
            else if (strItemType == "storage")
                return ExcelWriter.Mode.ITPropertyDetail_Storage;
            else if (strItemType == "box")
                return ExcelWriter.Mode.ITPropertyDetail_Box;
            else if (strItemType == "sanswitch")
                return ExcelWriter.Mode.ITPropertyDetail_SanSwitch;
            else if (strItemType == "etc")
                return ExcelWriter.Mode.ITPropertyDetail_Etc;

            return ExcelWriter.Mode.None;
        }
    }
}
