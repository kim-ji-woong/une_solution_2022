
namespace HynixAlarmSimulator
{
    partial class FormSensorManager
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
            this.CardLabel = new System.Windows.Forms.Label();
            this.SensorList = new System.Windows.Forms.ListBox();
            this.InsertButton = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.H2_Radio = new System.Windows.Forms.RadioButton();
            this.VOC_Radio = new System.Windows.Forms.RadioButton();
            this.CL_Radio = new System.Windows.Forms.RadioButton();
            this.label1 = new System.Windows.Forms.Label();
            this.ValueTextBox = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // CardLabel
            // 
            this.CardLabel.Location = new System.Drawing.Point(123, 20);
            this.CardLabel.Name = "CardLabel";
            this.CardLabel.Size = new System.Drawing.Size(77, 22);
            this.CardLabel.TabIndex = 4;
            this.CardLabel.Text = "센서 목록";
            this.CardLabel.Click += new System.EventHandler(this.CardLabel_Click);
            // 
            // SensorList
            // 
            this.SensorList.DisplayMember = "Name";
            this.SensorList.FormattingEnabled = true;
            this.SensorList.ItemHeight = 15;
            this.SensorList.Location = new System.Drawing.Point(117, 45);
            this.SensorList.Name = "SensorList";
            this.SensorList.Size = new System.Drawing.Size(231, 244);
            this.SensorList.TabIndex = 3;
            this.SensorList.ValueMember = "ID";
            this.SensorList.SelectedIndexChanged += new System.EventHandler(this.SensorList_SelectedIndexChanged);
            // 
            // InsertButton
            // 
            this.InsertButton.Location = new System.Drawing.Point(445, 86);
            this.InsertButton.Name = "InsertButton";
            this.InsertButton.Size = new System.Drawing.Size(83, 21);
            this.InsertButton.TabIndex = 5;
            this.InsertButton.Text = "데이터 입력";
            this.InsertButton.UseVisualStyleBackColor = true;
            this.InsertButton.Click += new System.EventHandler(this.InsertButton_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.H2_Radio);
            this.groupBox1.Controls.Add(this.VOC_Radio);
            this.groupBox1.Controls.Add(this.CL_Radio);
            this.groupBox1.Location = new System.Drawing.Point(12, 45);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(105, 99);
            this.groupBox1.TabIndex = 12;
            this.groupBox1.TabStop = false;
            // 
            // H2_Radio
            // 
            this.H2_Radio.Location = new System.Drawing.Point(3, 65);
            this.H2_Radio.Name = "H2_Radio";
            this.H2_Radio.Size = new System.Drawing.Size(96, 21);
            this.H2_Radio.TabIndex = 6;
            this.H2_Radio.TabStop = true;
            this.H2_Radio.Text = "수소(H2)";
            this.H2_Radio.UseVisualStyleBackColor = true;
            this.H2_Radio.CheckedChanged += new System.EventHandler(this.H2_Radio_CheckedChanged);
            // 
            // VOC_Radio
            // 
            this.VOC_Radio.Location = new System.Drawing.Point(3, 38);
            this.VOC_Radio.Name = "VOC_Radio";
            this.VOC_Radio.Size = new System.Drawing.Size(96, 21);
            this.VOC_Radio.TabIndex = 5;
            this.VOC_Radio.TabStop = true;
            this.VOC_Radio.Text = "VOC";
            this.VOC_Radio.UseVisualStyleBackColor = true;
            this.VOC_Radio.CheckedChanged += new System.EventHandler(this.VOC_Radio_CheckedChanged);
            // 
            // CL_Radio
            // 
            this.CL_Radio.Checked = true;
            this.CL_Radio.Location = new System.Drawing.Point(3, 11);
            this.CL_Radio.Name = "CL_Radio";
            this.CL_Radio.Size = new System.Drawing.Size(96, 21);
            this.CL_Radio.TabIndex = 5;
            this.CL_Radio.TabStop = true;
            this.CL_Radio.Text = "염소(CL)";
            this.CL_Radio.UseVisualStyleBackColor = true;
            this.CL_Radio.CheckedChanged += new System.EventHandler(this.CL_Radio_CheckedChanged);
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(21, 24);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(36, 19);
            this.label1.TabIndex = 13;
            this.label1.Text = "옵션";
            // 
            // ValueTextBox
            // 
            this.ValueTextBox.Location = new System.Drawing.Point(363, 50);
            this.ValueTextBox.Name = "ValueTextBox";
            this.ValueTextBox.Size = new System.Drawing.Size(165, 23);
            this.ValueTextBox.TabIndex = 15;
            this.ValueTextBox.Text = "0.0";
            // 
            // label3
            // 
            this.label3.Location = new System.Drawing.Point(363, 28);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(57, 23);
            this.label3.TabIndex = 14;
            this.label3.Text = "수치";
            this.label3.Click += new System.EventHandler(this.label3_Click);
            // 
            // label2
            // 
            this.label2.Location = new System.Drawing.Point(363, 122);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(300, 57);
            this.label2.TabIndex = 16;
            this.label2.Text = "염소: 주의 5.0 이상, 경계 7.0 이상, 심각: 10.0 이상\r\nVOC: 주의 1.0 이상, 경계 2.0 이상, 심각: 3.0 이상\r\n수소:" +
    " 주의 10.0 이상, 경계 15.0 이상, 심각: 20.0 이상";
            // 
            // FormSensorManager
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(692, 297);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.ValueTextBox);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.InsertButton);
            this.Controls.Add(this.CardLabel);
            this.Controls.Add(this.SensorList);
            this.Name = "FormSensorManager";
            this.Text = "FormSensorManager";
            this.groupBox1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label CardLabel;
        private System.Windows.Forms.ListBox SensorList;
        private System.Windows.Forms.Button InsertButton;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.RadioButton H2_Radio;
        private System.Windows.Forms.RadioButton VOC_Radio;
        private System.Windows.Forms.RadioButton CL_Radio;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox ValueTextBox;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
    }
}