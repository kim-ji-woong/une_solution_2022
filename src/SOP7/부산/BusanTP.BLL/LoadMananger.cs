using System;
using System.Collections;
using System.Collections.Generic;
using BusanTP.BLL.Models.Response;
using BusanTP.IDAL;
using BusanTP.Model;
using dnsDBUtil;
using SOPManager.BLL.Models;
using SOPManager.Model.Sop.Account;
using TeamEditor.Model.Sop.Team;

namespace BusanTP.BLL
{
    public class LoadManager
    {
        SDMS.IDAL.IDataManager sdmsDataManager = null;
        IDataManager externalDataManager = null;
        TeamEditor.IDAL.IDataManager teamDataManager = null;
        SOPManager.IDAL.IDataManager sopDataManager = null;
        
        public LoadManager(IDataManager externalDataManager, SDMS.IDAL.IDataManager sdmsDataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager)
        {
            this.externalDataManager = externalDataManager;
            this.sdmsDataManager = sdmsDataManager;
            this.teamDataManager = teamDataManager;
            this.sopDataManager = sopDataManager;
        }

        public ResponseExternalSensorGIS ReadExternalSensorGIS()
        {

            string strErrorMessage;
            ResponseExternalSensorGIS response = new ResponseExternalSensorGIS();
            
            response.SensorGISs = externalDataManager.GetSelectManager().SelectBusanExternalSensorGISs(null, null, out strErrorMessage);
            
            if (response.SensorGISs.Count == 0)
            {
                strErrorMessage = "No SensorGIS data found.";
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
        }

        public ResponseExternalPOIInfo ReadExternalPOIInfo()
        {
            string strErrorMessage;
            ResponseExternalPOIInfo response = new ResponseExternalPOIInfo();
            
            response.POIInfos = externalDataManager.GetSelectManager().SelectBusanExternalPOIInfos(null, null, out strErrorMessage);
            
            if (response.POIInfos.Count == 0)
            {
                strErrorMessage = "No POIInfo data found.";
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
            
        }

        public ResponseBusanUserMemo ReadBusanUserMemo()
        {
            string strErrorMessage;
            ResponseBusanUserMemo response = new ResponseBusanUserMemo();
            
            response.UserMemos = externalDataManager.GetSelectManager().SelectBusanUserMemos(null, null, out strErrorMessage);

            if (response.UserMemos == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
        }

        public ResponseAccountUsers GetAccountUsers()
        {
            ResponseAccountUsers response = new ResponseAccountUsers();
            string strErrorMessage;

            // JobLevel 불러오기
            string strCondition = " PropertyName = 'JobLevel'";
            List<Options> options = teamDataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);
            if (options == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            Dictionary<int, JobLevel> dicJobLevel = new Dictionary<int, JobLevel>();
            foreach(Options option in options)
            {
                JobLevel level = new JobLevel();
                level.ID = option.PropertyID;
                level.Name = option.PropertyValue;

                dicJobLevel[option.PropertyID] = level;
            }
            
            // JobPosition 불러오기
            strCondition = " PropertyName = 'JobPosition'";
            options = teamDataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);
            if (options == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            Dictionary<int, JobPosition> dicJobPosition = new Dictionary<int, JobPosition>();
            foreach (Options option in options)
            {
                JobPosition position = new JobPosition();
                position.ID = option.PropertyID;
                position.Name = option.PropertyValue;

                dicJobPosition[option.PropertyID] = position;
            }
            
            // 계정정보 불러오기
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            List<User> users = sopDataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);

            if (users == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            // 계정 권한 불ㄹ러오기
            Dictionary<Level.Fields, object> dicLevelConditions = new Dictionary<Level.Fields, object>();
            List<Level> levels = sopDataManager.GetSelectManager().SelectLevels(dicLevelConditions, out strErrorMessage);
            
            if (levels == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            // 정규 조직원 불러오기
            strCondition = string.Format("{0}.{1} is NOT NULL AND {0}.{1} != ''", RegularMember.GetTableName(), RegularMember.Fields.MemberID);

            ArrayList arrDatas = teamDataManager.GetSelectManager()
                .JoinRegularRegularMember(strCondition, out strErrorMessage);
            
            if (arrDatas == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            int nDataCount = arrDatas.Count;
            
            List<AccountUser> accountUsers = new List<AccountUser>();

            for (int i = 0; i < nDataCount; i += 2)
            {
                if (arrDatas[i] is Regular && arrDatas[i + 1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[i];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 1];

                    AccountUser accountUser = new AccountUser();
                    accountUser.ID = regularMember.ID;
                    accountUser.Regular = regular;
                    accountUser.MemberID = regularMember.MemberID;
                    accountUser.MemberName = regularMember.MemberName;
                    accountUser.Email = regularMember.Email;

                    if (regularMember.OfficePhoneNumber != null)
                        accountUser.OfficePhoneNumber = regularMember.OfficePhoneNumber;

                    if (regularMember.PhoneNumber != null)
                        accountUser.PhoneNumber = DecryptString(regularMember.PhoneNumber);

                    if (regularMember.JobLevelID != null && dicJobLevel.ContainsKey((int)regularMember.JobLevelID))
                        accountUser.JobLevel = dicJobLevel[(int)regularMember.JobLevelID];

                    if (regularMember.JobPositionID != null && dicJobPosition.ContainsKey((int)regularMember.JobPositionID))
                        accountUser.JobPosition = dicJobPosition[(int)regularMember.JobPositionID];

                    User user = users.Find(x => x.MemberID == regularMember.ID);
                    if (user != null)
                    {
                        accountUser.AccountID = user.ID;
                        accountUser.UserID = user.UserID;
                        accountUser.NickName = user.NickName;
                        accountUser.Password = user.Password;

                        Level level = levels.Find(x => x.ID == user.UserLevel);
                        if (level != null)
                            accountUser.AccountLevel = level;

                    }

                    accountUsers.Add(accountUser);
                }
            }
            
            response.Success = true;
            response.AccountUsers = accountUsers;

            return response;
        }

        public ResponseTestMode ReadTestOptions()
        {
            string strErrorMessage;
            
            ResponseTestMode response = new ResponseTestMode();
            
            List<TestOptions> testOptions = externalDataManager.GetSelectManager().SelectBusanTestOptions(null, null, out strErrorMessage);
            
            // 옵션 없으면 DB 확인해 봐야 함
            if (testOptions == null)
            {
                Logger.Instance.Write("ReadTestOptions is failed (BusanTestOption Table is null) : " + strErrorMessage);
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }
            
            TestOptions testOption = testOptions[0];

            if (testOption.PropertyName == "IsTest")
            {
                response.TestMode = testOption.PropertyValue == "True" ? true : false;
            }
            
            List<TestEvent> testEvents = externalDataManager.GetSelectManager().SelectBusanTestEvents(null, null, out strErrorMessage);
            
            if (testEvents == null)
            {
                Logger.Instance.Write("ReadTestOptions is failed (BusanTestEvent Table is null) : " + strErrorMessage);
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }
            
            response.TestEvents = testEvents;
            response.Success = true;

            return response;
        } 
        
        public ResponseWeatherSensorDataHistory ReadWeatherSensorDataHistory()
        {
            string strErrorMessage;
            ResponseWeatherSensorDataHistory response = new ResponseWeatherSensorDataHistory();
            
            response.WeatherSensorDataHistories = externalDataManager.GetSelectManager().SelectBusanWeatherSensorDataHistory(null, null, out strErrorMessage);
            
            if (response.WeatherSensorDataHistories.Count == 0)
            {
                strErrorMessage = "No WeatherSensorDataHistory data found.";
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
        }
        
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });
        
        public static string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return AES256Cipher.AES_decrypt(str, key);
        }
        
    }
}