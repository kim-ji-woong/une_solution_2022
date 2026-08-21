using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.IDAL
{
    public interface IDelete
    {
        bool DeleteAnomalyDetection(int id, out string strErrorMessage);
        bool DeleteAnomalyDetection(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

        bool DeleteAnomalyDetectionDetail(int id, out string strErrorMessage);
        bool DeleteAnomalyDetectionDetail(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
