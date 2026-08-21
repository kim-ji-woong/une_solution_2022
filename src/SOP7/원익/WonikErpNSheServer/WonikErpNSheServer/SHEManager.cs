using Dashboard.Model;
using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WonikErpNSheServer
{
    public class SHEManager
    {
        private DirectDBManager m_sheDBManager = null;
        private Dictionary<int, int> m_dicCampusIDs = new Dictionary<int, int>();
        private Dictionary<int, int> m_dicWorkerIDs = new Dictionary<int, int>();

        public Logger Logger { get; set; }

        public SHEManager(DirectDBManager sheDBManager)
        {
            m_sheDBManager = sheDBManager;

            Init();

            this.Logger = Logger.Instance.Clone("LOG_SHE");
        }

        private void Init()
        {
            // 캠퍼스 ID 초기화 (CAP_SEQ - BuildingGroupID)
            m_dicCampusIDs[111] = (int)ID.CampusID.H;       // 캠퍼스 H
            m_dicCampusIDs[110] = (int)ID.CampusID.A;       // 캠퍼스 A
            m_dicCampusIDs[112] = (int)ID.CampusID.C;       // 캠퍼스 C
            m_dicCampusIDs[113] = (int)ID.CampusID.V;       // 캠퍼스 V
            m_dicCampusIDs[164] = (int)ID.CampusID.S;       // 캠퍼스 S




            // 작업종류 초기화
            m_dicWorkerIDs[22] = (int)WorkPermit.Worker_Type.Common;         // 공통
            m_dicWorkerIDs[109] = (int)WorkPermit.Worker_Type.Fire;          // 화기
            m_dicWorkerIDs[115] = (int)WorkPermit.Worker_Type.High;          // 고소
            m_dicWorkerIDs[122] = (int)WorkPermit.Worker_Type.Closeness;     // 밀폐
            m_dicWorkerIDs[123] = (int)WorkPermit.Worker_Type.Blackout;       // 정전
            m_dicWorkerIDs[124] = (int)WorkPermit.Worker_Type.Heavy;          // 중장비
            m_dicWorkerIDs[195] = (int)WorkPermit.Worker_Type.Normal;         // 일반
            m_dicWorkerIDs[131] = (int)WorkPermit.Worker_Type.Excavation;     // 굴착
            m_dicWorkerIDs[132] = (int)WorkPermit.Worker_Type.Radiation;      // 방사선
        }


        public List<WorkPermitData> GetSHEWorkPermit(DateTime dtDate, out string strErrorMessage)
        {
            strErrorMessage = "";
            List<WorkPermitData> workPermits = null;
            
            if (dtDate == null)
                dtDate = DateTime.Today;

            string strSQL = string.Format("Select SW_CD, CAP_SEQ, SW_DATE From VW_WORKPERMIT Where SW_DATE ='{0}'", dtDate.ToString("yyyy-MM-dd"));
            //string strSQL = string.Format("Select SW_CD, CAP_SEQ, SW_DATE From VW_WORKPERMIT");

            ArrayList arrResult = m_sheDBManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = "1. GetWorkPermit Error (VW_WORKPERMIT 테이블을 조회 할 수 없습니다.)";
                return null;
            }

            workPermits = new List<WorkPermitData>();

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount - 2; i += 3)
            {
                string strSW_CD = WebDBManager.GetStringField(arrResult[i].ToString());
                int nCAP_SEQ = WebDBManager.GetIntField(arrResult[i + 1].ToString(), 0);
                string strSW_DATE = WebDBManager.GetStringField(arrResult[i + 2].ToString());

                WorkPermitData permitData = new WorkPermitData();
                permitData.SW_CD = strSW_CD;
                permitData.CAP_SEQ = nCAP_SEQ;
                permitData.SW_DATE = strSW_DATE;

                // 캠퍼스 ID 매칭
                if (m_dicCampusIDs.ContainsKey(nCAP_SEQ))
                    permitData.BuildingGroupID = m_dicCampusIDs[nCAP_SEQ];
                else
                    continue;

                workPermits.Add(permitData);
            }


            string strSW_CDs = null;

            // 해당 작업의 종류 조회
            foreach (WorkPermitData data in workPermits)
            {
                if (strSW_CDs == null)
                    strSW_CDs = data.SW_CD;
                else
                    strSW_CDs += "," + data.SW_CD;
            }

            if (strSW_CDs != null && strSW_CDs != "")
            {
                strSQL = string.Format("Select SW_CD, SWA_SEQ From VW_WORKPERMIT_ADM Where SW_CD in ({0})", strSW_CDs);

                arrResult = m_sheDBManager.GetResultData(strSQL);
                if (arrResult == null)
                {
                    strErrorMessage = "2. GetWorkPermit Error (VW_WORKPERMIT_ADM 테이블을 조회 할 수 없습니다.)";
                    return null;
                }

                nCount = arrResult.Count;

                for (int i = 0; i < nCount - 1; i += 2)
                {
                    string strSW_CD = WebDBManager.GetStringField(arrResult[i].ToString());
                    int nSWA_SEQ = WebDBManager.GetIntField(arrResult[i + 1].ToString(), 0);

                    if (m_dicWorkerIDs.ContainsKey(nSWA_SEQ))
                    {
                        int nWorkerID = m_dicWorkerIDs[nSWA_SEQ];

                        foreach (WorkPermitData data in workPermits)
                        {
                            if (data.SW_CD == strSW_CD)
                            {
                                if (data.WorkerTypes == null)
                                    data.WorkerTypes = new List<int>();

                                data.WorkerTypes.Add(nWorkerID);
                                break;
                            }
                        }
                    }
                }
            }

            return workPermits;
        }
    }
}
