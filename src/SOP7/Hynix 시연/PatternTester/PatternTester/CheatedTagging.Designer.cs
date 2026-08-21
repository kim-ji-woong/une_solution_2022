
namespace PatternTester
{
    partial class CheatedTagging
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
            this.label1 = new System.Windows.Forms.Label();
            this.cboTaggingFailCount = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.cboTimeLimit = new System.Windows.Forms.ComboBox();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(5, 6);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(100, 23);
            this.label1.TabIndex = 0;
            this.label1.Text = "사원증 태깅 실패 횟수 :";
            // 
            // cboTaggingFailCount
            // 
            this.cboTaggingFailCount.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTaggingFailCount.FormattingEnabled = true;
            this.cboTaggingFailCount.Items.AddRange(new object[] {
            "상관없음",
            "1회 이상",
            "2회 이상",
            "3회 이상",
            "4회 이상",
            "5회 이상",
            "6회 이상",
            "7회 이상",
            "8회 이상",
            "9회 이상",
            "10회 이상",
            "11회 이상",
            "12회 이상",
            "13회 이상",
            "14회 이상",
            "15회 이상"});
            this.cboTaggingFailCount.Location = new System.Drawing.Point(141, 1);
            this.cboTaggingFailCount.Name = "cboTaggingFailCount";
            this.cboTaggingFailCount.Size = new System.Drawing.Size(121, 20);
            this.cboTaggingFailCount.TabIndex = 0;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(250, 6);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(100, 23);
            this.label2.TabIndex = 0;
            this.label2.Text = "시간 제한 :";
            // 
            // cboTimeLimit
            // 
            this.cboTimeLimit.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTimeLimit.FormattingEnabled = true;
            this.cboTimeLimit.Items.AddRange(new object[] {
            "상관없음",
            "10초 이내",
            "20초 이내",
            "30초 이내",
            "40초 이내",
            "50초 이내",
            "1분 이내",
            "2분 이내",
            "3분 이내",
            "4분 이내",
            "5분 이내",
            "6분 이내",
            "7분 이내",
            "8분 이내",
            "9분 이내",
            "10분 이내"});
            this.cboTimeLimit.Location = new System.Drawing.Point(320, 1);
            this.cboTimeLimit.Name = "cboTimeLimit";
            this.cboTimeLimit.Size = new System.Drawing.Size(121, 20);
            this.cboTimeLimit.TabIndex = 0;
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox cboTaggingFailCount;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox cboTimeLimit;
    }
}
