
namespace PlcSensorSimulator
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
            this.components = new System.ComponentModel.Container();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle6 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle7 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle8 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle9 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle10 = new System.Windows.Forms.DataGridViewCellStyle();
            this.gridSensors = new System.Windows.Forms.DataGridView();
            this.colCheck = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.colSensorCode = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colValue = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.checkBoxAlarmStatus = new System.Windows.Forms.CheckBox();
            this.textBoxMessage = new System.Windows.Forms.TextBox();
            this.btnSend = new System.Windows.Forms.Button();
            this.gridFireSensors = new System.Windows.Forms.DataGridView();
            this.colNo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colPosition = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.label1 = new System.Windows.Forms.Label();
            this.btnSendFireClear = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.btnSendFireAlarm = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.gridSensors)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridFireSensors)).BeginInit();
            this.SuspendLayout();
            // 
            // gridSensors
            // 
            this.gridSensors.AllowUserToAddRows = false;
            this.gridSensors.AllowUserToDeleteRows = false;
            this.gridSensors.AllowUserToResizeColumns = false;
            dataGridViewCellStyle6.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle6.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle6.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle6.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle6.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle6.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle6.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridSensors.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle6;
            this.gridSensors.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridSensors.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colCheck,
            this.colSensorCode,
            this.colValue});
            this.gridSensors.Location = new System.Drawing.Point(23, 56);
            this.gridSensors.Name = "gridSensors";
            this.gridSensors.RowHeadersVisible = false;
            this.gridSensors.RowTemplate.Height = 25;
            this.gridSensors.Size = new System.Drawing.Size(277, 334);
            this.gridSensors.TabIndex = 0;
            // 
            // colCheck
            // 
            this.colCheck.HeaderText = "선택";
            this.colCheck.Name = "colCheck";
            this.colCheck.Width = 60;
            // 
            // colSensorCode
            // 
            dataGridViewCellStyle7.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colSensorCode.DefaultCellStyle = dataGridViewCellStyle7;
            this.colSensorCode.HeaderText = "Sensor";
            this.colSensorCode.Name = "colSensorCode";
            this.colSensorCode.ReadOnly = true;
            // 
            // colValue
            // 
            this.colValue.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle8.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle8.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.colValue.DefaultCellStyle = dataGridViewCellStyle8;
            this.colValue.HeaderText = "센서값";
            this.colValue.Name = "colValue";
            // 
            // checkBoxAlarmStatus
            // 
            this.checkBoxAlarmStatus.AutoSize = true;
            this.checkBoxAlarmStatus.Location = new System.Drawing.Point(23, 22);
            this.checkBoxAlarmStatus.Name = "checkBoxAlarmStatus";
            this.checkBoxAlarmStatus.Size = new System.Drawing.Size(74, 19);
            this.checkBoxAlarmStatus.TabIndex = 1;
            this.checkBoxAlarmStatus.Text = "알람여부";
            this.checkBoxAlarmStatus.UseVisualStyleBackColor = true;
            // 
            // textBoxMessage
            // 
            this.textBoxMessage.Location = new System.Drawing.Point(322, 56);
            this.textBoxMessage.Multiline = true;
            this.textBoxMessage.Name = "textBoxMessage";
            this.textBoxMessage.ReadOnly = true;
            this.textBoxMessage.Size = new System.Drawing.Size(322, 334);
            this.textBoxMessage.TabIndex = 2;
            // 
            // btnSend
            // 
            this.btnSend.Location = new System.Drawing.Point(243, 22);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(57, 23);
            this.btnSend.TabIndex = 3;
            this.btnSend.Text = "전송";
            this.btnSend.UseVisualStyleBackColor = true;
            this.btnSend.Click += new System.EventHandler(this.btnSend_Click);
            // 
            // gridFireSensors
            // 
            this.gridFireSensors.AllowUserToAddRows = false;
            this.gridFireSensors.AllowUserToDeleteRows = false;
            dataGridViewCellStyle9.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle9.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle9.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle9.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle9.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle9.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle9.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridFireSensors.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle9;
            this.gridFireSensors.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridFireSensors.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colNo,
            this.colName,
            this.colPosition});
            this.gridFireSensors.Location = new System.Drawing.Point(23, 434);
            this.gridFireSensors.MultiSelect = false;
            this.gridFireSensors.Name = "gridFireSensors";
            this.gridFireSensors.RowHeadersVisible = false;
            this.gridFireSensors.RowTemplate.Height = 25;
            this.gridFireSensors.Size = new System.Drawing.Size(621, 213);
            this.gridFireSensors.TabIndex = 4;
            // 
            // colNo
            // 
            dataGridViewCellStyle10.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colNo.DefaultCellStyle = dataGridViewCellStyle10;
            this.colNo.HeaderText = "No";
            this.colNo.Name = "colNo";
            this.colNo.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colNo.Width = 60;
            // 
            // colName
            // 
            this.colName.HeaderText = "Sensor";
            this.colName.Name = "colName";
            this.colName.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colName.Width = 300;
            // 
            // colPosition
            // 
            this.colPosition.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.colPosition.HeaderText = "위치";
            this.colPosition.Name = "colPosition";
            this.colPosition.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(23, 408);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 15);
            this.label1.TabIndex = 5;
            this.label1.Text = "화재센서";
            // 
            // btnSendFireClear
            // 
            this.btnSendFireClear.Location = new System.Drawing.Point(578, 404);
            this.btnSendFireClear.Name = "btnSendFireClear";
            this.btnSendFireClear.Size = new System.Drawing.Size(66, 23);
            this.btnSendFireClear.TabIndex = 3;
            this.btnSendFireClear.Text = "알람복구";
            this.btnSendFireClear.UseVisualStyleBackColor = true;
            this.btnSendFireClear.Click += new System.EventHandler(this.btnSendFireClear_Click);
            // 
            // timer1
            // 
            this.timer1.Interval = 1000;
            // 
            // btnSendFireAlarm
            // 
            this.btnSendFireAlarm.Location = new System.Drawing.Point(506, 404);
            this.btnSendFireAlarm.Name = "btnSendFireAlarm";
            this.btnSendFireAlarm.Size = new System.Drawing.Size(66, 23);
            this.btnSendFireAlarm.TabIndex = 3;
            this.btnSendFireAlarm.Text = "알람전송";
            this.btnSendFireAlarm.UseVisualStyleBackColor = true;
            this.btnSendFireAlarm.Click += new System.EventHandler(this.btnSendFireAlarm_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(659, 662);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.gridFireSensors);
            this.Controls.Add(this.btnSendFireAlarm);
            this.Controls.Add(this.btnSendFireClear);
            this.Controls.Add(this.btnSend);
            this.Controls.Add(this.textBoxMessage);
            this.Controls.Add(this.checkBoxAlarmStatus);
            this.Controls.Add(this.gridSensors);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "센서 시뮬레이터";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridSensors)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridFireSensors)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView gridSensors;
        private System.Windows.Forms.CheckBox checkBoxAlarmStatus;
        private System.Windows.Forms.TextBox textBoxMessage;
        private System.Windows.Forms.Button btnSend;
        private System.Windows.Forms.DataGridViewCheckBoxColumn colCheck;
        private System.Windows.Forms.DataGridViewTextBoxColumn colSensorCode;
        private System.Windows.Forms.DataGridViewTextBoxColumn colValue;
        private System.Windows.Forms.DataGridView gridFireSensors;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnSendFireClear;
        private System.Windows.Forms.DataGridViewTextBoxColumn colNo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPosition;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.Button btnSendFireAlarm;
    }
}

