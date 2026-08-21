using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace HynixAlarmSimulator
{
    partial class FormDetourItemManager
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
            DetourGroup = new System.Windows.Forms.GroupBox();
            ItemNameLabel = new System.Windows.Forms.Label();
            ItemNameTextBox = new System.Windows.Forms.TextBox();
            CardListBox = new System.Windows.Forms.ListBox();
            AddEventButton = new System.Windows.Forms.Button();
            DetourGroup.SuspendLayout();
            SuspendLayout();
            // 
            // DetourGroup
            // 
            DetourGroup.Controls.Add(AddEventButton);
            DetourGroup.Controls.Add(ItemNameLabel);
            DetourGroup.Controls.Add(ItemNameTextBox);
            DetourGroup.Controls.Add(CardListBox);
            DetourGroup.Location = new System.Drawing.Point(37, 34);
            DetourGroup.Name = "DetourGroup";
            DetourGroup.Size = new System.Drawing.Size(359, 359);
            DetourGroup.TabIndex = 0;
            DetourGroup.TabStop = false;
            DetourGroup.Text = "우회물품반입";
            // 
            // ItemNameLabel
            // 
            ItemNameLabel.Location = new System.Drawing.Point(202, 38);
            ItemNameLabel.Name = "ItemNameLabel";
            ItemNameLabel.Size = new System.Drawing.Size(84, 20);
            ItemNameLabel.TabIndex = 2;
            ItemNameLabel.Text = "물품 명";
            // 
            // ItemNameTextBox
            // 
            ItemNameTextBox.Location = new System.Drawing.Point(202, 61);
            ItemNameTextBox.Multiline = true;
            ItemNameTextBox.Name = "ItemNameTextBox";
            ItemNameTextBox.Size = new System.Drawing.Size(141, 28);
            ItemNameTextBox.TabIndex = 1;
            ItemNameTextBox.TextChanged += textBox1_TextChanged;
            // 
            // CardListBox
            // 
            CardListBox.FormattingEnabled = true;
            CardListBox.ItemHeight = 15;
            CardListBox.Location = new System.Drawing.Point(26, 42);
            CardListBox.Name = "CardListBox";
            CardListBox.Size = new System.Drawing.Size(154, 274);
            CardListBox.TabIndex = 0;
            CardListBox.SelectedIndexChanged += CardListBox_SelectedIndexChanged;
            // 
            // AddEventButton
            // 
            AddEventButton.Location = new System.Drawing.Point(262, 312);
            AddEventButton.Name = "AddEventButton";
            AddEventButton.Size = new System.Drawing.Size(91, 41);
            AddEventButton.TabIndex = 3;
            AddEventButton.Text = "이벤트 생성";
            AddEventButton.UseVisualStyleBackColor = true;
            AddEventButton.Click += AddEventButton_Click;
            // 
            // FormDetourItemManager
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(428, 450);
            Controls.Add(DetourGroup);
            Text = "FormDetourItemManager";
            DetourGroup.ResumeLayout(false);
            DetourGroup.PerformLayout();
            ResumeLayout(false);
        }

        private System.Windows.Forms.Button AddEventButton;

        private System.Windows.Forms.GroupBox DetourGroup;
        private System.Windows.Forms.ListBox CardListBox;
        private System.Windows.Forms.TextBox ItemNameTextBox;
        private System.Windows.Forms.Label ItemNameLabel;

        #endregion
    }
}