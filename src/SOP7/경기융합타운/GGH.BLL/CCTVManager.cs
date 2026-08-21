using System;
using System.Collections;
using System.Collections.Generic;
using GGH.Model.CCTV;
using SDMS.Model.CCTV;
using SDMS.Model.Spatial;

namespace GGH.BLL
{
    using IDAL;
    using Models.Request;
    using Models.Response;

    public class CCTVManager
    {
        private IDataManager m_dataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;

        public CCTVManager(IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager)
        {
            m_dataManager = dataManager;
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
        }

        public ResponseNvrList GetNvrList()
        {
            string strErrorMessage;
            List<Nvr> nvrs = m_dataManager.GetSelectManager().SelectNvrs(null, null, out strErrorMessage);

            if (nvrs == null)
                return new ResponseNvrList(false, strErrorMessage);

            ResponseNvrList response = new ResponseNvrList(true, "");
            response.NvrList.AddRange(nvrs);
            return response;
        }

        public MessageResult UpdateNvrList(RequestUpdateNvrList request)
        {
            MessageResult resultOwn = UpdateNvrList(request, m_dataManager.Clone());

            if (resultOwn.Success == false)
                return resultOwn;

            string strErrorMessage;
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, "ExternalNvrDB", out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine("SelectOption Fail : " + strErrorMessage);
                return resultOwn;
            }

            // 업데이트 해야할 외부 DB가 있으면 업데이트 한다.
            // 외부 DB 업데이트 실패는 전체 Transaction에 영향을 주지 않는다.
            foreach (var option in options)
            {
                string strHost, strName, strId, strPw;
                
                if (ParseExternalNvrDB(option.PropertyValue, out strHost, out strName, out strId, out strPw))
                {
                    IDataManager externalDataManager = m_dataManager.Clone(strHost, strName, strId, strPw, m_dataManager.SiteID);
                    UpdateNvrList(request, externalDataManager);
                }
            }

            return resultOwn;
        }

        private bool ParseExternalNvrDB(string strValue, out string strDbHost, out string strDbName, out string strId, out string strPw)
        {
            strDbHost = strDbName = strId = strPw = null;

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });
            string strDecrypt = dnsDBUtil.AES256Cipher.AES_decrypt(strValue, key);

            string[] tokens = strDecrypt.Split('/');

            if (tokens.Length == 4)
            {
                strDbHost = tokens[0].Trim();
                strDbName = tokens[1].Trim();
                strId = tokens[2].Trim();
                strPw = tokens[3].Trim();
                return true;
            }

            return false;
        }

        private MessageResult UpdateNvrList(RequestUpdateNvrList request, IDataManager dataManager)
        {
            string strErrorMessage;

            if (dataManager.BeginBatch() == false)
                return new MessageResult(false, "DB 트랜잭션을 시작할 수 없습니다.");

            DateTime dtNow = DateTime.Now;
            Dictionary<int, Nvr> dicNvrs = new Dictionary<int, Nvr>();

            foreach (Nvr nvr in request.UpdateList)
            {
                dicNvrs[nvr.ID] = nvr;

                if (dataManager.GetUpdateManager().UpdateNvr(nvr, out strErrorMessage) == false ||
                    UpdateDataManager.MakeUpdateData(nvr, dtNow, dataManager, out strErrorMessage) == false)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, strErrorMessage);
                }
            }

            // 업데이트할 Nvr에 연결되어 있는 CCTV들을 얻어온다.
            ArrayList arrDatas = dataManager.GetSelectManager().JoinCctvCctvNvrLink(request.UpdateList, null, out strErrorMessage);

            if (arrDatas == null)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, strErrorMessage);
            }

            // CCTV들의 Url을 변경한다.
            if (ChangeCctvUrl(arrDatas, dicNvrs, dataManager, dtNow, ref strErrorMessage) == false)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.BatchCommit() == false)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, "DB 트랜잭션 커밋이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        private bool ChangeCctvUrl(ArrayList arrDatas, Dictionary<int, Nvr> dicNvrs, IDataManager dataManager, DateTime dtNow, ref string strErrorMessage)
        {
            int nDataCount = arrDatas.Count;
            int nPrevNvrID = -1;
            Nvr prevNvr = null;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is CCTV && arrDatas[i + 1] is NvrLink)
                {
                    CCTV cctv = (CCTV)arrDatas[i];
                    NvrLink nvrLink = (NvrLink)arrDatas[i + 1];

                    Nvr nvr;

                    if (prevNvr != null && nvrLink.NvrID == nPrevNvrID)
                        nvr = prevNvr;
                    else if (dicNvrs.TryGetValue(nvrLink.NvrID, out nvr))
                    {
                        prevNvr = nvr;
                        nPrevNvrID = nvrLink.NvrID;
                    }
                    else
                        continue;

                    if (cctv.UserID == null || cctv.UserID.Trim().Length == 0 || cctv.Password == null || cctv.Password.Trim().Length == 0 || cctv.CameraCompanyName == null || cctv.CameraCompanyName.Length == 0)
                        continue;

                    /*int index = cctv.CameraIP.LastIndexOf('.');

                    if (index < 0)
                        continue;

                    string strNo = cctv.CameraIP.Substring(index + 1).Trim();
                    int no;

                    if (int.TryParse(strNo, out no) == false)
                        continue;*/

                    string strHighUrl = string.Format("http://{3}:{4}@{0}/live/media/{1}/DeviceIpint.{2}/SourceEndpoint.video:0:0", nvr.Url, nvr.Name, cctv.CameraCompanyName, cctv.UserID, cctv.Password);
                    string strLowUrl = string.Format("http://{3}:{4}@{0}/live/media/{1}/DeviceIpint.{2}/SourceEndpoint.video:0:1", nvr.Url, nvr.Name, cctv.CameraCompanyName, cctv.UserID, cctv.Password);

                    cctv.URL = strLowUrl;
                    cctv.BigURL = strHighUrl;
                    cctv.SmallURL = strLowUrl;

                    if (dataManager.GetUpdateManager().UpdateCCTV(cctv, out strErrorMessage) == false ||
                        UpdateDataManager.MakeUpdateData(cctv, dtNow, dataManager, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        public ResponseCCTVList GetCCTVList(int siteID)
        {
            Dictionary<CCTV.Fields, object> dicConditions = null;

            if (siteID > 0)
            {
                dicConditions = new Dictionary<CCTV.Fields, object>();
                dicConditions[CCTV.Fields.SiteID] = siteID;
            }

            string strErrorMessage;
            List<CCTV> cctvs = m_sdmsDataManager.GetSelectManager().SelectCCTVs(dicConditions, null, out strErrorMessage);

            if (cctvs == null)
                return new ResponseCCTVList(false, strErrorMessage);

            ArrayList arrResult = m_sdmsDataManager.GetSelectManager().JoinBuildingGroupBuildingZone(null, null, null, null, out strErrorMessage);

            if (arrResult == null)
                return new ResponseCCTVList(false, strErrorMessage);

            Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();
            Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();
            int nResultCount = arrResult.Count;

            for (int i=0;i<nResultCount-2;i+=3)
            {
                if (arrResult[i + 1] is Building && arrResult[i + 2] is Zone)
                {
                    Building building = (Building)arrResult[i + 1];
                    Zone zone = (Zone)arrResult[i + 2];

                    dicBuildings[building.ID] = building;
                    dicZones[zone.ID] = zone;
                }
            }

            ResponseCCTVList response = new ResponseCCTVList(true, "");

            foreach (CCTV cctv in cctvs)
            {
                Zone zone;
                Building building;
                ResponseCCTVList.CCTVData cctvData = new ResponseCCTVList.CCTVData();

                if (cctv.ZoneID != null && dicZones.TryGetValue((int)cctv.ZoneID, out zone))
                {
                    if (zone.BuildingID != null && dicBuildings.TryGetValue((int)zone.BuildingID, out building))
                    {
                        cctvData.BuildingName = building.DisplayText;
                    }

                    if (zone.FloorIndex != null)
                    {
                        cctvData.FloorName = (int)zone.FloorIndex < 0 ? string.Format("지하 {0}층", ((int)zone.FloorIndex) * (-1)) : string.Format("{0}층", ((int)zone.FloorIndex) + 1);
                    }
                }

                cctvData.Description = cctv.Description;
                cctvData.DeviceID = cctv.CameraCompanyName;
                cctvData.ID = cctv.ID;
                cctvData.IP = cctv.CameraIP;
                cctvData.Position = cctv.PositionName;

                response.CCTVList.Add(cctvData);
            }

            return response;
        }

        public MessageResult UpdateCCTVList(UpdateCCTVList request)
        {
            MessageResult resultOwn = UpdateCCTVList(request, m_dataManager.Clone(), m_sdmsDataManager.Clone());

            if (resultOwn.Success == false)
                return resultOwn;

            string strErrorMessage;
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, "ExternalNvrDB", out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine("SelectOption Fail : " + strErrorMessage);
                return resultOwn;
            }

            // 업데이트 해야할 외부 DB가 있으면 업데이트 한다.
            // 외부 DB 업데이트 실패는 전체 Transaction에 영향을 주지 않는다.
            foreach (var option in options)
            {
                string strHost, strName, strId, strPw;

                if (ParseExternalNvrDB(option.PropertyValue, out strHost, out strName, out strId, out strPw))
                {
                    IDataManager externalDataManager = m_dataManager.Clone(strHost, strName, strId, strPw, m_dataManager.SiteID);
                    var externalSdmsDataManager = m_sdmsDataManager.Clone(strHost, strName, strId, strPw, m_dataManager.SiteID);
                    UpdateCCTVList(request, externalDataManager, externalSdmsDataManager);
                }
            }

            return resultOwn;
        }

        private MessageResult UpdateCCTVList(UpdateCCTVList request, IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            string strErrorMessage;
            DateTime dtNow = DateTime.Now;

            if (sdmsDataManager.BeginBatch() == false)
                return new MessageResult(false, "DB 트랜잭션을 시작할 수 없습니다.");

            if (dataManager.BeginBatch() == false)
            {
                sdmsDataManager.BatchRollback();
                return new MessageResult(false, "DB 트랜잭션을 시작할 수 없습니다.");
            }

            foreach (var cctvData in request.CCTVList)
            {
                Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
                dicConditions[CCTV.Fields.ID] = cctvData.ID;

                Dictionary<CCTV.Fields, object> dicSets = new Dictionary<CCTV.Fields, object>();
                dicSets[CCTV.Fields.CameraIP] = cctvData.IP;
                dicSets[CCTV.Fields.CameraCompanyName] = cctvData.DeviceID;
                dicSets[CCTV.Fields.Description] = cctvData.Description;

                if (sdmsDataManager.GetUpdateManager().UpdateCCTV(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    sdmsDataManager.BatchRollback();
                    dataManager.BatchRollback();
                    return new MessageResult(false, strErrorMessage);
                }

                if (UpdateDataManager.MakeUpdateData(cctvData, dtNow, dataManager, out strErrorMessage) == false)
                {
                    sdmsDataManager.BatchRollback();
                    dataManager.BatchRollback();
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (sdmsDataManager.BatchCommit() == false || dataManager.BatchCommit() == false)
            {
                sdmsDataManager.BatchRollback();
                dataManager.BatchRollback();
                return new MessageResult(false, "DB 트랜잭션 커밋이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        public ResponseCCTVList2 GetCCTVList(List<int> cctvIDs)
        {
            if (cctvIDs == null || cctvIDs.Count == 0)
                return new ResponseCCTVList2(false, "CCTV ID가 비어있습니다.");

            string strCondition = string.Format("{0} in ({1})", CCTV.Fields.ID, string.Join(",", cctvIDs.ToArray()));

            string strErrorMessage;
            List<CCTV> cctvs = m_sdmsDataManager.GetSelectManager().SelectCCTVs(null, strCondition, out strErrorMessage);

            if (cctvs == null)
                return new ResponseCCTVList2(false, strErrorMessage);

            ResponseCCTVList2 response = new ResponseCCTVList2(true, "");
            response.Cctvs.AddRange(cctvs);
            return response;
        }
    }
}
