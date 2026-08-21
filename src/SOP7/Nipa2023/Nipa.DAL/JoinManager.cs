using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Weather;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Account;
using Nipa.Model.Sop.Team;
using Nipa.Model.Sdms.Spatial;
using Nipa.Model.Sdms.CCTV;
using System.Text;

namespace Nipa.DAL
{
    public class JoinManager : SelectManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public ArrayList JoinRegularRegularMember(string strAdditionalConditions, out string strErrorMessage)
        {
            Regular team = new Regular();
            RegularMember member = new RegularMember();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                team.GetTableName(), member.GetTableName(),
                Regular.Fields.ID, RegularMember.Fields.RegularID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nTeamFieldCount = team.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                team = new Regular();
                member = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nTeamFieldCount)
                    {
                        ReadRegular(pair.Key, pair.Value, team);
                    }
                    else
                    {
                        ReadRegularMember(pair.Key, pair.Value, member);
                    }

                    nIndex++;
                }

                arrDatas.Add(team);
                arrDatas.Add(member);
            }

            return arrDatas;
        }

        public ArrayList JoinUserRegularRegularMember(string strAdditionalConditions, out string strErrorMessage)
        {
            User user = new User();
            Regular regular = new Regular();
            RegularMember member = new RegularMember();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = c.{4} and c.{5} = b.{6}",
                user.GetTableName(), regular.GetTableName(), member.GetTableName(),
                User.Fields.MemberID, RegularMember.Fields.ID,
                RegularMember.Fields.RegularID, Regular.Fields.ID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nUserFieldCount = user.GetFieldCount();
            int nRegularFieldCount = regular.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                user = new User();
                regular = new Regular();
                member = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nUserFieldCount)
                    {
                        ReadUser(pair.Key, pair.Value, user);
                    }
                    else if (nIndex < nUserFieldCount + nRegularFieldCount)
                    {
                        ReadRegular(pair.Key, pair.Value, regular);
                    }
                    else
                    {
                        ReadRegularMember(pair.Key, pair.Value, member);
                    }

                    nIndex++;
                }

                arrDatas.Add(user);
                arrDatas.Add(regular);
                arrDatas.Add(member);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneTagInfoEtcMaterial(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();
            Material material = new Material();
            ETC etc = new ETC();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c, {3} d where a.{4} = b.{5} and a.{6} = d.{7} and d.{8} = c.{9} and a.{10} = d.{8}",
                sensorZone.GetTableName(), tagInfo.GetTableName(), material.GetTableName(), etc.GetTableName(),
                SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.OrgSensorID, ETC.Fields.ID,
                ETC.Fields.MaterialType, Material.Fields.ID,
                SensorZone.Fields.SensorType);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nTagInfoFieldCount = tagInfo.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nTagInfoFieldCount)
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }
                    else
                    {
                        ReadMaterial(pair.Key, pair.Value, material);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneTagInfoEtcMaterial(int etcMaterialType, string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();
            Material material = new Material();
            ETC etc = new ETC();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c, {3} d where a.{4} = b.{5} and a.{6} = d.{7} and d.{8} = c.{9} and a.{10} = {11}",
                sensorZone.GetTableName(), tagInfo.GetTableName(), material.GetTableName(), etc.GetTableName(),
                SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.OrgSensorID, ETC.Fields.ID,
                ETC.Fields.MaterialType, Material.Fields.ID,
                SensorZone.Fields.SensorType, etcMaterialType);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nTagInfoFieldCount = tagInfo.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nTagInfoFieldCount)
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }
                    else
                    {
                        ReadMaterial(pair.Key, pair.Value, material);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneTagInfoPSMMaterial(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();
            Material material = new Material();
            PSM psm = new PSM();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c, {3} d where a.{4} = b.{5} and a.{6} = d.{7} and d.{8} = c.{9} and a.{10} = d.{8}",
                sensorZone.GetTableName(), tagInfo.GetTableName(), material.GetTableName(), psm.GetTableName(),
                SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.OrgSensorID, PSM.Fields.ID,
                PSM.Fields.MaterialType, Material.Fields.ID,
                SensorZone.Fields.SensorType);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nTagInfoFieldCount = tagInfo.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nTagInfoFieldCount)
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }
                    else
                    {
                        ReadMaterial(pair.Key, pair.Value, material);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneTagInfoPSMMaterial(int psmMaterialType, string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();
            Material material = new Material();
            PSM psm = new PSM();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c, {3} d where a.{4} = b.{5} and a.{6} = d.{7} and d.{8} = c.{9} and a.{10} = {11}",
                sensorZone.GetTableName(), tagInfo.GetTableName(), material.GetTableName(), psm.GetTableName(),
                SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.OrgSensorID, PSM.Fields.ID,
                PSM.Fields.MaterialType, Material.Fields.ID,
                SensorZone.Fields.SensorType, psmMaterialType);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nTagInfoFieldCount = tagInfo.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nTagInfoFieldCount)
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }
                    else
                    {
                        ReadMaterial(pair.Key, pair.Value, material);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        private void ReadMaterial(string strFieldName, object value, Material material)
        {
            if (strFieldName == Material.Fields.ID.ToString())
                material.ID = (int)value;
            else if (strFieldName == Material.Fields.MaterialName.ToString())
                material.MaterialName = (string)value;
            else if (strFieldName == Material.Fields.UOM.ToString())
                material.UOM = (string)value;
            else if (strFieldName == Material.Fields.SiteID.ToString())
                material.SiteID = (int)value;
            else if (strFieldName == Material.Fields.Description.ToString())
                material.Description = (string)value;
        }

        public ArrayList JoinSensorZoneTagInfo(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}", sensorZone.GetTableName(), tagInfo.GetTableName(), SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
            }

            return arrDatas;
        }

        private void ReadSensorZone(string strFieldName, object value, SensorZone sensorZone)
        {
            if (strFieldName == SensorZone.Fields.ID.ToString())
                sensorZone.ID = (int)value;
            else if (strFieldName == SensorZone.Fields.SensorType.ToString())
                sensorZone.SensorType = (int)value;
            else if (strFieldName == SensorZone.Fields.OrgSensorID.ToString())
            {
                if (value == null)
                    sensorZone.OrgSensorID = null;
                else
                    sensorZone.OrgSensorID = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.EquipZoneID.ToString())
                sensorZone.EquipZoneID = (int)value;
            else if (strFieldName == SensorZone.Fields.IsAlarmStatus.ToString())
                sensorZone.IsAlarmStatus = (bool)value;
            else if (strFieldName == SensorZone.Fields.Data.ToString())
            {
                if (value == null)
                    sensorZone.Data = null;
                else
                    sensorZone.Data = (int)value;
            }
        }

        private void ReadTagInfo(string strFieldName, object value, TagInfo tagInfo)
        {
            if (strFieldName == TagInfo.Fields.ID.ToString())
                tagInfo.ID = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorServerID.ToString())
                tagInfo.SensorServerID = (int)value;
            else if (strFieldName == TagInfo.Fields.TagNo.ToString())
                tagInfo.TagNo = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorZoneID.ToString())
            {
                if (value == null)
                    tagInfo.SensorZoneID = null;
                else
                    tagInfo.SensorZoneID = (int)value;
            }
            else if (strFieldName == TagInfo.Fields.Activate.ToString())
                tagInfo.Activate = (int)value;
            else if (strFieldName == TagInfo.Fields.Description.ToString())
            {
                if (value == null)
                    tagInfo.Description = null;
                else
                    tagInfo.Description = (string)value;
            }
        }

        public ArrayList JoinSiteCurrent(string strAdditionalConditions, out string strErrorMessage)
        {
            Site site = new Site();
            Current current = new Current();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}", site.GetTableName(), current.GetTableName(), Site.Fields.ID, Current.Fields.WeatherSiteID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSiteFieldCount = site.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                site = new Site();
                current = new Current();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSiteFieldCount)
                    {
                        ReadSite(pair.Key, pair.Value, site);
                    }
                    else
                    {
                        ReadCurrent(pair.Key, pair.Value, current);
                    }

                    nIndex++;
                }

                arrDatas.Add(site);
                arrDatas.Add(current);
            }

            return arrDatas;
        }

        private void ReadSite(string strFieldName, object value, Site site)
        {
            if (strFieldName == Site.Fields.ID.ToString())
                site.ID = (int)value;
            else if (strFieldName == Site.Fields.Name.ToString())
                site.Name = (string)value;
            else if (strFieldName == Site.Fields.Description.ToString())
                site.Description = value == null ? null : (string)value;
        }

        private void ReadCurrent(string strFieldName, object value, Current current)
        {
            if (strFieldName == Current.Fields.WeatherSiteID.ToString())
                current.WeatherSiteID = (int)value;
            else if (strFieldName == Current.Fields.Temperature.ToString())
                current.Temperature = (double)value;
            else if (strFieldName == Current.Fields.SensibleTemp.ToString())
            {
                if (value == null)
                    current.SensibleTemp = null;
                else
                    current.SensibleTemp = (double)value;
            }
            else if (strFieldName == Current.Fields.Rain.ToString())
                current.Rain = (double)value;
            else if (strFieldName == Current.Fields.Humidity.ToString())
                current.Humidity = (double)value;
            else if (strFieldName == Current.Fields.WindSpeed.ToString())
            {
                if (value == null)
                    current.WindSpeed = null;
                else
                    current.WindSpeed = (double)value;
            }
            else if (strFieldName == Current.Fields.WindDirection.ToString())
            {
                if (value == null)
                    current.WindDirection = null;
                else
                    current.WindDirection = (int)value;
            }
            else if (strFieldName == Current.Fields.Atm.ToString())
            {
                if (value == null)
                    current.Atm = null;
                else
                    current.Atm = (double)value;
            }
            else if (strFieldName == Current.Fields.UpdateTime.ToString())
            {
                current.UpdateTime = (DateTime)value;
            }
            else if (strFieldName == Current.Fields.State.ToString())
            {
                if (value == null)
                    current.State = null;
                else
                    current.State = (int)value;
            }
        }

        public ArrayList JoinSessionUserLevel(string strAdditionalConditions, out string strErrorMessage)
        {
            Session session = new Session();
            User user = new User();
            Level level = new Level();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6}",
                session.GetTableName(), user.GetTableName(), level.GetTableName(),
                Session.Fields.AccountUserID, User.Fields.ID,
                User.Fields.UserLevel, Level.Fields.ID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSessionFieldCount = session.GetFieldCount();
            int nUserFieldCount = user.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                session = new Session();
                user = new User();
                level = new Level();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSessionFieldCount)
                    {
                        ReadSession(pair.Key, pair.Value, session);
                    }
                    else if (nIndex < nSessionFieldCount + nUserFieldCount)
                    {
                        ReadUser(pair.Key, pair.Value, user);
                    }
                    else
                    {
                        ReadLevel(pair.Key, pair.Value, level);
                    }

                    nIndex++;
                }

                arrDatas.Add(session);
                arrDatas.Add(user);
                arrDatas.Add(level);
            }

            return arrDatas;
        }

        private void ReadSession(string strFieldName, object value, Session session)
        {
            if (strFieldName == Session.Fields.ID.ToString())
                session.ID = (int)value;
            else if (strFieldName == Session.Fields.AccountUserID.ToString())
                session.AccountUserID = (int)value;
            else if (strFieldName == Session.Fields.SessionKey.ToString())
                session.SessionKey = (string)value;
            else if (strFieldName == Session.Fields.CreateDate.ToString())
                session.CreateDate = (DateTime)value;
            else if (strFieldName == Session.Fields.UpdateDate.ToString())
                session.UpdateDate = (DateTime)value;
            else if (strFieldName == Session.Fields.IsAutoLogin.ToString())
                session.IsAutoLogin = (bool)value;
        }

        private void ReadUser(string strFieldName, object value, User user)
        {
            if (strFieldName == User.Fields.ID.ToString())
                user.ID = (int)value;
            else if (strFieldName == User.Fields.UserLevel.ToString())
                user.UserLevel = (int)value;
            else if (strFieldName == User.Fields.Password.ToString())
                user.Password = (string)value;
            else if (strFieldName == User.Fields.UserID.ToString())
                user.UserID = (string)value;
            else if (strFieldName == User.Fields.NickName.ToString())
                user.NickName = (string)value;
            else if (strFieldName == User.Fields.PasswordCode.ToString())
                user.PasswordCode = (string)value;
            else if (strFieldName == User.Fields.Salt.ToString())
                user.Salt = (string)value;
            else if (strFieldName == User.Fields.SiteID.ToString())
                user.SiteID = (int)value;
            else if (strFieldName == User.Fields.MemberID.ToString())
            {
                if (value != null)
                    user.MemberID = (int)value;
            }
        }

        private void ReadRegular(string strFieldName, object value, Regular team)
        {
            if (strFieldName == Regular.Fields.ID.ToString())
                team.ID = (int)value;
            else if (strFieldName == Regular.Fields.TeamName.ToString())
                team.TeamName = (string)value;
            else if (strFieldName == Regular.Fields.ParentTeamID.ToString())
            {
                if (value == null)
                    team.ParentTeamID = null;
                else
                    team.ParentTeamID = (int)value;
            }
            else if (strFieldName == Regular.Fields.SiteID.ToString())
                team.SiteID = (int)value;
        }

        private void ReadRegularMember(string strFieldName, object value, RegularMember member)
        {
            if (strFieldName == RegularMember.Fields.ID.ToString())
                member.ID = (int)value;
            else if (strFieldName == RegularMember.Fields.RegularID.ToString())
                member.RegularID = (int)value;
            else if (strFieldName == RegularMember.Fields.MemberName.ToString())
                member.MemberName = (string)value;
            else if (strFieldName == RegularMember.Fields.MemberID.ToString())
                member.MemberID = (string)value;
            else if (strFieldName == RegularMember.Fields.OfficePhoneNumber.ToString())
                member.OfficePhoneNumber = (string)value;
            else if (strFieldName == RegularMember.Fields.PhoneNumber.ToString())
                member.PhoneNumber = (string)value;
            else if (strFieldName == RegularMember.Fields.JobLevelID.ToString())
            {
                if (value != null)
                    member.JobLevelID = (int)value;
                else
                    member.JobLevelID = null;
            }
            else if (strFieldName == RegularMember.Fields.JobPositionID.ToString())
            {
                if (value != null)
                    member.JobPositionID = (int)value;
                else
                    member.JobPositionID = null;
            }
            else if (strFieldName == RegularMember.Fields.Email.ToString())
                member.Email = (string)value;
            else if (strFieldName == RegularMember.Fields.StatusID.ToString())
                member.StatusID = (int)value;
        }

        private void ReadLevel(string strFieldName, object value, Level level)
        {
            if (strFieldName == Level.Fields.ID.ToString())
                level.ID = (int)value;
            else if (strFieldName == Level.Fields.LevelName.ToString())
                level.LevelName = (string)value;
        }

        public ArrayList JoinZoneZoneData(string strAdditionalConditions, out string strErrorMessage)
        {
            Zone zone = new Zone();
            ZoneData zoneData = new ZoneData();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                zone.GetTableName(), zoneData.GetTableName(),
                Zone.Fields.ID, ZoneData.Fields.ZoneID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nZoneFieldCount = zone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                zone = new Zone();
                zoneData = new ZoneData();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nZoneFieldCount)
                    {
                        ReadZone(pair.Key, pair.Value, zone);
                    }
                    else
                    {
                        ReadZoneData(pair.Key, pair.Value, zoneData);
                    }

                    nIndex++;
                }

                arrDatas.Add(zone);
                arrDatas.Add(zoneData);
            }

            return arrDatas;
        }

        private void ReadZone(string strFieldName, object value, Zone zone)
        {
            if (strFieldName == Zone.Fields.ID.ToString())
                zone.ID = (int)value;
            else if (strFieldName == Zone.Fields.ZoneName.ToString())
                zone.ZoneName = (string)value;
            else if (strFieldName == Zone.Fields.BuildingID.ToString())
            {
                if (value != null)
                    zone.BuildingID = (int)value;
            }
            else if (strFieldName == Zone.Fields.FloorIndex.ToString())
            {
                if (value != null)
                    zone.FloorIndex = (int)value;
            }
            else if (strFieldName == Zone.Fields.AddFloor.ToString())
            {
                if (value != null)
                    zone.AddFloor = (double)value;
            }
            else if (strFieldName == Zone.Fields.Boundary.ToString())
                zone.Boundary = (string)value;
            else if (strFieldName == Zone.Fields.TextCenter.ToString())
                zone.TextCenter = (string)value;
            else if (strFieldName == Zone.Fields.BroadcastText.ToString())
                zone.BroadcastText = (string)value;
            else if (strFieldName == Zone.Fields.DisplayText.ToString())
                zone.DisplayText = (string)value;
            else if (strFieldName == Zone.Fields.SiteID.ToString())
            {
                if (value != null)
                    zone.SiteID = (int)value;
            }
        }

        private void ReadZoneData(string strFieldName, object value, ZoneData zoneData)
        {
            if (strFieldName == ZoneData.Fields.ZoneID.ToString())
            {
                if (value != null)
                    zoneData.ZoneID = (int)value;
            }
            else if (strFieldName == ZoneData.Fields.FakeWallElevation.ToString())
            {
                if (value != null)
                    zoneData.FakeWallElevation = (double)value;
            }
            else if (strFieldName == ZoneData.Fields.PoiElevation.ToString())
            {
                if (value != null)
                    zoneData.PoiElevation = (double)value;
            }
            else if (strFieldName == ZoneData.Fields.ObjectID.ToString())
                zoneData.ObjectID = (string)value;
            else if (strFieldName == ZoneData.Fields.CameraPositionX.ToString())
            {
                if (value != null)
                    zoneData.CameraPositionX = (float)(double)value;
            }
            else if (strFieldName == ZoneData.Fields.CameraPositionY.ToString())
            {
                if (value != null)
                    zoneData.CameraPositionY = (float)(double)value;
            }
            else if (strFieldName == ZoneData.Fields.CameraPositionZ.ToString())
            {
                if (value != null)
                    zoneData.CameraPositionZ = (float)(double)value;
            }
            else if (strFieldName == ZoneData.Fields.CameraRotationX.ToString())
            {
                if (value != null)
                    zoneData.CameraRotationX = (float)(double)value;
            }
            else if (strFieldName == ZoneData.Fields.CameraRotationY.ToString())
            {
                if (value != null)
                    zoneData.CameraRotationY = (float)(double)value;
            }
            else if (strFieldName == ZoneData.Fields.CameraRotationZ.ToString())
            {
                if (value != null)
                    zoneData.CameraRotationZ = (float)(double)value;
            }
        }

        public ArrayList JoinSensorZoneSensorZoneHistory(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                sensorZone.GetTableName(), sensorZoneHistory.GetTableName(),
                SensorZone.Fields.ID, Model.Sdms.History.SensorZone.Fields.SensorZoneID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                sensorZoneHistory = new Model.Sdms.History.SensorZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(sensorZoneHistory);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneSensorZoneHistorySensorReactionHistoryFromCurrentAlarm(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();
            Model.Sdms.History.SensorReaction sensorReactionHistory = new Model.Sdms.History.SensorReaction();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6} and c.{7} = 0 and c.{6} in (Select {8} from {9})",
                sensorZone.GetTableName(), sensorZoneHistory.GetTableName(), sensorReactionHistory.GetTableName(),
                SensorZone.Fields.ID, Model.Sdms.History.SensorZone.Fields.SensorZoneID,
                Model.Sdms.History.SensorZone.Fields.ID, Model.Sdms.History.SensorReaction.Fields.SensorZoneHistoryID,
                Model.Sdms.History.SensorReaction.Fields.ReactionType,
                Model.Sdms.Alarm.Current.Fields.SensorZoneHistoryID, Model.Sdms.Alarm.Current.TableName);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                sensorZoneHistory = new Model.Sdms.History.SensorZone();
                sensorReactionHistory = new Model.Sdms.History.SensorReaction();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadSensorReactionHistory(pair.Key, pair.Value, sensorReactionHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorReactionHistory);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneSensorZoneHistorySensorReactionHistory(string strAdditionalConditions, out string strErrorMessage)
        {
            List<int> reactionTypes = new List<int>();
            reactionTypes.Add(0);
            return JoinSensorZoneSensorZoneHistorySensorReactionHistory(strAdditionalConditions, reactionTypes, out strErrorMessage);
        }

        public ArrayList JoinSensorZoneSensorZoneHistorySensorReactionHistory(string strAdditionalConditions, List<int> reactionTypes, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();
            Model.Sdms.History.SensorReaction sensorReactionHistory = new Model.Sdms.History.SensorReaction();

            if (reactionTypes.Count == 0)
            {
                strErrorMessage = null;
                return new ArrayList();
            }

            string strReactionTypeCondition = "";

            if (reactionTypes.Count == 1)
                strReactionTypeCondition = "c.{7} = " + reactionTypes[0].ToString();
            else
                strReactionTypeCondition = "c.{7} in (" + string.Join(", ", reactionTypes.ToArray()) + ")";

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6} and " + strReactionTypeCondition,
                sensorZone.GetTableName(), sensorZoneHistory.GetTableName(), sensorReactionHistory.GetTableName(),
                SensorZone.Fields.ID, Model.Sdms.History.SensorZone.Fields.SensorZoneID,
                Model.Sdms.History.SensorZone.Fields.ID, Model.Sdms.History.SensorReaction.Fields.SensorZoneHistoryID,
                Model.Sdms.History.SensorReaction.Fields.ReactionType);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                sensorZoneHistory = new Model.Sdms.History.SensorZone();
                sensorReactionHistory = new Model.Sdms.History.SensorReaction();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadSensorReactionHistory(pair.Key, pair.Value, sensorReactionHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorReactionHistory);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneHistorySensorReactionHistory(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();
            Model.Sdms.History.SensorReaction sensorReactionHistory = new Model.Sdms.History.SensorReaction();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                sensorZoneHistory.GetTableName(), sensorReactionHistory.GetTableName(),
                Model.Sdms.History.SensorZone.Fields.ID, Model.Sdms.History.SensorReaction.Fields.SensorZoneHistoryID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Model.Sdms.History.SensorZone();
                sensorReactionHistory = new Model.Sdms.History.SensorReaction();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadSensorReactionHistory(pair.Key, pair.Value, sensorReactionHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorReactionHistory);
            }

            return arrDatas;
        }

        private void ReadSensorZoneHistory(string strFieldName, object value, Model.Sdms.History.SensorZone sensorZoneHistory)
        {
            if (strFieldName == Model.Sdms.History.SensorZone.Fields.ID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.ID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.SensorZoneID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SensorZoneID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.Data.ToString())
            {
                sensorZoneHistory.Data = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.Time.ToString())
            {
                if (value != null)
                    sensorZoneHistory.Time = (DateTime)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.ZoneID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.ZoneID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.SensorType.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SensorType = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.DetectionStatus.ToString())
            {
                if (value != null)
                    sensorZoneHistory.DetectionStatus = (int)value;
                else
                    sensorZoneHistory.DetectionStatus = null;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.SiteID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SiteID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.AllSensorZoneIDs.ToString())
            {
                sensorZoneHistory.AllSensorZoneIDs = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorZone.Fields.Memo.ToString())
            {
                sensorZoneHistory.Memo = (string)value;
            }
        }

        private void ReadSensorReactionHistory(string strFieldName, object value, Model.Sdms.History.SensorReaction sensorReactionHistory)
        {
            if (strFieldName == Model.Sdms.History.SensorReaction.Fields.ID.ToString())
            {
                if (value != null)
                    sensorReactionHistory.ID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.SensorZoneHistoryID.ToString())
            {
                if (value != null)
                    sensorReactionHistory.SensorZoneHistoryID = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.ReactionType.ToString())
            {
                sensorReactionHistory.ReactionType = (int)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Time.ToString())
            {
                if (value != null)
                    sensorReactionHistory.Time = (DateTime)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Message.ToString())
            {
                sensorReactionHistory.Message = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Param1.ToString())
            {
                sensorReactionHistory.Param1 = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Param2.ToString())
            {
                sensorReactionHistory.Param2 = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Param3.ToString())
            {
                sensorReactionHistory.Param3 = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Param4.ToString())
            {
                sensorReactionHistory.Param4 = (string)value;
            }
            else if (strFieldName == Model.Sdms.History.SensorReaction.Fields.Param5.ToString())
            {
                sensorReactionHistory.Param5 = (string)value;
            }
        }

        public ArrayList JoinSensorZoneHistoryActionStepHistory(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();
            Model.Sop.History.ActionStep actionStepHistory = new Model.Sop.History.ActionStep();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                sensorZoneHistory.GetTableName(), actionStepHistory.GetTableName(),
                Model.Sdms.History.SensorZone.Fields.ID, Model.Sop.History.ActionStep.Fields.SensorZoneHistoryID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Model.Sdms.History.SensorZone();
                actionStepHistory = new Model.Sop.History.ActionStep();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadActionStepHistory(pair.Key, pair.Value, actionStepHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(actionStepHistory);
            }

            return arrDatas;
        }

        private void ReadActionStepHistory(string strFieldName, object value, Model.Sop.History.ActionStep actionStepHistory)
        {
            if (strFieldName == Model.Sop.History.ActionStep.Fields.ID.ToString())
            {
                if (value != null)
                    actionStepHistory.ID = (int)value;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.ActionStepID.ToString())
            {
                if (value != null)
                    actionStepHistory.ActionStepID = (int)value;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.RealMode.ToString())
            {
                if (value != null)
                {
                    if (value is bool)
                        actionStepHistory.RealMode = (bool)value;
                    else if (value is int)
                        actionStepHistory.RealMode = (int)value == 1;
                }
                else
                    actionStepHistory.RealMode = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.BeginTime.ToString())
            {
                if (value != null)
                    actionStepHistory.BeginTime = (DateTime)value;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.EndTime.ToString())
            {
                if (value != null)
                    actionStepHistory.EndTime = (DateTime)value;
                else
                    actionStepHistory.EndTime = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.LastAccessedTime.ToString())
            {
                if (value != null)
                    actionStepHistory.LastAccessedTime = (DateTime)value;
                else
                    actionStepHistory.LastAccessedTime = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.DetectEndTime.ToString())
            {
                if (value != null)
                    actionStepHistory.DetectEndTime = (DateTime)value;
                else
                    actionStepHistory.DetectEndTime = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.Position.ToString())
            {
                actionStepHistory.Position = (string)value;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.LastAccessedUserID.ToString())
            {
                if (value != null)
                    actionStepHistory.LastAccessedUserID = (int)value;
                else
                    actionStepHistory.LastAccessedUserID = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.StartOption.ToString())
            {
                if (value != null)
                    actionStepHistory.StartOption = (int)value;
                else
                    actionStepHistory.StartOption = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.DisasterOption.ToString())
            {
                actionStepHistory.DisasterOption = (string)value;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.SensorZoneHistoryID.ToString())
            {
                if (value != null)
                    actionStepHistory.SensorZoneHistoryID = (int)value;
                else
                    actionStepHistory.SensorZoneHistoryID = null;
            }
            else if (strFieldName == Model.Sop.History.ActionStep.Fields.Description.ToString())
            {
                actionStepHistory.Description = (string)value;
            }
        }

        public ArrayList JoinSensorEtcSensorEtcData(string strAdditionalConditions, out string strErrorMessage)
        {
            ETC etc = new ETC();
            EtcData etcData = new EtcData();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                etc.GetTableName(), etcData.GetTableName(),
                ETC.Fields.ID, EtcData.Fields.SensorID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEtcFieldCount = etc.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                etc = new ETC();
                etcData = new EtcData();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEtcFieldCount)
                    {
                        ReadEtc(pair.Key, pair.Value, etc);
                    }
                    else
                    {
                        ReadEtcData(pair.Key, pair.Value, etcData);
                    }

                    nIndex++;
                }

                arrDatas.Add(etc);
                arrDatas.Add(etcData);
            }

            return arrDatas;
        }

        private void ReadEtc(string strFieldName, object value, ETC etc)
        {
            if (strFieldName == ETC.Fields.ID.ToString())
            {
                if (value != null)
                    etc.ID = (int)value;
            }
            else if (strFieldName == ETC.Fields.Name.ToString())
            {
                etc.Name = (string)value;
            }
            else if (strFieldName == ETC.Fields.PositionName.ToString())
            {
                etc.PositionName = (string)value;
            }
            else if (strFieldName == ETC.Fields.X.ToString())
            {
                if (value != null)
                    etc.X = (double)value;
                else
                    etc.X = null;
            }
            else if (strFieldName == ETC.Fields.Y.ToString())
            {
                if (value != null)
                    etc.Y = (double)value;
                else
                    etc.Y = null;
            }
            else if (strFieldName == ETC.Fields.Z.ToString())
            {
                if (value != null)
                    etc.Z = (double)value;
                else
                    etc.Z = null;
            }
            else if (strFieldName == ETC.Fields.CurrentData.ToString())
            {
                etc.CurrentData = (string)value;
            }
            else if (strFieldName == ETC.Fields.ZoneID.ToString())
            {
                if (value != null)
                    etc.ZoneID = (int)value;
            }
            else if (strFieldName == ETC.Fields.Department.ToString())
            {
                etc.Department = (string)value;
            }
            else if (strFieldName == ETC.Fields.DepartmentPhoneNumber.ToString())
            {
                etc.DepartmentPhoneNumber = (string)value;
            }
            else if (strFieldName == ETC.Fields.Enabled.ToString())
            {
                if (value != null)
                    etc.Enabled = (bool)value;
                else
                    etc.Enabled = null;
            }
            else if (strFieldName == ETC.Fields.Status.ToString())
            {
                if (value != null)
                    etc.Status = (int)value;
                else
                    etc.Status = null;
            }
            else if (strFieldName == ETC.Fields.UniqueKey.ToString())
            {
                etc.UniqueKey = (string)value;
            }
            else if (strFieldName == ETC.Fields.MaterialType.ToString())
            {
                if (value != null)
                    etc.MaterialType = (int)value;
                else
                    etc.MaterialType = null;
            }
            else if (strFieldName == ETC.Fields.LimitBase.ToString())
            {
                etc.LimitBase = (string)value;
            }
            else if (strFieldName == ETC.Fields.LimitType.ToString())
            {
                if (value != null)
                    etc.LimitType = (int)value;
                else
                    etc.LimitType = null;
            }
            else if (strFieldName == ETC.Fields.LimitValue.ToString())
            {
                etc.LimitValue = (string)value;
            }
        }

        private void ReadEtcData(string strFieldName, object value, EtcData etcData)
        {
            if (strFieldName == EtcData.Fields.SensorID.ToString())
            {
                if (value != null)
                    etcData.SensorID = (int)value;
            }
            else if (strFieldName == EtcData.Fields.PropertyName.ToString())
            {
                etcData.PropertyName = (string)value;
            }
            else if (strFieldName == EtcData.Fields.PropertyValue.ToString())
            {
                etcData.PropertyValue = (string)value;
            }
            else if (strFieldName == EtcData.Fields.SiteID.ToString())
            {
                if (value != null)
                    etcData.SiteID = (int)value;
            }
            else if (strFieldName == EtcData.Fields.Description.ToString())
            {
                etcData.Description = (string)value;
            }
        }

        public ArrayList JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistoryZone(string strAdditionalConditions, out string strErrorMessage)
        {
            EquipmentZone equipZone = new EquipmentZone();
            Model.Sdms.History.SensorReaction sensorReactionHistory = new Model.Sdms.History.SensorReaction();
            SensorZone sensorZone = new SensorZone();
            Model.Sdms.History.SensorZone sensorZoneHistory = new Model.Sdms.History.SensorZone();
            Zone zone = new Zone();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.*, e.* from {0} a, {1} b, {2} c, {3} d, {4} e where a.{5} = c.{6} and c.{7} = d.{8} and d.{9} = b.{10} and d.{11} = e.{12}",
                equipZone.GetTableName(), sensorReactionHistory.GetTableName(), sensorZone.GetTableName(), sensorZoneHistory.GetTableName(), zone.GetTableName(),
                EquipmentZone.Fields.ID, SensorZone.Fields.EquipZoneID,
                SensorZone.Fields.ID, Model.Sdms.History.SensorZone.Fields.SensorZoneID,
                Model.Sdms.History.SensorZone.Fields.ID, Model.Sdms.History.SensorReaction.Fields.SensorZoneHistoryID,
                Model.Sdms.History.SensorZone.Fields.ZoneID, Zone.Fields.ID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEquipZoneFieldCount = equipZone.GetFieldCount();
            int nSensorReactionHistoryFieldCount = sensorReactionHistory.GetFieldCount();
            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                equipZone = new EquipmentZone();
                sensorReactionHistory = new Model.Sdms.History.SensorReaction();
                sensorZone = new SensorZone();
                sensorZoneHistory = new Model.Sdms.History.SensorZone();
                zone = new Zone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEquipZoneFieldCount)
                    {
                        ReadEquipmentZone(pair.Key, pair.Value, equipZone);
                    }
                    else if (nIndex < nEquipZoneFieldCount + nSensorReactionHistoryFieldCount)
                    {
                        ReadSensorReactionHistory(pair.Key, pair.Value, sensorReactionHistory);
                    }
                    else if (nIndex < nEquipZoneFieldCount + nSensorReactionHistoryFieldCount + nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nEquipZoneFieldCount + nSensorReactionHistoryFieldCount + nSensorZoneFieldCount + nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadZone(pair.Key, pair.Value, zone);
                    }

                    nIndex++;
                }

                arrDatas.Add(equipZone);
                arrDatas.Add(sensorReactionHistory);
                arrDatas.Add(sensorZone);
                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(zone);
            }

            return arrDatas;
        }

        private void ReadEquipmentZone(string strFieldName, object value, EquipmentZone equipZone)
        {
            if (strFieldName == EquipmentZone.Fields.ID.ToString())
            {
                if (value != null)
                    equipZone.ID = (int)value;
            }
            else if (strFieldName == EquipmentZone.Fields.ZoneName.ToString())
            {
                equipZone.ZoneName = (string)value;
            }
            else if (strFieldName == EquipmentZone.Fields.LinkedZoneIDList.ToString())
            {
                equipZone.LinkedZoneIDList = (string)value;
            }
            else if (strFieldName == EquipmentZone.Fields.Type.ToString())
            {
                if (value != null)
                    equipZone.Type = (int)value;
                else
                    equipZone.Type = null;
            }
            else if (strFieldName == EquipmentZone.Fields.TextCenter.ToString())
            {
                equipZone.TextCenter = (string)value;
            }
            else if (strFieldName == EquipmentZone.Fields.BroadcastText.ToString())
            {
                equipZone.BroadcastText = (string)value;
            }
            else if (strFieldName == EquipmentZone.Fields.DisplayText.ToString())
            {
                equipZone.DisplayText = (string)value;
            }
            else if (strFieldName == EquipmentZone.Fields.SiteID.ToString())
            {
                if (value != null)
                    equipZone.SiteID = (int)value;
            }
        }

        public ArrayList JoinSensorZoneSensors(string strAdditionalConditions, string strFireTypeIDs, string strPsmTypeIDs, string strEtcTypeIDs, string strCctvTypeIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Select {0}, {1}, {2}, ", SensorZone.Fields.ID, SensorZone.Fields.SensorType, SensorZone.Fields.OrgSensorID);
            sb.Append("             case ");
            sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as f Where f.ID = sz.OrgSensorID)"
                , SensorZone.Fields.SensorType, strFireTypeIDs, Fire.TableName);
            sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as p Where p.ID = sz.OrgSensorID)"
                , SensorZone.Fields.SensorType, strPsmTypeIDs, PSM.TableName);
            sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as p Where p.ID = sz.OrgSensorID)"
                , SensorZone.Fields.SensorType, strEtcTypeIDs, ETC.TableName);
            sb.AppendFormat("            when {0} in ({1}) then(select cameraName from {2} as p Where p.ID = sz.OrgSensorID)"
                , SensorZone.Fields.SensorType, strCctvTypeIDs, CCTV.TableName);
            sb.Append("              end as name ");
            sb.AppendFormat("  From {0} as sz ", SensorZone.TableName);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                sb.AppendFormat(" Where {0}", strAdditionalConditions);
            }

            IEnumerable<dynamic> result = this.Select(sb.ToString(), out strErrorMessage);

            if (result == null)
                return null;

            ArrayList arrDatas = new ArrayList();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nSensorZoneID = -1, nSensorType = -1;
                int? orgSensorID = null;
                string strSensorName = "";

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (pair.Key == SensorZone.Fields.ID.ToString())
                    {
                        if (pair.Value != null)
                            nSensorZoneID = (int)pair.Value;
                    }
                    else if (pair.Key == SensorZone.Fields.SensorType.ToString())
                    {
                        if (pair.Value != null)
                            nSensorType = (int)pair.Value;
                    }
                    else if (pair.Key == SensorZone.Fields.OrgSensorID.ToString())
                    {
                        if (pair.Value != null)
                            orgSensorID = (int)pair.Value;
                        else
                            orgSensorID = null;
                    }
                    else
                    {
                        strSensorName = (string)pair.Value;
                    }
                }

                arrDatas.Add(nSensorZoneID);
                arrDatas.Add(nSensorType);
                arrDatas.Add(orgSensorID);
                arrDatas.Add(strSensorName);
            }

            return arrDatas;
        }

        public ArrayList JoinBuildingGroupBuildingZone(string strAdditionalConditions, out string strErrorMessage)
        {
            BuildingGroup buildingGroup = new BuildingGroup();
            Building building = new Building();
            Zone zone = new Zone();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6}",
                buildingGroup.GetTableName(), building.GetTableName(), zone.GetTableName(),
                BuildingGroup.Fields.ID, Building.Fields.BuildingGroupID,
                Building.Fields.ID, Zone.Fields.BuildingID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nBuildingGroupFieldCount = buildingGroup.GetFieldCount();
            int nBuildingFieldCount = building.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                buildingGroup = new BuildingGroup();
                building = new Building();
                zone = new Zone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nBuildingGroupFieldCount)
                    {
                        ReadBuildingGroup(pair.Key, pair.Value, buildingGroup);
                    }
                    else if (nIndex < nBuildingGroupFieldCount + nBuildingFieldCount)
                    {
                        ReadBuilding(pair.Key, pair.Value, building);
                    }
                    else
                    {
                        ReadZone(pair.Key, pair.Value, zone);
                    }

                    nIndex++;
                }

                arrDatas.Add(buildingGroup);
                arrDatas.Add(building);
                arrDatas.Add(zone);
            }

            return arrDatas;
        }

        private void ReadBuildingGroup(string strFieldName, object value, BuildingGroup buildingGroup)
        {
            if (strFieldName == BuildingGroup.Fields.ID.ToString())
                buildingGroup.ID = (int)value;
            else if (strFieldName == BuildingGroup.Fields.GroupName.ToString())
                buildingGroup.GroupName = (string)value;
            else if (strFieldName == BuildingGroup.Fields.ParentID.ToString())
            {
                if (value != null)
                    buildingGroup.ParentID = (int)value;
                else
                    buildingGroup.ParentID = null;
            }
            else if (strFieldName == BuildingGroup.Fields.TextCenter.ToString())
            {
                buildingGroup.TextCenter = (string)value;
            }
            else if (strFieldName == BuildingGroup.Fields.DisplayText.ToString())
            {
                buildingGroup.DisplayText = (string)value;
            }
            else if (strFieldName == BuildingGroup.Fields.SiteID.ToString())
            {
                if (value != null)
                    buildingGroup.SiteID = (int)value;
            }
        }

        private void ReadBuilding(string strFieldName, object value, Building building)
        {
            if (strFieldName == Building.Fields.ID.ToString())
                building.ID = (int)value;
            else if (strFieldName == Building.Fields.BuildingCode.ToString())
                building.BuildingCode = (string)value;
            else if (strFieldName == Building.Fields.BuildingCode.ToString())
                building.BuildingName = (string)value;
            else if (strFieldName == Building.Fields.BuildingGroupID.ToString())
            {
                if (value != null)
                    building.BuildingGroupID = (int)value;
            }
            else if (strFieldName == Building.Fields.MaxFloor.ToString())
            {
                if (value != null)
                    building.MaxFloor = (int)value;
            }
            else if (strFieldName == Building.Fields.MinFloor.ToString())
            {
                if (value != null)
                    building.MinFloor = (int)value;
            }
            else if (strFieldName == Building.Fields.TextCenter.ToString())
            {
                building.TextCenter = (string)value;
            }
            else if (strFieldName == Building.Fields.BroadcastText.ToString())
            {
                building.BroadcastText = (string)value;
            }
            else if (strFieldName == Building.Fields.DisplayText.ToString())
            {
                building.DisplayText = (string)value;
            }
        }

        public ArrayList JoinMesEquipmentMesEquipmentData(string strAdditionalConditions, out string strErrorMessage)
        {
            Nipa.Model.Mes.Equipment.Equipment equipment = new Nipa.Model.Mes.Equipment.Equipment();
            Nipa.Model.Mes.Equipment.Data equipmentData = new Nipa.Model.Mes.Equipment.Data();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                equipment.GetTableName(), equipmentData.GetTableName(),
                Nipa.Model.Mes.Equipment.Equipment.Fields.ID, Nipa.Model.Mes.Equipment.Data.Fields.EqID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEquipmentFieldCount = equipment.GetFieldCount();
            int nEquipmentDataFieldCount = equipmentData.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                equipment = new Nipa.Model.Mes.Equipment.Equipment();
                equipmentData = new Nipa.Model.Mes.Equipment.Data();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEquipmentFieldCount)
                    {
                        ReadMesEquipment(pair.Key, pair.Value, equipment);
                    }
                    else
                    {
                        ReadMesEquipmentData(pair.Key, pair.Value, equipmentData);
                    }

                    nIndex++;
                }

                arrDatas.Add(equipment);
                arrDatas.Add(equipmentData);
            }

            return arrDatas;
        }

        private void ReadMesEquipment(string strFieldName, object value, Nipa.Model.Mes.Equipment.Equipment equipment)
        {
            if (strFieldName == Nipa.Model.Mes.Equipment.Equipment.Fields.ID.ToString())
                equipment.ID = (int)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Equipment.Fields.Name.ToString())
                equipment.Name = (string)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Equipment.Fields.Usable.ToString())
                equipment.Usable = (bool)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Equipment.Fields.SiteID.ToString())
                equipment.SiteID = (int)value;
        }

        private void ReadMesEquipmentData(string strFieldName, object value, Nipa.Model.Mes.Equipment.Data equipmentData)
        {
            if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.EqID.ToString())
                equipmentData.EqID = (int)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.ShotCount.ToString())
                equipmentData.ShotCount = (int)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.ShotTime.ToString())
                equipmentData.ShotTime = (DateTime)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.ProcessTime.ToString())
                equipmentData.ProcessTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.CushionPos.ToString())
                equipmentData.CushionPos = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MaxPressure.ToString())
                equipmentData.MaxPressure = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.TransferPos.ToString())
                equipmentData.TransferPos = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.TransferPressure.ToString())
                equipmentData.TransferPressure = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.InjectTime.ToString())
                equipmentData.InjectTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.HoldingPressure.ToString())
                equipmentData.HoldingPressure = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MeasureTime.ToString())
                equipmentData.MeasureTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MeasureStartPos.ToString())
                equipmentData.MeasureStartPos = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MeasureEndPos.ToString())
                equipmentData.MeasureEndPos = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.IcingTime.ToString())
                equipmentData.IcingTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MoldOpenTime.ToString())
                equipmentData.MoldOpenTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.MoldCloseTime.ToString())
                equipmentData.MoldCloseTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.FowardTime.ToString())
                equipmentData.FowardTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.BackwardTime.ToString())
                equipmentData.BackwardTime = (double)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.OK.ToString())
                equipmentData.OK = (bool)value;
            else if (strFieldName == Nipa.Model.Mes.Equipment.Data.Fields.TimeStamp.ToString())
                equipmentData.TimeStamp = (DateTime)value;
        }
    }
}
