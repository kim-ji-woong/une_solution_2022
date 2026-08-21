using Hydrogen.Model.Anomaly;
using Hydrogen.Model.RiskAssess;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.IDAL
{
    public interface ISelect
    {
        ArrayList GetResultData(string strSQL, out string strErrorMessage);

        AnomalyDetection SelectAnomalyDetection(int id, out string strErrorMessage);
        List<AnomalyDetection> SelectAnomalyDetections(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<AnomalyDetection> SelectAnomalyDetections(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

        AnomalyDetectionDetail SelectAnomalyDetectionDetail(int id, out string strErrorMessage);
        List<AnomalyDetectionDetail> SelectAnomalyDetectionDetails(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<AnomalyDetectionDetail> SelectAnomalyDetectionDetails(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

        HistoryRiskAssess SelectHistoryRiskAssess(int id, out string strErrorMessage);
        List<HistoryRiskAssess> SelectHistoryRiskAssess(Dictionary<HistoryRiskAssess.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<HistoryRiskAssess> SelectHistoryRiskAssess(Dictionary<HistoryRiskAssess.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
    }
}
