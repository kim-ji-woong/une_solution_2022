using Hynix.BLL.Request;
using Hynix.BLL.Response;
using Hynix.IDAL;
using Hynix.Model;
using Hynix.Model.History;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hynix.BLL.Process
{
    public class AbnormalManager
    {
        private IDataManager m_dataManager = null;

        public AbnormalManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAbnormalHistory GetAbnormalHistory(RequestAbnormalHistory data)
        {
            string strErrorMessage = null;

            ResponseAbnormalHistory response = new ResponseAbnormalHistory();


            // .TODO: 테스트용 데이터
            response.WorkerName = "홍길동";
            response.TeamName = "부서 1팀";
            response.OfficeName = "근무처 1사";

            List<Abnormal> abnormals_temp = new List<Abnormal>();
            Abnormal abnormal = new Abnormal();
            abnormal.WorkerID = data.WorkerID;
            abnormal.EventHistroyID = 1;
            abnormal.Time = DateTime.Now.AddMinutes(1);
            abnormal.Memo = "출입문 태깅";
            abnormals_temp.Add(abnormal);

            abnormal = new Abnormal();
            abnormal.WorkerID = data.WorkerID;
            abnormal.EventHistroyID = 1;
            abnormal.Time = DateTime.Now.AddMinutes(2);
            abnormal.Memo = "1층 입실";
            abnormals_temp.Add(abnormal);

            abnormal = new Abnormal();
            abnormal.WorkerID = data.WorkerID;
            abnormal.EventHistroyID = 1;
            abnormal.Time = DateTime.Now.AddMinutes(2);
            abnormal.Memo = "1층 퇴실";
            abnormals_temp.Add(abnormal);

            abnormal = new Abnormal();
            abnormal.WorkerID = data.WorkerID;
            abnormal.EventHistroyID = 1;
            abnormal.Time = DateTime.Now.AddMinutes(2);
            abnormal.Memo = "2층 입실";
            abnormals_temp.Add(abnormal);

            response.AbnormalHistorys = abnormals_temp;

            response.Success = true;
            return response;



            try
            {
                Worker worker = m_dataManager.GetSelectManager().SelectHynixWorker(data.WorkerID, out strErrorMessage);
                if (worker == null)
                {
                    new ApplicationException($"SelectHynixWorker Error: {strErrorMessage}");
                }

                Dictionary<Event.Fields, object> dicConditions_Event = new Dictionary<Event.Fields, object>();
                dicConditions_Event[Event.Fields.WorkerID] = data.WorkerID;
                dicConditions_Event[Event.Fields.WorkerID] = data.Time;
                dicConditions_Event[Event.Fields.Type] = Event.Abnormal;

                List<Event> eventDatas = m_dataManager.GetSelectManager().SelectHynixEventHistroys(dicConditions_Event, null, out strErrorMessage);
                if (eventDatas == null)
                {
                    new ApplicationException($"SelectHynixEventHistroys Error: {strErrorMessage}");
                }
                else if (eventDatas.Count == 0)
                {
                    new ApplicationException($"Event 데이터가 존재하지 않습니다.");
                }

                Event eventData = eventDatas[0];

                Dictionary<Abnormal.Fields, object> dicConditions = new Dictionary<Abnormal.Fields, object>();
                dicConditions[Abnormal.Fields.WorkerID] = data.WorkerID;
                dicConditions[Abnormal.Fields.EventHistroyID] = eventData.EventHistroyID;

                List<Abnormal> abnormals = m_dataManager.GetSelectManager().SelectHynixAbnormalHistorys(dicConditions, null, out strErrorMessage);
                if (abnormals == null)
                {
                    new ApplicationException($"SelectHynixAbnormalHistorys Error: {strErrorMessage}");
                }

                response.WorkerName = worker.Name;
                response.TeamName = worker.TeamName;
                response.OfficeName = worker.OfficeName;

                response.AbnormalHistorys = abnormals;

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }
    }
}
