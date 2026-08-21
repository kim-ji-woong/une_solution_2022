using System;

namespace Weather.IDAL
{
    using Model;

    public interface ICreate
    {
        string GetErrorMessage();

        Site CreateSite(string strName, string strDescription = null);
        Current CreateCurrent(int nWeatherSiteID, int nState, float fTemp, float? fSensibleTemp, float fRain, float fHumidity, float? fWindSpeed, int? nWindDir, float? fAtm, DateTime dtUpdate);
        Current2 CreateCurrent2(int nWeatherSiteID, float fTemp, int? nState, float fRain, float fHumidity, float? fWindSpeed, int? nWindDir, float? fAtm, DateTime dtUpdate, float? fTempHigh, float? fTempLow);
        SpecialReport CreateSpecialReport(int nWeatherSiteID, DateTime dtUpdate, string strURL = null, string strImageURL = null);
        Weekly CreateWeekly(int nWeatherSiteID, float fOneDayLaterTemp, int nOneDayLaterState, float fTwoDayLaterTemp, int nTwoDayLaterState, float fThreeDayLaterTemp, int nThreeDayLaterState, float fFourDayLaterTemp, int nFourDayLaterState, float fFiveDayLaterTemp, int nFiveDayLaterState, float fSixDayLaterTemp, int nSixDayLaterState, DateTime dtUpdate, float fOneDayMiniTemp, float fTwoDayMiniTemp, float fThreeDayMiniTemp, float fFourDayMiniTemp, float fFiveDayMiniTemp, float fSixDayMiniTemp);
    }
}
