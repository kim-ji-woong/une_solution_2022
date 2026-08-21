namespace FireSignalTester
{
    partial class FormMain
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            this.lblUrl = new System.Windows.Forms.Label();
            this.txtUrl = new System.Windows.Forms.TextBox();
            this.btnSend = new System.Windows.Forms.Button();
            this.grpSignal = new System.Windows.Forms.GroupBox();
            this.lblSignal = new System.Windows.Forms.Label();
            this.txtLog = new System.Windows.Forms.TextBox();
            this.lblLog = new System.Windows.Forms.Label();
            this.grpSignal.SuspendLayout();
            this.SuspendLayout();
            //
            // lblUrl
            //
            this.lblUrl.AutoSize = true;
            this.lblUrl.Location = new System.Drawing.Point(12, 15);
            this.lblUrl.Name = "lblUrl";
            this.lblUrl.Size = new System.Drawing.Size(53, 12);
            this.lblUrl.TabIndex = 0;
            this.lblUrl.Text = "API URL";
            //
            // txtUrl
            //
            this.txtUrl.Location = new System.Drawing.Point(14, 32);
            this.txtUrl.Name = "txtUrl";
            this.txtUrl.Size = new System.Drawing.Size(451, 21);
            this.txtUrl.TabIndex = 1;
            this.txtUrl.Text = "http://127.0.0.1:44379/api/FireSensor";
            //
            // btnSend
            //
            this.btnSend.Location = new System.Drawing.Point(471, 30);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(91, 25);
            this.btnSend.TabIndex = 2;
            this.btnSend.Text = "전송";
            this.btnSend.UseVisualStyleBackColor = true;
            this.btnSend.Click += new System.EventHandler(this.btnSend_Click);
            //
            // grpSignal
            //
            this.grpSignal.Controls.Add(this.lblSignal);
            this.grpSignal.Location = new System.Drawing.Point(14, 66);
            this.grpSignal.Name = "grpSignal";
            this.grpSignal.Size = new System.Drawing.Size(548, 122);
            this.grpSignal.TabIndex = 3;
            this.grpSignal.TabStop = false;
            this.grpSignal.Text = "전송할 신호 (2026-08-03 13:16:35 화재 알람)";
            //
            // lblSignal
            //
            this.lblSignal.AutoSize = true;
            this.lblSignal.Location = new System.Drawing.Point(14, 22);
            this.lblSignal.Name = "lblSignal";
            this.lblSignal.Size = new System.Drawing.Size(0, 12);
            this.lblSignal.TabIndex = 0;
            //
            // lblLog
            //
            this.lblLog.AutoSize = true;
            this.lblLog.Location = new System.Drawing.Point(12, 197);
            this.lblLog.Name = "lblLog";
            this.lblLog.Size = new System.Drawing.Size(29, 12);
            this.lblLog.TabIndex = 4;
            this.lblLog.Text = "결과";
            //
            // txtLog
            //
            this.txtLog.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.txtLog.Font = new System.Drawing.Font("Consolas", 9F);
            this.txtLog.Location = new System.Drawing.Point(14, 214);
            this.txtLog.Multiline = true;
            this.txtLog.Name = "txtLog";
            this.txtLog.ReadOnly = true;
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.Size = new System.Drawing.Size(548, 205);
            this.txtLog.TabIndex = 5;
            //
            // FormMain
            //
            this.AcceptButton = this.btnSend;
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(576, 433);
            this.Controls.Add(this.txtLog);
            this.Controls.Add(this.lblLog);
            this.Controls.Add(this.grpSignal);
            this.Controls.Add(this.btnSend);
            this.Controls.Add(this.txtUrl);
            this.Controls.Add(this.lblUrl);
            this.MinimumSize = new System.Drawing.Size(500, 380);
            this.Name = "FormMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "화재 신호 테스터";
            this.grpSignal.ResumeLayout(false);
            this.grpSignal.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.Label lblUrl;
        private System.Windows.Forms.TextBox txtUrl;
        private System.Windows.Forms.Button btnSend;
        private System.Windows.Forms.GroupBox grpSignal;
        private System.Windows.Forms.Label lblSignal;
        private System.Windows.Forms.TextBox txtLog;
        private System.Windows.Forms.Label lblLog;
    }
}
