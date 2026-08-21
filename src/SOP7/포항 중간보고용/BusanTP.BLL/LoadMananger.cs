using System.Collections.Generic;
using BusanTP.BLL.Models.Response;
using BusanTP.IDAL;
using BusanTP.Model;

namespace BusanTP.BLL
{
    public class LoadManager
    {
        SDMS.IDAL.IDataManager sdmsDataManager = null;
        IDataManager externalDataManager = null;
        
        public LoadManager(IDataManager externalDataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            this.externalDataManager = externalDataManager;
            this.sdmsDataManager = sdmsDataManager;
        }

        public ResponseExternalSensorGIS ReadExternalSensorGIS()
        {

            string strErrorMessage;
            ResponseExternalSensorGIS response = new ResponseExternalSensorGIS();
            
            response.SensorGISs = externalDataManager.GetSelectManager().SelectBusanExternalSensorGISs(null, null, out strErrorMessage);
            
            if (response.SensorGISs.Count == 0)
            {
                strErrorMessage = "No SensorGIS data found.";
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
        }

        public ResponseExternalPOIInfo ReadExternalPOIInfo()
        {
            string strErrorMessage;
            ResponseExternalPOIInfo response = new ResponseExternalPOIInfo();
            
            response.POIInfos = externalDataManager.GetSelectManager().SelectBusanExternalPOIInfos(null, null, out strErrorMessage);
            
            if (response.POIInfos.Count == 0)
            {
                strErrorMessage = "No POIInfo data found.";
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
            
        }
        
    }
}