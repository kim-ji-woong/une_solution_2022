using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.IDAL
{
    public interface ICreate
    {
        string GetErrorMessage();
        AnomalyDetection CreateAnomalyDetection(AnomalyDetection obj, out string strErrorMessage);
        AnomalyDetectionDetail CreateAnomalyDetectionDetail(AnomalyDetectionDetail obj, out string strErrorMessage);
    }
}
