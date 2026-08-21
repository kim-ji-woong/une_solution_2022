using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using Nipa.BLL.Models.Response.SDMS;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using TeamEditor.BLL.Models.Request;
using TeamEditor.BLL.Models.Response;
using TeamEditor.Model.Sop.Team;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Nipa2023.Areas.TeamEditor.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("Team")]
    public class TeamEditorController : Controller
    {
        private ProcessManager m_processManager = null;
        private global::TeamEditor.BLL.ProcessManager m_teamManager = null;

        public TeamEditorController(IDataManager dataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager, global::SDMS.IDAL.IDataManager sdmsManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_teamManager = new global::TeamEditor.BLL.ProcessManager(commonDataManager, teamDataManager, sopDataManager, sdmsManager);
        }

        /// <summary>
        /// 팀목록 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "siteID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Team/TeamEditor/RequestTeamList")]
        [ProducesResponseType(typeof(ResponseTeamList), 200)]
        public IActionResult RequestTeamList([FromBody] RequestTeamList data)
        {
            if (data == null)
                return BadRequest();

            ResponseTeamList response = m_processManager.TeamManager.GetTeamList(data.SiteID);
            return Ok(response);
        }

        /// <summary>
        /// 팀원목록 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "teamID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Team/TeamEditor/RequestTeamMemberList")]
        [ProducesResponseType(typeof(ResponseTeamMemberList), 200)]
        public IActionResult RequestTeamMemberList([FromBody] RequestTeamMemberList data)
        {
            if (data == null)
                return BadRequest();

            ResponseTeamMemberList response = m_processManager.TeamManager.GetTeamMemberList(data.TeamID);
            return Ok(response);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/DisplayRegular")]
        public List<Regular> DisplayRegular([FromBody] DisplayRegular data)
        {
            List<Regular> regulars = m_teamManager.GetLoadManager().LoadRegulars(data.SiteID);

            return regulars;
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/DisplayRegularMember")]        
        public string DisplayRegularMember([FromBody] DisplayRegular data)
        {
            List<RegularMember> regularMembers = m_teamManager.GetLoadManager().LoadRegularMembers(data.SiteID);
            if (regularMembers == null)
                return null;

            return JsonConvert.SerializeObject(regularMembers);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/DisplayTemporary")]
        public List<Temporary> DisplayTemporary([FromBody] DisplayTemporary param)
        {
            List<Temporary> temporaries = m_teamManager.GetLoadManager().LoadTemporaries(param.IsNormal, param.SiteID);
            if (temporaries == null)
                return null;

            return temporaries;
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/DisplayTemporaryMember")]
        public string DisplayTemporaryMember([FromBody] DisplayTemporaryMember param)
        {
            int nID = param.ID;
            bool bIsNoraml = param.IsNormal;
            string strErrorMessage;

            List<RegularmemberTemporarymember> temporaryMembers =
                m_teamManager.TeamDataManager.GetSelectManager().JoinRegularMemberTemporaryMember(nID, bIsNoraml, out strErrorMessage);

            return JsonConvert.SerializeObject(temporaryMembers);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/RequestTemporaryMembers")]
        public IActionResult RequestTemporaryMembers()
        {
            ResponseTemporaryMembers result = m_teamManager.GetLoadManager().LoadTemporaryMembers();

            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/SaveUpdateData")]
        public IActionResult SaveUpdateData([FromBody] RequestSaveUpdateData data)
        {
            global::TeamEditor.BLL.Models.Response.MessageResult result = m_teamManager.GetSaveManager().SaveUpdateData(data);

            return Ok(result);
        }

        [HttpGet]
        [Route("/TeamEditor/TeamEdit/GetJobLevels")]
        public string GetJobLevels()
        {
            List<Options> options = m_teamManager.GetLoadManager().LoadJobLevel();
            return JsonConvert.SerializeObject(options);
        }

        [HttpGet]
        [Route("/TeamEditor/TeamEdit/GetJobPositions")]
        public string GetJobPositions()
        {
            List<Options> options = m_teamManager.GetLoadManager().LoadJobPosition();
            return JsonConvert.SerializeObject(options);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/UpdateRegularMember")]
        public IActionResult UpdateRegularMember([FromBody] RequestUpdateRegularMember data)
        {
            ResponseUpdateRegularMember result = m_teamManager.GetSaveManager().UpdateNipaRegularMember(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/RemoveRegularMembers")]
        public IActionResult RemoveRegularMembers([FromBody] RequestRemoveRegularMember data)
        {
            global::TeamEditor.BLL.Models.Response.MessageResult result = m_teamManager.GetSaveManager().RemoveRegularMembers(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/UpdateTemporaryMember")]
        public IActionResult UpdateTemporaryMember([FromBody] RequestUpdateTemporaryMember data)
        {
            ResponseUpdateTemporaryMember result = m_teamManager.GetSaveManager().UpdateTemporaryMember(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/RemoveTemporaryMembers")]
        public IActionResult RemoveTemporaryMembers([FromBody] RequestRemoveTemporaryMember data)
        {
            global::TeamEditor.BLL.Models.Response.MessageResult result = m_teamManager.GetSaveManager().RemoveTemporaryMembers(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/UpdateRegularTeam")]
        [ProducesResponseType(typeof(ResponseUpdateRegularTeam), 200)]
        public IActionResult UpdateRegularTeam([FromBody] RequestUpdateRegularTeam data)
        {
            ResponseUpdateRegularTeam result = m_teamManager.GetSaveManager().UpdateRegularTeam(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/RemoveRegularTeams")]
        public IActionResult RemoveRegularTeams([FromBody] RequestRemoveRegularTeam data)
        {
            global::TeamEditor.BLL.Models.Response.MessageResult result = m_teamManager.GetSaveManager().RemoveRegularTeams(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/UpdateTemporaryTeam")]
        public IActionResult UpdateTemporaryTeam([FromBody] RequestUpdateTemporaryTeam data)
        {
            ResponseUpdateTemporaryTeam result = m_teamManager.GetSaveManager().UpdateTemporaryTeam(data);
            return Ok(result);
        }

        [HttpPost]
        [Route("/TeamEditor/TeamEdit/RemoveTemporaryTeams")]
        public IActionResult RemoveTemporaryTeams([FromBody] RequestRemoveTemporaryTeam data)
        {
            global::TeamEditor.BLL.Models.Response.MessageResult result = m_teamManager.GetSaveManager().RemoveTemporaryTeams(data);
            return Ok(result);
        }
    }
}
