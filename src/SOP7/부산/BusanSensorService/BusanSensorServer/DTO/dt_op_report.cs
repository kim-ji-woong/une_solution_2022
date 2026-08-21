using System;

namespace BusanSensorServer.DTO
{
    public class dt_op_report
    {
        private int m_dt_op_report_id;
        private int m_sys_net_node_id;
        private int m_report_mem_addr;
        private double m_report_mem_value;
        private double? m_report_mem_extra;
        private int m_report_valid_cnt;
        private DateTime m_report_timestamp;
        
        public int dt_op_report_id
        {
            get { return m_dt_op_report_id; }
            set { m_dt_op_report_id = value; }
        }
        
        public int sys_net_node_id
        {
            get { return m_sys_net_node_id; }
            set { m_sys_net_node_id = value; }
        }
        
        public int report_mem_addr
        {
            get { return m_report_mem_addr; }
            set { m_report_mem_addr = value; }
        }
        
        public double report_mem_value
        {
            get { return m_report_mem_value; }
            set { m_report_mem_value = value; }
        }
        
        public double? report_mem_extra
        {
            get { return m_report_mem_extra; }
            set { m_report_mem_extra = value; }
        }
        
        public int report_valid_cnt
        {
            get { return m_report_valid_cnt; }
            set { m_report_valid_cnt = value; }
        }
        
        public DateTime report_timestamp
        {
            get { return m_report_timestamp; }
            set { m_report_timestamp = value; }
        }

        public static string GetTableName()
        {
            return "dt_op_report";
        }
        
    }
}