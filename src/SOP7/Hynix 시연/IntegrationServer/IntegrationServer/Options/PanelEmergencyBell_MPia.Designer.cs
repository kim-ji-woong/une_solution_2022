
namespace IntegrationServer.Options
{
    partial class PanelEmergencyBell_MPia
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
            this.gbPropertyMPia = new System.Windows.Forms.GroupBox();
            this.textBoxUniqueKeyTag = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.gbPropertyMPia.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertyMPia
            // 
            this.gbPropertyMPia.Controls.Add(this.textBoxUniqueKeyTag);
            this.gbPropertyMPia.Controls.Add(this.label1);
            this.gbPropertyMPia.Location = new System.Drawing.Point(0, 0);
            this.gbPropertyMPia.Name = "gbPropertyMPia";
            this.gbPropertyMPia.Size = new System.Drawing.Size(187, 89);
            this.gbPropertyMPia.TabIndex = 37;
            this.gbPropertyMPia.TabStop = false;
            this.gbPropertyMPia.Text = "엠피아";
            // 
            // textBoxUniqueKeyTag
            // 
            this.textBoxUniqueKeyTag.Location = new System.Drawing.Point(67, 20);
            this.textBoxUniqueKeyTag.Name = "textBoxUniqueKeyTag";
            this.textBoxUniqueKeyTag.Size = new System.Drawing.Size(100, 23);
            this.textBoxUniqueKeyTag.TabIndex = 38;
            this.textBoxUniqueKeyTag.TextChanged += new System.EventHandler(this.OnTextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(49, 15);
            this.label1.TabIndex = 37;
            this.label1.Text = "Key Tag";
            // 
            // PanelEmergencyBell_MPia
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyMPia);
            this.Name = "PanelEmergencyBell_MPia";
            this.Size = new System.Drawing.Size(187, 89);
            this.gbPropertyMPia.ResumeLayout(false);
            this.gbPropertyMPia.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertyMPia;
        private System.Windows.Forms.TextBox textBoxUniqueKeyTag;
        private System.Windows.Forms.Label label1;
    }
}
