using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace HynixAlarmSimulator
{
    partial class FormSmartTagManager
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private IContainer components = null;

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
            InsertButton = new System.Windows.Forms.Button();
            SmartTagLabel = new System.Windows.Forms.GroupBox();
            ItemRadioButton = new System.Windows.Forms.RadioButton();
            WorkerRadioButton = new System.Windows.Forms.RadioButton();
            TagList = new System.Windows.Forms.ListBox();
            SmartTagReaderLabel = new System.Windows.Forms.GroupBox();
            TagReaderList = new System.Windows.Forms.ListBox();
            ResultLabel = new System.Windows.Forms.Label();
            LinkedZoneList = new System.Windows.Forms.ListBox();
            label1 = new System.Windows.Forms.Label();
            SmartTagLabel.SuspendLayout();
            SmartTagReaderLabel.SuspendLayout();
            SuspendLayout();
            // 
            // InsertButton
            // 
            InsertButton.Location = new System.Drawing.Point(535, 336);
            InsertButton.Name = "InsertButton";
            InsertButton.Size = new System.Drawing.Size(83, 27);
            InsertButton.TabIndex = 0;
            InsertButton.Text = "데이터 추가";
            InsertButton.UseVisualStyleBackColor = true;
            InsertButton.Click += InsertButton_Click;
            // 
            // SmartTagLabel
            // 
            SmartTagLabel.Controls.Add(ItemRadioButton);
            SmartTagLabel.Controls.Add(WorkerRadioButton);
            SmartTagLabel.Controls.Add(TagList);
            SmartTagLabel.Location = new System.Drawing.Point(12, 15);
            SmartTagLabel.Name = "SmartTagLabel";
            SmartTagLabel.Size = new System.Drawing.Size(243, 267);
            SmartTagLabel.TabIndex = 1;
            SmartTagLabel.TabStop = false;
            SmartTagLabel.Text = "스마트 태그";
            // 
            // ItemRadioButton
            // 
            ItemRadioButton.Location = new System.Drawing.Point(107, 27);
            ItemRadioButton.Name = "ItemRadioButton";
            ItemRadioButton.Size = new System.Drawing.Size(77, 18);
            ItemRadioButton.TabIndex = 2;
            ItemRadioButton.TabStop = true;
            ItemRadioButton.Text = "물품";
            ItemRadioButton.UseVisualStyleBackColor = true;
            ItemRadioButton.CheckedChanged += ItemRadioButton_CheckedChanged;
            // 
            // WorkerRadioButton
            // 
            WorkerRadioButton.Location = new System.Drawing.Point(30, 27);
            WorkerRadioButton.Name = "WorkerRadioButton";
            WorkerRadioButton.Size = new System.Drawing.Size(71, 18);
            WorkerRadioButton.TabIndex = 1;
            WorkerRadioButton.TabStop = true;
            WorkerRadioButton.Text = "작업자";
            WorkerRadioButton.UseVisualStyleBackColor = true;
            WorkerRadioButton.CheckedChanged += WorkerRadioButton_CheckedChanged;
            // 
            // TagList
            // 
            TagList.FormattingEnabled = true;
            TagList.ItemHeight = 15;
            TagList.Location = new System.Drawing.Point(27, 56);
            TagList.Name = "TagList";
            TagList.Size = new System.Drawing.Size(168, 184);
            TagList.TabIndex = 0;
            TagList.SelectedIndexChanged += TagList_SelectedIndexChanged;
            // 
            // SmartTagReaderLabel
            // 
            SmartTagReaderLabel.Controls.Add(TagReaderList);
            SmartTagReaderLabel.Location = new System.Drawing.Point(261, 15);
            SmartTagReaderLabel.Name = "SmartTagReaderLabel";
            SmartTagReaderLabel.Size = new System.Drawing.Size(242, 267);
            SmartTagReaderLabel.TabIndex = 2;
            SmartTagReaderLabel.TabStop = false;
            SmartTagReaderLabel.Text = "스마트 태그 리더기";
            // 
            // TagReaderList
            // 
            TagReaderList.FormattingEnabled = true;
            TagReaderList.ItemHeight = 15;
            TagReaderList.Location = new System.Drawing.Point(18, 56);
            TagReaderList.Name = "TagReaderList";
            TagReaderList.Size = new System.Drawing.Size(184, 184);
            TagReaderList.TabIndex = 0;
            TagReaderList.SelectedIndexChanged += TagReaderList_SelectedIndexChanged;
            // 
            // ResultLabel
            // 
            ResultLabel.Location = new System.Drawing.Point(12, 285);
            ResultLabel.Name = "ResultLabel";
            ResultLabel.Size = new System.Drawing.Size(517, 78);
            ResultLabel.TabIndex = 3;
            // 
            // LinkedZoneList
            // 
            LinkedZoneList.Enabled = false;
            LinkedZoneList.FormattingEnabled = true;
            LinkedZoneList.ItemHeight = 15;
            LinkedZoneList.Location = new System.Drawing.Point(515, 42);
            LinkedZoneList.Name = "LinkedZoneList";
            LinkedZoneList.Size = new System.Drawing.Size(103, 124);
            LinkedZoneList.TabIndex = 4;
            // 
            // label1
            // 
            label1.BackColor = System.Drawing.SystemColors.Control;
            label1.Enabled = false;
            label1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            label1.ForeColor = System.Drawing.Color.Blue;
            label1.Location = new System.Drawing.Point(515, 9);
            label1.Name = "label1";
            label1.Size = new System.Drawing.Size(103, 31);
            label1.TabIndex = 5;
            label1.Text = "허용 구역";
            label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // FormSmartTagManager
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(634, 365);
            Controls.Add(label1);
            Controls.Add(LinkedZoneList);
            Controls.Add(ResultLabel);
            Controls.Add(SmartTagReaderLabel);
            Controls.Add(SmartTagLabel);
            Controls.Add(InsertButton);
            Text = "FormSmartTagManager";
            Load += FormSmartTagManager_Load;
            SmartTagLabel.ResumeLayout(false);
            SmartTagReaderLabel.ResumeLayout(false);
            ResumeLayout(false);
        }

        private System.Windows.Forms.Label label1;

        private System.Windows.Forms.ListBox LinkedZoneList;

        private System.Windows.Forms.ListBox TagList;
        private System.Windows.Forms.RadioButton WorkerRadioButton;
        private System.Windows.Forms.RadioButton ItemRadioButton;
        private System.Windows.Forms.ListBox TagReaderList;

        private System.Windows.Forms.Label ResultLabel;

        private System.Windows.Forms.GroupBox SmartTagLabel;
        private System.Windows.Forms.GroupBox SmartTagReaderLabel;

        private System.Windows.Forms.Button InsertButton;

        #endregion
    }
}