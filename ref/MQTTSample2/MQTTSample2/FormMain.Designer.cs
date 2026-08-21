
namespace MQTTSample2
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxSiteID = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxIP = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxPort = new System.Windows.Forms.TextBox();
            this.btnApply = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxTagNo = new System.Windows.Forms.TextBox();
            this.btnFire = new System.Windows.Forms.Button();
            this.btnClear = new System.Windows.Forms.Button();
            this.cboFloor = new System.Windows.Forms.ComboBox();
            this.gridSensors = new System.Windows.Forms.DataGridView();
            this.colSensorZoneID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colSensorName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colTagNo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            ((System.ComponentModel.ISupportInitialize)(this.gridSensors)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(83, 110);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(50, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Site ID :";
            // 
            // textBoxSiteID
            // 
            this.textBoxSiteID.Location = new System.Drawing.Point(137, 107);
            this.textBoxSiteID.Name = "textBoxSiteID";
            this.textBoxSiteID.Size = new System.Drawing.Size(100, 23);
            this.textBoxSiteID.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(83, 139);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(24, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "IP :";
            // 
            // textBoxIP
            // 
            this.textBoxIP.Location = new System.Drawing.Point(137, 136);
            this.textBoxIP.Name = "textBoxIP";
            this.textBoxIP.Size = new System.Drawing.Size(100, 23);
            this.textBoxIP.TabIndex = 1;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(83, 168);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(36, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "Port :";
            // 
            // textBoxPort
            // 
            this.textBoxPort.Location = new System.Drawing.Point(137, 165);
            this.textBoxPort.Name = "textBoxPort";
            this.textBoxPort.Size = new System.Drawing.Size(100, 23);
            this.textBoxPort.TabIndex = 1;
            // 
            // btnApply
            // 
            this.btnApply.Location = new System.Drawing.Point(162, 211);
            this.btnApply.Name = "btnApply";
            this.btnApply.Size = new System.Drawing.Size(75, 23);
            this.btnApply.TabIndex = 2;
            this.btnApply.Text = "적용";
            this.btnApply.UseVisualStyleBackColor = true;
            this.btnApply.Click += new System.EventHandler(this.btnApply_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(282, 111);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(53, 15);
            this.label4.TabIndex = 0;
            this.label4.Text = "Tag No :";
            // 
            // textBoxTagNo
            // 
            this.textBoxTagNo.Location = new System.Drawing.Point(336, 108);
            this.textBoxTagNo.Name = "textBoxTagNo";
            this.textBoxTagNo.Size = new System.Drawing.Size(100, 23);
            this.textBoxTagNo.TabIndex = 1;
            // 
            // btnFire
            // 
            this.btnFire.Location = new System.Drawing.Point(282, 211);
            this.btnFire.Name = "btnFire";
            this.btnFire.Size = new System.Drawing.Size(75, 23);
            this.btnFire.TabIndex = 2;
            this.btnFire.Text = "화재신호";
            this.btnFire.UseVisualStyleBackColor = true;
            this.btnFire.Click += new System.EventHandler(this.btnFire_Click);
            // 
            // btnClear
            // 
            this.btnClear.Location = new System.Drawing.Point(361, 211);
            this.btnClear.Name = "btnClear";
            this.btnClear.Size = new System.Drawing.Size(75, 23);
            this.btnClear.TabIndex = 2;
            this.btnClear.Text = "복구신호";
            this.btnClear.UseVisualStyleBackColor = true;
            this.btnClear.Click += new System.EventHandler(this.btnClear_Click);
            // 
            // cboFloor
            // 
            this.cboFloor.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboFloor.FormattingEnabled = true;
            this.cboFloor.Location = new System.Drawing.Point(498, 108);
            this.cboFloor.Name = "cboFloor";
            this.cboFloor.Size = new System.Drawing.Size(121, 23);
            this.cboFloor.TabIndex = 3;
            this.cboFloor.SelectedIndexChanged += new System.EventHandler(this.cboFloor_SelectedIndexChanged);
            // 
            // gridSensors
            // 
            this.gridSensors.AllowUserToAddRows = false;
            this.gridSensors.AllowUserToDeleteRows = false;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridSensors.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.gridSensors.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridSensors.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colSensorZoneID,
            this.colSensorName,
            this.colTagNo});
            this.gridSensors.Location = new System.Drawing.Point(498, 139);
            this.gridSensors.Name = "gridSensors";
            this.gridSensors.ReadOnly = true;
            this.gridSensors.RowHeadersVisible = false;
            this.gridSensors.RowTemplate.Height = 25;
            this.gridSensors.Size = new System.Drawing.Size(374, 217);
            this.gridSensors.TabIndex = 4;
            this.gridSensors.MouseClick += new System.Windows.Forms.MouseEventHandler(this.gridSensors_MouseClick);
            // 
            // colSensorZoneID
            // 
            this.colSensorZoneID.HeaderText = "ID";
            this.colSensorZoneID.Name = "colSensorZoneID";
            this.colSensorZoneID.ReadOnly = true;
            this.colSensorZoneID.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colSensorZoneID.Width = 80;
            // 
            // colSensorName
            // 
            this.colSensorName.HeaderText = "이름";
            this.colSensorName.Name = "colSensorName";
            this.colSensorName.ReadOnly = true;
            this.colSensorName.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colSensorName.Width = 200;
            // 
            // colTagNo
            // 
            this.colTagNo.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.colTagNo.HeaderText = "태그번호";
            this.colTagNo.Name = "colTagNo";
            this.colTagNo.ReadOnly = true;
            this.colTagNo.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(886, 370);
            this.Controls.Add(this.gridSensors);
            this.Controls.Add(this.cboFloor);
            this.Controls.Add(this.btnClear);
            this.Controls.Add(this.btnFire);
            this.Controls.Add(this.btnApply);
            this.Controls.Add(this.textBoxPort);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textBoxIP);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textBoxTagNo);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textBoxSiteID);
            this.Controls.Add(this.label1);
            this.Name = "FormMain";
            this.Text = "FormMain";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormMain_FormClosing);
            this.Load += new System.EventHandler(this.FormMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridSensors)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxSiteID;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxIP;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxPort;
        private System.Windows.Forms.Button btnApply;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxTagNo;
        private System.Windows.Forms.Button btnFire;
        private System.Windows.Forms.Button btnClear;
        private System.Windows.Forms.ComboBox cboFloor;
        private System.Windows.Forms.DataGridView gridSensors;
        private System.Windows.Forms.DataGridViewTextBoxColumn colSensorZoneID;
        private System.Windows.Forms.DataGridViewTextBoxColumn colSensorName;
        private System.Windows.Forms.DataGridViewTextBoxColumn colTagNo;
    }
}

