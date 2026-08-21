
namespace DbReader
{
    partial class FormDbNames
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
            this.gridDbNames = new System.Windows.Forms.DataGridView();
            this.colDbName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnOk = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.gridDbNames)).BeginInit();
            this.SuspendLayout();
            // 
            // gridDbNames
            // 
            this.gridDbNames.AllowUserToAddRows = false;
            this.gridDbNames.AllowUserToDeleteRows = false;
            this.gridDbNames.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridDbNames.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colDbName});
            this.gridDbNames.Location = new System.Drawing.Point(12, 12);
            this.gridDbNames.Name = "gridDbNames";
            this.gridDbNames.ReadOnly = true;
            this.gridDbNames.RowHeadersVisible = false;
            this.gridDbNames.RowTemplate.Height = 25;
            this.gridDbNames.Size = new System.Drawing.Size(240, 150);
            this.gridDbNames.TabIndex = 0;
            this.gridDbNames.MouseClick += new System.Windows.Forms.MouseEventHandler(this.gridDbNames_MouseClick);
            this.gridDbNames.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.gridDbNames_MouseDoubleClick);
            // 
            // colDbName
            // 
            this.colDbName.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.colDbName.HeaderText = "Db 이름";
            this.colDbName.Name = "colDbName";
            this.colDbName.ReadOnly = true;
            // 
            // btnOk
            // 
            this.btnOk.Location = new System.Drawing.Point(134, 168);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new System.Drawing.Size(56, 23);
            this.btnOk.TabIndex = 1;
            this.btnOk.Text = "확인";
            this.btnOk.UseVisualStyleBackColor = true;
            this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Location = new System.Drawing.Point(196, 168);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(56, 23);
            this.btnCancel.TabIndex = 1;
            this.btnCancel.Text = "취소";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // FormDbNames
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(264, 202);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOk);
            this.Controls.Add(this.gridDbNames);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormDbNames";
            this.Text = "Database 목록";
            this.Load += new System.EventHandler(this.FormDbNames_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gridDbNames)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView gridDbNames;
        private System.Windows.Forms.DataGridViewTextBoxColumn colDbName;
        private System.Windows.Forms.Button btnOk;
        private System.Windows.Forms.Button btnCancel;
    }
}