using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WonikErpNSheServer
{
    public class DBBackup
    {
		//DirectDBManager m_dbManager = null;
        DirectDBManager m_dbBackup30 = null;
        DirectDBManager m_dbBackup31 = null;

        private Thread m_thread = null;
		private bool m_runThread = false;

        private string m_backupFilePath = "";
        private List<string> m_tables = new List<string>();

        private DateTime m_dtLast = new DateTime();

        int m_nThreadSleep = 1000 * 60 * 60;     // 1시간

        // GO 구분자 없이 전부 한 배치로 보내면 SQL Server가 연결을 끊는다. 이 행수마다 배치를 끊는다.
        private const int BATCH_ROW_COUNT = 1000;

        public Logger Logger { get; set; }

		public DBBackup(DirectDBManager dbBackup30, DirectDBManager dbBackup31, string backupFilePath)
		{
			this.m_dbBackup30 = dbBackup30;
            this.m_dbBackup31 = dbBackup31;

            this.Logger = Logger.Instance.Clone("LOG_Backup");

            m_backupFilePath = backupFilePath;
        }

		public void Start()
		{
			if (!this.m_runThread)
			{
                this.Logger.Write("DBBackup Start()");

                this.m_runThread = true;
				this.m_thread = new Thread(this.BackupThread);
				this.m_thread.Start();
			}
		}

		public void Stop()
		{
			if (this.m_runThread)
			{
                this.Logger.Write("DBBackup Stop()");

                this.m_runThread = false;
                m_thread.Abort();
            }
		}

		private void BackupThread()
		{
			while (this.m_runThread)
			{               
                try
                {
                    // 하루에 한번 실행
                    DateTime dtNow = DateTime.Today;
                    int nSubDay = dtNow.DayOfYear - m_dtLast.DayOfYear;

                    if (nSubDay == 0)
                    {
                        Thread.Sleep(m_nThreadSleep);
                        continue;
                    }

                    // 데이터 백업
                    DBExport(m_dbBackup30);
                    DBExport(m_dbBackup31);
                    FileDelete();

#if BACKUP
                    // DB 백업 직후 오래된 로그 파일 정리.
                    // 기동 직후 첫 백업(즉시 실행) 시 1회, 이후 하루 1회 백업 직후에 수행된다.
                    DeleteOldLogFiles();
#endif

                    m_dtLast = DateTime.Today;
                }
                catch (Exception ex)
                {
                    this.Logger.Write("[ERROR] BackupThread() Exception : " + ex.Message);
                }
            }
		}

		private void DBExport(DirectDBManager dbBackup)
		{
			LoadTables(dbBackup);
			MakeSql(dbBackup);
		}

		private void LoadTables(DirectDBManager dbBackup)
		{
			try
			{
				m_tables.Clear();
				// INFORMATION_SCHEMA.TABLES는 뷰도 함께 반환하므로 실제 테이블만 걸러낸다.
				ArrayList arrResult = dbBackup.GetResultData("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
				if (arrResult == null) return;

				for (int i = 0; i < arrResult.Count; i++)
				{
					string tableName = WebDBManager.GetStringField(arrResult[i]);
					if (tableName == "sysdiagrams")
						continue;

					m_tables.Add(tableName);
				}
			}
			catch (Exception ex)
			{
				this.Logger.Write("[ERROR] LoadTables() : " + ex.Message);
			}
		}

        private void MakeSql(DirectDBManager dbBackup)
        {
            // 백업 도중 실패한 파일이 정상 백업본으로 오인되지 않도록 임시 파일에 먼저 쓴 뒤 이름을 바꾼다.
            string strFilePath = m_backupFilePath + DateTime.Now.ToString("yyyy-MM-dd") + "_" + dbBackup.DbName + ".sql";
            string strTempPath = strFilePath + ".tmp";

            try
            {
                // sqlcmd가 BOM으로 인코딩을 자동 인식하도록 UTF-16LE로 기록한다. (한글 데이터 보존)
                using (StreamWriter sw = new StreamWriter(strTempPath, false, Encoding.Unicode))
                {
                    sw.WriteLine("EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'");
                    sw.WriteLine("GO");

                    foreach (string strTableName in m_tables)
                    {
                        sw.WriteLine("DELETE FROM " + strTableName + ";");
                        sw.WriteLine("GO");

                        ArrayList arrColumnInfo = dbBackup.GetResultData(
                            "SELECT column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME ='" + strTableName + "'");

                        if (arrColumnInfo == null || arrColumnInfo.Count == 0)
                            continue;

                        Dictionary<string, string> dicTableInfo = new Dictionary<string, string>();

                        for (int i = 0; i < arrColumnInfo.Count; i += 2)
                        {
                            string strColumnName = WebDBManager.GetStringField(arrColumnInfo[i]);
                            string strColumnType = WebDBManager.GetStringField(arrColumnInfo[i + 1]);

                            dicTableInfo.Add(strColumnName, strColumnType);
                        }

                        int nColumnCount = dicTableInfo.Count;

                        // SELECT와 INSERT가 같은 순서를 쓰도록 컬럼 목록을 한 번만 만든다.
                        string columns = string.Join(", ", dicTableInfo.Keys.Select(name => "[" + name + "]"));

                        ArrayList arrResult = dbBackup.GetResultData("SELECT " + columns + " FROM " + strTableName, 0);
                        if (arrResult == null || arrResult.Count == 0)
                            continue;

                        string strInsertPrefix = "INSERT INTO " + strTableName + " (" + columns + ") VALUES (";

                        // 행 단위로만 조립해서 바로 파일에 쓴다. (전체 DB를 메모리에 쌓지 않음)
                        StringBuilder sbRow = new StringBuilder();
                        int nBatchRows = 0;

                        for (int i = 0; i < arrResult.Count; i += nColumnCount)
                        {
                            int iCnt = 0;

                            sbRow.Clear();
                            sbRow.Append(strInsertPrefix);

                            for (int j = 0; j < nColumnCount; j++)
                            {
                                if (j > 0)
                                    sbRow.Append(",");
                                string dataKey = dicTableInfo.Keys.ElementAt(iCnt);
                                string dataType = dicTableInfo.Values.ElementAt(iCnt);
                                object value = null;
                                if (dataType.ToUpper() == "INT")
                                {
                                    VariousData<int> data = WebDBManager.GetIntField(arrResult[i + iCnt].ToString());
                                    if (data != null)
                                    {
                                        value = data.Data;

                                        // ParentID가 null 이면 최상위인데 int 타입의 기본값이 -1로 들어오다 보니 데이터가 잘못입력됨
                                        if (dataKey.ToUpper() == "PARENTID" && data.Data == -1)
                                        {
                                            value = null;
                                        }
                                    }
                                }
                                else if (dataType.ToUpper() == "DATETIME")
                                {
                                    VariousData<DateTime> date = WebDBManager.GetDateTimeField(arrResult[i + iCnt]);
                                    if (date != null)
                                    {
                                        value = Convert.ToDateTime(date.Data).ToString("yyyy-MM-dd HH:mm:ss");
                                    }
                                }
                                else if (dataType.ToUpper() == "BIT")
                                    value = WebDBManager.GetIntField(arrResult[i + iCnt].ToString(), -1);
                                else
                                    value = WebDBManager.GetStringField(arrResult[i + iCnt]);

                                if (value == null)
                                    sbRow.Append("NULL");
                                else
                                {
                                    if (dataType.ToUpper() == "INT" || dataType.ToUpper() == "FLOAT")
                                        sbRow.Append(value);
                                    else
                                        sbRow.Append(ToSqlLiteral(value.ToString(), dataType));
                                }
                                iCnt++;
                            }
                            sbRow.Append(");");

                            sw.WriteLine(sbRow.ToString());

                            nBatchRows++;
                            if (nBatchRows >= BATCH_ROW_COUNT)
                            {
                                sw.WriteLine("GO");
                                nBatchRows = 0;
                            }
                        }

                        if (nBatchRows > 0)
                            sw.WriteLine("GO");
                    }

                    sw.WriteLine("EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all'");
                    sw.WriteLine("GO");
                }

                if (File.Exists(strFilePath))
                    File.Delete(strFilePath);

                File.Move(strTempPath, strFilePath);

                this.Logger.Write("backup 완료 : " + strFilePath);
            }
            catch (Exception ex)
            {
                this.Logger.Write("[ERROR] MakeSql(" + dbBackup.DbName + ") : " + ex.Message);

                // 실패한 임시 파일은 남기지 않는다.
                try
                {
                    if (File.Exists(strTempPath))
                        File.Delete(strTempPath);
                }
                catch { }
            }
        }

        /// <summary>
        /// 문자열을 SQL 리터럴로 변환한다.
        /// 작은따옴표는 두 개로 늘려 이스케이프하고, 유니코드 타입은 N 접두사를 붙인다.
        /// </summary>
        private string ToSqlLiteral(string strValue, string strDataType)
        {
            string strEscaped = strValue.Replace("'", "''");

            switch (strDataType.ToUpper())
            {
                case "NVARCHAR":
                case "NCHAR":
                case "NTEXT":
                    return "N'" + strEscaped + "'";

                default:
                    return "'" + strEscaped + "'";
            }
        }

        /// <summary>
        /// 한달 지난 파일 지우기
        /// </summary>
        private void FileDelete()
        {
            try
            {
                if (Directory.Exists(m_backupFilePath))
                {
                    DateTime dtNow = DateTime.Now;

                    List<string> delFiles = new List<string>();
                    DirectoryInfo dir = new DirectoryInfo(m_backupFilePath);
                    foreach (FileInfo item in dir.GetFiles())
                    {
                        DateTime dtFile = new DateTime();

                        string strName = item.Name;
                        strName = item.Name.Replace(".sql", "");

                        int nIdx = strName.IndexOf("_");
                        if (nIdx == -1)
                            continue;

                        string day = strName.Substring(0, nIdx);

                        if (DateTime.TryParse(day, out dtFile) && item.Extension == ".sql")
                        {
                            if ((dtNow - dtFile).TotalDays > 30)
                                delFiles.Add(item.FullName);
                        }
                    }

                    foreach (string item in delFiles)
                    {
                        File.Delete(item);
                    }
                }
            }
            catch (Exception ex)
            {
                this.Logger.Write("[ERROR] FileDelete() : " + ex.Message);
            }
        }

#if BACKUP
        /// <summary>
        /// App.config 에 지정된 로그 폴더들에서 보관기간(logLifeTime, 일)이 지난 파일을 삭제한다.
        /// - DeleteLogFolderCount : 삭제 대상 폴더 개수
        /// - DeleteLogFolder_1 ~ DeleteLogFolder_N : 각 폴더 경로
        /// - logLifeTime : 보관 기간(일). 파일의 마지막 수정 시각 기준으로 이보다 오래되면 삭제.
        /// BACKUP 심볼로 빌드된 경우에만 컴파일/실행된다.
        /// </summary>
        private void DeleteOldLogFiles()
        {
            try
            {
                // 삭제 대상 폴더 개수
                int nFolderCount = 0;
                int.TryParse(ConfigurationManager.AppSettings.Get("DeleteLogFolderCount"), out nFolderCount);
                if (nFolderCount <= 0)
                    return;

                // 보관 기간(일). 설정이 없거나 잘못되면 30일을 기본값으로 사용.
                double dLifeDays = 30;
                string strLifeTime = ConfigurationManager.AppSettings.Get("logLifeTime");
                if (string.IsNullOrEmpty(strLifeTime) || double.TryParse(strLifeTime, out dLifeDays) == false)
                    dLifeDays = 30;

                DateTime dtLimit = DateTime.Now.AddDays(-dLifeDays);

                for (int i = 1; i <= nFolderCount; i++)
                {
                    string strFolder = ConfigurationManager.AppSettings.Get("DeleteLogFolder_" + i);

                    if (string.IsNullOrEmpty(strFolder))
                        continue;

                    if (!Directory.Exists(strFolder))
                    {
                        this.Logger.Write("DeleteOldLogFiles: 폴더 없음, 건너뜀 - " + strFolder);
                        continue;
                    }

                    int nDeleted = DeleteOldFilesInFolder(strFolder, dtLimit);
                    this.Logger.Write("DeleteOldLogFiles: " + strFolder + " 에서 " + nDeleted + "개 파일 삭제 (기준 " + dtLimit.ToString("yyyy-MM-dd HH:mm:ss") + " 이전)");
                }
            }
            catch (Exception ex)
            {
                this.Logger.Write("[ERROR] DeleteOldLogFiles() : " + ex.Message);
            }
        }

        /// <summary>
        /// 지정 폴더(하위 폴더 포함)에서 마지막 수정 시각이 dtLimit 이전인 파일을 삭제하고 삭제 개수를 반환한다.
        /// </summary>
        private int DeleteOldFilesInFolder(string strFolder, DateTime dtLimit)
        {
            int nDeleted = 0;

            try
            {
                DirectoryInfo dir = new DirectoryInfo(strFolder);

                foreach (FileInfo item in dir.GetFiles("*", SearchOption.AllDirectories))
                {
                    try
                    {
                        if (item.LastWriteTime < dtLimit)
                        {
                            item.Delete();
                            nDeleted++;
                        }
                    }
                    catch (Exception exFile)
                    {
                        this.Logger.Write("[ERROR] DeleteOldFilesInFolder 파일 삭제 실패 (" + item.FullName + ") : " + exFile.Message);
                    }
                }
            }
            catch (Exception ex)
            {
                this.Logger.Write("[ERROR] DeleteOldFilesInFolder(" + strFolder + ") : " + ex.Message);
            }

            return nDeleted;
        }
#endif
    }
}
