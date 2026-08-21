using System;
using System.Collections.Generic;
using Nipa.Model.Mes.Product;
using Nipa.Model.Mes.Quality;

namespace Nipa.BLL.Models.Response.SDMS
{
    public class ResponseMESData : MessageResult
    {
        private Run m_run = null;
        private List<Performance> m_performances = new List<Performance>();
        private List<NG> m_ngs = new List<NG>();
        private List<NGCategory> m_ngCategories = new List<NGCategory>();
        private List<Nipa.Model.Mes.Buy.Dashboard> m_buyDashboards = new List<Model.Mes.Buy.Dashboard>();
        private List<Nipa.Model.Mes.Sell.Dashboard> m_sellDashboards = new List<Model.Mes.Sell.Dashboard>();

        public Run Run
        {
            get { return m_run; }
            set { m_run = value; }
        }

        public List<Performance> Performances
        {
            get { return m_performances; }
            set { m_performances = value; }
        }

        public List<NG> Ngs
        {
            get { return m_ngs; }
            set { m_ngs = value; }
        }

        public List<NGCategory> NgCategories
        {
            get { return m_ngCategories; }
            set { m_ngCategories = value; }
        }

        public List<Nipa.Model.Mes.Buy.Dashboard> BuyDashboards
        {
            get { return m_buyDashboards; }
            set { m_buyDashboards = value; }
        }

        public List<Nipa.Model.Mes.Sell.Dashboard> SellDashboards
        {
            get { return m_sellDashboards; }
            set { m_sellDashboards = value; }
        }

        public ResponseMESData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseMESEquipmentData : MessageResult
    {
        private List<MesEquipmentData> m_datas = new List<MesEquipmentData>();

        public List<MesEquipmentData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public ResponseMESEquipmentData()
            : base()
        {
        }

        public ResponseMESEquipmentData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
