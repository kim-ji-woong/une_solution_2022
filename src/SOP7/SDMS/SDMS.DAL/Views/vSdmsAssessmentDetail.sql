-- =============================================================================
-- View : vSdmsAssessmentDetail
-- 용도 : 안전점검표 이력에서 한 평가(Assessment)를 클릭했을 때 펼쳐지는 "세부 항목"
--        = 구성원(수신자) × 평가항목별 점수·메모.
--        (화면 로직: History.BLL.LoadManager.DisplayAssessmentDetails 와 동일한 조인)
--
-- grain : 1행 = (AssessmentID, MemberID, ItemID)  → 구성원별 각 항목 1줄.
--
-- 원본 테이블
--   SdmsAssessmentAMember  m      : 구성원(수신자)별 평가 - m.Score = 그 구성원 전체 평균(0~4)
--   SdmsAssessmentA        a      : 평가항목(질문) - a.ID(=AID), a.Contents
--   SdmsAssessmentAItem    aitem  : 구성원×항목별 점수·메모 (AssessmentID, MemberID, AID, Score, Memo)  ★핵심
--   SopTeamRegularMember   rm     : 구성원 이름 (같은 DB 가정. 다른 DB면 [TeamDB].dbo.SopTeamRegularMember)
--   SdmsAssessment         ass    : 평가(유형/구역/발송일)
--   SdmsSpatialEquipmentZone ez   : 구역 이름 (LEFT JOIN - 구역이 삭제돼도 세부는 보이도록)
--
-- 등급(MemberGrade) : 구성원 평균 0~100(= m.Score*25) 을 기본 구간에 매핑
--                     (A:80~ B:60~ C:40~ D:20~ E:0~, 경계는 상위 등급).
--                     사이트 커스텀 구간(OptionSDMS.AssessmentClass)을 쓰면 임계값 조정.
--
-- 사용 예)
--   -- 특정 평가의 세부 항목 (AssessmentID 는 vSdmsMonthlyZoneAssessment 나 이력에서 얻음)
--   SELECT MemberName, ItemID, ItemContents, ItemScore, ItemMemo
--   FROM dbo.vSdmsAssessmentDetail
--   WHERE AssessmentID = 12345
--   ORDER BY MemberName, ItemID;
--
--   -- 월별 뷰와 연계 (2026-07 캠퍼스C 각 평가의 세부까지)
--   SELECT d.*
--   FROM dbo.vSdmsMonthlyZoneAssessment v
--   JOIN dbo.vSdmsAssessmentDetail d ON d.AssessmentID = v.AssessmentID
--   WHERE v.AssessYear = 2026 AND v.AssessMonth = 7 AND v.SiteID = 32
--   ORDER BY v.EquipZoneID, d.MemberName, d.ItemID;
-- =============================================================================

IF OBJECT_ID('dbo.vSdmsAssessmentDetail', 'V') IS NOT NULL
    DROP VIEW dbo.vSdmsAssessmentDetail;
GO

CREATE VIEW dbo.vSdmsAssessmentDetail
AS
    SELECT
        ass.ID                                            AS AssessmentID,
        ez.ID                                             AS EquipZoneID,
        ISNULL(NULLIF(ez.DisplayText, ''), ez.ZoneName)   AS ZoneName,
        CAST(ass.SendDate AS date)                        AS SendDate,       -- 날짜만
        ass.Type                                          AS AssessType,
        CASE ass.Type
            WHEN 1 THEN N'존'
            WHEN 2 THEN N'안전환경'
            WHEN 3 THEN N'현업'
            WHEN 4 THEN N'안전/보건'
            WHEN 5 THEN N'방재/환경'
            ELSE N'(미지정)'
        END                                               AS AssessTypeName,

        -- 구성원(수신자)
        m.MemberID                                        AS MemberID,
        rm.MemberName                                     AS MemberName,
        m.Score                                           AS MemberAvgScore,  -- 구성원 전체 평균(0~4)
        m.Score * 25                                      AS MemberScore100,  -- 0~100
        CASE
            WHEN m.Score * 25 >= 80 THEN N'A'
            WHEN m.Score * 25 >= 60 THEN N'B'
            WHEN m.Score * 25 >= 40 THEN N'C'
            WHEN m.Score * 25 >= 20 THEN N'D'
            ELSE N'E'
        END                                               AS MemberGrade,
        m.IsPass                                          AS IsPass,

        -- 항목별 세부
        a.ID                                              AS ItemID,          -- 항목(질문) ID = AID
        a.Contents                                        AS ItemContents,    -- 항목 내용
        aitem.Score                                       AS ItemScore,       -- 그 항목 점수(원본)
        aitem.Memo                                        AS ItemMemo         -- 그 항목 메모

    FROM SdmsAssessmentAMember m
    INNER JOIN SdmsAssessmentA a
        ON a.AssessmentID = m.AssessmentID
    INNER JOIN SdmsAssessmentAItem aitem
        ON  aitem.AssessmentID = m.AssessmentID
        AND aitem.MemberID     = m.MemberID
        AND aitem.AID          = a.ID
    INNER JOIN SopTeamRegularMember rm
        ON rm.ID = m.MemberID
    INNER JOIN SdmsAssessment ass
        ON ass.ID = m.AssessmentID
    LEFT JOIN SdmsSpatialEquipmentZone ez
        ON ez.ID = ass.EquipmentZoneID;
GO
