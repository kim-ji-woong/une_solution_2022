
namespace IntegrationServer.Options
{
    partial class PanelSWayM
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
            this.textBoxBaseUrl = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.gbPropertyHansol = new System.Windows.Forms.GroupBox();
            this.gbPropertyHansol.SuspendLayout();
            this.SuspendLayout();
            // 
            // textBoxBaseUrl
            // 
            this.textBoxBaseUrl.Location = new System.Drawing.Point(73, 20);
            this.textBoxBaseUrl.Name = "textBoxBaseUrl";
            this.textBoxBaseUrl.Size = new System.Drawing.Size(210, 23);
            this.textBoxBaseUrl.TabIndex = 38;
            this.textBoxBaseUrl.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(50, 15);
            this.label1.TabIndex = 37;
            this.label1.Text = "Base Url";
            // 
            // gbPropertyHansol
            // 
            this.gbPropertyHansol.Controls.Add(this.textBoxBaseUrl);
            this.gbPropertyHansol.Controls.Add(this.label1);
            this.gbPropertyHansol.Location = new System.Drawing.Point(0, 0);
            this.gbPropertyHansol.Name = "gbPropertyHansol";
            this.gbPropertyHansol.Size = new System.Drawing.Size(300, 89);
            this.gbPropertyHansol.TabIndex = 39;
            this.gbPropertyHansol.TabStop = false;
            this.gbPropertyHansol.Text = "에스웨이엠";
            // 
            // PanelSWayM
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyHansol);
            this.Name = "PanelSWayM";
            this.Size = new System.Drawing.Size(300, 89);
            this.gbPropertyHansol.ResumeLayout(false);
            this.gbPropertyHansol.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TextBox textBoxBaseUrl;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox gbPropertyHansol;
    }
}
