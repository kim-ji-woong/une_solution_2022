-- =============================================================================
-- View : vSdmsMonthlyZoneAssessment
-- 용도 : 월별 안전구역 평가 결과 (구역 · 평가유형별, 해당 월의 "마지막" 평가 점수 + 수신자)
-- 원본 : SdmsAssessment            (발송·채점된 평가 1건 = 1행)
--        SdmsSpatialEquipmentZone  (구역 정보 · 이름)
--        SdmsAssessmentAMember     (평가 ↔ 수신자 매핑, MemberID)
--        SopTeamRegularMember      (수신자 이름) ※ TeamEditor DB - 아래 [수신자 DB] 주석 참고
--
-- 월 값 정의 (화면 그래프 로직과 동일 - AssessmentManager.LoadZoneAssessmentHistories)
--   같은 (구역, 유형, 연, 월) 안에서 가장 최근(MAX SendDate) 평가의 Score 를 그 달 값으로 사용.
--   Score 는 0~4 원점수(평균)이며, 화면 표시값은 Score * 25 (0~100).
--
-- 평가유형(Type) : 1=존, 2=안전환경, 3=현업, 4=안전/보건, 5=방재/환경 (과거 데이터는 NULL 가능)
--
-- 수신자 : 그 달 대표 평가(AssessmentID)의 수신자. 여러 명이면 콤마로 연결(월별 1행 유지).
--
-- ─────────────────────────────────────────────────────────────────────────────
-- [수신자 DB] SopTeamRegularMember 가 SdmsAssessment 와 "다른 DB" 에 있으면
--   아래 3곳의  SopTeamRegularMember  를  [TeamDB].dbo.SopTeamRegularMember  형태로 바꾸세요.
--   (같은 DB 면 지금 그대로 실행하면 됩니다.)
--
-- [SQL Server 버전] 수신자 연결은 FOR XML PATH 방식이라 SQL Server 2016 이하에서도 동작.
--   (SQL Server 2017+ 라면 STUFF/FOR XML 대신 STRING_AGG(MemberName, ', ') 로 더 간단히 쓸 수 있음)
-- ─────────────────────────────────────────────────────────────────────────────
-- =============================================================================

IF OBJECT_ID('dbo.vSdmsMonthlyZoneAssessment', 'V') IS NOT NULL
    DROP VIEW dbo.vSdmsMonthlyZoneAssessment;
GO

CREATE VIEW dbo.vSdmsMonthlyZoneAssessment
AS
    WITH ranked AS (
        SELECT
            a.ID,
            a.EquipmentZoneID,
            a.SendDate,
            a.Score,
            a.Type,
            YEAR(a.SendDate)  AS AssessYear,
            MONTH(a.SendDate) AS AssessMonth,
            ROW_NUMBER() OVER (
                -- PARTITION BY 는 NULL 을 하나의 그룹으로 취급하므로 Type=NULL 도 포함된다.
                PARTITION BY a.EquipmentZoneID, a.Type, YEAR(a.SendDate), MONTH(a.SendDate)
                ORDER BY a.SendDate DESC, a.ID DESC
            ) AS rn
        FROM SdmsAssessment a
        WHERE a.Score IS NOT NULL          -- 채점된(결과가 들어온) 평가만
    )
    SELECT
        ez.ID                                             AS EquipZoneID,
        ISNULL(NULLIF(ez.DisplayText, ''), ez.ZoneName)   AS ZoneName,
        ez.SiteID                                         AS SiteID,
        r.AssessYear                                      AS AssessYear,
        r.AssessMonth                                     AS AssessMonth,
        r.Type                                            AS AssessType,
        CASE r.Type
            WHEN 1 THEN N'존'
            WHEN 2 THEN N'안전환경'
            WHEN 3 THEN N'현업'
            WHEN 4 THEN N'안전/보건'
            WHEN 5 THEN N'방재/환경'
            ELSE N'(미지정)'
        END                                               AS AssessTypeName,
        r.Score                                           AS RawScore,   -- 0~4
        r.Score * 25                                      AS Score100,   -- 0~100 (화면 표시값)
        -- 평가등급: 0~100 점수를 등급 구간에 매핑 (경계는 상위 등급).
        -- 기본 구간 A:80~100, B:60~80, C:40~60, D:20~40, E:0~20.
        -- ※ 사이트별 커스텀 구간(OptionSDMS, PropertyName='AssessmentClass')을 쓰면 아래 임계값을 그에 맞게 조정.
        CASE
            WHEN r.Score * 25 >= 80 THEN N'A'
            WHEN r.Score * 25 >= 60 THEN N'B'
            WHEN r.Score * 25 >= 40 THEN N'C'
            WHEN r.Score * 25 >= 20 THEN N'D'
            ELSE N'E'
        END                                               AS Grade,
        CAST(r.SendDate AS date)                          AS LastSendDate,  -- 날짜만(시간 제거)
        r.ID                                              AS AssessmentID,

        -- ── 수신자(그 달 대표 평가의 수신자) ─────────────────────────────
        -- 수신자 이름(여러 명이면 콤마 연결). FOR XML PATH 방식(SQL Server 2016 이하 호환).
        -- .value('.', ...) 로 &, <, > 같은 특수문자도 안전하게 복원됨.
        STUFF((
            SELECT N', ' + rm.MemberName
              FROM SdmsAssessmentAMember m
              INNER JOIN SopTeamRegularMember rm ON rm.ID = m.MemberID
             WHERE m.AssessmentID = r.ID
             ORDER BY rm.MemberName
             FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 2, N'')   AS Receivers,
        -- 수신자 MemberID(콤마 연결)
        STUFF((
            SELECT ',' + CONVERT(varchar(20), m.MemberID)
              FROM SdmsAssessmentAMember m
             WHERE m.AssessmentID = r.ID
             ORDER BY m.MemberID
             FOR XML PATH(''), TYPE).value('.', 'varchar(max)'), 1, 1, '')     AS ReceiverMemberIDs,
        -- 수신자 수
        (SELECT COUNT(*)
           FROM SdmsAssessmentAMember m
          WHERE m.AssessmentID = r.ID)                    AS ReceiverCount

    FROM ranked r
    INNER JOIN SdmsSpatialEquipmentZone ez
        ON r.EquipmentZoneID = ez.ID
    WHERE r.rn = 1;
GO

-- =============================================================================
-- 사용 예)
--   SELECT EquipZoneID, ZoneName, AssessTypeName, Score100, Grade, Receivers, LastSendDate
--   FROM dbo.vSdmsMonthlyZoneAssessment
--   WHERE AssessYear = 2026 AND AssessMonth = 7
--   ORDER BY EquipZoneID, AssessType;
-- =============================================================================

-- =============================================================================
-- [진단] View 가 여전히 비어 있으면:
--   SELECT COUNT(*) FROM SdmsAssessment WHERE Score IS NOT NULL;                 -- 채점된 평가 有無
--   SELECT COUNT(*) FROM SdmsAssessmentAMember;                                  -- 수신자 매핑 有無
--   SELECT TOP 5 * FROM SopTeamRegularMember;                                    -- 수신자 테이블 접근 가능 여부
-- =============================================================================
