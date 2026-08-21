
namespace LogSimulator
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
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxLogPath = new System.Windows.Forms.TextBox();
            this.textBoxIP = new System.Windows.Forms.TextBox();
            this.textBoxPort = new System.Windows.Forms.TextBox();
            this.btnLogPath = new System.Windows.Forms.Button();
            this.btnSend = new System.Windows.Forms.Button();
            this.btnConnect = new System.Windows.Forms.Button();
            this.radioServerMode = new System.Windows.Forms.RadioButton();
            this.radioClientMode = new System.Windows.Forms.RadioButton();
            this.textBoxByteArray = new System.Windows.Forms.TextBox();
            this.btnSendDirect = new System.Windows.Forms.Button();
            this.checkBoxTcp = new System.Windows.Forms.CheckBox();
            this.checkBoxUdp = new System.Windows.Forms.CheckBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxLogTag = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(22, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Log Path";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(22, 126);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(17, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "IP";
            this.label2.Visible = false;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(153, 126);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(29, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "Port";
            // 
            // textBoxLogPath
            // 
            this.textBoxLogPath.Location = new System.Drawing.Point(83, 17);
            this.textBoxLogPath.Name = "textBoxLogPath";
            this.textBoxLogPath.Size = new System.Drawing.Size(164, 23);
            this.textBoxLogPath.TabIndex = 1;
            // 
            // textBoxIP
            // 
            this.textBoxIP.Location = new System.Drawing.Point(45, 121);
            this.textBoxIP.Name = "textBoxIP";
            this.textBoxIP.Size = new System.Drawing.Size(91, 23);
            this.textBoxIP.TabIndex = 1;
            this.textBoxIP.Visible = false;
            // 
            // textBoxPort
            // 
            this.textBoxPort.Location = new System.Drawing.Point(186, 121);
            this.textBoxPort.Name = "textBoxPort";
            this.textBoxPort.Size = new System.Drawing.Size(61, 23);
            this.textBoxPort.TabIndex = 1;
            // 
            // btnLogPath
            // 
            this.btnLogPath.Location = new System.Drawing.Point(253, 17);
            this.btnLogPath.Name = "btnLogPath";
            this.btnLogPath.Size = new System.Drawing.Size(33, 21);
            this.btnLogPath.TabIndex = 2;
            this.btnLogPath.Text = "...";
            this.btnLogPath.UseVisualStyleBackColor = true;
            this.btnLogPath.Click += new System.EventHandler(this.btnLogPath_Click);
            // 
            // btnSend
            // 
            this.btnSend.Enabled = false;
            this.btnSend.Location = new System.Drawing.Point(387, 123);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(72, 21);
            this.btnSend.TabIndex = 2;
            this.btnSend.Text = "Log 전송";
            this.btnSend.UseVisualStyleBackColor = true;
            this.btnSend.Click += new System.EventHandler(this.btnSend_Click);
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(280, 123);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(50, 21);
            this.btnConnect.TabIndex = 2;
            this.btnConnect.Text = "시작";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // radioServerMode
            // 
            this.radioServerMode.AutoSize = true;
            this.radioServerMode.Checked = true;
            this.radioServerMode.Location = new System.Drawing.Point(280, 55);
            this.radioServerMode.Name = "radioServerMode";
            this.radioServerMode.Size = new System.Drawing.Size(73, 19);
            this.radioServerMode.TabIndex = 3;
            this.radioServerMode.TabStop = true;
            this.radioServerMode.Text = "서버모드";
            this.radioServerMode.UseVisualStyleBackColor = true;
            // 
            // radioClientMode
            // 
            this.radioClientMode.AutoSize = true;
            this.radioClientMode.Enabled = false;
            this.radioClientMode.Location = new System.Drawing.Point(359, 55);
            this.radioClientMode.Name = "radioClientMode";
            this.radioClientMode.Size = new System.Drawing.Size(109, 19);
            this.radioClientMode.TabIndex = 3;
            this.radioClientMode.Text = "클라이언트모드";
            this.radioClientMode.UseVisualStyleBackColor = true;
            // 
            // textBoxByteArray
            // 
            this.textBoxByteArray.Location = new System.Drawing.Point(22, 92);
            this.textBoxByteArray.Name = "textBoxByteArray";
            this.textBoxByteArray.Size = new System.Drawing.Size(354, 23);
            this.textBoxByteArray.TabIndex = 1;
            // 
            // btnSendDirect
            // 
            this.btnSendDirect.Enabled = false;
            this.btnSendDirect.Location = new System.Drawing.Point(387, 92);
            this.btnSendDirect.Name = "btnSendDirect";
            this.btnSendDirect.Size = new System.Drawing.Size(72, 21);
            this.btnSendDirect.TabIndex = 2;
            this.btnSendDirect.Text = "직접 전송";
            this.btnSendDirect.UseVisualStyleBackColor = true;
            this.btnSendDirect.Click += new System.EventHandler(this.btnSendDirect_Click);
            // 
            // checkBoxTcp
            // 
            this.checkBoxTcp.AutoSize = true;
            this.checkBoxTcp.Checked = true;
            this.checkBoxTcp.CheckState = System.Windows.Forms.CheckState.Checked;
            this.checkBoxTcp.Location = new System.Drawing.Point(52, 56);
            this.checkBoxTcp.Name = "checkBoxTcp";
            this.checkBoxTcp.Size = new System.Drawing.Size(45, 19);
            this.checkBoxTcp.TabIndex = 4;
            this.checkBoxTcp.Text = "Tcp";
            this.checkBoxTcp.UseVisualStyleBackColor = true;
            this.checkBoxTcp.CheckedChanged += new System.EventHandler(this.checkBox_CheckedChanged);
            // 
            // checkBoxUdp
            // 
            this.checkBoxUdp.AutoSize = true;
            this.checkBoxUdp.Location = new System.Drawing.Point(103, 56);
            this.checkBoxUdp.Name = "checkBoxUdp";
            this.checkBoxUdp.Size = new System.Drawing.Size(48, 19);
            this.checkBoxUdp.TabIndex = 4;
            this.checkBoxUdp.Text = "Udp";
            this.checkBoxUdp.UseVisualStyleBackColor = true;
            this.checkBoxUdp.CheckedChanged += new System.EventHandler(this.checkBox_CheckedChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(316, 20);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(50, 15);
            this.label4.TabIndex = 0;
            this.label4.Text = "Log Tag";
            // 
            // textBoxLogTag
            // 
            this.textBoxLogTag.Location = new System.Drawing.Point(377, 17);
            this.textBoxLogTag.Name = "textBoxLogTag";
            this.textBoxLogTag.Size = new System.Drawing.Size(82, 23);
            this.textBoxLogTag.TabIndex = 1;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(508, 169);
            this.Controls.Add(this.checkBoxUdp);
            this.Controls.Add(this.checkBoxTcp);
            this.Controls.Add(this.radioClientMode);
            this.Controls.Add(this.radioServerMode);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.btnSendDirect);
            this.Controls.Add(this.btnSend);
            this.Controls.Add(this.btnLogPath);
            this.Controls.Add(this.textBoxPort);
            this.Controls.Add(this.textBoxIP);
            this.Controls.Add(this.textBoxByteArray);
            this.Controls.Add(this.textBoxLogTag);
            this.Controls.Add(this.textBoxLogPath);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "Log Simulator";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxLogPath;
        private System.Windows.Forms.TextBox textBoxIP;
        private System.Windows.Forms.TextBox textBoxPort;
        private System.Windows.Forms.Button btnLogPath;
        private System.Windows.Forms.Button btnSend;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.RadioButton radioServerMode;
        private System.Windows.Forms.RadioButton radioClientMode;
        private System.Windows.Forms.TextBox textBoxByteArray;
        private System.Windows.Forms.Button btnSendDirect;
        private System.Windows.Forms.CheckBox checkBoxTcp;
        private System.Windows.Forms.CheckBox checkBoxUdp;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxLogTag;
    }
}

