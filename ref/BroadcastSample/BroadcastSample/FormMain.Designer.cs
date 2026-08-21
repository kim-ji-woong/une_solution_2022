
namespace BroadcastSample
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
            this.btnRunBroadcast = new System.Windows.Forms.Button();
            this.btnStopBroadcast = new System.Windows.Forms.Button();
            this.btnPauseBroadcast = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnRunBroadcast
            // 
            this.btnRunBroadcast.Location = new System.Drawing.Point(50, 49);
            this.btnRunBroadcast.Name = "btnRunBroadcast";
            this.btnRunBroadcast.Size = new System.Drawing.Size(75, 23);
            this.btnRunBroadcast.TabIndex = 0;
            this.btnRunBroadcast.Text = "방송실행";
            this.btnRunBroadcast.UseVisualStyleBackColor = true;
            this.btnRunBroadcast.Click += new System.EventHandler(this.btnRunBroadcast_Click);
            // 
            // btnStopBroadcast
            // 
            this.btnStopBroadcast.Location = new System.Drawing.Point(131, 49);
            this.btnStopBroadcast.Name = "btnStopBroadcast";
            this.btnStopBroadcast.Size = new System.Drawing.Size(75, 23);
            this.btnStopBroadcast.TabIndex = 0;
            this.btnStopBroadcast.Text = "방송중지";
            this.btnStopBroadcast.UseVisualStyleBackColor = true;
            this.btnStopBroadcast.Click += new System.EventHandler(this.btnStopBroadcast_Click);
            // 
            // btnPauseBroadcast
            // 
            this.btnPauseBroadcast.Location = new System.Drawing.Point(212, 49);
            this.btnPauseBroadcast.Name = "btnPauseBroadcast";
            this.btnPauseBroadcast.Size = new System.Drawing.Size(75, 23);
            this.btnPauseBroadcast.TabIndex = 0;
            this.btnPauseBroadcast.Text = "일시정지";
            this.btnPauseBroadcast.UseVisualStyleBackColor = true;
            this.btnPauseBroadcast.Click += new System.EventHandler(this.btnPauseBroadcast_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(333, 118);
            this.Controls.Add(this.btnPauseBroadcast);
            this.Controls.Add(this.btnStopBroadcast);
            this.Controls.Add(this.btnRunBroadcast);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "방송 테스트";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnRunBroadcast;
        private System.Windows.Forms.Button btnStopBroadcast;
        private System.Windows.Forms.Button btnPauseBroadcast;
    }
}

