using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace HynixAlarmSimulator
{
    partial class ExternalControllerForm
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
            CardList = new System.Windows.Forms.ListBox();
            CardReaderList = new System.Windows.Forms.ListBox();
            CardLabel = new System.Windows.Forms.Label();
            CardReaderLabel = new System.Windows.Forms.Label();
            InsertButton = new System.Windows.Forms.Button();
            PermitRadio = new System.Windows.Forms.RadioButton();
            RefuseRadio = new System.Windows.Forms.RadioButton();
            ExitRadio = new System.Windows.Forms.RadioButton();
            EnterRadio = new System.Windows.Forms.RadioButton();
            groupBox1 = new System.Windows.Forms.GroupBox();
            groupBox2 = new System.Windows.Forms.GroupBox();
            label1 = new System.Windows.Forms.Label();
            groupBox1.SuspendLayout();
            groupBox2.SuspendLayout();
            SuspendLayout();
            // 
            // CardList
            // 
            CardList.FormattingEnabled = true;
            CardList.ItemHeight = 15;
            CardList.Location = new System.Drawing.Point(34, 45);
            CardList.Name = "CardList";
            CardList.Size = new System.Drawing.Size(160, 274);
            CardList.TabIndex = 0;
            CardList.SelectedIndexChanged += CardList_SelectedIndexChanged;
            // 
            // CardReaderList
            // 
            CardReaderList.FormattingEnabled = true;
            CardReaderList.ItemHeight = 15;
            CardReaderList.Location = new System.Drawing.Point(218, 45);
            CardReaderList.Name = "CardReaderList";
            CardReaderList.Size = new System.Drawing.Size(160, 274);
            CardReaderList.TabIndex = 1;
            CardReaderList.SelectedIndexChanged += CardReaderList_SelectedIndexChanged;
            // 
            // CardLabel
            // 
            CardLabel.Location = new System.Drawing.Point(34, 20);
            CardLabel.Name = "CardLabel";
            CardLabel.Size = new System.Drawing.Size(77, 22);
            CardLabel.TabIndex = 2;
            CardLabel.Text = "출입카드";
            // 
            // CardReaderLabel
            // 
            CardReaderLabel.Location = new System.Drawing.Point(218, 20);
            CardReaderLabel.Name = "CardReaderLabel";
            CardReaderLabel.Size = new System.Drawing.Size(77, 22);
            CardReaderLabel.TabIndex = 3;
            CardReaderLabel.Text = "카드리더기";
            // 
            // InsertButton
            // 
            InsertButton.Enabled = false;
            InsertButton.Location = new System.Drawing.Point(410, 328);
            InsertButton.Name = "InsertButton";
            InsertButton.Size = new System.Drawing.Size(83, 21);
            InsertButton.TabIndex = 4;
            InsertButton.Text = "데이터 추가";
            InsertButton.UseVisualStyleBackColor = true;
            InsertButton.Click += InsertButton_Click;
            // 
            // PermitRadio
            // 
            PermitRadio.Checked = true;
            PermitRadio.Location = new System.Drawing.Point(3, 11);
            PermitRadio.Name = "PermitRadio";
            PermitRadio.Size = new System.Drawing.Size(96, 21);
            PermitRadio.TabIndex = 5;
            PermitRadio.TabStop = true;
            PermitRadio.Text = "출입 허용";
            PermitRadio.UseVisualStyleBackColor = true;
            PermitRadio.CheckedChanged += PermitRadio_CheckedChanged;
            // 
            // RefuseRadio
            // 
            RefuseRadio.Location = new System.Drawing.Point(3, 38);
            RefuseRadio.Name = "RefuseRadio";
            RefuseRadio.Size = new System.Drawing.Size(96, 21);
            RefuseRadio.TabIndex = 5;
            RefuseRadio.TabStop = true;
            RefuseRadio.Text = "출입 거부";
            RefuseRadio.UseVisualStyleBackColor = true;
            RefuseRadio.CheckedChanged += RefuseRadio_CheckedChanged;
            // 
            // ExitRadio
            // 
            ExitRadio.Location = new System.Drawing.Point(3, 43);
            ExitRadio.Name = "ExitRadio";
            ExitRadio.Size = new System.Drawing.Size(96, 21);
            ExitRadio.TabIndex = 7;
            ExitRadio.Text = "퇴실";
            ExitRadio.UseVisualStyleBackColor = true;
            ExitRadio.CheckedChanged += ExitRadio_CheckedChanged;
            // 
            // EnterRadio
            // 
            EnterRadio.Checked = true;
            EnterRadio.Location = new System.Drawing.Point(3, 22);
            EnterRadio.Name = "EnterRadio";
            EnterRadio.Size = new System.Drawing.Size(96, 21);
            EnterRadio.TabIndex = 8;
            EnterRadio.TabStop = true;
            EnterRadio.Text = "입실";
            EnterRadio.UseVisualStyleBackColor = true;
            EnterRadio.CheckedChanged += EnterRadio_CheckedChanged;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(RefuseRadio);
            groupBox1.Controls.Add(PermitRadio);
            groupBox1.Location = new System.Drawing.Point(388, 54);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new System.Drawing.Size(105, 70);
            groupBox1.TabIndex = 9;
            groupBox1.TabStop = false;
            // 
            // groupBox2
            // 
            groupBox2.Controls.Add(ExitRadio);
            groupBox2.Controls.Add(EnterRadio);
            groupBox2.Location = new System.Drawing.Point(388, 130);
            groupBox2.Name = "groupBox2";
            groupBox2.Size = new System.Drawing.Size(105, 70);
            groupBox2.TabIndex = 10;
            groupBox2.TabStop = false;
            // 
            // label1
            // 
            label1.Location = new System.Drawing.Point(424, 32);
            label1.Name = "label1";
            label1.Size = new System.Drawing.Size(36, 19);
            label1.TabIndex = 11;
            label1.Text = "옵션";
            // 
            // ExternalControllerForm
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(502, 361);
            Controls.Add(label1);
            Controls.Add(InsertButton);
            Controls.Add(CardReaderLabel);
            Controls.Add(CardLabel);
            Controls.Add(CardReaderList);
            Controls.Add(CardList);
            Controls.Add(groupBox2);
            Controls.Add(groupBox1);
            MinimumSize = new System.Drawing.Size(510, 390);
            StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            FormClosing += ExternalControllerForm_FormClosing;
            Load += ExternalControllerForm_Load;
            groupBox1.ResumeLayout(false);
            groupBox2.ResumeLayout(false);
            ResumeLayout(false);
        }

        private System.Windows.Forms.Label label1;

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;

        private System.Windows.Forms.RadioButton ExitRadio;
        private System.Windows.Forms.RadioButton EnterRadio;

        private System.Windows.Forms.Label CardLabel;
        private System.Windows.Forms.Label CardReaderLabel;
        private System.Windows.Forms.Button InsertButton;
        private System.Windows.Forms.RadioButton PermitRadio;
        private System.Windows.Forms.RadioButton RefuseRadio;

        private System.Windows.Forms.ListBox CardList;
        private System.Windows.Forms.ListBox CardReaderList;

        #endregion
    }
}