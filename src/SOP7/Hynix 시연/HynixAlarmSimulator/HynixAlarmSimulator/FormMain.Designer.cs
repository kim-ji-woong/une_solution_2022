namespace HynixAlarmSimulator
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
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            CategoryList = new System.Windows.Forms.ListBox();
            AlarmButton = new System.Windows.Forms.Button();
            ResultText = new System.Windows.Forms.Label();
            SuspendLayout();
            // 
            // CategoryList
            // 
            CategoryList.FormattingEnabled = true;
            CategoryList.ItemHeight = 15;
            CategoryList.Location = new System.Drawing.Point(19, 22);
            CategoryList.Name = "CategoryList";
            CategoryList.Size = new System.Drawing.Size(234, 229);
            CategoryList.TabIndex = 0;
            CategoryList.SelectedIndexChanged += CategoryList_SelectedIndexChanged;
            // 
            // AlarmButton
            // 
            AlarmButton.Font = new System.Drawing.Font("맑은 고딕", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            AlarmButton.Location = new System.Drawing.Point(203, 308);
            AlarmButton.Name = "AlarmButton";
            AlarmButton.Size = new System.Drawing.Size(61, 22);
            AlarmButton.TabIndex = 1;
            AlarmButton.Text = "알람발생";
            AlarmButton.UseVisualStyleBackColor = true;
            AlarmButton.Click += AlarmButton_Click;
            // 
            // ResultText
            // 
            ResultText.Location = new System.Drawing.Point(12, 267);
            ResultText.Name = "ResultText";
            ResultText.Size = new System.Drawing.Size(252, 20);
            ResultText.TabIndex = 11;
            // 
            // FormMain
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(276, 342);
            Controls.Add(ResultText);
            Controls.Add(AlarmButton);
            Controls.Add(CategoryList);
            Text = "Form1";
            Load += FormMain_Load;
            ResumeLayout(false);
        }

        private System.Windows.Forms.Label ResultText;

        private System.Windows.Forms.ListBox CategoryList;
        private System.Windows.Forms.Button AlarmButton;

        #endregion
    }
}
