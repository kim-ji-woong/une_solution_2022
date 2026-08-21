using System;
using System.Collections.Generic;
using System.Text;

namespace Vacation.BLL.Models.Vacation
{
    public class Options
    {
        private float m_fMinSpecialVacationDays = 0;
        private float m_fMaxSpecialVacationDays = 5;

        public float MinSpecialVacationDays
        {
            get { return m_fMinSpecialVacationDays; }
            set { m_fMinSpecialVacationDays = value; }
        }

        public float MaxSpecialVacationDays
        {
            get { return m_fMaxSpecialVacationDays; }
            set { m_fMaxSpecialVacationDays = value; }
        }
    }
}
