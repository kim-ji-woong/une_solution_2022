
namespace IntegrationServer.Options
{
    partial class PanelMqtt_Corners
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
            this.gbPropertyCorners = new System.Windows.Forms.GroupBox();
            this.textBoxMpcID = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxSiteID = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.gbPropertyCorners.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertyCorners
            // 
            this.gbPropertyCorners.Controls.Add(this.textBoxMpcID);
            this.gbPropertyCorners.Controls.Add(this.label2);
            this.gbPropertyCorners.Controls.Add(this.textBoxSiteID);
            this.gbPropertyCorners.Controls.Add(this.label1);
            this.gbPropertyCorners.Location = new System.Drawing.Point(2, 2);
            this.gbPropertyCorners.Name = "gbPropertyCorners";
            this.gbPropertyCorners.Size = new System.Drawing.Size(190, 150);
            this.gbPropertyCorners.TabIndex = 39;
            this.gbPropertyCorners.TabStop = false;
            this.gbPropertyCorners.Text = "코너스";
            // 
            // textBoxMpcID
            // 
            this.textBoxMpcID.Location = new System.Drawing.Point(73, 49);
            this.textBoxMpcID.Name = "textBoxMpcID";
            this.textBoxMpcID.PasswordChar = '*';
            this.textBoxMpcID.Size = new System.Drawing.Size(94, 23);
            this.textBoxMpcID.TabIndex = 38;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(8, 52);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(47, 15);
            this.label2.TabIndex = 37;
            this.label2.Text = "Mpc ID";
            // 
            // textBoxSiteID
            // 
            this.textBoxSiteID.Location = new System.Drawing.Point(73, 20);
            this.textBoxSiteID.Name = "textBoxSiteID";
            this.textBoxSiteID.Size = new System.Drawing.Size(94, 23);
            this.textBoxSiteID.TabIndex = 38;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(43, 15);
            this.label1.TabIndex = 37;
            this.label1.Text = "Site ID";
            // 
            // PanelMqtt_Corners
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyCorners);
            this.Name = "PanelMqtt_Corners";
            this.Size = new System.Drawing.Size(191, 155);
            this.gbPropertyCorners.ResumeLayout(false);
            this.gbPropertyCorners.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertyCorners;
        private System.Windows.Forms.TextBox textBoxMpcID;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxSiteID;
        private System.Windows.Forms.Label label1;
    }
}
