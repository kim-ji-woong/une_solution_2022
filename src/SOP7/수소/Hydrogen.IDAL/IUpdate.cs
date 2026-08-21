using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.IDAL
{
    public interface IUpdate
    {
        bool UpdateAnomalyDetection(AnomalyDetection obj, out string strErrorMessage);

        bool UpdateAnomalyDetectionDetail(AnomalyDetectionDetail obj, out string strErrorMessage);
    }
}
