using System;
using System.IO;
using System.Speech.Synthesis;
using NAudio.Wave;
using System.Collections;
using System.Threading;

namespace dnsBroadcast
{
#if NST
    class MessageClientNST : BaseMessageClient
    {
        private string m_strReceiveFileName = "";
        // Timeout : 5분
        private int m_nTimeoutSeconds = 60 * 5;

        public MessageClientNST(object param)
        {
        }

        public override void Run(bool useSiren, string message)
        {
            if (this.Tag != null && this.Tag is ArrayList)
            {
                ArrayList arrDatas = (ArrayList)this.Tag;

                if (arrDatas.Count == 2 && arrDatas[0] is int && arrDatas[1] is int)
                {
                    int actionStepHistoryID = (int)arrDatas[0];
                    int componentID = (int)arrDatas[1];

                    string strFolder;
                    string strTargetFile = GetFileName(out strFolder);

                    Random rand = new Random((int)DateTime.Now.ToBinary());
                    string strFileName = strFolder + "/" + rand.Next().ToString() + ".dat";
                    m_strReceiveFileName = strFileName;

                    SendMessage(actionStepHistoryID, componentID, strFileName, message, strTargetFile);

                    if (OnCompleteBroadcast != null)
                    {
                        Thread t = new Thread(new ThreadStart(CheckCompleteThread));
                        t.Start();
                    }
                }
            }
        }

        private string GetFileName(out string strFolder)
        {
            strFolder = "C:/UnE";
            string strTargetFile = strFolder + "/Broadcast.dat";

            if (Directory.Exists(strFolder) == false)
                Directory.CreateDirectory(strFolder);

            return strTargetFile;
        }

        private void SendMessage(int actionStepHistoryID, int componentID, string strFileName, string message, string strTargetFile)
        {
            StreamWriter writer = new StreamWriter(strTargetFile, false, System.Text.Encoding.UTF8);
            writer.WriteLine(actionStepHistoryID);
            writer.WriteLine(componentID);
            writer.WriteLine(strFileName);
            writer.WriteLine(message);
            writer.Close();
        }

        private void SendMessage(string strDeleteFileName, string strTargetFile)
        {
            StreamWriter writer = new StreamWriter(strTargetFile, false, System.Text.Encoding.UTF8);
            writer.WriteLine(strDeleteFileName);
            writer.Close();
        }

        private void CheckCompleteThread()
        {
            string strFolder;
            string strTargetFile = GetFileName(out strFolder);

            for (int i=0;i< m_nTimeoutSeconds;i++)
            {
                if (File.Exists(m_strReceiveFileName))
                {
                    StreamReader reader = new StreamReader(m_strReceiveFileName, System.Text.Encoding.UTF8);
                    string strLine = reader.ReadLine();
                    reader.Close();

                    SendMessage(m_strReceiveFileName, strTargetFile);

                    int historyStatus;

                    if (int.TryParse(strLine.Trim(), out historyStatus))
                    {
                        OnCompleteBroadcast(this, (BaseMessageClient.Status)historyStatus);
                    }

                    return;
                }

                Thread.Sleep(1000);
            }

            OnCompleteBroadcast(this, BaseMessageClient.Status.Completed);
        }

        public override void Stop()
        {
        }

        public override void Pause()
        {
        }

        public override void Resume()
        {
        }
    }
#else
    class MessageClientDefault : BaseMessageClient
    {
        private WaveOutEvent m_outputDevice = null;
        private AudioFileReader m_audioFile = null;
        private string m_strDelayMessage = null;
        private SpeechSynthesizer m_synth = null;
        private bool m_stopped = false;
        private bool m_completed = false;
        private bool m_useSiren = false;
        private bool m_pauseSynth = false;
        private bool m_pauseDevice = false;

        public MessageClientDefault(object param)
        {
        }

        public override void Run(bool useSiren, string message)
        {
            m_useSiren = useSiren;

            if (useSiren && CheckSirenFile())
            {
                if (m_outputDevice == null)
                {
                    m_outputDevice = new WaveOutEvent();
                    m_outputDevice.PlaybackStopped += OnPlaybackStopped;
                }

                if (m_audioFile == null)
                {
                    m_audioFile = new AudioFileReader(SirenFile);
                }

                m_strDelayMessage = message;
                m_outputDevice.Init(m_audioFile);
                m_outputDevice.Play();
            }
            else
            {
                Speak(message);
            }
        }

        public override void Stop()
        {
            m_stopped = true;

            if (m_synth != null)
            {
                if (m_completed == false)
                {
                    m_synth.Pause();
                    m_synth.Dispose();
                    m_synth = null;

                    if (OnCompleteBroadcast != null)
                        OnCompleteBroadcast(this, BaseMessageClient.Status.Stopped);
                }
            }
            else if (m_outputDevice != null && m_useSiren)
            {
                m_outputDevice.Stop();
            }
        }

        public override void Pause()
        {
            if (m_synth != null)
            {
                if (m_completed == false)
                {
                    m_pauseSynth = true;
                    m_synth.Pause();
                }
            }
            else if (m_outputDevice != null && m_useSiren)
            {
                m_pauseDevice = true;
                m_outputDevice.Pause();
            }
        }

        public override void Resume()
        {
            if (m_pauseSynth)
                m_synth.Resume();
            else if (m_pauseDevice)
                m_outputDevice.Play();
        }

        private bool CheckSirenFile()
        {
            if (SirenFile != null && SirenFile.Trim().Length > 0 && File.Exists(SirenFile))
                return true;

            return false;
        }

        private void OnPlaybackStopped(object sender, StoppedEventArgs args)
        {
            m_outputDevice.Dispose();
            m_outputDevice = null;

            m_audioFile.Dispose();
            m_audioFile = null;

            Speak(m_strDelayMessage);
            m_strDelayMessage = null;
        }

        private void Speak(string message)
        {
            if (m_stopped)
            {
                if (OnCompleteBroadcast != null)
                    OnCompleteBroadcast(this, BaseMessageClient.Status.Stopped);
                return;
            }

            if (message != null && message.Trim().Length > 0)
            {
                m_synth = new SpeechSynthesizer();
                m_synth.SetOutputToDefaultAudioDevice();
                m_synth.SpeakAsync(message);
                m_synth.SpeakCompleted += Synth_SpeakCompleted;
            }
            else
            {
                Synth_SpeakCompleted(null, null);
            }
        }

        private void Synth_SpeakCompleted(object sender, SpeakCompletedEventArgs e)
        {
            if (m_stopped == false)
            {
                m_completed = true;

                if (OnCompleteBroadcast != null)
                    OnCompleteBroadcast(this, BaseMessageClient.Status.Completed);
            }
        }
    }
#endif
}
