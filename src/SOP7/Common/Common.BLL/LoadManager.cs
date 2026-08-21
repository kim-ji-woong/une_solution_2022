using Common.BLL.Models.Response;
using Common.Model;
using Common.Model.History;
using System;
using System.Collections.Generic;

namespace Common.BLL
{
    public class LoadManager
    {
        private ProcessManager m_processManager = null;

        public LoadManager(ProcessManager processManager)
        {
            this.m_processManager = processManager;
        }

        public ResponseSite GetSites()
        {
            ResponseSite res = new ResponseSite();

            try
            {
                string strError = null;
                List<Site> sites = m_processManager.CommonDataManager.GetSelectManager().SelectSites(null, out strError);
                if (sites == null)
                    throw new ApplicationException(strError);

                if (sites.Count == 0)
                    throw new ApplicationException("Site 정보가 없습니다");

                // 멀티사이트 사용 (원익)
                if (sites.Count > 1)
                    res.UseMultiSite = true;
                else
                    res.UseMultiSite = false;

                res.Sites = new List<Site>();
                res.Sites.AddRange(sites);
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }
    }
}
