using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GSFireSensorServer
{
    public class CrawlingManager
    {
        private const string STATE_NORMAL = "#efefef";
        private const string STATE_ALARM = "#ff0400";

        private const string CLASS_ON = "btn btn-default btn-xs btn-success";
        private const string CLASS_OFF = "btn btn-default btn-xs btn-danger";

        private ChromeDriverService m_driverService = null;
        private ChromeOptions m_options = null;
        private ChromeDriver m_driver;

        private bool m_bIsCurrentAlarm = false;
        SignManager m_SignManager = null;

        private string m_strChromeDriverPath = "";

        public enum StateType {Error = -1, Normal, Alarm}

        public CrawlingManager(SignManager signManager)
        {
            m_SignManager = signManager;

            string strChromeDriverPath = ConfigurationManager.AppSettings.Get("ChromeDriver_PATH");
            if (strChromeDriverPath == null || strChromeDriverPath.Length == 0)
                strChromeDriverPath = "C:\\Program Files\\Google\\Chrome\\Application\\";

            m_strChromeDriverPath = strChromeDriverPath;
        }

        public bool InitCrawling(out string strErrorMessage)
        {
            strErrorMessage = "";

            try
            {
                //m_driverService = ChromeDriverService.CreateDefaultService();
                m_driverService = ChromeDriverService.CreateDefaultService(m_strChromeDriverPath);
                m_driverService.HideCommandPromptWindow = true;

                m_options = new ChromeOptions();
                m_options.AddArgument("disable-gpu");

                m_options.AddArgument("no-sandbox");
                m_options.AddArgument("single-process");
                m_options.AddArgument("disable-dev-shm-usage");

                m_options.AddArgument("headless");  // 창을 숨기는 옵션
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        public void Quit()
        {
            if (m_driver != null)
                m_driver.Quit();
        }

        public bool ConnectVitconSite(out string strErrorMessage)
        {
            strErrorMessage = "";

            try
            {
                string strID = "kdr1820@unes.co.kr";
                string strPW = "9449966Ab";

                m_driver = new ChromeDriver(m_driverService, m_options);
                //m_driver = new ChromeDriver(m_strChromeDriverPath, m_options);

                m_driver.Navigate().GoToUrl("https://iot.vitcon.co.kr/login/");
                m_driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

                var element = m_driver.FindElement(By.XPath("//*[@id='inputEmail']"));
                element.SendKeys(strID);

                element = m_driver.FindElement(By.XPath("//*[@id='inputPassword']"));
                element.SendKeys(strPW);

                element = m_driver.FindElement(By.XPath("//*[@id='loginform']/button[1]"));
                element.Click();

                Thread.Sleep(800);

                // 상태값 페이지 이동
                element = m_driver.FindElement(By.XPath("//*[@id='table-div']/table/tbody/tr[2]/td[5]/form/button"));
                element.Click();

                Thread.Sleep(800);

            }
            catch (Exception ex)
            {
                // 기존 드라이버 종료
                m_driver.Quit();

                // 센서 off 신호
                if (m_SignManager.UpdateFireSensorOnOFF(false, out strErrorMessage) == false)
                    return false;
                
                Trace.WriteLine(ex.Message);
                strErrorMessage = ex.Message;

                // ChromeDriverPath 경로 표시
                strErrorMessage = "(ChromeDriverPath: " + m_strChromeDriverPath + ") " + strErrorMessage;
                return false;
            }

            return true;
        }

        public StateType ReadFireSensor(out string strErrorMessage)
        {
            StateType type = StateType.Normal;
            strErrorMessage = "";

            try
            {
                string strID = "kdr1820@unes.co.kr";
                string strPW = "9449966Ab";

                m_driver = new ChromeDriver(m_driverService, m_options);
                //m_driver = new ChromeDriver(m_strChromeDriverPath, m_options);

                m_driver.Navigate().GoToUrl("https://iot.vitcon.co.kr/login/");
                m_driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

                var element = m_driver.FindElement(By.XPath("//*[@id='inputEmail']"));
                element.SendKeys(strID);

                element = m_driver.FindElement(By.XPath("//*[@id='inputPassword']"));
                element.SendKeys(strPW);

                element = m_driver.FindElement(By.XPath("//*[@id='loginform']/button[1]"));
                element.Click();

                Thread.Sleep(800);





                // 연결 상태 읽어오기
                element = m_driver.FindElement(By.XPath("//*[@id='table-div']/table/tbody/tr[2]/td[4]/button"));
                string strClass = element.GetAttribute("class");

                if(strClass == CLASS_ON)
                {
                    // 센서 on 신호
                    if (m_SignManager.UpdateFireSensorOnOFF(true, out strErrorMessage) == false)
                    {
                        // 기존 드라이버 종료
                        m_driver.Quit();

                        type = StateType.Error;
                        return type;
                    }
                }
                else if (strClass == CLASS_OFF)
                {
                    // 기존 드라이버 종료
                    m_driver.Quit();
                    type = StateType.Error;

                    // 센서 off 신호
                    if (m_SignManager.UpdateFireSensorOnOFF(false, out strErrorMessage) == false)
                        return type;

                    strErrorMessage = "센서가 연결되지 않았습니다.";
                    return type;
                } 
                else
                {
                    // 기존 드라이버 종료
                    m_driver.Quit();
                    type = StateType.Error;

                    // 센서 off 신호
                    if (m_SignManager.UpdateFireSensorOnOFF(false, out strErrorMessage) == false)
                        return type;

                    strErrorMessage = "Class 값이 제대로 읽어지지 않았습니다.";
                    return type;
                }






                // 상태값 페이지 이동
                element = m_driver.FindElement(By.XPath("//*[@id='table-div']/table/tbody/tr[2]/td[5]/form/button"));
                element.Click();

                Thread.Sleep(800);

                // 화재 신호을 컬러 값으로 읽어온다.
                element = m_driver.FindElement(By.XPath("//*[@id='backcolor']"));
                string strColor = element.GetAttribute("fill");

                // 현재 알람 상태가 아니고 화재
                if (strColor == STATE_ALARM)
                {   // 화재 발생
                    Console.WriteLine("화재 발생!!");

                    type = StateType.Alarm;
                }
                else if (strColor == STATE_NORMAL)
                {   // 평상시 
                    Console.WriteLine("화재 종료");

                    type = StateType.Normal;
                }
                else
                {
                    strErrorMessage = "센서값이 제대로 된 값이 아닙니다.";
                    type = StateType.Error;
                }

            }
            catch (Exception ex)
            {
                // 기존 드라이버 종료
                m_driver.Quit();

                type = StateType.Error;

                // 센서 off 신호
                if (m_SignManager.UpdateFireSensorOnOFF(false, out strErrorMessage) == false)
                    return type;

                Trace.WriteLine(ex.Message);
                strErrorMessage = ex.Message;

                // ChromeDriverPath 경로 표시
                strErrorMessage = "(ChromeDriverPath: " + m_strChromeDriverPath + ") " + strErrorMessage;
            }

            // 기존 드라이버 종료
            m_driver.Quit();

            return type;
        }

        public StateType ReadFireSensorData(out string strErrorMessage)
        {
            StateType type = StateType.Normal; 
            strErrorMessage = "";

            try
            {
                // 새로고침
                m_driver.Navigate().Refresh();
                Thread.Sleep(1000);

                // 화재 신호을 컬러 값으로 읽어온다.
                var element = m_driver.FindElement(By.XPath("//*[@id='backcolor']"));
                string strColor = element.GetAttribute("fill");

                // 현재 알람 상태가 아니고 화재
                if (strColor == STATE_ALARM)
                {   // 화재 발생
                    Console.WriteLine("화재 발생!!");

                    type = StateType.Alarm;
                }
                else if (strColor == STATE_NORMAL)
                {   // 평상시 
                    Console.WriteLine("화재 종료");

                    type = StateType.Normal;
                }
                else
                {
                    strErrorMessage = "센서값이 제대로 된 값이 아닙니다.";
                    type = StateType.Error;
                }
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
                strErrorMessage = ex.Message;
                type = StateType.Error;

                // 기존 드라이버 종료
                m_driver.Quit();
            }

            return type;
        }
    }
}
