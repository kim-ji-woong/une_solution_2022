
namespace SoulbrainSensorTester
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
            this.gridCurrent = new System.Windows.Forms.DataGridView();
            this.dataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnSelectReset = new System.Windows.Forms.Button();
            this.btnAllReset = new System.Windows.Forms.Button();
            this.btnProcessAllClear = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.sensorTreeView = new System.Windows.Forms.TreeView();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.btnSend = new System.Windows.Forms.Button();
            this.btnReset = new System.Windows.Forms.Button();
            this.lbSensorType = new System.Windows.Forms.Label();
            this.lbSensorName = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.gridCurrent)).BeginInit();
            this.SuspendLayout();
            // 
            // gridCurrent
            // 
            this.gridCurrent.AllowUserToAddRows = false;
            this.gridCurrent.AllowUserToDeleteRows = false;
            this.gridCurrent.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridCurrent.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.dataGridViewTextBoxColumn1});
            this.gridCurrent.Location = new System.Drawing.Point(25, 53);
            this.gridCurrent.MultiSelect = false;
            this.gridCurrent.Name = "gridCurrent";
            this.gridCurrent.ReadOnly = true;
            this.gridCurrent.RowHeadersVisible = false;
            this.gridCurrent.RowTemplate.Height = 25;
            this.gridCurrent.Size = new System.Drawing.Size(222, 207);
            this.gridCurrent.TabIndex = 0;
            // 
            // dataGridViewTextBoxColumn1
            // 
            this.dataGridViewTextBoxColumn1.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.dataGridViewTextBoxColumn1.HeaderText = "현재 신호";
            this.dataGridViewTextBoxColumn1.Name = "dataGridViewTextBoxColumn1";
            this.dataGridViewTextBoxColumn1.ReadOnly = true;
            // 
            // btnSelectReset
            // 
            this.btnSelectReset.Location = new System.Drawing.Point(25, 268);
            this.btnSelectReset.Name = "btnSelectReset";
            this.btnSelectReset.Size = new System.Drawing.Size(111, 23);
            this.btnSelectReset.TabIndex = 1;
            this.btnSelectReset.Text = "선택한 센서 복구";
            this.btnSelectReset.UseVisualStyleBackColor = true;
            this.btnSelectReset.Click += new System.EventHandler(this.btnSelectReset_Click);
            // 
            // btnAllReset
            // 
            this.btnAllReset.Location = new System.Drawing.Point(142, 268);
            this.btnAllReset.Name = "btnAllReset";
            this.btnAllReset.Size = new System.Drawing.Size(105, 23);
            this.btnAllReset.TabIndex = 1;
            this.btnAllReset.Text = "모든 센서 복구";
            this.btnAllReset.UseVisualStyleBackColor = true;
            this.btnAllReset.Click += new System.EventHandler(this.btnAllReset_Click);
            // 
            // btnProcessAllClear
            // 
            this.btnProcessAllClear.Location = new System.Drawing.Point(127, 297);
            this.btnProcessAllClear.Name = "btnProcessAllClear";
            this.btnProcessAllClear.Size = new System.Drawing.Size(120, 23);
            this.btnProcessAllClear.TabIndex = 1;
            this.btnProcessAllClear.Text = "화재센서 모두 복구";
            this.btnProcessAllClear.UseVisualStyleBackColor = true;
            this.btnProcessAllClear.Click += new System.EventHandler(this.btnProcessAllClear_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(262, 53);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(71, 15);
            this.label1.TabIndex = 2;
            this.label1.Text = "센서 리스트";
            // 
            // sensorTreeView
            // 
            this.sensorTreeView.Location = new System.Drawing.Point(264, 70);
            this.sensorTreeView.Name = "sensorTreeView";
            this.sensorTreeView.Size = new System.Drawing.Size(313, 230);
            this.sensorTreeView.TabIndex = 3;
            this.sensorTreeView.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.sensorTreeView_AfterSelect);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(597, 70);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(38, 15);
            this.label2.TabIndex = 4;
            this.label2.Text = "타입 :";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(597, 98);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(38, 15);
            this.label3.TabIndex = 4;
            this.label3.Text = "이름 :";
            // 
            // btnSend
            // 
            this.btnSend.Location = new System.Drawing.Point(599, 268);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(75, 23);
            this.btnSend.TabIndex = 5;
            this.btnSend.Text = "신호 전송";
            this.btnSend.UseVisualStyleBackColor = true;
            this.btnSend.Click += new System.EventHandler(this.btnSend_Click);
            // 
            // btnReset
            // 
            this.btnReset.Location = new System.Drawing.Point(680, 268);
            this.btnReset.Name = "btnReset";
            this.btnReset.Size = new System.Drawing.Size(75, 23);
            this.btnReset.TabIndex = 5;
            this.btnReset.Text = "신호복구";
            this.btnReset.UseVisualStyleBackColor = true;
            this.btnReset.Click += new System.EventHandler(this.btnReset_Click);
            // 
            // lbSensorType
            // 
            this.lbSensorType.AutoSize = true;
            this.lbSensorType.Location = new System.Drawing.Point(637, 70);
            this.lbSensorType.Name = "lbSensorType";
            this.lbSensorType.Size = new System.Drawing.Size(0, 15);
            this.lbSensorType.TabIndex = 6;
            // 
            // lbSensorName
            // 
            this.lbSensorName.AutoSize = true;
            this.lbSensorName.Location = new System.Drawing.Point(637, 98);
            this.lbSensorName.Name = "lbSensorName";
            this.lbSensorName.Size = new System.Drawing.Size(0, 15);
            this.lbSensorName.TabIndex = 7;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 362);
            this.Controls.Add(this.lbSensorName);
            this.Controls.Add(this.lbSensorType);
            this.Controls.Add(this.btnReset);
            this.Controls.Add(this.btnSend);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.sensorTreeView);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnAllReset);
            this.Controls.Add(this.btnProcessAllClear);
            this.Controls.Add(this.btnSelectReset);
            this.Controls.Add(this.gridCurrent);
            this.Location = new System.Drawing.Point(637, 70);
            this.Name = "FormMain";
            this.Text = "Sensor Tester";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FormMain_FormClosed);
            this.Load += new System.EventHandler(this.FormMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridCurrent)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView gridCurrent;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn1;
        private System.Windows.Forms.Button btnSelectReset;
        private System.Windows.Forms.Button btnAllReset;
        private System.Windows.Forms.Button btnProcessAllClear;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TreeView sensorTreeView;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button btnSend;
        private System.Windows.Forms.Button btnReset;
        private System.Windows.Forms.Label lbSensorType;
        private System.Windows.Forms.Label lbSensorName;
    }
}

