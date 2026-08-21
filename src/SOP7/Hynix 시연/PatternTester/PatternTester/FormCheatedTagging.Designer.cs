
namespace PatternTester
{
    partial class FormCheatedTagging
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
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
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.cboTaggingCount = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.cboElapsedTime = new System.Windows.Forms.ComboBox();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(14, 16);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(134, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "사원증 태깅 승인 횟수 :";
            // 
            // cboTaggingCount
            // 
            this.cboTaggingCount.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTaggingCount.FormattingEnabled = true;
            this.cboTaggingCount.Items.AddRange(new object[] {
            "상관없음",
            "1회 이상",
            "2회 이상",
            "3회 이상",
            "4회 이상",
            "5회 이상",
            "6회 이상",
            "7회 이상",
            "8회 이상",
            "9회 이상",
            "10회 이상",
            "11회 이상",
            "12회 이상",
            "13회 이상",
            "14회 이상",
            "15회 이상"});
            this.cboTaggingCount.Location = new System.Drawing.Point(154, 12);
            this.cboTaggingCount.Name = "cboTaggingCount";
            this.cboTaggingCount.Size = new System.Drawing.Size(95, 23);
            this.cboTaggingCount.TabIndex = 1;
            this.cboTaggingCount.SelectedIndexChanged += new System.EventHandler(this.cboTaggingFailCount_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(262, 16);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(62, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "경과시간 :";
            // 
            // cboElapsedTime
            // 
            this.cboElapsedTime.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboElapsedTime.FormattingEnabled = true;
            this.cboElapsedTime.Items.AddRange(new object[] {
            "상관없음",
            "10초 이내",
            "20초 이내",
            "30초 이내",
            "40초 이내",
            "50초 이내",
            "1분 이내",
            "2분 이내",
            "3분 이내",
            "4분 이내",
            "5분 이내",
            "6분 이내",
            "7분 이내",
            "8분 이내",
            "9분 이내",
            "10분 이내"});
            this.cboElapsedTime.Location = new System.Drawing.Point(333, 12);
            this.cboElapsedTime.Name = "cboElapsedTime";
            this.cboElapsedTime.Size = new System.Drawing.Size(95, 23);
            this.cboElapsedTime.TabIndex = 1;
            this.cboElapsedTime.SelectedIndexChanged += new System.EventHandler(this.cboElapsedTime_SelectedIndexChanged);
            // 
            // FormCheatedTagging
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(439, 48);
            this.Controls.Add(this.cboElapsedTime);
            this.Controls.Add(this.cboTaggingCount);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "FormCheatedTagging";
            this.Text = "FormCheatedTagging";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox cboTaggingCount;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox cboElapsedTime;
    }
}