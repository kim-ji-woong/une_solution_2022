using System;
using System.Collections.Generic;
using VDS.Model.DataCenter;

namespace VDS.BLL.Models.Container
{
    public class DataCenterDataContainer
    {
        private Data m_data = null;
        private DataCenterDataContainer m_parent = null;
        private List<DataCenterDataContainer> m_children = new List<DataCenterDataContainer>();

        public Data Data
        {
            get { return m_data; }
            set { m_data = value; }
        }

        public DataCenterDataContainer Parent
        {
            get { return m_parent; }
            set { m_parent = value; }
        }

        public List<DataCenterDataContainer> Children
        {
            get { return m_children; }
            set { m_children = value; }
        }

        public int GetChildCount()
        {
            int nCount = 0;

            foreach (DataCenterDataContainer container in m_children)
            {
                nCount += container.GetChildCount() + 1;
            }

            return nCount;
        }

        private int GetChildCount(DataCenterDataContainer container)
        {
            return container.GetChildCount();
        }
    }
}
