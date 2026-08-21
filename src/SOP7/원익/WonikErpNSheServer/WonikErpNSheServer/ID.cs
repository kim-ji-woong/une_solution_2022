using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamEditor.BLL;
using TeamEditor.Model.Sop.Team;

namespace WonikErpNSheServer
{
    public class ID
    {
        public enum CampusID { H = 1, A, C, V, S}

        public enum TeamOption { JobLevel = 0, JobPosition, Status }

        public static string H2 = "H2";
        public static string O2 = "O2";
        public static string CL2 = "CL2";
        public static string HF = "HF";
        public static string LNG = "LNG";
        public static string LPG = "LPG";
        public static string UVIR = "UV/IR";
        public static string CO = "CO";
        public static string IPA = "IPA";
        public static string CO2 = "CO2";
        public static string HNO3 = "HNO3";
        public static string Press = "압력계";
        public static string Flow = "유량계";
        public static string Flame = "불꽃감지";
        public static string Status = "가동중지";
        public static string Fault = "고장";

        public static string ALARM_METHOD = "POST";


        public static byte FC_ReadCoils = 0x01;
        public static byte FC_ReadDiscrete = 0x02;
        public static byte FC_ReadHolding = 0x03;
        public static byte FC_ReadInputRegister = 0x04;

        public static int H_Discrete_Length = 556;
        public static int H_Register_Length = 70;

        public static int A_Dev1_Discrete_Length = 1554;
        public static int A_Dev1_Register_Length = 182;
        public static int A_Dev1_Register_Length1 = 100;
        public static int A_Dev1_Register_Length2 = 90;

        public static int A_Dev2_Discrete_Length = 76;
        public static int A_Dev2_Register_Length = 10;

        public static int C_Dev1_Discrete_Length = 145;
        public static int C_Dev1_Register_Length = 18;
        public static int C_Dev2_Discrete_Length = 186;
        public static int C_Dev2_Register_Length = 14;
        public static int C_Dev3_Discrete_Length = 267;
        public static int C_Dev3_Register_Length = 34;

        public static int V_Dev1_Discrete_Length = 498;
        public static int V_Dev1_Register_Length = 60;
        public static int V_Dev2_Discrete_Length = 66;
        public static int V_Dev2_Register_Length = 4;
        public static int V_Dev3_Discrete_Length = 570;
        public static int V_Dev3_Register_Length = 71;
        public static int V_Dev4_Discrete_Length = 436;
        public static int V_Dev4_Register_Length = 55;
        public static int V_Dev5_Discrete_Length = 146;
        public static int V_Dev5_Register_Length = 17;

        public static int S_Dev1_Discrete_Length = 766;
        public static int S_Dev1_Register_Length = 46;
        public static int S_Dev2_Discrete_Length = 1092;
        public static int S_Dev2_Register_Length = 111;
        public static int S_Dev2_Register_Length1 = 100;
        public static int S_Dev2_Register_Length2 = 11;
        
        public static int S_Dev3_Discrete_Length = 1766;
        public static int S_Dev3_Discrete_Length1 = 1000;
        public static int S_Dev3_Discrete_Length2 = 700;

        public static int S_Dev3_Register_Length = 187;
        public static int S_Dev3_Register_Length1 = 100;
        public static int S_Dev3_Register_Length2 = 87;

        public static int S_Dev4_Discrete_Length = 1768;
        public static int S_Dev4_Register_Length = 105;
        public static int S_Dev5_Discrete_Length = 1762;
        public static int S_Dev5_Register_Length = 120;
        public static int S_Dev6_Discrete_Length = 100;
        public static int S_Dev6_Register_Length = 13;
        public static int S_Dev7_Discrete_Length = 122;
        public static int S_Dev7_Register_Length = 17;
        public static int S_Dev8_Discrete_Length = 28;
        public static int S_Dev8_Register_Length = 4;

        public static int S_Dev9_Discrete_Length = 4;
        public static int S_Dev9_Register_Length = 1;

        // H캠퍼스 리스트
        public static string GD_A01 = "GD-A01";
        public static string GD_A02 = "GD-A02";
        public static string GD_A03 = "GD-A03";
        public static string GD_A04 = "GD-A04";
        public static string GD_A05 = "GD-A05";
        public static string GD_A06 = "GD-A06";
        public static string GD_A07 = "GD-A07";
        public static string GD_B01 = "GD-B01";
        public static string GD_C01 = "GD-C01";
        public static string GD_C02 = "GD-C02";
        public static string GD_E01 = "GD-E01";
        public static string GD_E02 = "GD-E02";
        public static string GD_E03 = "GD-E03";
        public static string GD_E04 = "GD-E04";
        public static string GD_E05 = "GD-E05";
        public static string GD_E06 = "GD-E06";
        public static string GD_E07 = "GD-E07";
        public static string GD_F01 = "GD-F01";
        public static string GD_F02 = "GD-F02";
        public static string GD_F03 = "GD-F03";
        public static string GD_G01 = "GD-G01";
        public static string GD_G02 = "GD-G02";
        public static string GD_H01 = "GD-H01";
        public static string GD_H02 = "GD-H02";
        public static string GD_D01 = "GD-D01";


        // A캠퍼스 리스트
        public static string GD_A_A01 = "GD-A-A01";
        public static string GD_A_A02 = "GD-A-A02";
        public static string GD_A_A03 = "GD-A-A03";
        public static string GD_A_A04 = "GD-A-A04";
        public static string GD_A_B01 = "GD-A-B01";
        public static string GD_A_B02 = "GD-A-B02";
        public static string GD_A_B03 = "GD-A-B03";
        public static string GD_A_B04 = "GD-A-B04";
        public static string GD_A_C01 = "GD-A-C01";
        public static string GD_A_C02 = "GD-A-C02";
        public static string GD_A_C03 = "GD-A-C03";
        public static string GD_A_C04 = "GD-A-C04";
        public static string GD_A_C05 = "GD-A-C05";
        public static string GD_A_C06 = "GD-A-C06";
        public static string GD_A_C07 = "GD-A-C07";
        //public static string GD_A_D01 = "GD-A-D01";   // 센서명 중복으로 인한 주석처리 - 20260203
        public static string GD_A_D02 = "GD-A-D02";
        public static string GD_A_E01 = "GD-A-E01";
        public static string GD_A_E02 = "GD-A-E02";
        public static string GD_A_E03 = "GD-A-E03";
        public static string GD_A_E04 = "GD-A-E04";
        public static string GD_A_E05 = "GD-A-E05";
        public static string GD_A_E06 = "GD-A-E06";
        public static string GD_A_E07 = "GD-A-E07";
        public static string GD_A_E08 = "GD-A-E08";
        public static string GD_A_E09 = "GD-A-E09";
        public static string GD_A_E10 = "GD-A-E10";
        public static string GD_A_E11 = "GD-A-E11";
        public static string GD_A_E12 = "GD-A-E12";
        public static string GD_A_F01 = "GD-A-F01";
        public static string GD_A_F02 = "GD-A-F02";
        public static string GD_A_F03 = "GD-A-F03";
        public static string GD_A_F04 = "GD-A-F04";
        public static string GD_A_G01 = "GD-A-G01";
        public static string GD_A_G02 = "GD-A-G02";
        public static string GD_A_G03 = "GD-A-G03";
        public static string GD_A_G04 = "GD-A-G04";
        public static string GD_A_G05 = "GD-A-G05";
        public static string GD_A_G06 = "GD-A-G06";
        public static string GD_A_G07 = "GD-A-G07";
        public static string GD_A_G08 = "GD-A-G08";
        public static string GD_A_G09 = "GD-A-G09";
        public static string GD_A_G10 = "GD-A-G10";
        public static string GD_A_G11 = "GD-A-G11";
        public static string GD_A_G12 = "GD-A-G12";
        public static string GD_A_G13 = "GD-A-G13";
        public static string GD_A_G14 = "GD-A-G14";
        public static string GD_A_H01 = "GD-A-H01";
        public static string GD_A_H02 = "GD-A-H02";
        public static string GD_A_H03 = "GD-A-H03";
        public static string GD_A_H04 = "GD-A-H04";
        public static string GD_A_H05 = "GD-A-H05";
        public static string GD_A_H06 = "GD-A-H06";
        public static string GD_A_H07 = "GD-A-H07";
        public static string GD_A_H08 = "GD-A-H08";
        public static string GD_A_H09 = "GD-A-H09";
        public static string GD_A_H10 = "GD-A-H10";
        public static string GD_A_H11 = "GD-A-H11";
        public static string GD_A_H12 = "GD-A-H12";
        public static string GD_A_H13 = "GD-A-H13";
        public static string GD_A_H14 = "GD-A-H14";
        public static string GD_A_I01 = "GD-A-I01";
        public static string GD_A_I02 = "GD-A-I02";
        public static string GD_A_J01 = "GD-A-J01";
        public static string GD_A_K01 = "GD-A-K01";
        public static string GD_A_K02 = "GD-A-K02";
        public static string GD_A_K03 = "GD-A-K03";
        public static string GD_A_L01 = "GD-A-L01";
        public static string GD_A_L02 = "GD-A-L02";
        public static string GD_A_L03 = "GD-A-L03";
        public static string GD_A_L04 = "GD-A-L04";
        public static string GD_A_L05 = "GD-A-L05";
        public static string GD_A_L06 = "GD-A-L06";
        public static string GD_A_L07 = "GD-A-L07";
        public static string GD_A_L08 = "GD-A-L08";
        public static string GD_A_L09 = "GD-A-L09";
        public static string GD_A_L10 = "GD-A-L10";
        public static string GD_A_L11 = "GD-A-L11";
        public static string GD_A_L12 = "GD-A-L12";
        public static string GD_A_L13 = "GD-A-L13";
        public static string GD_A_L14 = "GD-A-L14";
        public static string GD_A_L15 = "GD-A-L15";
        public static string GD_A_L16 = "GD-A-L16";
        public static string GD_A_L17 = "GD-A-L17";
        //public static string GD_A_L18 = "GD-A-L18";
        public static string GD_A_L19 = "GD-A-L19";
        public static string GD_A_M01 = "GD-A-M01";
        public static string GD_A_M02 = "GD-A-M02";
        public static string GD_A_M03 = "GD-A-M03";
        public static string GD_A_N01 = "GD-A-N01";
        public static string GD_A_N02 = "GD-A-N02";
        public static string GD_A_N03 = "GD-A-N03";
        public static string GD_A_N04 = "GD-A-N04";
        public static string GD_A_N05 = "GD-A-N05";
        public static string GD_A_N06 = "GD-A-N06";
        public static string GD_A_O01 = "GD-A-O01";
        public static string GD_A_O02 = "GD-A-O02";
        public static string GD_A_O03 = "GD-A-O03";
        public static string GD_A_O04 = "GD-A-O04";



        // C캠퍼스 리스트
        public static string GD_C_01 = "GD-C-01";
        public static string GD_C_02 = "GD-C-02";
        public static string GD_C_03 = "GD-C-03";
        public static string GD_C_04 = "GD-C-04";
        public static string GD_C1_01 = "GD-C1-01";
        public static string GD_C3_01 = "GD-C3-01";
        public static string GD_C3_02 = "GD-C3-02";
        public static string GD_C4_01 = "GD-C4-01";
        public static string GD_C4_02 = "GD-C4-02";
        public static string GD_C4_03 = "GD-C4-03";
        public static string GD_C4_04 = "GD-C4-04";
        public static string GD_C1E_01 = "GD-C1E-01";
        public static string GD_C1E_02 = "GD-C1E-02";
        public static string GD_C4L_01 = "GD-C4L-01";
        public static string GD_C4L_02 = "GD-C4L-02";
        public static string GD_C4L_03 = "GD-C4L-03";
        public static string GD_C4L_04 = "GD-C4L-04";
        public static string GD_C4L_05 = "GD-C4L-05";
        public static string GD_C4L_06 = "GD-C4L-06";




        // V 캠퍼스 리스트
        public static string GD_V_A01 = "GD-V-A01";
        public static string GD_V_A02 = "GD-V-A02";
        public static string GD_V_A03 = "GD-V-A03";
        public static string GD_V_A04 = "GD-V-A04";

        public static string GD_V_B01 = "GD-V-B01";
        public static string GD_V_B02 = "GD-V-B02";
        public static string GD_V_B03 = "GD-V-B03";
        public static string GD_V_B04 = "GD-V-B04";
        public static string GD_V_B05 = "GD-V-B05";
        public static string GD_V_B06 = "GD-V-B06";

        public static string GD_V_C01 = "GD-V-C01";
        public static string GD_V_C02 = "GD-V-C02";
        public static string GD_V_C03 = "GD-V-C03";
        public static string GD_V_C04 = "GD-V-C04";

        public static string GD_V_D01 = "GD-V-D01";
        public static string GD_V_D02 = "GD-V-D02";
        public static string GD_V_D03 = "GD-V-D03";
        public static string GD_V_D04 = "GD-V-D04";

        public static string GD_V_E01 = "GD-V-E01";
        public static string GD_V_E02 = "GD-V-E02";
        public static string GD_V_E03 = "GD-V-E03";
        public static string GD_V_E04 = "GD-V-E04";
        public static string GD_V_E05 = "GD-V-E05";

        public static string GD_V_F01 = "GD-V-F01";
        public static string GD_V_F02 = "GD-V-F02";
        public static string GD_V_F03 = "GD-V-F03";
        public static string GD_V_F04 = "GD-V-F04";
        public static string GD_V_F05 = "GD-V-F05";
        public static string GD_V_F06 = "GD-V-F06";
        public static string GD_V_F07 = "GD-V-F07";
        public static string GD_V_F08 = "GD-V-F08";
        public static string GD_V_F09 = "GD-V-F09";
        public static string GD_V_F10 = "GD-V-F10";
        public static string GD_V_F11 = "GD-V-F11";
        public static string GD_V_F12 = "GD-V-F12";

        public static string GD_V_G01 = "GD-V-G01";
        public static string GD_V_G02 = "GD-V-G02";
        public static string GD_V_G03 = "GD-V-G03";
        public static string GD_V_G04 = "GD-V-G04";

        public static string GD_V_H01 = "GD-V-H01";
        public static string GD_V_H02 = "GD-V-H02";
        public static string GD_V_H03 = "GD-V-H03";
        public static string GD_V_H04 = "GD-V-H04";
        public static string GD_V_H05 = "GD-V-H05";
        public static string GD_V_H06 = "GD-V-H06";
        public static string GD_V_H07 = "GD-V-H07";
        public static string GD_V_H08 = "GD-V-H08";

        public static string GD_V_I01 = "GD-V-I01";
        public static string GD_V_I02 = "GD-V-I02";
        public static string GD_V_I03 = "GD-V-I03";
        public static string GD_V_I04 = "GD-V-I04";

        public static string GD_V_J01 = "GD-V-J01";

        public static string GD_V_K01 = "GD-V-K01";
        public static string GD_V_K02 = "GD-V-K02";
        public static string GD_V_K03 = "GD-V-K03";

        public static string GD_V_L01 = "GD-V-L01";
        public static string GD_V_L02 = "GD-V-L02";
        public static string GD_V_L03 = "GD-V-L03";

        public static string GD_V_M01 = "GD-V-M01";
        public static string GD_V_M02 = "GD-V-M02";
        public static string GD_V_M03 = "GD-V-M03";

        public static string GD_V_U01 = "GD-V-U01";

        public static string GD_V_N01 = "GD-V-N01";
        public static string GD_V_N02 = "GD-V-N02";
        public static string GD_V_N03 = "GD-V-N03";
        public static string GD_V_N04 = "GD-V-N04";
        public static string GD_V_N05 = "GD-V-N05";

        public static string GD_V_O01 = "GD-V-O01";
        public static string GD_V_O02 = "GD-V-O02";
        public static string GD_V_O03 = "GD-V-O03";

        public static string GD_V_P01 = "GD-V-P01";
        public static string GD_V_P02 = "GD-V-P02";

        public static string GD_V_Q01 = "GD-V-Q01";
        public static string GD_V_Q02 = "GD-V-Q02";
        public static string GD_V_Q03 = "GD-V-Q03";
        public static string GD_V_Q04 = "GD-V-Q04";

        public static string GD_V_R01 = "GD-V-R01";
        public static string GD_V_R02 = "GD-V-R02";
        public static string GD_V_R03 = "GD-V-R03";
        public static string GD_V_R04 = "GD-V-R04";
        public static string GD_V_R05 = "GD-V-R05";

        public static string GD_V_S01 = "GD-V-S01";
        public static string GD_V_S02 = "GD-V-S02";
        public static string GD_V_S03 = "GD-V-S03";
        public static string GD_V_S04 = "GD-V-S04";
        public static string GD_V_S05 = "GD-V-S05";

        public static string GD_V_T01 = "GD-V-T01";
        public static string GD_V_T02 = "GD-V-T02";
        public static string GD_V_T03 = "GD-V-T03";
        public static string GD_V_T04 = "GD-V-T04";

        public static string GD_V_V01 = "GD-V-V01";
        public static string GD_V_V02 = "GD-V-V02";
        public static string GD_V_V03 = "GD-V-V03";
        public static string GD_V_V04 = "GD-V-V04";
        public static string GD_V_V05 = "GD-V-V05";
        public static string GD_V_V06 = "GD-V-V06";

        public static string GD_V_O11 = "GD-V-O11";

        

        // S캠퍼스 리스트
        public static string GD_S1_A23 = "GD-S1-A23";
        public static string GD_S1_A24 = "GD-S1-A24";
        public static string GD_S1_A25 = "GD-S1-A25";
        public static string GD_S1_A29 = "GD-S1-A29";

        public static string GD_S1_A01 = "GD-S1-A01";
        public static string GD_S1_A02 = "GD-S1-A02";
        public static string GD_S1_A03 = "GD-S1-A03";
        public static string GD_S1_A04 = "GD-S1-A04";
        public static string GD_S1_A05 = "GD-S1-A05";
        public static string GD_S1_A06 = "GD-S1-A06";
        public static string GD_S1_A07 = "GD-S1-A07";
        public static string GD_S1_A08 = "GD-S1-A08";
        public static string GD_S1_A09 = "GD-S1-A09";
        public static string GD_S1_A10 = "GD-S1-A10";
        public static string GD_S1_A11 = "GD-S1-A11";

        public static string GD_S1_A16 = "GD-S1-A16";
        public static string GD_S1_A17 = "GD-S1-A17";
        public static string GD_S1_A18 = "GD-S1-A18";
        public static string GD_S1_A19 = "GD-S1-A19";
        public static string GD_S1_A20 = "GD-S1-A20";
        public static string GD_S1_A21 = "GD-S1-A21";
        public static string GD_S1_A22 = "GD-S1-A22";
        public static string GD_S1_A26 = "GD-S1-A26";

        public static string GD_S1_A12 = "GD-S1-A12";
        public static string GD_S1_A13 = "GD-S1-A13";
        public static string GD_S1_A14 = "GD-S1-A14";
        public static string GD_S1_A15 = "GD-S1-A15";

        public static string GD_S1_A27 = "GD-S1-A27";
        public static string GD_S1_A28 = "GD-S1-A28";


        public static string GD_S2_B01 = "GD-S2-B01";
        public static string GD_S2_B02 = "GD-S2-B02";
        public static string GD_S2_B03 = "GD-S2-B03";
        public static string GD_S2_B04 = "GD-S2-B04";
        public static string GD_S2_B05 = "GD-S2-B05";
        public static string GD_S2_B06 = "GD-S2-B06";
        public static string GD_S2_B07 = "GD-S2-B07";
        public static string GD_S2_B08 = "GD-S2-B08";
        public static string GD_S2_B09 = "GD-S2-B09";
        public static string GD_S2_B10 = "GD-S2-B10";
        public static string GD_S2_B11 = "GD-S2-B11";
        public static string GD_S2_B12 = "GD-S2-B12";
        public static string GD_S2_B13 = "GD-S2-B13";
        public static string GD_S2_B14 = "GD-S2-B14";
        public static string GD_S2_B15 = "GD-S2-B15";
        public static string GD_S2_B16 = "GD-S2-B16";
        public static string GD_S2_B17 = "GD-S2-B17";
        public static string GD_S2_B18 = "GD-S2-B18";
        public static string GD_S2_B19 = "GD-S2-B19";
        public static string GD_S2_B20 = "GD-S2-B20";
        public static string GD_S2_B21 = "GD-S2-B21";
        public static string GD_S2_B22 = "GD-S2-B22";
        public static string GD_S2_B23 = "GD-S2-B23";

        public static string GD_S2_E01 = "GD-S2-E01";
        public static string GD_S2_E02 = "GD-S2-E02";
        public static string GD_S2_E03 = "GD-S2-E03";
        public static string GD_S2_E04 = "GD-S2-E04";
        public static string GD_S2_E05 = "GD-S2-E05";
        public static string GD_S2_E06 = "GD-S2-E06";
        public static string GD_S2_E07 = "GD-S2-E07";
        public static string GD_S2_E08 = "GD-S2-E08";
        public static string GD_S2_E09 = "GD-S2-E09";
        public static string GD_S2_E10 = "GD-S2-E10";
        public static string GD_S2_E11 = "GD-S2-E11";

        public static string GD_S2_C02 = "GD-S2-C02";
        public static string GD_S2_C08 = "GD-S2-C08";
        public static string GD_S2_C09 = "GD-S2-C09";
        public static string GD_S2_C10 = "GD-S2-C10";

        public static string GD_S2_D01 = "GD-S2-D01";
        public static string GD_S2_D02 = "GD-S2-D02";
        public static string GD_S2_D03 = "GD-S2-D03";
        public static string GD_S2_D04 = "GD-S2-D04";
        public static string GD_S2_D05 = "GD-S2-D05";
        public static string GD_S2_D06 = "GD-S2-D06";
        public static string GD_S2_D07 = "GD-S2-D07";
        public static string GD_S2_D08 = "GD-S2-D08";
        public static string GD_S2_D09 = "GD-S2-D09";
        public static string GD_S2_D10 = "GD-S2-D10";

        public static string GD_S2_C01 = "GD-S2-C01";
        public static string GD_S2_C03 = "GD-S2-C03";
        public static string GD_S2_C04 = "GD-S2-C04";
        public static string GD_S2_C05 = "GD-S2-C05";
        public static string GD_S2_C06 = "GD-S2-C06";
        public static string GD_S2_C07 = "GD-S2-C07";
        public static string GD_S2_C11 = "GD-S2-C11";

        public static string GD_S2_F01 = "GD-S2-F01";
        public static string GD_S2_F02 = "GD-S2-F02";
        public static string GD_S2_F03 = "GD-S2-F03";
        public static string GD_S2_F04 = "GD-S2-F04";
        public static string GD_S2_F05 = "GD-S2-F05";
        public static string GD_S2_F06 = "GD-S2-F06";
        public static string GD_S2_F07 = "GD-S2-F07";
        public static string GD_S2_F08 = "GD-S2-F08";
        public static string GD_S2_F09 = "GD-S2-F09";
        public static string GD_S2_F10 = "GD-S2-F10";
        public static string GD_S2_F11 = "GD-S2-F11";
        public static string GD_S2_F12 = "GD-S2-F12";
        public static string GD_S2_F13 = "GD-S2-F13";
        public static string GD_S2_F14 = "GD-S2-F14";
        public static string GD_S2_F15 = "GD-S2-F15";
        public static string GD_S2_F16 = "GD-S2-F16";
        public static string GD_S2_F17 = "GD-S2-F17";
        public static string GD_S2_F18 = "GD-S2-F18";
        public static string GD_S2_F19 = "GD-S2-F19";

        public static string GD_S2_F25 = "GD-S2-F25";
        public static string GD_S2_F26 = "GD-S2-F26";
        public static string GD_S2_F27 = "GD-S2-F27";

        public static string GD_S2_F33 = "GD-S2-F33";

        public static string GD_S2_F48 = "GD-S2-F48";
        public static string GD_S2_F49 = "GD-S2-F49";
        public static string GD_S2_F50 = "GD-S2-F50";
        public static string GD_S2_F51 = "GD-S2-F51";
        public static string GD_S2_F53 = "GD-S2-F53";
        public static string GD_S2_F54 = "GD-S2-F54";

        public static string GD_S2_I01 = "GD-S2-I01";
        public static string GD_S2_I02 = "GD-S2-I02";

        public static string GD_S2_L01 = "GD-S2-L01";
        public static string GD_S2_L02 = "GD-S2-L02";
        public static string GD_S2_L03 = "GD-S2-L03";

        public static string GD_S2_F20 = "GD-S2-F20";
        public static string GD_S2_F21 = "GD-S2-F21";
        public static string GD_S2_F22 = "GD-S2-F22";
        public static string GD_S2_F23 = "GD-S2-F23";
        public static string GD_S2_F24 = "GD-S2-F24";
        public static string GD_S2_F28 = "GD-S2-F28";
        public static string GD_S2_F29 = "GD-S2-F29";
        public static string GD_S2_F30 = "GD-S2-F30";
        public static string GD_S2_F31 = "GD-S2-F31";
        public static string GD_S2_F32 = "GD-S2-F32";
        public static string GD_S2_F34 = "GD-S2-F34";
        public static string GD_S2_F35 = "GD-S2-F35";
        public static string GD_S2_F36 = "GD-S2-F36";
        public static string GD_S2_F37 = "GD-S2-F37";
        public static string GD_S2_F38 = "GD-S2-F38";
        public static string GD_S2_F39 = "GD-S2-F39";
        public static string GD_S2_F40 = "GD-S2-F40";
        public static string GD_S2_F41 = "GD-S2-F41";
        public static string GD_S2_F42 = "GD-S2-F42";
        public static string GD_S2_F43 = "GD-S2-F43";
        public static string GD_S2_F44 = "GD-S2-F44";
        public static string GD_S2_F45 = "GD-S2-F45";
        public static string GD_S2_F46 = "GD-S2-F46";
        public static string GD_S2_F47 = "GD-S2-F47";

        public static string GD_S2_F52 = "GD-S2-F52";

        public static string GD_S2_G01 = "GD-S2-G01";
        public static string GD_S2_G02 = "GD-S2-G02";
        public static string GD_S2_G03 = "GD-S2-G03";
        public static string GD_S2_G04 = "GD-S2-G04";
        public static string GD_S2_G05 = "GD-S2-G05";
        public static string GD_S2_G06 = "GD-S2-G06";
        public static string GD_S2_G07 = "GD-S2-G07";
        public static string GD_S2_G08 = "GD-S2-G08";
        public static string GD_S2_G09 = "GD-S2-G09";
        public static string GD_S2_G10 = "GD-S2-G10";
        public static string GD_S2_G11 = "GD-S2-G11";
        public static string GD_S2_G12 = "GD-S2-G12";
        public static string GD_S2_G13 = "GD-S2-G13";
        public static string GD_S2_G14 = "GD-S2-G14";
        public static string GD_S2_G15 = "GD-S2-G15";
        public static string GD_S2_G16 = "GD-S2-G16";

        public static string GD_S2_H01 = "GD-S2-H01";
        public static string GD_S2_H02 = "GD-S2-H02";
        public static string GD_S2_H03 = "GD-S2-H03";
        public static string GD_S2_H04 = "GD-S2-H04";

        public static string GD_S_A01 = "GD-S-A01";
        public static string GD_S_A02 = "GD-S-A02";
        public static string GD_S_A03 = "GD-S-A03";
        public static string GD_S_A06 = "GD-S-A06";

        public static string GD_S_K01 = "GD-S-K01";
        public static string GD_S_K02 = "GD-S-K02";

        public static string GD_S_A04 = "GD-S-A04";
        public static string GD_S_A05 = "GD-S-A05";

        public static string GD_S_J01 = "GD-S-J01";
        public static string GD_S_J02 = "GD-S-J02";
        public static string GD_S_J03 = "GD-S-J03";
        public static string GD_S_J04 = "GD-S-J04";

        public static string GD_S_M01 = "GD-S-M01";

        public static string FT_001 = "FT-001";
        public static string PIA_001 = "PIA-001";
        public static string PIA_002 = "PIA-002";
        public static string PT_WIQ11 = "PT-WIQ11";
        public static string FT_WIQ11 = "FT-WIQ11";
        public static string PT_WIQ01 = "PT-WIQ01";
        public static string FT_WIQ01 = "FT-WIQ01";

        public static string GD_S_J05 = "GD-S-J05";
        public static string GD_S_J06 = "GD-S-J06";
        public static string GD_S_J07 = "GD-S-J07";
        public static string GD_S_J08 = "GD-S-J08";

        public static string GAS_EF_2F_1 = "GAS-EF-2F-1";
        public static string GAS_EF_2F_2 = "GAS-EF-2F-2";
        public static string GAS_EF_2F_3 = "GAS-EF-2F-3";
        public static string GAS_EF_2F_4 = "GAS-EF-2F-4";

        public static string GAS_EF_3F_1 = "GAS-EF-3F-1";
        public static string GAS_EF_3F_2 = "GAS-EF-3F-2";
        public static string GAS_EF_3F_3 = "GAS-EF-3F-3";
        public static string GAS_EF_3F_4 = "GAS-EF-3F-4";



        // 20251106 새로 추가된 센서
        public static string GD_A_D01 = "GD-A-D01";
        public static string GD_A_L20 = "GD-A-L20";

        public static string GD_C3_03 = "GD-C3-03";

        public static string GD_H_E08 = "GD-H-E08";

        public static string GD_S1_O01 = "GD-S1-O01";
        public static string GD_S2_N01 = "GD-S2-N01";

        
        public static string GD_V_W01 = "GD-V-W01";
        public static string GD_V_W02 = "GD-V-W02";
        public static string GD_V_W03 = "GD-V-W03";
        public static string GD_V_X01 = "GD-V-X01";
        public static string GD_V_X02 = "GD-V-X02";
        public static string GD_V_X03 = "GD-V-X03";
        public static string GD_V_Y01 = "GD-V-Y01";
        public static string GD_V_Y02 = "GD-V-Y02";
        public static string GD_V_Y03 = "GD-V-Y03";
        public static string GD_V_I05 = "GD-V-I05";


        // 20260304 A캠퍼스 추가 요청
        public static string GD_A_L18 = "GD-A-L18";
        public static string GD_A_L21 = "GD-A-L21";
        public static string GD_A_L22 = "GD-A-L22";
    }



    public class WorkPermitData
    {
        /// <summary>
        /// 관리 번호
        /// </summary>
        public string SW_CD { get; set; }

        /// <summary>
        /// 사업장(캠퍼스) ID
        /// </summary>
        public int CAP_SEQ { get; set; }

        /// <summary>
        /// 작업기간
        /// </summary>
        public string SW_DATE { get; set; }

        /// <summary>
        /// 빌딩그룹 ID
        /// </summary>
        public int BuildingGroupID { get; set; }

        /// <summary>
        /// 작업 종류 리스트
        /// </summary>
        public List<int> WorkerTypes { get; set; }
    }

    public class PermitUpdateData
    {
        public int BuildingGroupID { get; set; }

        public int Normal { get; set; }
        public int Fire { get; set; }
        public int High { get; set; }
        public int Blackout { get; set; }
        public int Closeness { get; set; }
        public int Heavy { get; set; }
        public int Excavation { get; set; }
        public int Radiation { get; set; }
        public int Common { get; set; }
    }

    public class ERPTeamData
    {
        /// <summary>
        /// 부서코드
        /// </summary>
        public string DEPT { get; set; }
        /// <summary>
        /// 부모 부서코드
        /// </summary>
        public string PDEPT { get; set; }
        /// <summary>
        /// 부서명
        /// </summary>
        public string LDEPTNM { get; set; }
        /// <summary>
        /// 레벨
        /// </summary>
        public int LVL { get; set; }
        /// <summary>
        /// 순번
        /// </summary>
        public int SEQ { get; set; }
    }

    public class ERPMemberData
    {
        /// <summary>
        /// 사번
        /// </summary>
        public string EMP_NO { get; set; }
        /// <summary>
        /// 이름
        /// </summary>
        public string NAME { get; set; }
        /// <summary>
        /// 핸드폰 번호
        /// </summary>
        public string HAND_TEL_NO { get; set; }
        /// <summary>
        /// 전화번호
        /// </summary>
        public string TEL_NO { get; set; }
        /// <summary>
        /// 이메일
        /// </summary>
        public string EMAIL_ADDR { get; set; }
        /// <summary>
        /// 부서코드
        /// </summary>
        public string DEPT_CD { get; set; }
        /// <summary>
        /// 부서 이름
        /// </summary>
        public string DEPT_NM { get; set; }
        /// <summary>
        /// 직위코드
        /// </summary>
        public string ROLL_PSTN { get; set; }
        /// <summary>
        /// 직위 이름
        /// </summary>
        public string ROLL_PSTN_NM { get; set; }
        /// <summary>
        /// 직책코드
        /// </summary>
        public string ROLE_CD { get; set; }
        /// <summary>
        /// 직책이름
        /// </summary>
        public string ROLE_NM { get; set; }
        /// <summary>
        /// 사용여부
        /// </summary>
        public string USE_YN { get; set; }
    }

    public class ERPRegular : RegularTeam
    {
        public string DEPT { get; set; }
    }

    public class ERPRegularMember : RegularMember
    {
        public string DEPT_CD { get; set; }
    }


    public class GasData
    {
        public enum VauleTypes { None = 0, Divide10, Divide100, ConverS1, ConverS2, Divide100_2 }

        private bool m_bHiAlarm = false;
        private bool m_bHiHighAlarm = false;
        private bool m_bLoAlarm = false;
        private bool m_bLoLowAlarm = false;
        private bool m_bFaultAlarm = false;
        private bool m_bStatus = true;
        private bool m_bPressHiAlarm = false;
        private bool m_bPressLoAlarm = false;
        private bool m_bFireAlarm = false;

        public GasData()
        {
           
        }

        public GasData(string strSensorName, string strType, VauleTypes vauleType = VauleTypes.None)
        {
            this.SensorName = strSensorName;
            this.Type = strType;
            this.VauleType = vauleType;
        }


        public string SensorName { get; set; }
        public string Type { get; set; }
        public int Value { get; set; }
        public double Measure { get; set; }

        private VauleTypes m_vauleType = VauleTypes.None;
        public VauleTypes VauleType 
        { 
            get { return m_vauleType; } 
            set { m_vauleType = value; }
        }

        public bool HiAlarm 
        { 
            get { return m_bHiAlarm; } 
            set { m_bHiAlarm = value; }
        }
        public bool HiHighAlarm
        {
            get { return m_bHiHighAlarm; }
            set { m_bHiHighAlarm = value; }
        }
        public bool LoAlarm
        {
            get { return m_bLoAlarm; }
            set { m_bLoAlarm = value; }
        }
        public bool LoLowAlarm
        {
            get { return m_bLoLowAlarm; }
            set { m_bLoLowAlarm = value; }
        }
        public bool FaultAlarm
        {
            get { return m_bFaultAlarm; }
            set { m_bFaultAlarm = value; }
        }
        public bool Status
        {
            get { return m_bStatus; }
            set { m_bStatus = value; }
        }
        public bool PressHiAlarm
        {
            get { return m_bPressHiAlarm; }
            set { m_bPressHiAlarm = value; }
        }
        public bool PressLoAlarm
        {
            get { return m_bPressLoAlarm; }
            set { m_bPressLoAlarm = value; }
        }

        public bool FireAlarm
        {
            get { return m_bFireAlarm; }
            set { m_bFireAlarm = value; }
        }

        public void SetHiData(bool bHiAlarm, bool bHiHighAlarm, bool bFaultAlarm)
        {
            this.HiAlarm = bHiAlarm;
            this.HiHighAlarm = bHiHighAlarm;
            this.FaultAlarm = bFaultAlarm;
        }

        public void SetLowData(bool bLoAlarm, bool bLoLowAlarm, bool bHiAlarm, bool bFaultAlarm)
        {
            this.LoAlarm = bLoAlarm;
            this.LoLowAlarm = bLoLowAlarm;
            this.HiAlarm = bHiAlarm;
            //this.FaultAlarm = bFaultAlarm;
        }

        public void SetHiData(BitArray bitArray, int nStartNum)
        {            
            this.HiAlarm = bitArray[nStartNum];
            this.HiHighAlarm = bitArray[nStartNum + 1];
            //this.FaultAlarm = bitArray[nStartNum + 3];
        }

        public void SetHiData_S(BitArray bitArray, int nStartNum)
        {
            this.HiAlarm = bitArray[nStartNum];
            this.HiHighAlarm = bitArray[nStartNum + 1];
            //this.FaultAlarm = bitArray[nStartNum + 2];
        }

        public void SetLowData(BitArray bitArray, int nStartNum)
        {
            this.LoAlarm = bitArray[nStartNum];
            this.LoLowAlarm = bitArray[nStartNum + 1];
            this.HiAlarm = bitArray[nStartNum + 2];
            //this.FaultAlarm = bitArray[nStartNum + 3];
        }

        public void SetVale(byte[] arrData, int nAddress)
        {
            int nRegisterLeng = 2;
            byte[] arrTemp = new byte[nRegisterLeng];

            nAddress = nAddress * nRegisterLeng;

            Array.Copy(arrData, nAddress, arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
            this.Value = BitConverter.ToInt16(arrTemp, 0);

            if (this.VauleType == VauleTypes.Divide10)
            {
                if (this.Value <= 0)
                    this.Measure = 0;
                else
                {
                    this.Measure = this.Value / 10;
                    this.Measure = Math.Round(this.Measure, 1);
                }
            }
            else if (this.VauleType == VauleTypes.Divide100)
            {
                if (this.Value <= 0)
                    this.Measure = 0;
                else
                {
                    this.Measure = this.Value / 100;
                    this.Measure = Math.Round(this.Measure, 1);
                }
            }
            else if (this.VauleType == VauleTypes.Divide100_2)
            {
                if (this.Value <= 0)
                    this.Measure = 0;
                else
                {
                    this.Measure = this.Value / 100;
                    this.Measure = Math.Round(this.Measure, 2);
                }
            }
            else if (this.VauleType == VauleTypes.ConverS1)
            {
                if (this.Value >= 4000 && this.Value <= 20000)
                {
                    int nTemp = this.Value - 4000;
                    this.Measure = nTemp / 160;
                    this.Measure = Math.Round(this.Measure, 1);
                }
                else
                    this.Measure = this.Value;
            }
            else if (this.VauleType == VauleTypes.ConverS2)
            {
                if (this.Value >= 4000 && this.Value <= 20000)
                {
                    int nTemp = this.Value - 4000;
                    this.Measure = nTemp / 640;
                    this.Measure = Math.Round(this.Measure, 1);
                }
                else
                    this.Measure = this.Value;
            }
            else
            {
                this.Measure = this.Value;
            }

        }
    }

    public class GasSensorData
    {
        public int ID { get; set; }
        public string SensorName { get; set; }
        public string UniqueKey { get; set; }
        public int SensorZoneID { get; set; }
        public int TagInfoID { get; set; }

    }

    public class EnvironmentSensorData
    {
        public ETC ETC { get; set; }
        public int? SensorZoneID { get; set; }
        public int? TagInfoID { get; set; }

        public EnvironmentSensorData(ETC etc)
        {
            this.ETC = etc;
        }

    }
}
