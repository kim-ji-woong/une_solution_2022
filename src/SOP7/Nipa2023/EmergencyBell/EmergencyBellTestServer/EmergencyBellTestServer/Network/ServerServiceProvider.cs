using dnsTcpLib2;
using System.Collections.Generic;
using System.Net.Sockets;

namespace EmergencyBellTestServer.Network
{
    public class ServerServiceProvider : TcpServiceProvider
    {
		private NetworkManager m_netMgr = null;

		public ServerServiceProvider(NetworkManager netMgr)
        {
			m_netMgr = netMgr;
        }

		public override object Clone()
		{
			return new ServerServiceProvider(m_netMgr);
		}

		public override void OnAcceptConnection(ConnectionState state)
		{
			state.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
			state.LengthAdd = false;
			m_netMgr.OnAddClient(state);

			System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
			string strIP = endPoint.Address.ToString();

			System.Diagnostics.Trace.WriteLine("OnAccept : " + strIP);
		}

		public override bool OnReceiveData(ConnectionState state)
		{
			if (!base.OnReceiveData(state))
				return false;

			System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
			string strIP = endPoint.Address.ToString();

			byte[] bytes = state.RecivedBuffer;

			if (bytes != null)
			{
				WriteBinaryLog(bytes, 0, bytes.Length, "Recv");
				int len = bytes.Length;

				if (len >= 6 && bytes[2] == 0x31 && bytes[4] == 0x00)
				{
					List<int> alarmSensors = FormMain.Instance.GetAlarmSensors();
					byte[] sendBytes = new byte[11];
					sendBytes[0] = 0xc2;
					sendBytes[1] = 0x01;
					sendBytes[2] = 0x31;
					sendBytes[3] = 0x06;
					sendBytes[4] = 0x00;
					sendBytes[7] = 0x00;
					sendBytes[8] = 0x01;
					sendBytes[9] = 0x01;

					if (alarmSensors.Count > 0)
					{
						foreach (int sensorNo in alarmSensors)
						{
							sendBytes[5] = 0x00;
							sendBytes[6] = (byte)sensorNo;

							sendBytes[10] = GetCheckSum(sendBytes, 0, 9);
							state.Write(sendBytes, 0, sendBytes.Length);
							WriteBinaryLog(sendBytes, 0, sendBytes.Length, "Send");
						}
					}
					else
                    {
						sendBytes[5] = 0x00;
						sendBytes[6] = 0x00;
						sendBytes[10] = GetCheckSum(sendBytes, 0, 9);
						state.Write(sendBytes, 0, sendBytes.Length);
						WriteBinaryLog(sendBytes, 0, sendBytes.Length, "Send");
					}
				}
				else if (len >= 6 && bytes[2] == 0x32)
                {
					FormMain.Instance.ClearAlarms();
                }
			}

			return true;
		}

		private byte GetCheckSum(byte[] bytes, int beginIndex, int endIndex)
		{
			int sum = 0;

			for (int i = beginIndex; i <= endIndex; i++)
			{
				sum += (int)bytes[i];
			}

			byte checkSum = (byte)(sum % 256);
			return checkSum;
		}

		public override void OnDropConnection(ConnectionState state)
		{
			m_netMgr.OnDropClient(state);

			System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
			string strIP = endPoint.Address.ToString();

			System.Diagnostics.Trace.WriteLine("OnDrop : " + strIP);
		}

		private string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
		{
			string strBytesLog = GetByteString(bytes, nIndex, len);
			System.Diagnostics.Trace.WriteLine(strTag + " : " + strBytesLog);
			return strTag + " : " + strBytesLog;
		}

		private string GetByteString(byte[] bytes, int nIndex, int len)
		{
			string strBytes = "";

			for (int i=nIndex;i<nIndex + len;i++)
			{
				byte b = bytes[i];

				if (strBytes.Length == 0)
					strBytes = string.Format("\t\t{0:X2}", (int)b);
				else
					strBytes += string.Format(" {0:X2}", (int)b);
			}

			return strBytes;
		}
	}
}
