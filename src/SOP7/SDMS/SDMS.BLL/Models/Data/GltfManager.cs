using System.Collections.Generic;
using SDMS.IDAL;
using Common.Model.Option;
using UnE.Geometry;

namespace SDMS.BLL.Models.Data
{
    using Response;
    using Request;

    public static class GltfManager
    {
        public static ICollection<GltfModel> LoadGltfModels(IDataManager dataManager, int? userID, List<int> siteIDs, out string strErrorMessage)
        {
            string strAdditionalConditions = null;

            if (siteIDs != null && siteIDs.Count > 0)
            {
                foreach (int nSiteID in siteIDs)
                {
                    if (strAdditionalConditions == null)
                        strAdditionalConditions = nSiteID.ToString();
                    else
                        strAdditionalConditions += "," + nSiteID.ToString();
                }

                bool isNullable;
                strAdditionalConditions = string.Format("{0} in ({1})", GltfModel.GetFieldName(Model.GLTF.Model.Fields.SiteID, out isNullable), strAdditionalConditions);
            }

            strErrorMessage = null;
            List<Model.GLTF.Model> models = dataManager.GetSelectManager().SelectGltfModels(null, strAdditionalConditions, out strErrorMessage);

            if (models == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfModels error : " + strErrorMessage);
                return null;
            }

            Dictionary<int, GltfModel> dicModels = new Dictionary<int, GltfModel>();
            Dictionary<int, int> dicParentIDs = new Dictionary<int, int>();

            foreach (Model.GLTF.Model model in models)
            {
                GltfModel gltf = new GltfModel();

                gltf.ID = model.ID;
                gltf.ModelName = model.ModelName;
                gltf.ParentID = model.ParentID;
                gltf.SiteID = model.SiteID;

                dicModels[gltf.ID] = gltf;

                if (gltf.ParentID != null)
                {
                    dicParentIDs[gltf.ID] = (int)gltf.ParentID;
                }
            }

            foreach (KeyValuePair<int, int> pair in dicParentIDs)
            {
                GltfModel model, parent;

                if (dicModels.TryGetValue(pair.Key, out model) && dicModels.TryGetValue(pair.Value, out parent))
                {
                    parent.ChildModels.Add(model);
                }
            }

            List<Model.GLTF.ModelData> modelDatas = dataManager.GetSelectManager().SelectGltfModelDatas(null, null, out strErrorMessage);

            if (modelDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfModels error : " + strErrorMessage);
                return null;
            }

            foreach (Model.GLTF.ModelData modelData in modelDatas)
            {
                GltfModel model;

                if (dicModels.TryGetValue(modelData.ModelID, out model))
                {
                    model.ModelDatas.Add(modelData);
                }
            }

            List<Model.GLTF.ModelOrthoData> modelOrthoDatas = dataManager.GetSelectManager().SelectGltfModelOrthoDatas(null, null, out strErrorMessage);

            if (modelOrthoDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfModels error : " + strErrorMessage);
                return null;
            }

            foreach (Model.GLTF.ModelOrthoData modelOrthoData in modelOrthoDatas)
            {
                GltfModel model;

                if (dicModels.TryGetValue(modelOrthoData.ModelID, out model))
                {
                    model.ModelOrthoDatas.Add(modelOrthoData);
                }
            }

            if (userID != null)
                return LoadPrivateModels(dataManager, dicModels.Values, (int)userID, out strErrorMessage);

            return dicModels.Values;
        }

        private static ICollection<GltfModel> LoadPrivateModels(IDataManager dataManager, ICollection<GltfModel> models, int userID, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (var model in models)
            {
                if (ToPrivateModelDatas(dataManager, model.ModelDatas, userID, out strErrorMessage) == false)
                    return null;

                if (ToPrivateModelOrthoDatas(dataManager, model.ModelOrthoDatas, userID, out strErrorMessage) == false)
                    return null;

                if (LoadPrivateModels(dataManager, model.ChildModels, userID, out strErrorMessage) == null)
                    return null;
            }

            return models;
        }

        private static bool ToPrivateModelOrthoDatas(IDataManager dataManager, List<Model.GLTF.ModelOrthoData> modelDatas, int userID, out string strErrorMessage)
        {
            string strModelDataIDs = "";

            foreach (var modelData in modelDatas)
            {
                if (strModelDataIDs.Length == 0)
                    strModelDataIDs = modelData.ID.ToString();
                else
                    strModelDataIDs += "," + modelData.ID.ToString();
            }

            strErrorMessage = null;

            if (strModelDataIDs.Length == 0)
                return true;

            string strCondition = string.Format("{0} = {1} and {2} in ({3})",
                Model.GLTF.PrivateModelOrthoData.Fields.UserID, userID,
                Model.GLTF.PrivateModelOrthoData.Fields.ModelDataID, strModelDataIDs);

            List<Model.GLTF.PrivateModelOrthoData> privateModelDatas = dataManager.GetSelectManager().SelectGltfPrivateModelOrthoDatas(null, strCondition, out strErrorMessage);

            if (privateModelDatas == null)
                return false;

            Dictionary<int, Model.GLTF.PrivateModelOrthoData> dicModelDatas = new Dictionary<int, Model.GLTF.PrivateModelOrthoData>();

            foreach (var privateModelData in privateModelDatas)
            {
                dicModelDatas[privateModelData.ModelDataID] = privateModelData;
            }

            // privateModelData로 대체한다.
            foreach (var modelData in modelDatas)
            {
                Model.GLTF.PrivateModelOrthoData privateModelData;

                if (dicModelDatas.TryGetValue(modelData.ID, out privateModelData))
                {
                    modelData.CameraPositionX = privateModelData.CameraPositionX;
                    modelData.CameraPositionY = privateModelData.CameraPositionY;
                    modelData.CameraPositionZ = privateModelData.CameraPositionZ;

                    modelData.CameraQuaternionX = privateModelData.CameraQuaternionX;
                    modelData.CameraQuaternionY = privateModelData.CameraQuaternionY;
                    modelData.CameraQuaternionZ = privateModelData.CameraQuaternionZ;
                    modelData.CameraQuaternionW = privateModelData.CameraQuaternionW;

                    modelData.CameraRotationX = privateModelData.CameraRotationX;
                    modelData.CameraRotationY = privateModelData.CameraRotationY;
                    modelData.CameraRotationZ = privateModelData.CameraRotationZ;

                    modelData.TargetX = privateModelData.TargetX;
                    modelData.TargetY = privateModelData.TargetY;
                    modelData.TargetZ = privateModelData.TargetZ;

                    modelData.Zoom = privateModelData.Zoom;
                }
            }

            return true;
        }

        private static bool ToPrivateModelDatas(IDataManager dataManager, List<Model.GLTF.ModelData> modelDatas, int userID, out string strErrorMessage)
        {
            string strModelDataIDs = "";

            foreach (var modelData in modelDatas)
            {
                if (strModelDataIDs.Length == 0)
                    strModelDataIDs = modelData.ID.ToString();
                else
                    strModelDataIDs += "," + modelData.ID.ToString();
            }

            strErrorMessage = null;

            if (strModelDataIDs.Length == 0)
                return true;

            string strCondition = string.Format("{0} = {1} and {2} in ({3})",
                Model.GLTF.PrivateModelData.Fields.UserID, userID,
                Model.GLTF.PrivateModelData.Fields.ModelDataID, strModelDataIDs);

            List<Model.GLTF.PrivateModelData> privateModelDatas = dataManager.GetSelectManager().SelectGltfPrivateModelDatas(null, strCondition, out strErrorMessage);

            if (privateModelDatas == null)
                return false;

            Dictionary<int, Model.GLTF.PrivateModelData> dicModelDatas = new Dictionary<int, Model.GLTF.PrivateModelData>();

            foreach (var privateModelData in privateModelDatas)
            {
                dicModelDatas[privateModelData.ModelDataID] = privateModelData;
            }

            // privateModelData로 대체한다.
            foreach (var modelData in modelDatas)
            {
                Model.GLTF.PrivateModelData privateModelData;

                if (dicModelDatas.TryGetValue(modelData.ID, out privateModelData))
                {
                    modelData.CameraPositionX = privateModelData.CameraPositionX;
                    modelData.CameraPositionY = privateModelData.CameraPositionY;
                    modelData.CameraPositionZ = privateModelData.CameraPositionZ;

                    modelData.CameraQuaternionX = privateModelData.CameraQuaternionX;
                    modelData.CameraQuaternionY = privateModelData.CameraQuaternionY;
                    modelData.CameraQuaternionZ = privateModelData.CameraQuaternionZ;
                    modelData.CameraQuaternionW = privateModelData.CameraQuaternionW;

                    modelData.CameraRotationX = privateModelData.CameraRotationX;
                    modelData.CameraRotationY = privateModelData.CameraRotationY;
                    modelData.CameraRotationZ = privateModelData.CameraRotationZ;

                    modelData.OrbitTargetX = privateModelData.OrbitTargetX;
                    modelData.OrbitTargetY = privateModelData.OrbitTargetY;
                    modelData.OrbitTargetZ = privateModelData.OrbitTargetZ;
                }
            }

            return true;
        }

        public static GltfOption LoadGltfOption(Common.IDAL.IDataManager dataManager, string str3DHighVer, out string strErrorMessage)
        {
            GltfOption gltfOption = new GltfOption();
            List<Options> options = dataManager.GetSelectManager().SelectOptions(Options.OptionTarget.GLTF, out strErrorMessage);

            if (options == null)
                return null;

            if (str3DHighVer == "false")
            {
                Options option = FindGlftOption(options, "3DLightModelBaseURL");

                if (option != null)
                    gltfOption._3DModelBaseURL = option.PropertyValue;
            }
            else
            {
                Options option = FindGlftOption(options, "3DModelBaseURL");

                if (option != null)
                    gltfOption._3DModelBaseURL = option.PropertyValue;
            }

            Options optionTextureBaseURL = FindGlftOption(options, "3DTextureBaseURL");

            if (optionTextureBaseURL != null)
                gltfOption._3DTextureBaseURL = optionTextureBaseURL.PropertyValue;

            Options optionBackgroundImage = FindGlftOption(options, "3DBackgroundImage");

            if (optionBackgroundImage != null)
                gltfOption._3DBackgroundImage = optionBackgroundImage.PropertyValue;

            Options optionIndoorModelOnMemory = FindGlftOption(options, "indoorModelOnMemory");

            if (optionIndoorModelOnMemory != null)
            {
                bool success;
                bool onMomery = GetBooleanValue(optionIndoorModelOnMemory, out success);

                if (success)
                    gltfOption.IndoorModelOnMemory = onMomery;
            }

            /*if (str3DHighVer == "false")
                options = dataManager.GetSelectManager().SelectOption(Options.OptionTarget.GLTF, "3DLightModelBaseURL", out strErrorMessage);
            else
                options = dataManager.GetSelectManager().SelectOption(Options.OptionTarget.GLTF, "3DModelBaseURL", out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfOption error : " + strErrorMessage);
                return null;
            }

            if (options.Count > 0)
            {
                gltfOption._3DModelBaseURL = options[0].PropertyValue;
            }

            options = dataManager.GetSelectManager().SelectOption(Options.OptionTarget.GLTF, "3DTextureBaseURL", out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfOption error : " + strErrorMessage);
                return null;
            }

            if (options.Count > 0)
            {
                gltfOption._3DTextureBaseURL = options[0].PropertyValue;
            }

            options = dataManager.GetSelectManager().SelectOption(Options.OptionTarget.GLTF, "3DBackgroundImage", out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadGltfOption error : " + strErrorMessage);
                return null;
            }

            if (options.Count > 0)
            {
                gltfOption._3DBackgroundImage = options[0].PropertyValue;
            }*/

            return gltfOption;
        }

        private static bool GetBooleanValue(Options option, out bool success)
        {
            success = false;

            string strValue = option.PropertyValue;

            if (strValue == null)
                return false;

            strValue = strValue.ToLower();

            if (strValue == "1" || strValue == "true")
            {
                success = true;
                return true;
            }
            else if (strValue == "0" || strValue == "false")
            {
                success = true;
                return false;
            }

            return false;
        }

        private static Options FindGlftOption(List<Options> options, string strOptionName)
        {
            foreach (Options option in options)
            {
                if (string.Compare(option.PropertyName, strOptionName, true) == 0)
                    return option;
            }

            return null;
        }

        public static bool SaveViewport(IDataManager dataManager, RequestSaveViewport request, out string strErrorMessage)
        {
            if (request == null)
            {
                strErrorMessage = "[SaveViewport 실패] : 요청정보가 비어있습니다.";
                return false;
            }

            Dictionary<Model.GLTF.Model.Fields, object> dicConditions = new Dictionary<Model.GLTF.Model.Fields, object>();
            dicConditions[Model.GLTF.Model.Fields.ModelName] = request.ModelName;

            List<Model.GLTF.Model> models = dataManager.GetSelectManager().SelectGltfModels(dicConditions, null, out strErrorMessage);

            if (models == null)
                return false;

            if (models.Count == 0)
            {
                strErrorMessage = string.Format("[SaveViewport 실패] : {0}에 해당하는 모델 정보를 찾을수 없습니다.", request.ModelName);
                return false;
            }

            Model.GLTF.Model model = models[0];

            Dictionary<Model.GLTF.ModelData.Fields, object> dicConditions2 = new Dictionary<Model.GLTF.ModelData.Fields, object>();
            dicConditions2[Model.GLTF.ModelData.Fields.ModelID] = model.ID;
            dicConditions2[Model.GLTF.ModelData.Fields.ModelFile] = request.ModelFile;
            dicConditions2[Model.GLTF.ModelData.Fields.BuildingGroupID] = request.BuildingGroupID;
            dicConditions2[Model.GLTF.ModelData.Fields.BuildingID] = request.BuildingID;
            dicConditions2[Model.GLTF.ModelData.Fields.ZoneID] = request.ZoneID;

            List<Model.GLTF.ModelData> modelDatas = dataManager.GetSelectManager().SelectGltfModelDatas(dicConditions2, null, out strErrorMessage);

            if (modelDatas == null)
                return false;

            if (modelDatas.Count > 0)
                return UpdateModelData(dataManager, modelDatas[0], request, out strErrorMessage);

            return CreateModelData(dataManager, models[0].ID, request, out strErrorMessage);
        }

        private static bool UpdateModelData(IDataManager dataManager, Model.GLTF.ModelData modelData, RequestSaveViewport request, out string strErrorMessage)
        {
            if (request.UserID == null)
            {
                modelData.CameraFar = request.Far;
                modelData.CameraFov = request.Fov;
                modelData.CameraNear = request.Near;
                modelData.CameraPosition.SetVertex(request.CameraPosition.x, request.CameraPosition.y, request.CameraPosition.z);
                modelData.CameraQuaternion.Set(request.CameraQuaternion.x, request.CameraQuaternion.y, request.CameraQuaternion.z, request.CameraQuaternion.w);
                modelData.CameraRotation.SetVertex(request.CameraRotation.x, request.CameraRotation.y, request.CameraRotation.z);
                modelData.OrbitTarget.SetVertex(request.OrbitTarget.x, request.OrbitTarget.y, request.OrbitTarget.z);
                modelData.ModelDisplayText = request.ModelDisplayText;
                modelData.FloorIndex = request.FloorIndex;
                modelData.ModelFile = request.ModelFile;

                return dataManager.GetUpdateManager().UpdateGltfModelData(modelData, out strErrorMessage);
            }
            else
            {
                Model.GLTF.PrivateModelData privateModelData = dataManager.GetSelectManager().SelectGltfPrivateModelData(modelData.ID, (int)request.UserID, out strErrorMessage);

                if (privateModelData == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                        return CreatePrivateModelData(dataManager, modelData, request, (int)request.UserID, out strErrorMessage);
                }
                else
                    return UpdatePrivateModelData(dataManager, privateModelData, request, out strErrorMessage);
            }
        }

        public static bool UpdatePrivateModelData(IDataManager dataManager, Model.GLTF.PrivateModelData modelData, RequestSaveViewport request, out string strErrorMessage)
        {
            Model.GLTF.PrivateModelData privateModelData = new Model.GLTF.PrivateModelData();

            modelData.CameraFar = request.Far;
            modelData.CameraFov = request.Fov;
            modelData.CameraNear = request.Near;
            modelData.CameraPosition.SetVertex(request.CameraPosition.x, request.CameraPosition.y, request.CameraPosition.z);
            modelData.CameraQuaternion.Set(request.CameraQuaternion.x, request.CameraQuaternion.y, request.CameraQuaternion.z, request.CameraQuaternion.w);
            modelData.CameraRotation.SetVertex(request.CameraRotation.x, request.CameraRotation.y, request.CameraRotation.z);
            modelData.OrbitTarget.SetVertex(request.OrbitTarget.x, request.OrbitTarget.y, request.OrbitTarget.z);

            return dataManager.GetUpdateManager().UpdateGltfPrivateModelData(modelData, out strErrorMessage);
        }

        public static bool CreatePrivateModelData(IDataManager dataManager, Model.GLTF.ModelData modelData, RequestSaveViewport request, int userID, out string strErrorMessage)
        {
            Model.GLTF.PrivateModelData privateModelData = new Model.GLTF.PrivateModelData();

            privateModelData.ModelDataID = modelData.ID;
            privateModelData.UserID = userID;

            privateModelData.CameraFar = request.Far;
            privateModelData.CameraFov = request.Fov;
            privateModelData.CameraNear = request.Near;
            privateModelData.CameraPosition.SetVertex(request.CameraPosition.x, request.CameraPosition.y, request.CameraPosition.z);
            privateModelData.CameraQuaternion.Set(request.CameraQuaternion.x, request.CameraQuaternion.y, request.CameraQuaternion.z, request.CameraQuaternion.w);
            privateModelData.CameraRotation.SetVertex(request.CameraRotation.x, request.CameraRotation.y, request.CameraRotation.z);
            privateModelData.OrbitTarget.SetVertex(request.OrbitTarget.x, request.OrbitTarget.y, request.OrbitTarget.z);

            Vertex3D vCameraPosition = new Vertex3D(request.CameraPosition.x, request.CameraPosition.y, request.CameraPosition.z);
            Vertex3D vCameraRotation = new Vertex3D(request.CameraRotation.x, request.CameraRotation.y, request.CameraRotation.z);
            Quaternion vCameraQuaternion = new Quaternion(request.CameraQuaternion.x, request.CameraQuaternion.y, request.CameraQuaternion.z, request.CameraQuaternion.w);
            Vertex3D vOrbitTarget = new Vertex3D(request.OrbitTarget.x, request.OrbitTarget.y, request.OrbitTarget.z);

            if (dataManager.GetCreateManager().CreateGltfPrivateModelData(modelData.ID, userID, vCameraPosition, vCameraQuaternion, vCameraRotation, request.Fov, request.Near, request.Far, vOrbitTarget) == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }

            strErrorMessage = null;
            return true;
        }

        private static bool CreateModelData(IDataManager dataManager, int nModelID, RequestSaveViewport request, out string strErrorMessage)
        {
            Model.GLTF.ModelData modelData = dataManager.GetCreateManager().CreateGltfModelData(nModelID, request.ModelFile, request.ModelDisplayText, request.CameraPosition, request.CameraQuaternion, request.CameraRotation, request.Fov, request.Near, request.Far, request.OrbitTarget, request.FloorIndex, request.BuildingGroupID, request.BuildingID, request.ZoneID);

            if (modelData == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }

            if (request.UserID != null)
            {
                return CreatePrivateModelData(dataManager, modelData, request, (int)request.UserID, out strErrorMessage);
            }

            strErrorMessage = null;
            return true;
        }
    }
}
