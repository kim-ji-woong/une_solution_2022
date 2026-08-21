using System;
using System.Collections.Generic;
using GGH.Model.History;
using GGH.IDAL;

namespace GGH.BLL
{
    using Models.Response;

    public class EarthquakeManager
    {
        private IDataManager m_dataManager = null;

        public EarthquakeManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseEarthquakeHistory GetEarthquakeHistory(int quaterNo)
        {
            if (quaterNo < 1 || quaterNo > 4)
                return new ResponseEarthquakeHistory(false, "QuaterNo는 1~4 사이의 값이어야 합니다.");

            DateTime dtFirst, dtLast;
            DateTime dtNow = DateTime.Now;
            string strCondition = GetQuaterCondition(dtNow, quaterNo, out dtFirst, out dtLast);

            string strErrorMessage;
            List<Earthquake> earthquakeList = m_dataManager.GetSelectManager().SelectHistoryEarthquakes(null, strCondition, out strErrorMessage);

            if (earthquakeList == null)
                return new ResponseEarthquakeHistory(false, strErrorMessage);

            ResponseEarthquakeHistory response = new ResponseEarthquakeHistory(true, "");

            int historyCount = earthquakeList.Count;
            int index = 0;

            for (int i = dtFirst.Hour; i <= dtLast.Hour; i++)
            {
                int init = i == dtFirst.Hour ? dtFirst.Minute : 0;
                int last = i == dtLast.Hour ? dtLast.Minute : 59;

                for (int j = init; j <= last; j++)
                {
                    NullableEarthquake earthquake = GetNullableEarthquake(ref index, historyCount, dtNow, i, j, earthquakeList);
                    response.EarthquakeHistories.Add(earthquake);
                }
            }

            return response;
        }

        private NullableEarthquake GetNullableEarthquake(ref int index, int historyCount, DateTime dtNow, int hour, int min, List<Earthquake> earthquakeList)
        {
            if (index < historyCount)
            {
                Earthquake earthquake = earthquakeList[index];

                if (earthquake.TimeStamp.Hour == hour && earthquake.TimeStamp.Minute == min)
                {
                    index++;
                    return NullableEarthquake.ToNullableEarthquake(earthquake);
                }
            }

            NullableEarthquake _earthquake = new NullableEarthquake();
            _earthquake.Hpga = _earthquake.Tpga = _earthquake.Gal = null;
            _earthquake.Intensity = null;
            _earthquake.TimeStamp = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, hour, min, 0);

            return _earthquake;
        }

        public ResponseLastEarthquake GetLastEarthquake()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = (Select max({0}) from {1})", Earthquake.Fields.TimeStamp, Earthquake.TableName);
            List<Earthquake> earthquakeList = m_dataManager.GetSelectManager().SelectHistoryEarthquakes(null, strCondition, out strErrorMessage);

            if (earthquakeList == null)
                return new ResponseLastEarthquake(false, strErrorMessage);

            if (earthquakeList.Count == 0)
                return new ResponseLastEarthquake(false, "데이터가 존재하지 않습니다.");

            ResponseLastEarthquake response = new ResponseLastEarthquake(true, "");
            response.Earthquake = earthquakeList[0];
            return response;
        }

        private string GetQuaterCondition(DateTime dtNow, int quaterNo, out DateTime firstTime, out DateTime lastTime)
        {
            string strCondition = string.Format("{0} >= '{1}-{2:00}-{3:00} ", Earthquake.Fields.TimeStamp, dtNow.Year, dtNow.Month, dtNow.Day);

            if (quaterNo == 1)
            {
                strCondition += string.Format("00:00:00' and {0} <= '{1}-{2:00}-{3:00} 06:00:00'", Earthquake.Fields.TimeStamp, dtNow.Year, dtNow.Month, dtNow.Day);
                firstTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 0, 0, 0);
                lastTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 6, 0, 0);
            }
            else if (quaterNo == 2)
            {
                strCondition += string.Format("06:00:00' and {0} <= '{1}-{2:00}-{3:00} 12:00:00'", Earthquake.Fields.TimeStamp, dtNow.Year, dtNow.Month, dtNow.Day);
                firstTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 6, 0, 0);
                lastTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 12, 0, 0);
            }
            else if (quaterNo == 3)
            {
                strCondition += string.Format("12:00:00' and {0} <= '{1}-{2:00}-{3:00} 18:00:00'", Earthquake.Fields.TimeStamp, dtNow.Year, dtNow.Month, dtNow.Day);
                firstTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 12, 0, 0);
                lastTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 18, 0, 0);
            }
            else if (quaterNo == 4)
            {
                strCondition += string.Format("18:00:00' and {0} <= '{1}-{2:00}-{3:00} 23:59:59'", Earthquake.Fields.TimeStamp, dtNow.Year, dtNow.Month, dtNow.Day);
                firstTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 18, 0, 0);
                lastTime = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 23, 59, 59);
            }
            else
            {
                firstTime = lastTime = new DateTime();
            }

            strCondition += string.Format(" order by {0}", Earthquake.Fields.TimeStamp);
            return strCondition;
        }
    }
}
