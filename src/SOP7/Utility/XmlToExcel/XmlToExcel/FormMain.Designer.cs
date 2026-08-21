
namespace XmlToExcel
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
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxXmlPath = new System.Windows.Forms.TextBox();
            this.btnOpenFile = new System.Windows.Forms.Button();
            this.btnCreateExcel = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(38, 40);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(66, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "XML 파일 :";
            // 
            // textBoxXmlPath
            // 
            this.textBoxXmlPath.AllowDrop = true;
            this.textBoxXmlPath.Location = new System.Drawing.Point(108, 37);
            this.textBoxXmlPath.Name = "textBoxXmlPath";
            this.textBoxXmlPath.PlaceholderText = "파일 경로를 입력하거나 파일을 Drag & Drop 하세요.";
            this.textBoxXmlPath.Size = new System.Drawing.Size(377, 23);
            this.textBoxXmlPath.TabIndex = 1;
            this.textBoxXmlPath.DragDrop += new System.Windows.Forms.DragEventHandler(this.textBoxXmlPath_DragDrop);
            this.textBoxXmlPath.DragOver += new System.Windows.Forms.DragEventHandler(this.textBoxXmlPath_DragOver);
            // 
            // btnOpenFile
            // 
            this.btnOpenFile.Location = new System.Drawing.Point(491, 37);
            this.btnOpenFile.Name = "btnOpenFile";
            this.btnOpenFile.Size = new System.Drawing.Size(34, 23);
            this.btnOpenFile.TabIndex = 2;
            this.btnOpenFile.Text = "...";
            this.btnOpenFile.UseVisualStyleBackColor = true;
            this.btnOpenFile.Click += new System.EventHandler(this.btnOpenFile_Click);
            // 
            // btnCreateExcel
            // 
            this.btnCreateExcel.Location = new System.Drawing.Point(424, 66);
            this.btnCreateExcel.Name = "btnCreateExcel";
            this.btnCreateExcel.Size = new System.Drawing.Size(101, 23);
            this.btnCreateExcel.TabIndex = 3;
            this.btnCreateExcel.Text = "Excel 파일 생성";
            this.btnCreateExcel.UseVisualStyleBackColor = true;
            this.btnCreateExcel.Click += new System.EventHandler(this.btnCreateExcel_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(564, 112);
            this.Controls.Add(this.btnCreateExcel);
            this.Controls.Add(this.btnOpenFile);
            this.Controls.Add(this.textBoxXmlPath);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "XML to Excel";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxXmlPath;
        private System.Windows.Forms.Button btnOpenFile;
        private System.Windows.Forms.Button btnCreateExcel;
    }
}

