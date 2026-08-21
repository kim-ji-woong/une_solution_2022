
namespace MQTTSample
{
    partial class FormMain
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.textBoxBrokerPort = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxBrokerIP = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.textBoxTargetSiteID = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.btnCancelEvac = new System.Windows.Forms.Button();
            this.btnEndEvac = new System.Windows.Forms.Button();
            this.btnEvacNow = new System.Windows.Forms.Button();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.textBoxNoEntry = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.btnConnect);
            this.groupBox1.Controls.Add(this.textBoxBrokerPort);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.textBoxBrokerIP);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(28, 29);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(409, 66);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "MQTT 브로커";
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(336, 22);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(53, 25);
            this.btnConnect.TabIndex = 2;
            this.btnConnect.Text = "연결";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // textBoxBrokerPort
            // 
            this.textBoxBrokerPort.Location = new System.Drawing.Point(221, 22);
            this.textBoxBrokerPort.Name = "textBoxBrokerPort";
            this.textBoxBrokerPort.Size = new System.Drawing.Size(100, 23);
            this.textBoxBrokerPort.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(184, 25);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(29, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "Port";
            // 
            // textBoxBrokerIP
            // 
            this.textBoxBrokerIP.Location = new System.Drawing.Point(52, 22);
            this.textBoxBrokerIP.Name = "textBoxBrokerIP";
            this.textBoxBrokerIP.Size = new System.Drawing.Size(100, 23);
            this.textBoxBrokerIP.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(15, 25);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(17, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "IP";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.textBoxTargetSiteID);
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Location = new System.Drawing.Point(28, 114);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(409, 66);
            this.groupBox2.TabIndex = 0;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "제어대상";
            // 
            // textBoxTargetSiteID
            // 
            this.textBoxTargetSiteID.Location = new System.Drawing.Point(64, 22);
            this.textBoxTargetSiteID.Name = "textBoxTargetSiteID";
            this.textBoxTargetSiteID.Size = new System.Drawing.Size(100, 23);
            this.textBoxTargetSiteID.TabIndex = 1;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(15, 25);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(43, 15);
            this.label4.TabIndex = 0;
            this.label4.Text = "Site ID";
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.btnCancelEvac);
            this.groupBox3.Controls.Add(this.btnEndEvac);
            this.groupBox3.Controls.Add(this.btnEvacNow);
            this.groupBox3.Location = new System.Drawing.Point(28, 205);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(409, 66);
            this.groupBox3.TabIndex = 0;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "대피";
            // 
            // btnCancelEvac
            // 
            this.btnCancelEvac.Location = new System.Drawing.Point(213, 24);
            this.btnCancelEvac.Name = "btnCancelEvac";
            this.btnCancelEvac.Size = new System.Drawing.Size(93, 23);
            this.btnCancelEvac.TabIndex = 0;
            this.btnCancelEvac.Text = "대피취소";
            this.btnCancelEvac.UseVisualStyleBackColor = true;
            this.btnCancelEvac.Click += new System.EventHandler(this.btnCancelEvac_Click);
            // 
            // btnEndEvac
            // 
            this.btnEndEvac.Location = new System.Drawing.Point(114, 24);
            this.btnEndEvac.Name = "btnEndEvac";
            this.btnEndEvac.Size = new System.Drawing.Size(93, 23);
            this.btnEndEvac.TabIndex = 0;
            this.btnEndEvac.Text = "대피종료";
            this.btnEndEvac.UseVisualStyleBackColor = true;
            this.btnEndEvac.Click += new System.EventHandler(this.btnEndEvac_Click);
            // 
            // btnEvacNow
            // 
            this.btnEvacNow.Location = new System.Drawing.Point(15, 24);
            this.btnEvacNow.Name = "btnEvacNow";
            this.btnEvacNow.Size = new System.Drawing.Size(93, 23);
            this.btnEvacNow.TabIndex = 0;
            this.btnEvacNow.Text = "즉시 대피시작";
            this.btnEvacNow.UseVisualStyleBackColor = true;
            this.btnEvacNow.Click += new System.EventHandler(this.btnEvacNow_Click);
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.textBoxNoEntry);
            this.groupBox4.Controls.Add(this.label3);
            this.groupBox4.Location = new System.Drawing.Point(28, 300);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(409, 66);
            this.groupBox4.TabIndex = 0;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "진입금지";
            // 
            // textBoxNoEntry
            // 
            this.textBoxNoEntry.Location = new System.Drawing.Point(85, 22);
            this.textBoxNoEntry.Name = "textBoxNoEntry";
            this.textBoxNoEntry.Size = new System.Drawing.Size(100, 23);
            this.textBoxNoEntry.TabIndex = 1;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(15, 25);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(61, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "Station ID";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(459, 391);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "MQTT Sample";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.TextBox textBoxBrokerPort;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxBrokerIP;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox textBoxTargetSiteID;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Button btnCancelEvac;
        private System.Windows.Forms.Button btnEndEvac;
        private System.Windows.Forms.Button btnEvacNow;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.TextBox textBoxNoEntry;
        private System.Windows.Forms.Label label3;
    }
}

