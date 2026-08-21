
namespace IntegrationServer.Options
{
    partial class PanelSiemens
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
            this.gbPropertySiemens = new System.Windows.Forms.GroupBox();
            this.label9 = new System.Windows.Forms.Label();
            this.rbServerMode = new System.Windows.Forms.RadioButton();
            this.rbClientMode = new System.Windows.Forms.RadioButton();
            this.gbPropertySiemens.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbPropertySiemens
            // 
            this.gbPropertySiemens.Controls.Add(this.label9);
            this.gbPropertySiemens.Controls.Add(this.rbServerMode);
            this.gbPropertySiemens.Controls.Add(this.rbClientMode);
            this.gbPropertySiemens.Location = new System.Drawing.Point(0, 0);
            this.gbPropertySiemens.Name = "gbPropertySiemens";
            this.gbPropertySiemens.Size = new System.Drawing.Size(278, 53);
            this.gbPropertySiemens.TabIndex = 37;
            this.gbPropertySiemens.TabStop = false;
            this.gbPropertySiemens.Text = "지멘스";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(8, 24);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(71, 15);
            this.label9.TabIndex = 38;
            this.label9.Text = "ServerMode";
            // 
            // rbServerMode
            // 
            this.rbServerMode.AutoSize = true;
            this.rbServerMode.Location = new System.Drawing.Point(99, 22);
            this.rbServerMode.Name = "rbServerMode";
            this.rbServerMode.Size = new System.Drawing.Size(58, 19);
            this.rbServerMode.TabIndex = 33;
            this.rbServerMode.TabStop = true;
            this.rbServerMode.Text = "Server";
            this.rbServerMode.UseVisualStyleBackColor = true;
            this.rbServerMode.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // rbClientMode
            // 
            this.rbClientMode.AutoSize = true;
            this.rbClientMode.Location = new System.Drawing.Point(163, 22);
            this.rbClientMode.Name = "rbClientMode";
            this.rbClientMode.Size = new System.Drawing.Size(56, 19);
            this.rbClientMode.TabIndex = 34;
            this.rbClientMode.TabStop = true;
            this.rbClientMode.Text = "Client";
            this.rbClientMode.UseVisualStyleBackColor = true;
            this.rbClientMode.CheckedChanged += new System.EventHandler(this.rb_CheckedChanged);
            // 
            // PanelSiemens
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertySiemens);
            this.Name = "PanelSiemens";
            this.Size = new System.Drawing.Size(278, 53);
            this.gbPropertySiemens.ResumeLayout(false);
            this.gbPropertySiemens.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertySiemens;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.RadioButton rbServerMode;
        private System.Windows.Forms.RadioButton rbClientMode;
    }
}
