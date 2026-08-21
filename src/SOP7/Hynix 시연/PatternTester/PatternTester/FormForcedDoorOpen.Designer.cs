
namespace PatternTester
{
    partial class FormForcedDoorOpen
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
            this.cboElapsedTime = new System.Windows.Forms.ComboBox();
            this.cboTaggingFailCount = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // cboElapsedTime
            // 
            this.cboElapsedTime.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboElapsedTime.FormattingEnabled = true;
            this.cboElapsedTime.Items.AddRange(new object[] {
            "상관없음",
            "1분 이내",
            "2분 이내",
            "3분 이내",
            "4분 이내",
            "5분 이내",
            "6분 이내",
            "7분 이내",
            "8분 이내",
            "9분 이내",
            "10분 이내",
            "11분 이내",
            "12분 이내",
            "13분 이내",
            "14분 이내",
            "15분 이내"});
            this.cboElapsedTime.Location = new System.Drawing.Point(333, 13);
            this.cboElapsedTime.Name = "cboElapsedTime";
            this.cboElapsedTime.Size = new System.Drawing.Size(95, 23);
            this.cboElapsedTime.TabIndex = 4;
            this.cboElapsedTime.SelectedIndexChanged += new System.EventHandler(this.cboElapsedTime_SelectedIndexChanged);
            // 
            // cboTaggingFailCount
            // 
            this.cboTaggingFailCount.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTaggingFailCount.FormattingEnabled = true;
            this.cboTaggingFailCount.Items.AddRange(new object[] {
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
            this.cboTaggingFailCount.Location = new System.Drawing.Point(154, 13);
            this.cboTaggingFailCount.Name = "cboTaggingFailCount";
            this.cboTaggingFailCount.Size = new System.Drawing.Size(95, 23);
            this.cboTaggingFailCount.TabIndex = 5;
            this.cboTaggingFailCount.SelectedIndexChanged += new System.EventHandler(this.cboTaggingFailCount_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(262, 17);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(62, 15);
            this.label2.TabIndex = 2;
            this.label2.Text = "경과시간 :";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(14, 17);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(134, 15);
            this.label1.TabIndex = 3;
            this.label1.Text = "사원증 태깅 실패 횟수 :";
            // 
            // FormForcedDoorOpen
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(443, 48);
            this.Controls.Add(this.cboElapsedTime);
            this.Controls.Add(this.cboTaggingFailCount);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "FormForcedDoorOpen";
            this.Text = "FormForcedDoorOpen";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox cboElapsedTime;
        private System.Windows.Forms.ComboBox cboTaggingFailCount;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
    }
}