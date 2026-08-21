using IntegrationServer.Datas;
using S1SVMSSDKv2.Model.Etc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static dnsSopID.ID;

namespace IntegrationServer.Options
{
    public partial class PanelSenko : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelSenko(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                if (data.ServerType == (int)ServerTypes.PSM_Senko)
                {
                    //if (pair.Key == ServerProperty.)
                }
            }
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
    }
}
