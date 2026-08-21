using System;
using System.Collections.Generic;
using System.Text;

namespace WonikLPR
{
    /// <summary>
    /// 페이지 검색 API 응답 (page_summary=1)
    /// </summary>
    public class LprPageSummary
    {
        /// <summary>전체 로그 개수</summary>
        public int TotalLog { get; set; }

        /// <summary>페이지당 로그 개수</summary>
        public int PageSize { get; set; }

        /// <summary>전체 페이지 개수</summary>
        public int TotalPage { get; set; }

        public override string ToString()
        {
            return string.Format("TotalLog={0}, PageSize={1}, TotalPage={2}",
                TotalLog, PageSize, TotalPage);
        }
    }

    /// <summary>
    /// 데이터 검색 API 응답 항목 (page_summary=0)
    /// </summary>
    public class LprLogItem
    {
        /// <summary>로그 인덱스 고유번호</summary>
        public long Index { get; set; }

        /// <summary>로그 날짜 (YYYY-MM-DD)</summary>
        public string Date { get; set; }

        /// <summary>로그 시간 (hh:mm:ss)</summary>
        public string Time { get; set; }

        /// <summary>CCTV 카메라 녹화 채널 번호</summary>
        public string Channel { get; set; }

        /// <summary>64 (LPR 데이터 고정)</summary>
        public string Type { get; set; }

        /// <summary>0 (LPR 데이터 고정)</summary>
        public string Type2 { get; set; }

        /// <summary>인식 번호</summary>
        public string LPR { get; set; }

        /// <summary>LineNo (문서상 설명 없음)</summary>
        public string LineNo { get; set; }

        /// <summary>값이 없으면 정상 인식, 그외 텍스트는 인식 오류</summary>
        public string Error { get; set; }

        /// <summary>인식 오류 여부</summary>
        public bool IsError
        {
            get { return string.IsNullOrEmpty(Error) == false; }
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Index={0}, {1} {2}, Channel={3}, Type={4}/{5}, LPR={6}",
                Index, Date, Time, Channel, Type, Type2, LPR);

            if (string.IsNullOrEmpty(LineNo) == false)
            {
                sb.AppendFormat(", LineNo={0}", LineNo);
            }

            sb.AppendFormat(", {0}", IsError ? "ERROR=" + Error : "OK");

            return sb.ToString();
        }
    }

    /// <summary>
    /// 데이터 검색 API 1회 호출 결과
    /// </summary>
    public class LprLogPage
    {
        public LprLogPage()
        {
            Items = new List<LprLogItem>();
        }

        /// <summary>요청한 페이지 인덱스</summary>
        public int PageIndex { get; set; }

        /// <summary>조회된 로그 목록</summary>
        public List<LprLogItem> Items { get; private set; }
    }
}
