using Dashboard.Model;
using dnsDBUtil;
//using DBUtility2;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoulbrainWebSensorServer
{
    public class HrDataManager
    {
        private DirectDBManager m_HrDBManager = null;

        public HrDataManager(DirectDBManager hrDBManager)
        {
            m_HrDBManager = hrDBManager;

        }

        public List<HrTeamData> GetHrTeams(out string strErrorMessage)
        {
            strErrorMessage = "";
            List<HrTeamData> hrTeams = new List<HrTeamData>();

            string strSQL = "SELECT ENTER_CD, ENTER_NM, SDATE, ORG_CD, ORG_NM, PRIOR_ORG_CD, ORDER_SEQ, ORG_LEVEL, CHKDATE, CHKID FROM Team";
            ArrayList arrResult = m_HrDBManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = m_HrDBManager.LastErrorMessage;
                return null;
            }

            int nCount = arrResult.Count;
            DateTime dtNow = DateTime.Now;

            for (int i = 0; i < nCount; i += 10)
            {
                string strENTER_CD = WebDBManager.GetStringField(arrResult[i], "");
                string strENTER_NM = WebDBManager.GetStringField(arrResult[i + 1], "");
                string strSDATE = WebDBManager.GetStringField(arrResult[i + 2], "");
                string strORG_CD = WebDBManager.GetStringField(arrResult[i + 3], "");
                string strORG_NM = WebDBManager.GetStringField(arrResult[i + 4], "");
                string strPRIOR_ORG_CD = WebDBManager.GetStringField(arrResult[i + 5], "");
                string strORDER_SEQ = WebDBManager.GetStringField(arrResult[i + 6], "");
                string strORG_LEVEL = WebDBManager.GetStringField(arrResult[i + 7], "");
                DateTime dtCHKDATE = WebDBManager.GetDateTimeField(arrResult[i + 8], dtNow);
                string strCHKID = WebDBManager.GetStringField(arrResult[i + 9], "");

                HrTeamData hrTeam = new HrTeamData();
                hrTeam.ENTER_CD = strENTER_CD;
                hrTeam.ENTER_NM = strENTER_NM;
                hrTeam.SDATE = strSDATE;
                hrTeam.ORG_CD = strORG_CD;
                hrTeam.ORG_NM = strORG_NM;
                hrTeam.PRIOR_ORG_CD = strPRIOR_ORG_CD;
                hrTeam.ORDER_SEQ = strORDER_SEQ;
                hrTeam.ORG_LEVEL = strORG_LEVEL;
                hrTeam.CHKDATE = dtCHKDATE;
                hrTeam.CHKID = strCHKID;

                hrTeams.Add(hrTeam);
            }

            return hrTeams;
        }

        public List<HrMemberData> GetHrMembers(out string strErrorMessage)
        {
            strErrorMessage = "";
            List<HrMemberData> hrMembers = new List<HrMemberData>();

            string strSQL = "SELECT SABUN, NAME, ORG_CD, ORG_NM, STATUS_CD, STATUS_NM, JIKWEE_CD, JIKWEE_NM, JIKCHAK_CD, JIKCHAK_NM, ADDRESS_OT, ADDRESS_HP, ADDRESS_IM  FROM Member WHERE STATUS_NM NOT IN ('퇴직', '퇴사')";
            ArrayList arrResult = m_HrDBManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = m_HrDBManager.LastErrorMessage;
                return null;
            }

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount; i += 13)
            {
                string strSABUN = WebDBManager.GetStringField(arrResult[i], "");
                string strNAME = WebDBManager.GetStringField(arrResult[i + 1], "");
                string strORG_CD = WebDBManager.GetStringField(arrResult[i + 2], "");
                string strORG_NM = WebDBManager.GetStringField(arrResult[i + 3], "");
                string strSTATUS_CD = WebDBManager.GetStringField(arrResult[i + 4], "");
                string strSTATUS_NM = WebDBManager.GetStringField(arrResult[i + 5], "");
                string strJIKWEE_CD = WebDBManager.GetStringField(arrResult[i + 6], "");
                string strJIKWEE_NM = WebDBManager.GetStringField(arrResult[i + 7], "");
                string strJIKCHAK_CD = WebDBManager.GetStringField(arrResult[i + 8], "");
                string strJIKCHAK_NM = WebDBManager.GetStringField(arrResult[i + 9], "");
                string strADDRESS_OT = WebDBManager.GetStringField(arrResult[i + 10], "");
                string strADDRESS_HP = WebDBManager.GetStringField(arrResult[i + 11], "");
                string strADDRESS_IM = WebDBManager.GetStringField(arrResult[i + 12], "");

                HrMemberData hrMember = new HrMemberData();
                hrMember.SABUN = strSABUN;
                hrMember.NAME = strNAME;
                hrMember.ORG_CD = strORG_CD;
                hrMember.ORG_NM = strORG_NM;
                hrMember.STATUS_CD = strSTATUS_CD;
                hrMember.STATUS_NM = strSTATUS_NM;
                hrMember.JIKWEE_CD = strJIKWEE_CD;
                hrMember.JIKWEE_NM = strJIKWEE_NM;
                hrMember.JIKCHAK_CD = strJIKCHAK_CD;
                hrMember.JIKCHAK_NM = strJIKCHAK_NM;
                hrMember.ADDRESS_OT = strADDRESS_OT;
                hrMember.ADDRESS_HP = strADDRESS_HP;
                hrMember.ADDRESS_IM = strADDRESS_IM;

                hrMembers.Add(hrMember);
            }

            return hrMembers;
        }

    }
}
