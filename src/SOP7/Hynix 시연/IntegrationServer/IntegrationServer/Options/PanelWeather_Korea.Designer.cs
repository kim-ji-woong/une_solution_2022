
namespace IntegrationServer.Options
{
    partial class PanelWeather_Korea
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle5 = new System.Windows.Forms.DataGridViewCellStyle();
            this.gbPropertyMPia = new System.Windows.Forms.GroupBox();
            this.btnDeleteRegion = new System.Windows.Forms.Button();
            this.btnAddRegion = new System.Windows.Forms.Button();
            this.gridDatas = new System.Windows.Forms.DataGridView();
            this.colRegionNo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCity = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colRegionCode = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCityCode = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.textBoxServiceKey = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.gbPropertyMPia.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gridDatas)).BeginInit();
            this.SuspendLayout();
            // 
            // gbPropertyMPia
            // 
            this.gbPropertyMPia.Controls.Add(this.btnDeleteRegion);
            this.gbPropertyMPia.Controls.Add(this.btnAddRegion);
            this.gbPropertyMPia.Controls.Add(this.gridDatas);
            this.gbPropertyMPia.Controls.Add(this.textBoxServiceKey);
            this.gbPropertyMPia.Controls.Add(this.label4);
            this.gbPropertyMPia.Location = new System.Drawing.Point(0, 0);
            this.gbPropertyMPia.Name = "gbPropertyMPia";
            this.gbPropertyMPia.Size = new System.Drawing.Size(473, 206);
            this.gbPropertyMPia.TabIndex = 38;
            this.gbPropertyMPia.TabStop = false;
            this.gbPropertyMPia.Text = "기상청";
            // 
            // btnDeleteRegion
            // 
            this.btnDeleteRegion.Location = new System.Drawing.Point(392, 51);
            this.btnDeleteRegion.Name = "btnDeleteRegion";
            this.btnDeleteRegion.Size = new System.Drawing.Size(75, 23);
            this.btnDeleteRegion.TabIndex = 40;
            this.btnDeleteRegion.Text = "지역삭제";
            this.btnDeleteRegion.UseVisualStyleBackColor = true;
            this.btnDeleteRegion.Click += new System.EventHandler(this.btnDeleteRegion_Click);
            // 
            // btnAddRegion
            // 
            this.btnAddRegion.Location = new System.Drawing.Point(311, 51);
            this.btnAddRegion.Name = "btnAddRegion";
            this.btnAddRegion.Size = new System.Drawing.Size(75, 23);
            this.btnAddRegion.TabIndex = 40;
            this.btnAddRegion.Text = "지역추가";
            this.btnAddRegion.UseVisualStyleBackColor = true;
            this.btnAddRegion.Click += new System.EventHandler(this.btnAddRegion_Click);
            // 
            // gridDatas
            // 
            this.gridDatas.AllowUserToAddRows = false;
            this.gridDatas.AllowUserToDeleteRows = false;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("맑은 고딕", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.gridDatas.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.gridDatas.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gridDatas.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colRegionNo,
            this.colCity,
            this.colRegionCode,
            this.colCityCode});
            this.gridDatas.Location = new System.Drawing.Point(8, 80);
            this.gridDatas.MultiSelect = false;
            this.gridDatas.Name = "gridDatas";
            this.gridDatas.RowHeadersVisible = false;
            this.gridDatas.RowTemplate.Height = 25;
            this.gridDatas.Size = new System.Drawing.Size(459, 118);
            this.gridDatas.TabIndex = 39;
            this.gridDatas.CellEndEdit += new System.Windows.Forms.DataGridViewCellEventHandler(this.gridDatas_CellEndEdit);
            // 
            // colRegionNo
            // 
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colRegionNo.DefaultCellStyle = dataGridViewCellStyle2;
            this.colRegionNo.HeaderText = "번호";
            this.colRegionNo.Name = "colRegionNo";
            this.colRegionNo.ReadOnly = true;
            this.colRegionNo.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colRegionNo.Width = 60;
            // 
            // colCity
            // 
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colCity.DefaultCellStyle = dataGridViewCellStyle3;
            this.colCity.HeaderText = "도시";
            this.colCity.Name = "colCity";
            this.colCity.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // colRegionCode
            // 
            dataGridViewCellStyle4.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colRegionCode.DefaultCellStyle = dataGridViewCellStyle4;
            this.colRegionCode.HeaderText = "지역코드";
            this.colRegionCode.Name = "colRegionCode";
            this.colRegionCode.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.colRegionCode.Width = 86;
            // 
            // colCityCode
            // 
            this.colCityCode.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle5.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleCenter;
            this.colCityCode.DefaultCellStyle = dataGridViewCellStyle5;
            this.colCityCode.HeaderText = "시도코드";
            this.colCityCode.Name = "colCityCode";
            this.colCityCode.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // textBoxServiceKey
            // 
            this.textBoxServiceKey.Location = new System.Drawing.Point(96, 19);
            this.textBoxServiceKey.Name = "textBoxServiceKey";
            this.textBoxServiceKey.Size = new System.Drawing.Size(371, 23);
            this.textBoxServiceKey.TabIndex = 38;
            this.textBoxServiceKey.TextChanged += new System.EventHandler(this.textBoxServiceKey_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(8, 22);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(68, 15);
            this.label4.TabIndex = 37;
            this.label4.Text = "Service Key";
            // 
            // PanelWeather_Korea
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbPropertyMPia);
            this.Name = "PanelWeather_Korea";
            this.Size = new System.Drawing.Size(473, 206);
            this.gbPropertyMPia.ResumeLayout(false);
            this.gbPropertyMPia.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gridDatas)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbPropertyMPia;
        private System.Windows.Forms.Button btnDeleteRegion;
        private System.Windows.Forms.Button btnAddRegion;
        private System.Windows.Forms.DataGridView gridDatas;
        private System.Windows.Forms.DataGridViewTextBoxColumn colRegionNo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCity;
        private System.Windows.Forms.DataGridViewTextBoxColumn colRegionCode;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCityCode;
        private System.Windows.Forms.TextBox textBoxServiceKey;
        private System.Windows.Forms.Label label4;
    }
}
