
namespace IntegrationServer.Options
{
    partial class PanelContact
    {
        /// <summary> 
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region 구성 요소 디자이너에서 생성한 코드

        /// <summary> 
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.gbPropertyContact = new System.Windows.Forms.GroupBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.rbAlarmDepth4 = new System.Windows.Forms.RadioButton();
            this.rbAlarmDepth3 = new System.Windows.Forms.RadioButton();
            this.rbAlarmDepth2 = new System.Windows.Forms.RadioButton();
            this.rbAlarmDepth1 = new System.Windows.Forms.RadioButton();
            this.txtSensorType = new System.Windows.Forms.TextBox();
            this.txtSensorID = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label15 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.rbContact3 = new System.Windows.Forms.RadioButton();
            this.rbContact2 = new System.Windows.Forms.RadioButton();
            this.rbContact1 = new System.Windows.Forms.RadioButton();
            this.rbAlarmDepth0 = new System.Windows.Forms.RadioButton();
            this.gbPropertyContact.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertyContact
            // 
            this.gbPropertyContact.Controls.Add(this.groupBox1);
            this.gbPropertyContact.Controls.Add(this.txtSensorType);
            this.gbPropertyContact.Controls.Add(this.txtSensorID);
            this.gbPropertyContact.Controls.Add(this.label1);
            this.gbPropertyContact.Controls.Add(this.label15);
            this.gbPropertyContact.Controls.Add(this.label7);
            this.gbPropertyContact.Controls.Add(this.rbContact3);
            this.gbPropertyContact.Controls.Add(this.rbContact2);
            this.gbPropertyContact.Controls.Add(this.rbContact1);
            this.gbPropertyContact.Location = new System.Drawing.Point(0, 0);
            this.gbPropertyContact.Name = "gbPropertyContact";
            this.gbPropertyContact.Size = new System.Drawing.Size(339, 205);
            this.gbPropertyContact.TabIndex = 0;
            this.gbPropertyContact.TabStop = false;
            this.gbPropertyContact.Text = "접점신호-솔내";
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.rbAlarmDepth0);
            this.groupBox1.Controls.Add(this.rbAlarmDepth4);
            this.groupBox1.Controls.Add(this.rbAlarmDepth3);
            this.groupBox1.Controls.Add(this.rbAlarmDepth2);
            this.groupBox1.Controls.Add(this.rbAlarmDepth1);
            this.groupBox1.Location = new System.Drawing.Point(9, 130);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(294, 58);
            this.groupBox1.TabIndex = 56;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "기본 알람단계";
            // 
            // rbAlarmDepth4
            // 
            this.rbAlarmDepth4.AutoSize = true;
            this.rbAlarmDepth4.Location = new System.Drawing.Point(227, 22);
            this.rbAlarmDepth4.Name = "rbAlarmDepth4";
            this.rbAlarmDepth4.Size = new System.Drawing.Size(49, 19);
            this.rbAlarmDepth4.TabIndex = 55;
            this.rbAlarmDepth4.Text = "심각";
            this.rbAlarmDepth4.UseVisualStyleBackColor = true;
            this.rbAlarmDepth4.CheckedChanged += new System.EventHandler(this.rb_DepthChanged);
            // 
            // rbAlarmDepth3
            // 
            this.rbAlarmDepth3.AutoSize = true;
            this.rbAlarmDepth3.Location = new System.Drawing.Point(172, 22);
            this.rbAlarmDepth3.Name = "rbAlarmDepth3";
            this.rbAlarmDepth3.Size = new System.Drawing.Size(49, 19);
            this.rbAlarmDepth3.TabIndex = 54;
            this.rbAlarmDepth3.Text = "경계";
            this.rbAlarmDepth3.UseVisualStyleBackColor = true;
            this.rbAlarmDepth3.CheckedChanged += new System.EventHandler(this.rb_DepthChanged);
            // 
            // rbAlarmDepth2
            // 
            this.rbAlarmDepth2.AutoSize = true;
            this.rbAlarmDepth2.Location = new System.Drawing.Point(117, 22);
            this.rbAlarmDepth2.Name = "rbAlarmDepth2";
            this.rbAlarmDepth2.Size = new System.Drawing.Size(49, 19);
            this.rbAlarmDepth2.TabIndex = 53;
            this.rbAlarmDepth2.Text = "주의";
            this.rbAlarmDepth2.UseVisualStyleBackColor = true;
            this.rbAlarmDepth2.CheckedChanged += new System.EventHandler(this.rb_DepthChanged);
            // 
            // rbAlarmDepth1
            // 
            this.rbAlarmDepth1.AutoSize = true;
            this.rbAlarmDepth1.Location = new System.Drawing.Point(62, 22);
            this.rbAlarmDepth1.Name = "rbAlarmDepth1";
            this.rbAlarmDepth1.Size = new System.Drawing.Size(49, 19);
            this.rbAlarmDepth1.TabIndex = 52;
            this.rbAlarmDepth1.Text = "관심";
            this.rbAlarmDepth1.UseVisualStyleBackColor = true;
            this.rbAlarmDepth1.CheckedChanged += new System.EventHandler(this.rb_DepthChanged);
            // 
            // txtSensorType
            // 
            this.txtSensorType.Location = new System.Drawing.Point(91, 62);
            this.txtSensorType.Name = "txtSensorType";
            this.txtSensorType.Size = new System.Drawing.Size(133, 23);
            this.txtSensorType.TabIndex = 50;
            this.txtSensorType.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // txtSensorID
            // 
            this.txtSensorID.Location = new System.Drawing.Point(91, 92);
            this.txtSensorID.Name = "txtSensorID";
            this.txtSensorID.Size = new System.Drawing.Size(133, 23);
            this.txtSensorID.TabIndex = 49;
            this.txtSensorID.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 95);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(43, 15);
            this.label1.TabIndex = 48;
            this.label1.Text = "센서ID";
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(9, 65);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(55, 15);
            this.label15.TabIndex = 44;
            this.label15.Text = "센서타입";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(9, 35);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(55, 15);
            this.label7.TabIndex = 38;
            this.label7.Text = "사용포트";
            // 
            // rbContact3
            // 
            this.rbContact3.AutoSize = true;
            this.rbContact3.Location = new System.Drawing.Point(254, 33);
            this.rbContact3.Name = "rbContact3";
            this.rbContact3.Size = new System.Drawing.Size(49, 19);
            this.rbContact3.TabIndex = 2;
            this.rbContact3.Text = "둘다";
            this.rbContact3.UseVisualStyleBackColor = true;
            this.rbContact3.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // rbContact2
            // 
            this.rbContact2.AutoSize = true;
            this.rbContact2.Location = new System.Drawing.Point(172, 33);
            this.rbContact2.Name = "rbContact2";
            this.rbContact2.Size = new System.Drawing.Size(76, 19);
            this.rbContact2.TabIndex = 1;
            this.rbContact2.Text = "2번(접점)";
            this.rbContact2.UseVisualStyleBackColor = true;
            this.rbContact2.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // rbContact1
            // 
            this.rbContact1.AutoSize = true;
            this.rbContact1.Checked = true;
            this.rbContact1.Location = new System.Drawing.Point(78, 33);
            this.rbContact1.Name = "rbContact1";
            this.rbContact1.Size = new System.Drawing.Size(88, 19);
            this.rbContact1.TabIndex = 0;
            this.rbContact1.TabStop = true;
            this.rbContact1.Text = "1번(무접점)";
            this.rbContact1.UseVisualStyleBackColor = true;
            this.rbContact1.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // rbAlarmDepth0
            // 
            this.rbAlarmDepth0.AutoSize = true;
            this.rbAlarmDepth0.Checked = true;
            this.rbAlarmDepth0.Location = new System.Drawing.Point(7, 22);
            this.rbAlarmDepth0.Name = "rbAlarmDepth0";
            this.rbAlarmDepth0.Size = new System.Drawing.Size(49, 19);
            this.rbAlarmDepth0.TabIndex = 56;
            this.rbAlarmDepth0.Text = "없음";
            this.rbAlarmDepth0.UseVisualStyleBackColor = true;
            // 
            // PanelContact
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyContact);
            this.Name = "PanelContact";
            this.Size = new System.Drawing.Size(338, 207);
            this.gbPropertyContact.ResumeLayout(false);
            this.gbPropertyContact.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertyContact;
        private System.Windows.Forms.RadioButton rbContact3;
        private System.Windows.Forms.RadioButton rbContact2;
        private System.Windows.Forms.RadioButton rbContact1;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txtSensorType;
        private System.Windows.Forms.TextBox txtSensorID;
        private System.Windows.Forms.RadioButton rbAlarmDepth1;
        private System.Windows.Forms.RadioButton rbAlarmDepth4;
        private System.Windows.Forms.RadioButton rbAlarmDepth3;
        private System.Windows.Forms.RadioButton rbAlarmDepth2;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.RadioButton rbAlarmDepth0;
    }
}
