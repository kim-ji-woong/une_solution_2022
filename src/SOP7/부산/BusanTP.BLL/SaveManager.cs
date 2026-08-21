using System;
using System.Collections.Generic;
using BusanTP.BLL.Models.Request;
using BusanTP.IDAL;
using BusanTP.BLL.Models.Response;
using BusanTP.Model;
using dnsDBUtil;
using SOPManager.Model.Sop.Account;
using SOPSimulator.BLL;
using TeamEditor.Model.Sop.Team;

namespace BusanTP.BLL
{
    public class SaveManager
    {
        SDMS.IDAL.IDataManager sdmsDataManager = null;
        IDataManager externalDataManager = null;
        SOPManager.IDAL.IDataManager sopDataManager = null;
        TeamEditor.IDAL.IDataManager teamDataManager = null;

        public SaveManager(IDataManager externalDataManager, SDMS.IDAL.IDataManager sdmsDataManager, SOPManager.IDAL.IDataManager sopDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            this.externalDataManager = externalDataManager;
            this.sdmsDataManager = sdmsDataManager;
            this.sopDataManager = sopDataManager;
            this.teamDataManager = teamDataManager;
        }
        
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        public MessageResult RequestSaveUser(RequestSaveUser data)
        {
            MessageResult response = new MessageResult();
            string strErrorMessage;
            
            int nUserLevel = data.UserLevel;
            if (nUserLevel == 0)
            {
                response.Success = false;
                response.Message = "UserLevel is required.";
                return response;
            }
            
            Dictionary<UserMemo.Fields, object> dicConditions = new Dictionary<UserMemo.Fields, object>();

            User originUser = sopDataManager.GetSelectManager().SelectUser(data.UserID, out strErrorMessage);

            dicConditions.Add(UserMemo.Fields.UserID, data.UserID);
            originUser.ID = data.UserID;
            originUser.UserLevel = data.UserLevel;
            if (!sopDataManager.GetUpdateManager().UpdateUser(originUser, null))
            {
                response.Success = false;
                response.Message = "Failed to update User.";
                return response;
            }
            
            if (data.UserID == 0)
            {
                response.Success = false;
                response.Message = "UserID is required.";
                return response;
            }
            
            List<UserMemo> originUserMemo = externalDataManager.GetSelectManager().SelectBusanUserMemos(dicConditions, null, null, out strErrorMessage);
            
            if (originUserMemo.Count == 0)
            {
                UserMemo addUserMemo = new UserMemo();
                addUserMemo.UserID = data.UserID;
                addUserMemo.Memo = data.Memo;
                
                if (externalDataManager.GetCreateManager().CreateBusanUserMemo(addUserMemo, out strErrorMessage) == null)
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }
            }
            else
            {
                Dictionary<UserMemo.Fields, object> dicSets = new Dictionary<UserMemo.Fields, object>();
                dicSets.Add(UserMemo.Fields.Memo, data.Memo);
                Dictionary<UserMemo.Fields, object> dicConditions2 = new Dictionary<UserMemo.Fields, object>();
                dicConditions2.Add(UserMemo.Fields.UserID, data.UserID);
                if (!externalDataManager.GetUpdateManager()
                    .UpdateBusanUserMemo(dicSets, dicConditions2, null, out strErrorMessage))
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }
            }

            response.Success = true;
            return response;
        }
        
        public MessageResult RequestRemoveUser(RequestRemoveUser data)
        {
            MessageResult response = new MessageResult();
            string strErrorMessage;
            
            if (data.UserID == 0)
            {
                response.Success = false;
                response.Message = "UserID is required.";
                return response;
            }
            
            // begin transaction batch
            IDataManager cloneExternalDataManager = externalDataManager.Clone();
            SOPManager.IDAL.IDataManager cloneSopDataManager = sopDataManager.Clone();
            
            Dictionary<UserMemo.Fields, object> dicConditions = new Dictionary<UserMemo.Fields, object>();
            dicConditions.Add(UserMemo.Fields.UserID, data.UserID);
            
            // AccountUser 삭제 및 관련 Foreign Key 걸려있는 데이터 삭제
            try
            {
                // 유저 삭제 관련 SopHistoryComponent , SopHistoryActionStep, SopCategoryVersion 업데이트
                // 유저 관련 정보 삭제 - 메모 , 세션, 사용자 고유 옵션
                if (cloneSopDataManager.BeginBatch() == false)
                    throw new ApplicationException("Failed to begin batch."); 
                
                if (!cloneSopDataManager.GetDeleteManager().DeleteOption(@$"{Option.Fields.UserID.ToString()} = {data.UserID}"))
                    throw new ApplicationException("Failed to delete option.");
                
                if (!cloneSopDataManager.GetDeleteManager().DeleteSession(data.UserID))
                    throw new ApplicationException("Failed to delete session.");
                
                if (cloneSopDataManager.BatchCommit() == false)
                    throw new ApplicationException("Failed to commit batch.");

                
            } catch (Exception e)
            {
                cloneSopDataManager.BatchRollback();
                response.Success = false;
                response.Message = e.Message;
                return response;
            }

            try
            {
                if (cloneExternalDataManager.BeginBatch() == false)
                    throw new ApplicationException("Failed to begin batch.");
                
                // 유저 메모 삭제
                if (!cloneExternalDataManager.GetDeleteManager()
                        .DeleteBusanUserMemo(dicConditions, null, out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);
                
                if (!cloneExternalDataManager.GetDeleteManager()
                        .DeleteUser(data.UserID, null, out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);

                if (cloneExternalDataManager.BatchCommit() == false)
                    throw new ApplicationException("Failed to commit batch.");
                
                
            } catch (Exception e)
            {
                cloneExternalDataManager.BatchRollback();
                response.Success = false;
                response.Message = e.Message;
                return response;
            }

            response.Success = true;
            return response;
        }

        public MessageResult RequestAddUser(RequestAddUser data)
        {
            MessageResult response = new MessageResult();

            string strErrorMessage;
            
            RegularMember member = teamDataManager.GetSelectManager().SelectRegularMember(data.MemberID, out strErrorMessage);
            
            string strSalt = MakeSalt();
            string strPassword = EncryptPassword("1234", strSalt);
            
            string strDecryptedPhoneNum = DecryptString(member.PhoneNumber);

            if (member.PhoneNumber != null && member.PhoneNumber.Length > 0)
            {
                String[] strArrPhoneNum = strDecryptedPhoneNum.Split('-');
                
                if (strArrPhoneNum.Length == 3)
                {
                    strPassword = EncryptPassword(strArrPhoneNum[2], strSalt);
                }
            }

            int nMemberID = -1;
            int nUserLevel = -1;
            int nSiteID = -1;
            string strUserID = "";
            string strNickName = "";
            string strPasswordCode = "";
            
            SOPManager.IDAL.IDataManager cloneSopDataManager = sopDataManager.Clone();

            if (data.MemberID != -1)
                nMemberID = data.MemberID;
            if (data.UserLevel != -1)
                nUserLevel = data.UserLevel;
            if (data.SiteID != -1)
                nSiteID = data.SiteID;
            if (data.UserID != null)
                strUserID = data.UserID;
            if (data.NickName != null)
                strNickName = data.NickName;
            
            try 
            {
                if (cloneSopDataManager.BeginBatch() == false)
                {
                    response.Success = false;
                    response.Message = "Failed to begin batch.";
                    return response;
                }

                User createdUser = cloneSopDataManager.GetCreateManager().CreateUser(
                    nMemberID, nUserLevel, strUserID, strPassword, strNickName, nSiteID, strSalt, strPasswordCode);

                if (createdUser == null)
                    throw new ApplicationException("Failed to create user.");
                
                /* Option 생성 (팝업창) */
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "statusPsmSensorInfo", "16%", "7%", "400px", "300px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "statusInfo", "6%", "25%", "617px", "312px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "miniMap", "54%", "29%", "254px", "300px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "eventMemo", "16%", "7%", "400px", "300px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "event", "34%", "27%", "600px", "300px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.GetCreateManager().CreateOption(
                        createdUser.ID, "popup", "simulation", "5%", "10%", "516px", "300px") == null)
                    throw new ApplicationException("Failed to create option.");
                
                if (cloneSopDataManager.BatchCommit() == false)
                    throw new ApplicationException("Failed to commit batch.");
                
            }
            catch (Exception e)
            {
                cloneSopDataManager.BatchRollback();
                
                response.Success = false;
                response.Message = e.Message;
                return response;
            }
            
            // 유저생성에 성공했으면 Member의 사번도 일치시킨다
            Dictionary<RegularMember.Fields, object> dicSets = new Dictionary<RegularMember.Fields, object>();
            Dictionary<RegularMember.Fields, object> dicConditions = new Dictionary<RegularMember.Fields, object>();
            dicSets.Add(RegularMember.Fields.MemberID, data.MemberID);
            dicConditions.Add(RegularMember.Fields.ID, data.MemberID);
            if (!teamDataManager.GetUpdateManager().UpdateRegularMember(dicSets, dicConditions, null, out strErrorMessage))
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.Message = strErrorMessage;
            response.Success = true;
            return response;
        }

        public MessageResult SendNewPassword(RequestSendPassword data, SMSManager smsManager)
        {
            MessageResult response = new MessageResult();

            string strErrorMessage;

            if (data.Enc != "" && data.Key != "")
            {
                string str = AesHelper.Decrypt(data.Enc, data.Key);
                int nIndex = str.IndexOf('|');

                if (nIndex > 0)
                {
                    string strConditions = string.Format("{0} = '{1}' AND {2} = '{3}'",
                        RegularMember.Fields.MemberName, data.Name,
                        RegularMember.Fields.PhoneNumber, data.Phone);
                    
                    List<RegularMember> members = teamDataManager.GetSelectManager().SelectRegularMembers(strConditions, out strErrorMessage);
                    RegularMember member = members[0];
                    
                    Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
                    dicConditions.Add(User.Fields.MemberID, member.ID);
                    List<User> users = sopDataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
                    User user = new User();
                    
                    // 전송할 PW
                    string strPW = str.Substring(0, nIndex).Trim();
                    
                    // 암호화 되어 저장될 PW
                    string strPwHash = str.Substring(nIndex + 1).Trim();
                    
                    user.Password = strPwHash;
                    
                    if (!sopDataManager.GetUpdateManager().UpdateUser(user, null))
                    {
                        response.Success = false;
                        response.Message = "Failed to update User. Error Message :  " + strErrorMessage;
                        return response;
                    }
                    
                    List<string> phoneNumbers = new List<string>();
                    phoneNumbers.Add(data.Phone);
                    
                    string message = "부산TP DT시스템 임시 비밀번호 : " + strPW;

                    if (smsManager.SendSMS(null, phoneNumbers, message)) // strCaller : 발신번호 , strPhoneNumbers : 수신번호 , strMessage : 메시지
                    {
                        response.Success = false;
                        response.Message = "Failed to send SMS.";
                        return response;
                    }

                }
            }
            
            return response;
        }
        
        private static string MakeSalt()
        {
            int length = 50;
            string strChars = "0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

            int charLength = strChars.Length;
            string strData = "";

            Random rand = new Random((int)DateTime.Now.ToBinary());

            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(0, charLength - 1);
                strData += strChars[index];
            }

            return strData;
        }
        
        private string EncryptPassword(string strPassword, string strSalt)
        {
            strPassword += strSalt;
            System.Security.Cryptography.SHA256Managed sha256Managed = new System.Security.Cryptography.SHA256Managed();
            byte[] encryptBytes = sha256Managed.ComputeHash(System.Text.Encoding.UTF8.GetBytes(strPassword));
            return BitConverter.ToString(encryptBytes).Replace("-", "").ToLower();
        }
        
        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return AES256Cipher.AES_decrypt(str, key);
        }
        
        private class AesHelper
        {
            private const int KeySize = 32;

            private static char[] BaseArr = MakeBaseArray();

            private static char[] MakeBaseArray()
            {
                char[] arr = new char[62];
                int i = 0;

                for (char ch = '0'; ch <= '9'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'a'; ch <= 'z'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'A'; ch <= 'Z'; ch++)
                {
                    arr[i++] = ch;
                }

                return arr;
            }

            public static string MakeRandomKey(long? num)
            {
                string strKey = "";
                int max = BaseArr.Length - 1;

                int seed = num == null ? DateTime.Now.GetHashCode() : (int)num;
                Random rand = new Random(seed);

                for (int i = 0; i < KeySize; i++)
                {
                    int nIndex = rand.Next(max);
                    strKey += BaseArr[nIndex];
                }

                return strKey;
            }

            /// <summary>  
            /// AES encryption algorithm  
            /// </summary>  
            /// <param name="input">plain string</param>  
            /// <param name="key">key (32 bit)</param>  

            public static string Encrypt(string input, string key)
            {
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream())
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, encryptor, System.Security.Cryptography.CryptoStreamMode.Write))
                        {
                            using (System.IO.StreamWriter swEncrypt = new System.IO.StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(input);
                            }
                            byte[] bytes = msEncrypt.ToArray();
                            return ByteArrayToHexString(bytes);
                        }
                    }
                }
            }

            /// <summary>  
            /// AES decryption  
            /// </summary>  
            /// <param name="input"> ciphertext byte array</param>  
            /// <param name="key">key (32 bit)</param>  
            /// <returns> returns the decrypted string</returns>  
            public static string Decrypt(string input, string key)
            {
                byte[] inputBytes = HexStringToByteArray(input);
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream(inputBytes))
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, decryptor, System.Security.Cryptography.CryptoStreamMode.Read))
                        {
                            using (System.IO.StreamReader srEncrypt = new System.IO.StreamReader(csEncrypt))
                            {
                                return srEncrypt.ReadToEnd();
                            }
                        }
                    }
                }
            }

            public static string GetHashCode(string input)
            {
                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);
                byte[] hashed = System.Security.Cryptography.SHA256.Create().ComputeHash(bytes);

                string strHashed = "";

                foreach (byte b in hashed)
                {
                    strHashed += string.Format("{0:x2}", b);
                }

                return strHashed;
            }

            /// <summary>
            /// Convert the specified hex string to a byte array
            /// </summary>
            /// <param name="s">hexadecimal string (eg "7F 2C 4A" or "7F2C4A")</param>
            /// <returns>byte array corresponding to hexadecimal string</returns>
            public static byte[] HexStringToByteArray(string s)
            {
                s = s.Replace(" ", "");
                byte[] buffer = new byte[s.Length / 2];
                for (int i = 0; i < s.Length; i += 2)
                    buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
                return buffer;
            }

            /// <summary>
            /// Convert a byte array into a formatted hex string
            /// </summary>
            /// <param name="data">byte array</param>
            /// <returns> formatted hexadecimal string</returns>
            public static string ByteArrayToHexString(byte[] data)
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder(data.Length * 3);
                foreach (byte b in data)
                {
                    //hexadecimal number
                    sb.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                    //16 digits separated by spaces
                    //sb.Append(Convert.ToString(b, 16).PadLeft(2, '0').PadRight(3, ' '));
                }
                return sb.ToString().ToUpper();
            }
        }
    }
}