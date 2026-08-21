using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace InsertToUpdate
{
    class QueryManager
    {
		public static string InsertToUpdate(string strPath)
        {
			StreamReader reader = new StreamReader(strPath, Encoding.UTF8);

			while (reader.EndOfStream == false)
            {
				string strLine = reader.ReadLine().Trim();

				if (strLine.Length == 0)
					continue;

				int index1 = strLine.IndexOf("'");

				if (index1 < 0)
					continue;

				int index2 = strLine.IndexOf("'", index1 + 1);

				if (index2 < 0)
					continue;

				string strDescription = strLine.Substring(index1 + 1, index2 - index1 - 1);

				index1 = strLine.IndexOf('(');
				index1 = strLine.IndexOf('(', index1 + 1);
				index2 = strLine.IndexOf(',', index1 + 1);

				string strID = strLine.Substring(index1 + 1, index2 - index1 - 1);

				string strSQL = "Update SdmsSensorTagInfo set Description = '" + strDescription + "' where ID = " + strID;
				System.Diagnostics.Trace.WriteLine(strSQL);				
			}

			return null;
		}
  //      public static string InsertToUpdate(string strPath)
  //      {
		//	string strTableName;
		//	List<string> vecFields = new List<string>();
		//	List<string> vecValues = new List<string>();

		//	if (!GetTokens(strInsertQuery, strTableName, vecFields, vecValues))
		//		return false;

		//	int nFieldCount = (int)vecFields.size();

		//	if (nPrimaryKeyIndex >= nFieldCount)
		//	{
		//		m_strError = L"PrimaryKey Index가 Field 개수를 벗어납니다.";
		//		return false;
		//	}

		//	strUpdateQuery = L"Update ";
		//	strUpdateQuery += strTableName + L" Set ";

		//	std::wstring strSet = L"";

		//	for (int i = 0; i < nFieldCount; i++)
		//	{
		//		const std::wstring&strField = vecFields[i];
		//		const std::wstring&strValue = vecValues[i];

		//		if (strSet.length() == 0)
		//			strSet += strField + L" = " + strValue;
		//else
		//		{
		//			strSet += L", ";
		//			strSet += strField + L" = " + strValue;
		//		}
		//	}

		//	strUpdateQuery += strSet + L" where " + vecFields[nPrimaryKeyIndex] + L" = " + vecValues[nPrimaryKeyIndex];
		//	return true;
		//}

		//private static bool GetTokens(string strInsertQuery, ref string strTableName, List<string> rVecFields, List<string> rVecValues)
		//{
		//	strInsertQuery = ParseString(strInsertQuery);

		//	wchar_t strToken[1024];
		//	int nMode;
		//	int nCount = 0;
		//	bool inParenthesis = false;
		//	bool isValueTime = false;

		//	strTableName = L"";

		//	while (true)
		//	{
		//		strInsertQuery = StringManager::GetToken(strInsertQuery.c_str(), strToken);

		//		if (strInsertQuery.length() == 0 && wcslen(strToken) == 0)
		//			break;

		//		wchar_t* str = ParseToken(strToken, nMode);

		//		if (wcslen(str) > 0)
		//		{
		//			if (nCount == 0)
		//			{
		//				if (_wcsicmp(str, L"Insert") != 0)
		//				{
		//					m_strError = L"Insert 구문이 아닙니다.";
		//					return false;
		//				}
		//			}
		//			else if (nCount == 1)
		//			{
		//				if (_wcsicmp(str, L"into") != 0)
		//					strTableName = str;
		//			}
		//			else if (nCount == 2 && strTableName.length() == 0)
		//			{
		//				strTableName = str;
		//			}
		//			else
		//			{
		//				if ((nMode & 1) == 1)
		//					inParenthesis = true;

		//				if (inParenthesis)
		//				{
		//					if (isValueTime)
		//						rVecValues.push_back(str);
		//					else
		//						rVecFields.push_back(str);
		//				}
		//				else if (_wcsicmp(str, L"values") == 0)
		//				{
		//					isValueTime = true;

		//					if (!ParseValue(strInsertQuery.c_str(), rVecValues))
		//						return false;
		//					else
		//						break;
		//				}

		//				if ((nMode & 2) == 2)
		//					inParenthesis = false;
		//			}

		//			nCount++;

		//			if (strInsertQuery.length() == 0)
		//				break;
		//		}
		//	}

		//	if (strTableName.length() == 0)
		//	{
		//		m_strError = L"Table 이름이 존재하지 않습니다.";
		//		return false;
		//	}
		//	else if (rVecValues.size() != rVecFields.size())
		//	{
		//		m_strError = L"Field 개수와 Value 개수가 일치하지 않습니다.";
		//		return false;
		//	}
		//	else if (rVecValues.size() == 0)
		//	{
		//		m_strError = L"Value가 존재하지 않습니다.";
		//		return false;
		//	}

		//	return true;
		//}

		//private static string ParseString(string str)
		//{
		//	int len = str.Length;

		//	if (len == 0)
		//		return null;

		//	int nBeginIndex = -1, nLastIndex = -1;

		//	for (int i = 0; i < len; i++)
		//	{
		//		if (str[i] != ' ' && str[i] != '\t' && str[i] != '\r' && str[i] != '\n')
		//		{
		//			if (nBeginIndex < 0)
		//				nBeginIndex = i;
		//			nLastIndex = i;
		//		}
		//	}

		//	if (nBeginIndex < 0 || nLastIndex < nBeginIndex)
		//		return null;

		//	string strResult = str.Substring(nBeginIndex);
		//	strResult = strResult.Substring(0, (nLastIndex - nBeginIndex) + 1).Trim();
		//	return strResult;
		//}
	}
}
