using System.Collections.Generic;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Models.Response
{
    public class ResponseItemDetails : MessageResult
    {
        private List<Backup> m_backups = new List<Backup>();
        private List<Box> m_boxs = new List<Box>();
        private List<Etc> m_etcs = new List<Etc>();
        private List<Network> m_networks = new List<Network>();
        private List<SanSwitch> m_sanSwitches = new List<SanSwitch>();
        private List<Security> m_securities = new List<Security>();
        private List<Storage> m_storages = new List<Storage>();
        private List<ItemServer> m_itemServers = new List<ItemServer>();
        //private List<Item> m_items = new List<Item>();

        public List<Backup> Backups
        {
            get { return m_backups; }
            set { m_backups = value; }
        }
        public List<Box> Boxs
        {
            get { return m_boxs; }
            set { m_boxs = value; }
        }
        public List<Etc> Etcs
        {
            get { return m_etcs; }
            set { m_etcs = value; }
        }
        public List<Network> Networks
        {
            get { return m_networks; }
            set { m_networks = value; }
        }
        public List<SanSwitch> SanSwitchs
        {
            get { return m_sanSwitches; }
            set { m_sanSwitches = value; }
        }
        public List<Security> Securitys
        {
            get { return m_securities; }
            set { m_securities = value; }
        }
        public List<Storage> Storages
        {
            get { return m_storages; }
            set { m_storages = value; }
        }
        public List<ItemServer> ItemServers
        {
            get { return m_itemServers; }
            set { m_itemServers = value; }
        }
        /*public List<Item> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }*/

        public ResponseItemDetails()
            : base()
        {
        }

        public ResponseItemDetails(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseEmptyItemDetails : MessageResult
    {
        private Backup m_backup = new Backup();
        private Box m_box = new Box();
        private Etc m_etc = new Etc();
        private Network m_network = new Network();
        private SanSwitch m_sanSwitch = new SanSwitch();
        private Security m_security = new Security();
        private Storage m_storage = new Storage();
        private ItemServer m_itemServer = new ItemServer();

        public Backup Backup
        {
            get { return m_backup; }
            set { m_backup = value; }
        }

        public Box Box
        {
            get { return m_box; }
            set { m_box = value; }
        }

        public Etc Etc
        {
            get { return m_etc; }
            set { m_etc = value; }
        }

        public Network Network
        {
            get { return m_network; }
            set { m_network = value; }
        }

        public SanSwitch SanSwitch
        {
            get { return m_sanSwitch; }
            set { m_sanSwitch = value; }
        }

        public Security Security
        {
            get { return m_security; }
            set { m_security = value; }
        }

        public Storage Storage
        {
            get { return m_storage; }
            set { m_storage = value; }
        }

        public ItemServer ItemServer
        {
            get { return m_itemServer; }
            set { m_itemServer = value; }
        }

        public ResponseEmptyItemDetails()
            : base()
        {
        }

        public ResponseEmptyItemDetails(bool success, string message)
            : base(success, message)
        {
        }
    }
}