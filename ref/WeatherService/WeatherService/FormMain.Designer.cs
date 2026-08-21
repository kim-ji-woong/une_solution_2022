
namespace WeatherService
{
    partial class FormMain
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

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.cboFirst = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.cboSecond = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.cboThird = new System.Windows.Forms.ComboBox();
            this.btnSearch = new System.Windows.Forms.Button();
            this.labelTemperature = new System.Windows.Forms.Label();
            this.labelHumidity = new System.Windows.Forms.Label();
            this.labelRainFall = new System.Windows.Forms.Label();
            this.labelWindSpeed = new System.Windows.Forms.Label();
            this.labelWindDir = new System.Windows.Forms.Label();
            this.labelSkyType = new System.Windows.Forms.Label();
            this.labelMaxTemp = new System.Windows.Forms.Label();
            this.labelMinTemp = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(28, 31);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(43, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "시/도 :";
            // 
            // cboFirst
            // 
            this.cboFirst.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboFirst.FormattingEnabled = true;
            this.cboFirst.Location = new System.Drawing.Point(95, 28);
            this.cboFirst.Name = "cboFirst";
            this.cboFirst.Size = new System.Drawing.Size(101, 20);
            this.cboFirst.TabIndex = 1;
            this.cboFirst.SelectedIndexChanged += new System.EventHandler(this.cboFirst_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(28, 57);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(61, 12);
            this.label2.TabIndex = 0;
            this.label2.Text = "시/군/구 :";
            // 
            // cboSecond
            // 
            this.cboSecond.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboSecond.FormattingEnabled = true;
            this.cboSecond.Location = new System.Drawing.Point(95, 54);
            this.cboSecond.Name = "cboSecond";
            this.cboSecond.Size = new System.Drawing.Size(101, 20);
            this.cboSecond.TabIndex = 1;
            this.cboSecond.SelectedIndexChanged += new System.EventHandler(this.cboSecond_SelectedIndexChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(28, 83);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(61, 12);
            this.label3.TabIndex = 0;
            this.label3.Text = "읍/면/동 :";
            // 
            // cboThird
            // 
            this.cboThird.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboThird.FormattingEnabled = true;
            this.cboThird.Location = new System.Drawing.Point(95, 80);
            this.cboThird.Name = "cboThird";
            this.cboThird.Size = new System.Drawing.Size(101, 20);
            this.cboThird.TabIndex = 1;
            // 
            // btnSearch
            // 
            this.btnSearch.Location = new System.Drawing.Point(231, 28);
            this.btnSearch.Name = "btnSearch";
            this.btnSearch.Size = new System.Drawing.Size(87, 72);
            this.btnSearch.TabIndex = 2;
            this.btnSearch.Text = "조회";
            this.btnSearch.UseVisualStyleBackColor = true;
            this.btnSearch.Click += new System.EventHandler(this.btnSearch_Click);
            // 
            // labelTemperature
            // 
            this.labelTemperature.AutoSize = true;
            this.labelTemperature.Location = new System.Drawing.Point(30, 135);
            this.labelTemperature.Name = "labelTemperature";
            this.labelTemperature.Size = new System.Drawing.Size(41, 12);
            this.labelTemperature.TabIndex = 3;
            this.labelTemperature.Text = "기온 : ";
            // 
            // labelHumidity
            // 
            this.labelHumidity.AutoSize = true;
            this.labelHumidity.Location = new System.Drawing.Point(155, 135);
            this.labelHumidity.Name = "labelHumidity";
            this.labelHumidity.Size = new System.Drawing.Size(41, 12);
            this.labelHumidity.TabIndex = 3;
            this.labelHumidity.Text = "습도 : ";
            // 
            // labelRainFall
            // 
            this.labelRainFall.AutoSize = true;
            this.labelRainFall.Location = new System.Drawing.Point(30, 162);
            this.labelRainFall.Name = "labelRainFall";
            this.labelRainFall.Size = new System.Drawing.Size(53, 12);
            this.labelRainFall.TabIndex = 3;
            this.labelRainFall.Text = "강수량 : ";
            // 
            // labelWindSpeed
            // 
            this.labelWindSpeed.AutoSize = true;
            this.labelWindSpeed.Location = new System.Drawing.Point(155, 162);
            this.labelWindSpeed.Name = "labelWindSpeed";
            this.labelWindSpeed.Size = new System.Drawing.Size(41, 12);
            this.labelWindSpeed.TabIndex = 3;
            this.labelWindSpeed.Text = "풍속 : ";
            // 
            // labelWindDir
            // 
            this.labelWindDir.AutoSize = true;
            this.labelWindDir.Location = new System.Drawing.Point(31, 188);
            this.labelWindDir.Name = "labelWindDir";
            this.labelWindDir.Size = new System.Drawing.Size(41, 12);
            this.labelWindDir.TabIndex = 3;
            this.labelWindDir.Text = "풍향 : ";
            // 
            // labelSkyType
            // 
            this.labelSkyType.AutoSize = true;
            this.labelSkyType.Location = new System.Drawing.Point(155, 188);
            this.labelSkyType.Name = "labelSkyType";
            this.labelSkyType.Size = new System.Drawing.Size(41, 12);
            this.labelSkyType.TabIndex = 3;
            this.labelSkyType.Text = "상태 : ";
            // 
            // labelMaxTemp
            // 
            this.labelMaxTemp.AutoSize = true;
            this.labelMaxTemp.Location = new System.Drawing.Point(30, 215);
            this.labelMaxTemp.Name = "labelMaxTemp";
            this.labelMaxTemp.Size = new System.Drawing.Size(81, 12);
            this.labelMaxTemp.TabIndex = 3;
            this.labelMaxTemp.Text = "일 최고기온 : ";
            // 
            // labelMinTemp
            // 
            this.labelMinTemp.AutoSize = true;
            this.labelMinTemp.Location = new System.Drawing.Point(155, 215);
            this.labelMinTemp.Name = "labelMinTemp";
            this.labelMinTemp.Size = new System.Drawing.Size(81, 12);
            this.labelMinTemp.TabIndex = 3;
            this.labelMinTemp.Text = "일 최저기온 : ";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(339, 250);
            this.Controls.Add(this.labelSkyType);
            this.Controls.Add(this.labelWindSpeed);
            this.Controls.Add(this.labelWindDir);
            this.Controls.Add(this.labelRainFall);
            this.Controls.Add(this.labelHumidity);
            this.Controls.Add(this.labelMinTemp);
            this.Controls.Add(this.labelMaxTemp);
            this.Controls.Add(this.labelTemperature);
            this.Controls.Add(this.btnSearch);
            this.Controls.Add(this.cboThird);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.cboSecond);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.cboFirst);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "FormMain";
            this.Text = "오늘의 날씨";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox cboFirst;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox cboSecond;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.ComboBox cboThird;
        private System.Windows.Forms.Button btnSearch;
        private System.Windows.Forms.Label labelTemperature;
        private System.Windows.Forms.Label labelHumidity;
        private System.Windows.Forms.Label labelRainFall;
        private System.Windows.Forms.Label labelWindSpeed;
        private System.Windows.Forms.Label labelWindDir;
        private System.Windows.Forms.Label labelSkyType;
        private System.Windows.Forms.Label labelMaxTemp;
        private System.Windows.Forms.Label labelMinTemp;
    }
}

