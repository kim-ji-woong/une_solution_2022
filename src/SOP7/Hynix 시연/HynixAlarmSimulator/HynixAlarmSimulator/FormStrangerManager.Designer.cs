using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace HynixAlarmSimulator
{
    partial class FormStrangerManager
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
            NewStrangerGroup = new System.Windows.Forms.GroupBox();
            InsertAlarmButton = new System.Windows.Forms.Button();
            NewTextBox = new System.Windows.Forms.TextBox();
            CardList = new System.Windows.Forms.ListBox();
            OldStrangerGroup = new System.Windows.Forms.GroupBox();
            AddEventText = new System.Windows.Forms.TextBox();
            AddPositionButton = new System.Windows.Forms.Button();
            EventList = new System.Windows.Forms.ListBox();
            NewStrangerGroup.SuspendLayout();
            OldStrangerGroup.SuspendLayout();
            SuspendLayout();
            // 
            // NewStrangerGroup
            // 
            NewStrangerGroup.Controls.Add(InsertAlarmButton);
            NewStrangerGroup.Controls.Add(NewTextBox);
            NewStrangerGroup.Controls.Add(CardList);
            NewStrangerGroup.Location = new System.Drawing.Point(14, 19);
            NewStrangerGroup.Name = "NewStrangerGroup";
            NewStrangerGroup.Size = new System.Drawing.Size(372, 413);
            NewStrangerGroup.TabIndex = 0;
            NewStrangerGroup.TabStop = false;
            NewStrangerGroup.Text = "신규";
            // 
            // InsertAlarmButton
            // 
            InsertAlarmButton.Location = new System.Drawing.Point(281, 377);
            InsertAlarmButton.Name = "InsertAlarmButton";
            InsertAlarmButton.Size = new System.Drawing.Size(79, 30);
            InsertAlarmButton.TabIndex = 3;
            InsertAlarmButton.Text = "알람생성";
            InsertAlarmButton.UseVisualStyleBackColor = true;
            InsertAlarmButton.Click += button1_Click;
            // 
            // NewTextBox
            // 
            NewTextBox.Location = new System.Drawing.Point(192, 44);
            NewTextBox.Multiline = true;
            NewTextBox.Name = "NewTextBox";
            NewTextBox.Size = new System.Drawing.Size(168, 86);
            NewTextBox.TabIndex = 2;
            NewTextBox.TextChanged += NewTextBox_TextChanged;
            // 
            // CardList
            // 
            CardList.FormattingEnabled = true;
            CardList.ItemHeight = 15;
            CardList.Location = new System.Drawing.Point(25, 44);
            CardList.Name = "CardList";
            CardList.Size = new System.Drawing.Size(162, 334);
            CardList.TabIndex = 1;
            CardList.SelectedIndexChanged += CardList_SelectedIndexChanged;
            // 
            // OldStrangerGroup
            // 
            OldStrangerGroup.Controls.Add(AddEventText);
            OldStrangerGroup.Controls.Add(AddPositionButton);
            OldStrangerGroup.Controls.Add(EventList);
            OldStrangerGroup.Location = new System.Drawing.Point(392, 19);
            OldStrangerGroup.Name = "OldStrangerGroup";
            OldStrangerGroup.Size = new System.Drawing.Size(367, 413);
            OldStrangerGroup.TabIndex = 1;
            OldStrangerGroup.TabStop = false;
            OldStrangerGroup.Text = "추가";
            // 
            // AddEventText
            // 
            AddEventText.Location = new System.Drawing.Point(193, 38);
            AddEventText.Multiline = true;
            AddEventText.Name = "AddEventText";
            AddEventText.Size = new System.Drawing.Size(168, 86);
            AddEventText.TabIndex = 5;
            AddEventText.TextChanged += AddEventText_TextChanged;
            // 
            // AddPositionButton
            // 
            AddPositionButton.Location = new System.Drawing.Point(282, 377);
            AddPositionButton.Name = "AddPositionButton";
            AddPositionButton.Size = new System.Drawing.Size(79, 30);
            AddPositionButton.TabIndex = 4;
            AddPositionButton.Text = "동선추가";
            AddPositionButton.UseVisualStyleBackColor = true;
            AddPositionButton.Click += AddPositionButton_Click;
            // 
            // EventList
            // 
            EventList.FormattingEnabled = true;
            EventList.ItemHeight = 15;
            EventList.Location = new System.Drawing.Point(25, 38);
            EventList.Name = "EventList";
            EventList.Size = new System.Drawing.Size(162, 334);
            EventList.TabIndex = 0;
            EventList.SelectedIndexChanged += EventList_SelectedIndexChanged;
            // 
            // FormStrangerManager
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(771, 450);
            Controls.Add(OldStrangerGroup);
            Controls.Add(NewStrangerGroup);
            Text = "FormStrangerManager";
            NewStrangerGroup.ResumeLayout(false);
            NewStrangerGroup.PerformLayout();
            OldStrangerGroup.ResumeLayout(false);
            OldStrangerGroup.PerformLayout();
            ResumeLayout(false);
        }

        private System.Windows.Forms.TextBox AddEventText;

        private System.Windows.Forms.ListBox CardList;
        private System.Windows.Forms.TextBox NewTextBox;
        private System.Windows.Forms.Button InsertAlarmButton;
        private System.Windows.Forms.Button AddPositionButton;

        private System.Windows.Forms.ListBox EventList;

        private System.Windows.Forms.GroupBox NewStrangerGroup;
        private System.Windows.Forms.GroupBox OldStrangerGroup;

        #endregion
    }
}