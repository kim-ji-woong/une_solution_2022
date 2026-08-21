-- =============================================================================
-- 사이트별 구역 종합점수 / 사이트 평균점수
--   원본 쿼리(다운로드 "사이트평균점수.sql")를 View 화.
--   차이점: 하드코딩된  WHERE EqZone.SiteID = 34  제거 → SiteID 를 컬럼으로 노출하여
--           어느 사이트든  WHERE SiteID = <n>  으로 조회 가능하게 함.
--
-- ※ 이 파일은 SdmsAssessment 가 있는 DB(예: WSOP_31)에서 실행하세요. (원본의 use WSOP_31 대체)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- View 1) vSdmsZoneTotalScore : 구역별 종합점수 (원본 쿼리 그대로, 사이트 필터만 컬럼화)
--   TotalScore = 유형별 "최신" 평가 점수의 가중합
--     Type 3(현업)      × 10
--     Type 4(안전/보건) × 7
--     Type 5(방재/환경) × 8
--     (그 외 유형은 0)  → 세 유형 모두 있고 각 Score=4(만점)면 4×(10+7+8)=100
--   [주의] 어떤 유형의 평가가 없으면 그 항목은 0 으로 빠져 종합점수가 낮아집니다(원본 동작 유지).
--   [as-of] 특정 시점 기준이 필요하면(원본의 주석) View 로는 파라미터를 못 받습니다.
--           그 경우 아래 서브쿼리에 SendDate <= '...' 를 넣은 별도 쿼리를 쓰세요.
-- -----------------------------------------------------------------------------
IF OBJECT_ID('dbo.vSdmsZoneTotalScore', 'V') IS NOT NULL
    DROP VIEW dbo.vSdmsZoneTotalScore;
GO

CREATE VIEW dbo.vSdmsZoneTotalScore
AS
    SELECT
        A.EquipmentZoneID                                   AS EquipZoneID,
        EqZone.ZoneName                                     AS ZoneName,
        EqZone.SiteID                                       AS SiteID,
        SUM(CASE WHEN A.Type = 3 THEN A.Score * 10
                 WHEN A.Type = 4 THEN A.Score * 7
                 WHEN A.Type = 5 THEN A.Score * 8
                 ELSE 0 END)                                AS TotalScore
    FROM SdmsAssessment A
    INNER JOIN (
        -- 구역·유형별 "최신" 평가 시점
        SELECT EquipmentZoneID, Type, MAX(SendDate) AS SD
        FROM SdmsAssessment
        WHERE Score IS NOT NULL
          AND Type  IS NOT NULL
        GROUP BY EquipmentZoneID, Type
    ) B
        ON  A.EquipmentZoneID = B.EquipmentZoneID
        AND A.Type            = B.Type
        AND A.SendDate        = B.SD
    INNER JOIN SdmsSpatialEquipmentZone EqZone
        ON A.EquipmentZoneID = EqZone.ID
    GROUP BY A.EquipmentZoneID, EqZone.ZoneName, EqZone.SiteID;
GO

-- -----------------------------------------------------------------------------
-- View 2) vSdmsSiteAvgScore : 사이트별 평균점수 (구역 종합점수의 평균)
-- -----------------------------------------------------------------------------
IF OBJECT_ID('dbo.vSdmsSiteAvgScore', 'V') IS NOT NULL
    DROP VIEW dbo.vSdmsSiteAvgScore;
GO

CREATE VIEW dbo.vSdmsSiteAvgScore
AS
    SELECT
        SiteID,
        COUNT(*)          AS ZoneCount,     -- 평균에 포함된 구역 수
        AVG(TotalScore)   AS AvgScore       -- 구역 종합점수의 평균
    FROM dbo.vSdmsZoneTotalScore
    GROUP BY SiteID;
GO

-- =============================================================================
-- 사용 예)
--   -- 특정 사이트(34)의 구역별 종합점수
--   SELECT * FROM dbo.vSdmsZoneTotalScore WHERE SiteID = 34 ORDER BY ZoneName;
--
--   -- 특정 사이트의 평균점수
--   SELECT * FROM dbo.vSdmsSiteAvgScore WHERE SiteID = 34;
--
--   -- 전체 사이트 평균점수 한눈에
--   SELECT * FROM dbo.vSdmsSiteAvgScore ORDER BY SiteID;
-- =============================================================================
