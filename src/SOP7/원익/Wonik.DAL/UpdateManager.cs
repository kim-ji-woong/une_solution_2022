using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;
using Wonik.IDAL;
using Wonik.Model;

namespace Wonik.DAL
{
    public class UpdateManager : QueryManager, IUpdate
    {
        private DataManager m_dataManager = null;
        //private WebDBManager m_dbManager = null;

        public UpdateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public bool UpdateVehicleSpeedDetection(VehicleSpeedDetection obj, out string strErrorMessage)
        {
            Dictionary<VehicleSpeedDetection.Fields, object> dicSets = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicSets[VehicleSpeedDetection.Fields.DetectionTime] = obj.DetectionTime;
            dicSets[VehicleSpeedDetection.Fields.SensorID] = obj.SensorID;
            dicSets[VehicleSpeedDetection.Fields.Speed] = obj.Speed;
            // CarNo / DiffSeconds 는 일부러 제외한다. 감지 로직이 만드는 객체에는 이 값들이 없으므로
            // 여기에 넣으면 LPR 연동으로 채워둔 값을 덮어써 지워버린다.
            // 이 두 값만 갱신할 때는 UpdateVehicleSpeedDetectionCarNo 를 쓴다.

            Dictionary<VehicleSpeedDetection.Fields, object> dicConditions = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicConditions[VehicleSpeedDetection.Fields.ID] = obj.ID;

            return UpdateVehicleSpeedDetection(dicSets, dicConditions, null, out strErrorMessage);
        }

        /// <summary>
        /// 지정한 과속 기록의 차량번호(CarNo)와 LPR 시각차(DiffSeconds)만 갱신한다.
        /// 다른 컬럼은 건드리지 않는다.
        /// </summary>
        /// <param name="dDiffSeconds">
        /// DetectionTime - LPR 이벤트 시각 (초). 양수면 DB 가 늦고, 음수면 DB 가 빠르다.
        /// </param>
        public bool UpdateVehicleSpeedDetectionCarNo(int nID, string strCarNo, double? dDiffSeconds, out string strErrorMessage)
        {
            Dictionary<VehicleSpeedDetection.Fields, object> dicSets = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicSets[VehicleSpeedDetection.Fields.CarNo] = strCarNo;
            dicSets[VehicleSpeedDetection.Fields.DiffSeconds] = dDiffSeconds;

            Dictionary<VehicleSpeedDetection.Fields, object> dicConditions = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicConditions[VehicleSpeedDetection.Fields.ID] = nID;

            return UpdateVehicleSpeedDetection(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateVehicleSpeedDetection(Dictionary<VehicleSpeedDetection.Fields, object> dicSets, Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<VehicleSpeedDetection.Fields>(ref strSets, dicSets, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<VehicleSpeedDetection.Fields>(ref strCondition, dicConditions, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(VehicleSpeedDetection.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
        {
            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

            if (m_dbManager.GetResultData(strSQL) == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return false;
            }

            strErrorMessage = null;
            return true;
        }
    }
}
