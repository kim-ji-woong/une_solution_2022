using Airbase20.BLL.Models;
using Airbase20.Model;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Airbase20.BLL
{
    public class ProcessManager
    {
        private Airbase20.IDAL.IDataManager m_dataManager = null;

        public ProcessManager(Airbase20.IDAL.IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseRelay GetRelay(int nID)
        {
            string strErrorMessage = "";

            ResponseRelay response = new ResponseRelay();

            Relay relay = m_dataManager.GetSelectManager().SelectRelay(nID, out strErrorMessage);
            if (relay == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.Relay = relay;
            response.Success = true;
            return response;
        }

        public ResponseRelayList GetRelayList()
        {
            string strErrorMessage = "";

            ResponseRelayList response = new ResponseRelayList();

            List<Relay> relays = m_dataManager.GetSelectManager().SelectRelays(null, null, out strErrorMessage);
            if (relays == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.RelayList = relays;
            response.Success = true;
            return response;
        }

        public ResponseSwitchDetail GetSwitchDetail(int nID)
        {
            string strErrorMessage = "";

            ResponseSwitchDetail response = new ResponseSwitchDetail();

            SwitchDetail switchDetail = m_dataManager.GetSelectManager().SelectSwitchDetail(nID, out strErrorMessage);
            if (switchDetail == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            SwitchDetailData detailData = new SwitchDetailData(switchDetail);

            response.SwitchDetail = detailData;
            response.Success = true;
            return response;
        }

        public ResponseSwitchDetailList GetSwitchDetailList()
        {
            string strErrorMessage = "";

            ResponseSwitchDetailList response = new ResponseSwitchDetailList();

            List<SwitchDetail> switchDetails = m_dataManager.GetSelectManager().SelectSwitchDetails(null, null, out strErrorMessage);
            if (switchDetails == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            List<SwitchDetailData> switchDetailDatas = new List<SwitchDetailData>();

            foreach (SwitchDetail switchDetail in switchDetails)
            {
                SwitchDetailData detailData = new SwitchDetailData(switchDetail);
                switchDetailDatas.Add(detailData);
            }

            response.SwitchDetailList = switchDetailDatas;
            response.Success = true;
            return response;
        }


        public ResponsePeckPower GetPeckPower(int nID)
        {
            string strErrorMessage = "";

            ResponsePeckPower response = new ResponsePeckPower();

            PeckPower peckPower = m_dataManager.GetSelectManager().SelectPeckPower(nID, out strErrorMessage);
            if (peckPower == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.PeckPower = peckPower;
            response.Success = true;
            return response;
        }

        public ResponsePeckPowerList GetPeckPowerList()
        {
            string strErrorMessage = "";

            ResponsePeckPowerList response = new ResponsePeckPowerList();

            List<PeckPower> peckPowers = m_dataManager.GetSelectManager().SelectPeckPowers(null, null, out strErrorMessage);
            if (peckPowers == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.PeckPowerList = peckPowers;
            response.Success = true;
            return response;
        }


        public ResponseAlarmList GetAlarmList()
        {
            string strErrorMessage = "";

            ResponseAlarmList response = new ResponseAlarmList();

            string strAdditionalConditions = string.Format("{0}.{1} = 1 or {0}.{2} = 1 or {0}.{3} = 1 or {0}.{4} = 1 ",
                SwitchDetail.TableName, SwitchDetail.Fields.FI_Auto_A, SwitchDetail.Fields.FI_Auto_B, SwitchDetail.Fields.FI_Auto_C, SwitchDetail.Fields.FI_Auto_N);

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSwitchSwitchDetail(strAdditionalConditions, out strErrorMessage);

            if (arrDatas == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            int nDataCount = arrDatas.Count;

            List<AlarmData> alarmList = new List<AlarmData>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Switch && arrDatas[i + 1] is SwitchDetail)
                {
                    Switch _switch = (Switch)arrDatas[i];
                    SwitchDetail switchDetail = (SwitchDetail)arrDatas[i + 1];

                    AlarmData alarmData = new AlarmData(switchDetail);
                    alarmData.SwitchName = _switch.Name;
                    alarmList.Add(alarmData);
                }
            }

            response.AlarmList = alarmList;
            response.Success = true;
            return response;
        }






        public ResponsePowerResult GetPowerResult(int nID)
        {
            string strErrorMessage = "";

            ResponsePowerResult response = new ResponsePowerResult();
            response.UseTodayPower = 0;
            response.UseWeekPower = 0;
            response.UseMonthPower = 0;
            response.UseYearPower = 0;

            DateTime dtToday = DateTime.Today;
            DateTime dtWeek = DateTime.Today.AddDays(-6);

            DateTime dtMonthStart = new DateTime(dtToday.Year, dtToday.Month, 1);
            int nEnd = DateTime.DaysInMonth(dtToday.Year, dtToday.Month);
            DateTime dtMonthEnd = new DateTime(dtToday.Year, dtToday.Month, nEnd);

            DateTime dtYear = DateTime.Today.AddYears(-1);
            DateTime dtYearStart = new DateTime(dtToday.Year, 1, 1);
            DateTime dtYearEnd = new DateTime(dtToday.Year, 12, 31);

            string strAdditionalConditions = string.Format("{0} = {1} AND {2} = '{3}'",
                RelayHistory.Fields.RelayID, nID, RelayHistory.Fields.Date, dtToday.ToString("yyyy-MM-dd HH:mm:ss"));

            List<RelayHistory> relayHistories = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strAdditionalConditions, out strErrorMessage);
            if (relayHistories == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            foreach (RelayHistory history in relayHistories)
            {
                if (history.ActivePowerTotal.HasValue)
                    response.UseTodayPower += history.ActivePowerTotal.Value;
            }

            strAdditionalConditions = string.Format("{0} = {1} AND {2} >= '{3}'",
                RelayHistory.Fields.RelayID, nID, RelayHistory.Fields.Date, dtWeek.ToString("yyyy-MM-dd HH:mm:ss"));

            relayHistories = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strAdditionalConditions, out strErrorMessage);
            if (relayHistories == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            foreach (RelayHistory history in relayHistories)
            {
                if (history.ActivePowerTotal.HasValue)
                    response.UseWeekPower += history.ActivePowerTotal.Value;
            }

            strAdditionalConditions = string.Format("{0} = {1} AND {2} >= '{3}'",
                RelayHistory.Fields.RelayID, nID, RelayHistory.Fields.Date, dtMonthStart.ToString("yyyy-MM-dd HH:mm:ss"));

            relayHistories = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strAdditionalConditions, out strErrorMessage);
            if (relayHistories == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            foreach (RelayHistory history in relayHistories)
            {
                if (history.ActivePowerTotal.HasValue)
                    response.UseMonthPower += history.ActivePowerTotal.Value;
            }

            strAdditionalConditions = string.Format("{0} = {1} AND {2} >= '{3}'",
                RelayHistory.Fields.RelayID, nID, RelayHistory.Fields.Date, dtYearStart.ToString("yyyy-MM-dd HH:mm:ss"));

            relayHistories = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strAdditionalConditions, out strErrorMessage);
            if (relayHistories == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            foreach (RelayHistory history in relayHistories)
            {
                if (history.ActivePowerTotal.HasValue)
                    response.UseYearPower += history.ActivePowerTotal.Value;
            }

            response.Success = true;
            return response;
        }






    }
}
