using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using Vacation.BLL;
using Vacation.BLL.Models.Teams;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Vacation.Model;
using Vacation.DAL;

namespace UnEInternal.Controllers
{
    public class TeamsController : Controller
    {
        private ProcessManager m_processManager = null;
        private IDataManager m_dataManager = null;

        public TeamsController(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpGet]
        public List<RegularTeam> DisplayRegular()
        {
            string strErrorMessage;
            IEnumerable<RegularTeam> regulars = m_dataManager.GetSelect().Select<RegularTeam>(null, out strErrorMessage);
            if (regulars == null)
                return null;

            TeamManager.RegularTeam = new List<RegularTeam>();
            TeamManager.RegularTeam.AddRange(regulars);

            return TeamManager.RegularTeam;
        }

        [HttpGet]
        public List<JobLevel> DisplayJobLevel()
        {
            string strErrorMessage;
            IEnumerable<JobLevel> levels = m_dataManager.GetSelect().Select<JobLevel>(null, out strErrorMessage);
            if (levels == null)
                return null;

            TeamManager.JobLevel = new List<JobLevel>();
            TeamManager.JobLevel.AddRange(levels);

            return TeamManager.JobLevel;
        }

        [HttpPost]
        public string DisplayRegularMember([FromBody] RegularTeam data)
        {
            List<CompanyMemberData> datas = m_processManager.GetTeamManager().LoadCompanyMember(data.ID);            
            return JsonConvert.SerializeObject(datas);
        }

        [HttpPost]
        public void Save([FromBody] CompanyMemberDataCollect data)
        {
            bool suc = m_processManager.GetTeamManager().SaveMember(data.data);
        }

        [HttpPost]
        public void DeleteMember([FromBody] CompanyMemberDataCollect data)
        {
            bool suc = m_processManager.GetTeamManager().DeleteMember(data.data);
        }

        [HttpPost]
        public void SaveTeam([FromBody] RegularTeam data)
        {
            if (data.ID > 0)
                m_processManager.GetTeamManager().UpdateRegularTeam(data);
            else
            {
                RegularTeam team = new RegularTeam();
                team.Name = data.Name;
                team.ParentTeamID = data.ParentTeamID;

                CreateManager createManager = new CreateManager(m_dataManager);

                int addID;
                string strErrorMessage;
                createManager.CreateRegularTeam(team, out addID, out strErrorMessage);
            }
        }

        [HttpPost]
        public void DeleteTeam([FromBody] RegularTeamDataCollect data)
        {
            bool suc = m_processManager.GetTeamManager().DeleteTeam(data.data);
        }


        [HttpPost]
        public int CheckAdminLength([FromBody] RegularTeam data)
        {
            string strErrorMessage;
            SelectManager2 selectManager = new SelectManager2(m_dataManager);
            int length = selectManager.SelectAdminLength(data.ID, out strErrorMessage);

            return length;
        }
    }    
}
