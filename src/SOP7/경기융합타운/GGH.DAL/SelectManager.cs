using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using GGH.IDAL;
using GGH.Model.CCTV;
using GGH.Model;
using SDMS.Model.CCTV;
using GGH.Model.Equipment;

namespace GGH.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public Nvr SelectNvr(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<Nvr.Fields>(out nFieldCount), Nvr.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Nvr model = ReadNvr(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Nvr> SelectNvrs(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectNvrs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Nvr> SelectNvrs(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Nvr.Fields>(out nFieldCount), Nvr.TableName);

			string strCondition = "";

			if (SetCondition<Nvr.Fields>(ref strCondition, dicConditions, Nvr.GetFieldName, Nvr.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Nvr> datas = new List<Nvr>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Nvr model = ReadNvr(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Nvr ReadNvr(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Nvr model = new Nvr();
			bool isNullable;

			foreach (Nvr.Fields field in Nvr.Fields.GetValues(typeof(Nvr.Fields)))
			{
				string strFieldName = Nvr.GetFieldName(field, out isNullable);

				if (field == Nvr.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == Nvr.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == Nvr.Fields.Url)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Url = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Url = data;
					}
				}
				else if (field == Nvr.Fields.Description)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Description = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Description = data;
					}
				}

				index++;
			}

			return model;
		}


		public NvrLink SelectNvrLink(int cctvID, int nvrID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CctvID = {2} and NvrID = {3} ", 
				GetFieldNames<NvrLink.Fields>(out nFieldCount), NvrLink.TableName
				, cctvID
				, nvrID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				NvrLink model = ReadNvrLink(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<NvrLink> SelectNvrLinks(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectNvrLinks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<NvrLink> SelectNvrLinks(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<NvrLink.Fields>(out nFieldCount), NvrLink.TableName);

			string strCondition = "";

			if (SetCondition<NvrLink.Fields>(ref strCondition, dicConditions, NvrLink.GetFieldName, NvrLink.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<NvrLink> datas = new List<NvrLink>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				NvrLink model = ReadNvrLink(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private NvrLink ReadNvrLink(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			NvrLink model = new NvrLink();
			bool isNullable;

			foreach (NvrLink.Fields field in NvrLink.Fields.GetValues(typeof(NvrLink.Fields)))
			{
				string strFieldName = NvrLink.GetFieldName(field, out isNullable);

				if (field == NvrLink.Fields.CctvID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CctvID = data.Data;
					}
				}
				else if (field == NvrLink.Fields.NvrID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.NvrID = data.Data;
					}
				}

				index++;
			}

			return model;
		}

        public Evacuation SelectEvacuation(int siteID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where {2} = {3} ",
                GetFieldNames<Evacuation.Fields>(out nFieldCount),
                Evacuation.TableName,
                Evacuation.Fields.SiteID,
                siteID);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                Evacuation model = ReadEvacuation(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<Evacuation> SelectEvacuations(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectEvacuations(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<Evacuation> SelectEvacuations(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<Evacuation.Fields>(out nFieldCount), Evacuation.TableName);

            string strCondition = "";

            if (SetCondition<Evacuation.Fields>(ref strCondition, dicConditions, Evacuation.GetFieldName, Evacuation.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<Evacuation> datas = new List<Evacuation>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                Evacuation model = ReadEvacuation(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private Evacuation ReadEvacuation(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            Evacuation model = new Evacuation();
            bool isNullable;

            foreach (Evacuation.Fields field in Evacuation.Fields.GetValues(typeof(Evacuation.Fields)))
            {
                string strFieldName = Evacuation.GetFieldName(field, out isNullable);

                if (field == Evacuation.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }
                else if (field == Evacuation.Fields.IsEvac)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.IsEvac = data.Data == 1;
                    }
                }
                else if (field == Evacuation.Fields.TimeStamp)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.TimeStamp = data.Data;
                    }
                }
                else if (field == Evacuation.Fields.UniqueKey)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.UniqueKey = data;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.UniqueKey = data;
                    }
                }

                index++;
            }

            return model;
        }


        public ArrayList JoinCctvCctvNvrLink(List<Nvr> nvrList, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;

			if (nvrList == null || nvrList.Count == 0)
				return new ArrayList();

			string strNvrIDs = "";

			foreach (Nvr nvr in nvrList)
            {
				if (strNvrIDs.Length == 0)
					strNvrIDs = nvr.ID.ToString();
				else
					strNvrIDs += "," + nvr.ID.ToString();
            }

			string strCctvTableName = CCTV.TableName;
			string strNvrLinkTableName = NvrLink.TableName;

			int nCctvFieldCount, nNvrLinkFieldCount;

			string strCctvFields = GetFieldNames<CCTV.Fields>(out nCctvFieldCount);
			string strNvrLinkFields = GetFieldNames<NvrLink.Fields>(out nNvrLinkFieldCount);

			int nFieldsCount = nCctvFieldCount + nNvrLinkFieldCount;
			bool isNullable;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} "
				, strCctvFields, strNvrLinkFields
				, strCctvTableName, strNvrLinkTableName);
			strSQL += string.Format(" where {0}.{1} = {2}.{3} and {2}.{4} in ({5})",
				strCctvTableName,
				CCTV.GetFieldName(CCTV.Fields.ID, out isNullable),
				strNvrLinkTableName,
				NvrLink.GetFieldName(NvrLink.Fields.CctvID, out isNullable),
				NvrLink.GetFieldName(NvrLink.Fields.NvrID, out isNullable),
				strNvrIDs
				);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				CCTV cctv = ReadCCTV(arrResult, i, out strErrorMessage);

				if (cctv == null)
					return null;
				else
					arrDatas.Add(cctv);

				NvrLink nvrLink = ReadNvrLink(arrResult, i + nCctvFieldCount, out strErrorMessage);

				if (nvrLink == null)
					return null;
				else
					arrDatas.Add(nvrLink);
			}

            return arrDatas;
        }

        private CCTV ReadCCTV(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            CCTV model = new CCTV();
            bool isNullable;

            foreach (CCTV.Fields field in CCTV.Fields.GetValues(typeof(CCTV.Fields)))
            {
                string strFieldName = CCTV.GetFieldName(field, out isNullable);

                if (field == CCTV.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == CCTV.Fields.CameraName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.CameraName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.CameraName = data;
                    }
                }
                else if (field == CCTV.Fields.PositionName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.PositionName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.PositionName = data;
                    }
                }
                else if (field == CCTV.Fields.UniqueKey)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.UniqueKey = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.UniqueKey = data;
                    }
                }
                else if (field == CCTV.Fields.X)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.X = null;
                    }
                    else
                    {
                        model.X = data.Data;
                    }
                }
                else if (field == CCTV.Fields.Y)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Y = null;
                    }
                    else
                    {
                        model.Y = data.Data;
                    }
                }
                else if (field == CCTV.Fields.Z)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Z = null;
                    }
                    else
                    {
                        model.Z = data.Data;
                    }
                }
                else if (field == CCTV.Fields.ZoneID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.ZoneID = null;
                    }
                    else
                    {
                        model.ZoneID = data.Data;
                    }
                }
                else if (field == CCTV.Fields.IsIndoor)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.IsIndoor = data.Data == 1;
                    }
                }
                else if (field == CCTV.Fields.Type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Type = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Type = data;
                    }
                }
                else if (field == CCTV.Fields.Channel)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Channel = null;
                    }
                    else
                    {
                        model.Channel = data.Data;
                    }
                }
                else if (field == CCTV.Fields.UserID)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.UserID = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.UserID = data;
                    }
                }
                else if (field == CCTV.Fields.Password)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Password = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Password = data;
                    }
                }
                else if (field == CCTV.Fields.URL)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.URL = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.URL = data;
                    }
                }
                else if (field == CCTV.Fields.BigURL)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.BigURL = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.BigURL = data;
                    }
                }
                else if (field == CCTV.Fields.SmallURL)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.SmallURL = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.SmallURL = data;
                    }
                }
                else if (field == CCTV.Fields.Enabled)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Enabled = null;
                    }
                    else
                    {
                        model.Enabled = data.Data == 1;
                    }
                }
                else if (field == CCTV.Fields.CameraIP)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.CameraIP = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.CameraIP = data;
                    }
                }
                else if (field == CCTV.Fields.CameraCompanyName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.CameraCompanyName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.CameraCompanyName = data;
                    }
                }
                else if (field == CCTV.Fields.CameraModelName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.CameraModelName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.CameraModelName = data;
                    }
                }
                else if (field == CCTV.Fields.Description)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Description = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Description = data;
                    }
                }
                else if (field == CCTV.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.SiteID = null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }

                index++;
            }

            return model;
        }

        public ParkingGate SelectParkingGate(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<ParkingGate.Fields>(out nFieldCount), ParkingGate.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                ParkingGate model = ReadParkingGate(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<ParkingGate> SelectParkingGates(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectParkingGates(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<ParkingGate> SelectParkingGates(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<ParkingGate.Fields>(out nFieldCount), ParkingGate.TableName);

            string strCondition = "";

            if (SetCondition<ParkingGate.Fields>(ref strCondition, dicConditions, ParkingGate.GetFieldName, ParkingGate.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<ParkingGate> datas = new List<ParkingGate>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                ParkingGate model = ReadParkingGate(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private ParkingGate ReadParkingGate(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            ParkingGate model = new ParkingGate();
            bool isNullable;

            foreach (ParkingGate.Fields field in ParkingGate.Fields.GetValues(typeof(ParkingGate.Fields)))
            {
                string strFieldName = ParkingGate.GetFieldName(field, out isNullable);

                if (field == ParkingGate.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == ParkingGate.Fields.Name)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Name = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Name = data;
                    }
                }
                else if (field == ParkingGate.Fields.GateCode)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.GateCode = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.GateCode = data;
                    }
                }
                else if (field == ParkingGate.Fields.InOut)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.InOut = data.Data == 1;
                    }
                }
                else if (field == ParkingGate.Fields.Status)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Status = data.Data;
                    }
                }
                else if (field == ParkingGate.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }

                index++;
            }

            return model;
        }

        public UpdateData SelectUpdateData(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<UpdateData.Fields>(out nFieldCount), UpdateData.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                UpdateData model = ReadUpdateData(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<UpdateData> SelectUpdateDatas(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectUpdateDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<UpdateData> SelectUpdateDatas(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<UpdateData.Fields>(out nFieldCount), UpdateData.TableName);

            string strCondition = "";

            if (SetCondition<UpdateData.Fields>(ref strCondition, dicConditions, UpdateData.GetFieldName, UpdateData.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<UpdateData> datas = new List<UpdateData>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                UpdateData model = ReadUpdateData(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private UpdateData ReadUpdateData(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            UpdateData model = new UpdateData();
            bool isNullable;

            foreach (UpdateData.Fields field in UpdateData.Fields.GetValues(typeof(UpdateData.Fields)))
            {
                string strFieldName = UpdateData.GetFieldName(field, out isNullable);

                if (field == UpdateData.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == UpdateData.Fields.Timestamp)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Timestamp = data.Data;
                    }
                }
                else if (field == UpdateData.Fields.NameOfTable)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.NameOfTable = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.NameOfTable = data;
                    }
                }
                else if (field == UpdateData.Fields.FieldList)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.FieldList = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.FieldList = data;
                    }
                }
                else if (field == UpdateData.Fields.ValueList)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.ValueList = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.ValueList = data;
                    }
                }
                else if (field == UpdateData.Fields.PrimaryCondition)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.PrimaryCondition = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.PrimaryCondition = data;
                    }
                }

                index++;
            }

            return model;
        }

        public Model.History.Earthquake SelectHistoryEarthquake(DateTime timeStamp, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where TimeStamp = '{2}' ",
                GetFieldNames<Model.History.Earthquake.Fields>(out nFieldCount), Model.History.Earthquake.TableName
                , GetDateTimeString(timeStamp));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                Model.History.Earthquake model = ReadHistoryEarthquake(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<Model.History.Earthquake> SelectHistoryEarthquakes(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectHistoryEarthquakes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<Model.History.Earthquake> SelectHistoryEarthquakes(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.History.Earthquake.Fields>(out nFieldCount), Model.History.Earthquake.TableName);

            string strCondition = "";

            if (SetCondition<Model.History.Earthquake.Fields>(ref strCondition, dicConditions, Model.History.Earthquake.GetFieldName, Model.History.Earthquake.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<Model.History.Earthquake> datas = new List<Model.History.Earthquake>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                Model.History.Earthquake model = ReadHistoryEarthquake(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private Model.History.Earthquake ReadHistoryEarthquake(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            Model.History.Earthquake model = new Model.History.Earthquake();
            bool isNullable;

            foreach (Model.History.Earthquake.Fields field in Model.History.Earthquake.Fields.GetValues(typeof(Model.History.Earthquake.Fields)))
            {
                string strFieldName = Model.History.Earthquake.GetFieldName(field, out isNullable);

                if (field == Model.History.Earthquake.Fields.TimeStamp)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.TimeStamp = data.Data;
                    }
                }
                else if (field == Model.History.Earthquake.Fields.Hpga)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Hpga = data.Data;
                    }
                }
                else if (field == Model.History.Earthquake.Fields.Tpga)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Tpga = data.Data;
                    }
                }
                else if (field == Model.History.Earthquake.Fields.Gal)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Gal = data.Data;
                    }
                }
                else if (field == Model.History.Earthquake.Fields.Intensity)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Intensity = data.Data;
                    }
                }

                index++;
            }

            return model;
        }

        public FirstAidEquipment SelectFirstAidEquipment(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<FirstAidEquipment.Fields>(out nFieldCount), FirstAidEquipment.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                FirstAidEquipment model = ReadFirstAidEquipment(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<FirstAidEquipment> SelectFirstAidEquipments(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectFirstAidEquipments(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<FirstAidEquipment> SelectFirstAidEquipments(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<FirstAidEquipment.Fields>(out nFieldCount), FirstAidEquipment.TableName);

            string strCondition = "";

            if (SetCondition<FirstAidEquipment.Fields>(ref strCondition, dicConditions, FirstAidEquipment.GetFieldName, FirstAidEquipment.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<FirstAidEquipment> datas = new List<FirstAidEquipment>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                FirstAidEquipment model = ReadFirstAidEquipment(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private FirstAidEquipment ReadFirstAidEquipment(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            FirstAidEquipment model = new FirstAidEquipment();
            bool isNullable;

            foreach (FirstAidEquipment.Fields field in FirstAidEquipment.Fields.GetValues(typeof(FirstAidEquipment.Fields)))
            {
                string strFieldName = FirstAidEquipment.GetFieldName(field, out isNullable);

                if (field == FirstAidEquipment.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.EquipmentType)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.EquipmentType = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.EquipmentName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.EquipmentName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.EquipmentName = data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.ZoneID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ZoneID = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.X)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.X = null;
                    else
                    {
                        model.X = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.Y)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Y = null;
                    else
                    {
                        model.Y = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.Z)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Z = null;
                    else
                    {
                        model.Z = data.Data;
                    }
                }
                else if (field == FirstAidEquipment.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }

                index++;
            }

            return model;
        }


        public FirstAidEquipmentType SelectFirstAidEquipmentType(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<FirstAidEquipmentType.Fields>(out nFieldCount), FirstAidEquipmentType.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                FirstAidEquipmentType model = ReadFirstAidEquipmentType(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<FirstAidEquipmentType> SelectFirstAidEquipmentTypes(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectFirstAidEquipmentTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<FirstAidEquipmentType> SelectFirstAidEquipmentTypes(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<FirstAidEquipmentType.Fields>(out nFieldCount), FirstAidEquipmentType.TableName);

            string strCondition = "";

            if (SetCondition<FirstAidEquipmentType.Fields>(ref strCondition, dicConditions, FirstAidEquipmentType.GetFieldName, FirstAidEquipmentType.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<FirstAidEquipmentType> datas = new List<FirstAidEquipmentType>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                FirstAidEquipmentType model = ReadFirstAidEquipmentType(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private FirstAidEquipmentType ReadFirstAidEquipmentType(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            FirstAidEquipmentType model = new FirstAidEquipmentType();
            bool isNullable;

            foreach (FirstAidEquipmentType.Fields field in FirstAidEquipmentType.Fields.GetValues(typeof(FirstAidEquipmentType.Fields)))
            {
                string strFieldName = FirstAidEquipmentType.GetFieldName(field, out isNullable);

                if (field == FirstAidEquipmentType.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == FirstAidEquipmentType.Fields.EquipmentType)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.EquipmentType = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.EquipmentType = data;
                    }
                }
                else if (field == FirstAidEquipmentType.Fields.EquipmentTypeEng)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.EquipmentTypeEng = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.EquipmentTypeEng = data;
                    }
                }

                index++;
            }

            return model;
        }

        public ArrayList JoinFirstAidEquipmentEquipmentType(string strConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            int nEquipmentFieldCount, nTypeFieldCount;

            string strEquipmentFields = GetFieldNames<FirstAidEquipment.Fields>("a", out nEquipmentFieldCount);
            string strTypeFields = GetFieldNames<FirstAidEquipmentType.Fields>("b", out nTypeFieldCount);

            int nFieldsCount = nEquipmentFieldCount + nTypeFieldCount;

            string strSQL = string.Format("Select {2}, {3} from {0} a, {1} b where a.{4} = b.{5}",
                FirstAidEquipment.TableName, FirstAidEquipmentType.TableName,
                strEquipmentFields,
                strTypeFields,
                FirstAidEquipment.Fields.EquipmentType,
                FirstAidEquipmentType.Fields.ID);

            if (strConditions != null && strConditions.Length > 0)
            {
                strSQL += " and " + strConditions;
            }

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            ArrayList arrDatas = new ArrayList();
            int nResultCount = arrResult.Count;

            for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
            {
                FirstAidEquipment equipment = ReadFirstAidEquipment(arrResult, i, out strErrorMessage);

                if (equipment == null)
                    return null;
                else
                    arrDatas.Add(equipment);

                FirstAidEquipmentType equipmentType = ReadFirstAidEquipmentType(arrResult, i + nEquipmentFieldCount, out strErrorMessage);

                if (equipmentType == null)
                    return null;
                else
                    arrDatas.Add(equipmentType);
            }

            return arrDatas;
        }
    }
}
