using System;
using System.Net;
using System.Configuration;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using Weather.IDAL;
using Weather.DAL;
using Weather.Model;
using System.Windows.Forms;
using System.Threading;
using System.Drawing;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using dnsDBUtil;

namespace WeatherMaster
{
    public class Cities
    {
        private string m_strBaseURL = "";
        public string BaseURL
        {
            get { return m_strBaseURL; }
            set { m_strBaseURL = value; }
        }

        private string m_strCityName = "";
        public string CityName
        {
            get { return m_strCityName; }
            set { m_strCityName = value; }
        }

        private int m_nWeatherSiteID = -1;
        public int WeatherSiteID
        {
            get { return m_nWeatherSiteID; }
            set { m_nWeatherSiteID = value; }
        }
    }
    public class SpecialReportReader
    {
        private List<Cities> m_cities = null;
        //private string BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=108&prevKind=&prevCmtCd=&stn=133&kind=&date=";
        //private string BaseURL2 = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=133&prevKind=&prevCmtCd=&stn=109&kind=&date=";
        //private string m_strCityName = "공주";
        //private int m_nWeatherSiteID = -1;

        private string m_strImageFolder = null;        
        private IDataManager m_dataManager = null;

        ChromeDriverService m_driverService = null;
        ChromeOptions m_options = null;

        public SpecialReportReader()
        {
            SetDataManager();
            SetSelenium();
        }

        private void SetDataManager()
        {
            string strSite = ConfigurationManager.AppSettings.Get("siteid");

            if (strSite == null || strSite.Length == 0)
                return;

            int nSiteID, nDBType;

            if (int.TryParse(strSite, out nSiteID) == false)
                return;

            string strWebServerURL = ConfigurationManager.AppSettings.Get("webserverURL");
            string strDBName = ConfigurationManager.AppSettings.Get("dbName");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            string strDBHost = ConfigurationManager.AppSettings.Get("dbHost");
            string strDBId = ConfigurationManager.AppSettings.Get("dbId");
            string strDBPw = ConfigurationManager.AppSettings.Get("dbPw");

            if (strWebServerURL == null || strWebServerURL.Length == 0 ||
                strDBName == null || strDBName.Length == 0 ||
                strDBType == null || strDBType.Length == 0 ||
                strDBHost == null || strDBHost.Length == 0 ||
                strDBId == null || strDBId.Length == 0 ||
                strDBPw == null || strDBPw.Length == 0)
                return;

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            if (int.TryParse(strDBType, out nDBType) == false)
                return;

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);

            string strImageFolder = ConfigurationManager.AppSettings.Get("imageFolder");

            if (strImageFolder != null)
            {
                m_strImageFolder = strImageFolder;

                m_cities = new List<Cities>();

                string strErrorMessage;

                List<Site> sites = m_dataManager.GetSelectManager().SelectSites(null, null, out strErrorMessage);

                if (sites != null && sites.Count > 0)
                {
                    foreach (Site site in sites)
                    {
                        Cities city = new Cities();
                        city.WeatherSiteID = site.ID;
                        if (site.Name == "공주")
                        {
                            city.BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=108&prevKind=&prevCmtCd=&stn=133&kind=&date=";
                            city.CityName = "공주";
                        }
                        else if (site.Name == "파주" || site.Name == "판교" || site.Name == "보정" || site.Name == "서울" || site.Name == "안성" || site.Name == "오산")
                        {
                            city.BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=133&prevKind=&prevCmtCd=&stn=109&kind=&date=";
                            city.CityName = site.Name;
                        }
                        else if (site.Name == "오창" || site.Name == "음성")
                        {
                            city.BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=133&prevKind=&prevCmtCd=&stn=131&kind=&date=";
                            city.CityName = site.Name;
                        }
                        else if (site.Name == "화순")
                        {
                            city.BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=131&prevKind=&prevCmtCd=&stn=156&kind=&date=";
                            city.CityName = "화순";
                        }
                        else if (site.Name == "구미")
                        {
                            city.BaseURL = "https://www.weather.go.kr/w/weather/warning/list.do?prevStn=109&prevKind=&prevCmtCd=&stn=143&kind=&date=";
                            city.CityName = "구미";
                        }

                        m_cities.Add(city);
                    }
                }
            }
        }

        private void SetSelenium()
        {
            string strChromeDriverPath = ConfigurationManager.AppSettings.Get("ChromeDriver_PATH");

            if (strChromeDriverPath == null || strChromeDriverPath.Length == 0)
            {
                m_driverService = ChromeDriverService.CreateDefaultService();
            }
            else
            {
                m_driverService = ChromeDriverService.CreateDefaultService(strChromeDriverPath);
            }

            m_driverService.HideCommandPromptWindow = true;

            m_options = new ChromeOptions();
            m_options.AddArgument("disable-gpu");

            // 창을 숨기는 옵션
            m_options.AddArgument("no-sandbox");
            m_options.AddArgument("single-process");
            m_options.AddArgument("disable-dev-shm-usage");

            m_options.AddArgument("headless");
        }

        public bool ReadData()
        {
            bool success = true;

            DateTime dtNow = DateTime.Now;
            foreach (Cities city in m_cities)
            {
                string strURL = city.BaseURL + string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

                try
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
                    request.Method = "GET";
                    request.Timeout = 10 * 1000; // 10초

                    string strResponse = "";

                    using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
                    {
                        HttpStatusCode status = resp.StatusCode;

                        if (status != HttpStatusCode.OK)
                        {
                            System.Diagnostics.Trace.WriteLine("URL 실패 : " + strURL);
                            Logger.Instance.Write("[ERROR] URL 실패 : " + strURL);
                            return false;
                        }

                        Stream respStream = resp.GetResponseStream();
                        using (StreamReader sr = new StreamReader(respStream))
                        {
                            strResponse = sr.ReadToEnd();
                        }
                    }

                    string strTargetClassName = "cmp-view-announce";

                    if (strResponse.Contains(strTargetClassName))
                    {
                        if (m_strImageFolder != null && m_strImageFolder.Length > 0)
                        {
#if !SERVICE
                            string strImageFilePath = city.WeatherSiteID > 0 ? string.Format("{0}\\special{1}.jpg", m_strImageFolder, city.WeatherSiteID) : m_strImageFolder + "\\special.jpg";
                            //UrlToImage(strURL, strImageFilePath, city.CityName);
                            UrlToImage2(strURL, strImageFilePath, city.CityName);
                            continue;
#endif
                        }

                        SetSpecialReport(city.CityName, strURL);
                    }
                    else
                    {
                        SetSpecialReport(city.CityName, null);
                    }

                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] ReadData : " + e.Message);
                    Logger.Instance.Write("[ERROR] Special ReadData : " + e.Message);
                    success = false;
                } 
            }

            return success;
        }

        private void UrlToImage(string strUrl, string strImageFilePath, string strCityName)
        {
            Thread thread = new Thread(delegate ()
            {
                try
                {
                    using (WebBrowser browser = new WebBrowser())
                    {
                        browser.ScrollBarsEnabled = false;
                        browser.AllowNavigation = true;
                        browser.Navigate(strUrl);
                        browser.Width = 1024;
                        browser.Height = 768;
                        browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(webBrowser_DocumentCompleted);

                        ArrayList datas = new ArrayList();
                        datas.Add(this);
                        datas.Add(strUrl);
                        datas.Add(strImageFilePath);
                        datas.Add(strCityName);
                        browser.Tag = datas;

                        // browser 종료 여부 확인 추가 - K.D.R 
                        while (browser.IsDisposed != true && browser.ReadyState != WebBrowserReadyState.Complete)
                        {
                            System.Windows.Forms.Application.DoEvents();
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Instance.Write("[ERROR] void UrlToImage(string, string, string) : " + ex.Message);
                }
            });

            thread.SetApartmentState(ApartmentState.STA);
            thread.Start();
            thread.Join();
        }

        private void UrlToImage2(string strUrl, string strImageFilePath, string strCityName)
        {   // Selenium을 이용한 방식 >> WebBrowser를 이용하면 익스플로러가 사용되는데, 불안전성
            ChromeDriver driver = null;
            
            try
            {
                driver = new ChromeDriver(m_driverService, m_options);

                // 사이즈 조절
                Size size = new Size(1024, 9999);   // 임의의 최대 높이  
                driver.Manage().Window.Size = size;

                driver.Navigate().GoToUrl(strUrl);

                //var element = driver.FindElement(By.TagName("body"));
                //string strClientWidth = element.GetAttribute("clientWidth");
                //string strClientHeight = element.GetAttribute("clientHeight");


                // 컨텐츠 사이즈 구하기
                IWebElement section = null;
                IWebElement footer = null;

                section = driver.FindElement(By.TagName("section"));
                footer = driver.FindElement(By.TagName("footer"));

                if (section == null || footer == null)
                {
                    Logger.Instance.Write("[ERROR] void UrlToImage2(string, string, string) : section 또는 footer 태그를 찾을 수 없습니다.");
                    return;
                }

                string strSectionWidth = section.GetAttribute("clientWidth");
                string strSectionHeight = section.GetAttribute("clientHeight");
                string strFooterWidth = footer.GetAttribute("clientWidth");
                string strFooterHeight = footer.GetAttribute("clientHeight");

                if (int.TryParse(strSectionWidth, out int nSectionWidth) == false || int.TryParse(strSectionHeight, out int nSectionHeight) == false ||
                    int.TryParse(strFooterWidth, out int nFooterWidth) == false || int.TryParse(strFooterHeight, out int nFooterHeight) == false)
                {
                    Logger.Instance.Write("[ERROR] void UrlToImage2(string, string, string) : section 또는 footer 사이즈가 제대로 된 값이 아닙니다");
                    return;
                }

                int nWideth = nSectionWidth;
                int nHeight = nSectionHeight + nFooterHeight + 28;  // 스크롤 사이즈 추가

                size = new Size(nWideth, nHeight);   
                driver.Manage().Window.Size = size;

                // 사이즈 조절 후 스크린샷
                Screenshot screenshot = ((ITakesScreenshot)driver).GetScreenshot();
                screenshot.SaveAsFile(strImageFilePath, ScreenshotImageFormat.Jpeg);

                // 드라이버 종료
                driver.Quit();

                string strImageUrl = "image/weather/" + GetFileName(strImageFilePath);
                SetSpecialReport(strCityName, strUrl, strImageUrl);
            }
            catch(Exception ex)
            {
                if (driver != null)
                    driver.Quit();

                Logger.Instance.Write("[ERROR] void UrlToImage2(string, string, string) : " + ex.Message);
            }
        }

        static void webBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            SpecialReportReader reader = null;

            try
            {
                var webBrowser = (WebBrowser)sender;
                ArrayList datas = (ArrayList)webBrowser.Tag;
                reader = (SpecialReportReader)datas[0];

                string strUrl = (string)datas[1];
                string strImageFilePath = (string)datas[2];
                string strCityName = (string)datas[3];

                webBrowser.Width = webBrowser.Document.Body.ScrollRectangle.Width;
                webBrowser.Height = webBrowser.Document.Body.ScrollRectangle.Height;

                using (Bitmap bitmap =
                    new Bitmap(
                        webBrowser.Width,
                        webBrowser.Height))
                {
                    webBrowser
                        .DrawToBitmap(
                        bitmap,
                        new System.Drawing
                            .Rectangle(0, 0, bitmap.Width, bitmap.Height));
                    bitmap.Save(strImageFilePath,
                        System.Drawing.Imaging.ImageFormat.Jpeg);

                    // 생성된 WebBrowser 종료 - K.D.R
                    webBrowser.Dispose();

                    string strImageUrl = "image/weather/" + GetFileName(strImageFilePath);
                    reader.SetSpecialReport(strCityName, strUrl, strImageUrl);
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.Write("[ERROR] webBrowser_DocumentCompleted(object, WebBrowserDocumentCompletedEventArgs) : " + ex.Message);

                WebBrowser webBrowser = sender as WebBrowser;
                if (webBrowser != null && webBrowser.IsDisposed == false)
                {
                    webBrowser.Dispose();
                }
            }
        }

        private static string GetFileName(string strFilePath)
        {
            int index1 = strFilePath.LastIndexOf('\\');
            int index2 = strFilePath.LastIndexOf('/');

            if (index1 > index2)
                return strFilePath.Substring(index1 + 1).Trim();
            else if (index2 > index1)
                return strFilePath.Substring(index2 + 1).Trim();

            return strFilePath;
        }

        private void SetSpecialReport(string strCityName, string strURL, string strImageUrl = null)
        {
            if (m_dataManager == null)
                return;

            Dictionary<Site.Fields, object> dicConditions = new Dictionary<Site.Fields, object>();
            dicConditions[Site.Fields.Name] = strCityName;

            string strErrorMessage;
            List<Site> sites = m_dataManager.GetSelectManager().SelectSites(dicConditions, null, out strErrorMessage);

            if (sites == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    Logger.Instance.Write("[ERROR] WriteCurrentData : " + strErrorMessage);
                    return;
                }
            }

            if (sites.Count == 0)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("{0}에 해당하는 WeatherSite가 존재하지 않습니다.", strCityName));
                Logger.Instance.Write(string.Format("{0}에 해당하는 WeatherSite가 존재하지 않습니다.", strCityName));
                return;
            }

            Site site = sites[0];
            SpecialReport report = m_dataManager.GetSelectManager().SelectSpecialReport(site.ID, out strErrorMessage);

            if (report == null)
            {
                if (m_dataManager.GetCreateManager().CreateSpecialReport(site.ID, DateTime.Now, strURL, strImageUrl) == null)
                {
                    strErrorMessage = m_dataManager.GetCreateManager().GetErrorMessage();

                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] SetSpecialReport : " + strErrorMessage);
                        Logger.Instance.Write("[ERROR] SetSpecialReport : " + strErrorMessage);
                    }
                }
            }
            else
            {
                report.Url = strURL;
                report.ImageUrl = strImageUrl;
                report.UpdateTime = DateTime.Now;

                if (m_dataManager.GetUpdateManager().UpdateSpecialReport(report, out strErrorMessage) == false)
                {
                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] SetSpecialReport : " + strErrorMessage);
                        Logger.Instance.Write("[ERROR] SetSpecialReport : " + strErrorMessage);
                    }
                }
            }
        }
    }
}
