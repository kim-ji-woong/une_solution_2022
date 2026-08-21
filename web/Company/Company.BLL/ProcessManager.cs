using System;
using System.Collections.Generic;
using System.Text;


namespace Company.BLL
{
    public class ProcessManager 
    {
        private Company.IDAL.IDataManager m_companyDataManager = null;
        private LoadManager m_loadManager = null;

        public ProcessManager(Company.IDAL.IDataManager companyDataManager)
        {
            this.m_companyDataManager = companyDataManager;

            m_loadManager = new LoadManager(m_companyDataManager, this);

        }

        public Company.IDAL.IDataManager CompanyDataManager
        {
            get { return m_companyDataManager; }
        }

        public LoadManager GetLoadManager()
        {
            return m_loadManager;   
        }
    }
}