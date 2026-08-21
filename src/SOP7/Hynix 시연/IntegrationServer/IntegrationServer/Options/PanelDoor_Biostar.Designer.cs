
namespace IntegrationServer.Options
{
    partial class PanelDoor_Biostar
    {
        /// <summary> 
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region 구성 요소 디자이너에서 생성한 코드

        /// <summary> 
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.gbPropertySuprema = new System.Windows.Forms.GroupBox();
            this.textBoxPassword = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxID = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.gbPropertySuprema.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertySuprema
            // 
            this.gbPropertySuprema.Controls.Add(this.textBoxPassword);
            this.gbPropertySuprema.Controls.Add(this.label2);
            this.gbPropertySuprema.Controls.Add(this.textBoxID);
            this.gbPropertySuprema.Controls.Add(this.label1);
            this.gbPropertySuprema.Location = new System.Drawing.Point(2, 2);
            this.gbPropertySuprema.Name = "gbPropertySuprema";
            this.gbPropertySuprema.Size = new System.Drawing.Size(190, 150);
            this.gbPropertySuprema.TabIndex = 40;
            this.gbPropertySuprema.TabStop = false;
            this.gbPropertySuprema.Text = "Suprema";
            // 
            // textBoxPassword
            // 
            this.textBoxPassword.Location = new System.Drawing.Point(73, 49);
            this.textBoxPassword.Name = "textBoxPassword";
            this.textBoxPassword.PasswordChar = '*';
            this.textBoxPassword.Size = new System.Drawing.Size(94, 23);
            this.textBoxPassword.TabIndex = 38;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(8, 52);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(57, 15);
            this.label2.TabIndex = 37;
            this.label2.Text = "Password";
            // 
            // textBoxID
            // 
            this.textBoxID.Location = new System.Drawing.Point(73, 20);
            this.textBoxID.Name = "textBoxID";
            this.textBoxID.Size = new System.Drawing.Size(94, 23);
            this.textBoxID.TabIndex = 38;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(19, 15);
            this.label1.TabIndex = 37;
            this.label1.Text = "ID";
            // 
            // PanelDoor_Biostar
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertySuprema);
            this.Name = "PanelDoor_Biostar";
            this.Size = new System.Drawing.Size(190, 150);
            this.gbPropertySuprema.ResumeLayout(false);
            this.gbPropertySuprema.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertySuprema;
        private System.Windows.Forms.TextBox textBoxPassword;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxID;
        private System.Windows.Forms.Label label1;
    }
}
