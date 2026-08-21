
namespace PatternTester
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
            this.cboAlarmType = new System.Windows.Forms.ComboBox();
            this.textBoxPolicy = new System.Windows.Forms.TextBox();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.btnHelp = new System.Windows.Forms.Button();
            this.panel1 = new System.Windows.Forms.Panel();
            this.checkBoxOptions = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // cboAlarmType
            // 
            this.cboAlarmType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboAlarmType.FormattingEnabled = true;
            this.cboAlarmType.Items.AddRange(new object[] {
            "강제문열림",
            "대리태깅"});
            this.cboAlarmType.Location = new System.Drawing.Point(38, 31);
            this.cboAlarmType.Name = "cboAlarmType";
            this.cboAlarmType.Size = new System.Drawing.Size(121, 23);
            this.cboAlarmType.TabIndex = 0;
            this.cboAlarmType.SelectedIndexChanged += new System.EventHandler(this.cboAlarmType_SelectedIndexChanged);
            // 
            // textBoxPolicy
            // 
            this.textBoxPolicy.Location = new System.Drawing.Point(38, 127);
            this.textBoxPolicy.Multiline = true;
            this.textBoxPolicy.Name = "textBoxPolicy";
            this.textBoxPolicy.Size = new System.Drawing.Size(545, 277);
            this.textBoxPolicy.TabIndex = 1;
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(464, 423);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(55, 23);
            this.btnOK.TabIndex = 2;
            this.btnOK.Text = "적용";
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Location = new System.Drawing.Point(525, 423);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(55, 23);
            this.btnCancel.TabIndex = 2;
            this.btnCancel.Text = "취소";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // btnHelp
            // 
            this.btnHelp.Location = new System.Drawing.Point(529, 30);
            this.btnHelp.Name = "btnHelp";
            this.btnHelp.Size = new System.Drawing.Size(54, 23);
            this.btnHelp.TabIndex = 3;
            this.btnHelp.Text = "범례";
            this.btnHelp.UseVisualStyleBackColor = true;
            this.btnHelp.Click += new System.EventHandler(this.btnHelp_Click);
            // 
            // panel1
            // 
            this.panel1.ForeColor = System.Drawing.Color.Black;
            this.panel1.Location = new System.Drawing.Point(38, 66);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(545, 48);
            this.panel1.TabIndex = 4;
            this.panel1.Visible = false;
            // 
            // checkBoxOptions
            // 
            this.checkBoxOptions.AutoSize = true;
            this.checkBoxOptions.Location = new System.Drawing.Point(174, 33);
            this.checkBoxOptions.Name = "checkBoxOptions";
            this.checkBoxOptions.Size = new System.Drawing.Size(65, 19);
            this.checkBoxOptions.TabIndex = 5;
            this.checkBoxOptions.Text = "옵션 UI";
            this.checkBoxOptions.UseVisualStyleBackColor = true;
            this.checkBoxOptions.CheckedChanged += new System.EventHandler(this.checkBoxOptions_CheckedChanged);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(600, 459);
            this.Controls.Add(this.checkBoxOptions);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.btnHelp);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.textBoxPolicy);
            this.Controls.Add(this.cboAlarmType);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "정책 편집기";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox cboAlarmType;
        private System.Windows.Forms.TextBox textBoxPolicy;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Button btnHelp;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.CheckBox checkBoxOptions;
    }
}

