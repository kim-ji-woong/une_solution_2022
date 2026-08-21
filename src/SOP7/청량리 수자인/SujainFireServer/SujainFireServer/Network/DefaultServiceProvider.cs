using SujainFireServer.Network;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TcpLib2
{
	/// <SUMMARY>
	/// EchoServiceProvider. Just replies messages received from the clients.
	/// </SUMMARY>
	public class DefaultServiceProvider : TcpServiceProvider
	{
		public DefaultServiceProvider()
		{
		}

		public override object Clone()
		{
			return new DefaultServiceProvider();
		}

		public override void OnAcceptConnection(ConnectionState state)
		{

		}

		public override bool OnReceiveData(ConnectionState state)
		{
			if (!base.OnReceiveData(state))
				return false;
#if WINFORM
			// 모니터링 용도
            SujainFireServer.FormMain.Instance.OnReceive(state, ReceivedData);
#endif
			// 알람 및 해제 신호 처리
			NetworkManager.Instance.OnReceive(state, ReceivedData);

			// 서버 연결 닫기
			state.EndConnection();

			return true;
		}

		public override void OnDropConnection(ConnectionState state)
		{

		}
	}
}
