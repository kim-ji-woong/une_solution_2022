using System.Collections;
using System.Collections.Generic;
using GGH.IDAL;
using GGH.Model.Equipment;

namespace GGH.BLL
{
    using Models.Response;
    using Models.Request;

    public class EquipmentManager
    {
        private IDataManager m_dataManager = null;

        public EquipmentManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseEquipmentList GetFirstAidEquipmentList(int? siteID)
        {
            string strConditions = null;

            if (siteID != null)
            {
                strConditions = string.Format("{0} = {1}", FirstAidEquipment.Fields.SiteID, (int)siteID);
            }

            string strErrorMessage;
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinFirstAidEquipmentEquipmentType(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseEquipmentList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            ResponseEquipmentList response = new ResponseEquipmentList(true, "");

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is FirstAidEquipment && arrDatas[i + 1] is FirstAidEquipmentType)
                {
                    FirstAidEquipment equipment = (FirstAidEquipment)arrDatas[i];
                    FirstAidEquipmentType equipmentType = (FirstAidEquipmentType)arrDatas[i + 1];

                    if (equipmentType.EquipmentType == "완강기")
                        response.DescendingLifeLines.Add(equipment);
                    else if (equipmentType.EquipmentType == "심장제세동기")
                        response.Cardiacs.Add(equipment);
                    else if (equipmentType.EquipmentType == "인명구조기구")
                        response.SafetyEquipments.Add(equipment);
                }
            }

            return response;
        }

        public ResponseFirstAidEquipment GetNewEquipment(string strSensorType)
        {
            Dictionary<FirstAidEquipmentType.Fields, object> dicConditions = new Dictionary<FirstAidEquipmentType.Fields, object>();
            dicConditions[FirstAidEquipmentType.Fields.EquipmentTypeEng] = strSensorType;

            string strErrorMessage;
            List<FirstAidEquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectFirstAidEquipmentTypes(dicConditions, null, out strErrorMessage);

            if (equipmentTypes == null)
                return new ResponseFirstAidEquipment(false, strErrorMessage);

            if (equipmentTypes.Count == 0)
                return new ResponseFirstAidEquipment(false, string.Format("[{0}]에 해당하는 구급장비가 존재하지 않습니다.", strSensorType));

            FirstAidEquipment equipment = new FirstAidEquipment();
            equipment.ID = -1;
            equipment.EquipmentType = equipmentTypes[0].ID;
            equipment.EquipmentName = equipmentTypes[0].EquipmentType;
            equipment.ZoneID = -1;
            equipment.SiteID = -1;

            ResponseFirstAidEquipment response = new ResponseFirstAidEquipment(true, "");
            response.Equipment = equipment;
            return response;
        }

        public MessageResult DeleteSensors(List<RequestDeleteSensors.Sensor> sensors)
        {
            if (sensors.Count == 0)
                return new MessageResult(true, "");

            string strErrorMessage;
            List<FirstAidEquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectFirstAidEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return new MessageResult(false, strErrorMessage);

            Dictionary<string, FirstAidEquipmentType> dicEquipmentTypes = new Dictionary<string, FirstAidEquipmentType>();

            foreach (var equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.EquipmentTypeEng] = equipmentType;
            }

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
                return new MessageResult(false, "Database의 트랜잭션을 시작할 수 없습니다.");

            string strIDs = "";

            foreach (var sensor in sensors)
            {
                if (dicEquipmentTypes.ContainsKey(sensor.SensorType))
                {
                    if (strIDs.Length == 0)
                        strIDs = sensor.ID.ToString();
                    else
                        strIDs += "," + sensor.ID.ToString();
                }
            }

            if (strIDs.Length == 0)
            {
                // 삭제할 것이 없으니 Rollback한다.
                dataManager.BatchRollback();
                return new MessageResult(true, "");
            }

            string strCondition = string.Format("{0} in ({1})", FirstAidEquipment.Fields.ID, strIDs);

            if (dataManager.GetDeleteManager().DeleteFirstAidEquipment(null, strCondition, out strErrorMessage) == false)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, strErrorMessage);
            }
            else
            {
                if (UpdateDataManager.MakeDeleteData(dataManager, FirstAidEquipment.TableName, strCondition, out strErrorMessage) == false)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (dataManager.BatchCommit() == false)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, "Database 트랜잭션을 정상적으로 종료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }
    }
}
