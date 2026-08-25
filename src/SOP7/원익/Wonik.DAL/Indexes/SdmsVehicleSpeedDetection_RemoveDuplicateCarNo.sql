-- =============================================================================
-- SdmsVehicleSpeedDetection 중복 행 정리 (같은 차량번호 + 같은 시각)
--
--   대상 DB : 원익 사이트 DB (예: WSOP_30)
--   DB 종류 : SQL Server
--
--   [배경]
--   DetectionProvider 는 추적 상태(m_lastDistance)를 하나만 들고 있어서, 레이더가 두 대를
--   번갈아 보고하면 같은 차량을 "새 차량"으로 두 번 인식해 두 건을 INSERT 한다.
--   LPR 연동으로 CarNo 가 채워지면서 이 중복이 눈에 보이게 됐다.
--       예) ID 65152 / 65153 : 2026-08-25 07:40:02, 19000, 36km/h, 290*2530  (완전 동일)
--
--   [삭제 기준]
--   같은 CarNo + 같은 DetectionTime 이면 한 대의 차량으로 보고 ID 가 가장 작은 행만 남긴다.
--   CarNo 가 NULL 인 행은 건드리지 않는다. (차량 식별이 안 되므로 중복 판정 불가)
--
--   [주의]
--   * 삭제는 되돌릴 수 없다. 3번 단계에서 백업 테이블을 만든 뒤 지운다.
--   * 서비스를 내리지 않아도 되지만, 정리 중 들어오는 신규 행은 대상에서 빠질 수 있다.
--   * 재실행해도 안전하다. 남은 중복이 없으면 0건 삭제로 끝난다.
--
--   [함께 적용할 코드]
--   CarNoUpdater 가 CarNo/DiffSeconds 를 채울 때 같은 키의 행이 이미 있으면 그 행을 지우도록
--   수정되어 있다. 그래서 이 스크립트는 과거 데이터 정리용으로 한 번만 돌리면 된다.
-- =============================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID('dbo.SdmsVehicleSpeedDetection', 'U') IS NULL
BEGIN
    RAISERROR('dbo.SdmsVehicleSpeedDetection 테이블이 없습니다. 접속한 DB가 맞는지 확인하세요.', 16, 1);
    SET NOEXEC ON;
END
GO

-- -----------------------------------------------------------------------------
-- 1) 삭제 대상 미리보기
-- -----------------------------------------------------------------------------
;WITH dup AS
(
    SELECT ID, CarNo, DetectionTime, SensorID, Speed, DiffSeconds,
           ROW_NUMBER() OVER (PARTITION BY CarNo, DetectionTime ORDER BY ID) AS rn,
           COUNT(*)    OVER (PARTITION BY CarNo, DetectionTime)              AS grp
    FROM dbo.SdmsVehicleSpeedDetection
    WHERE CarNo IS NOT NULL
)
SELECT
    '삭제대상' AS 구분, COUNT(*) AS 행수,
    (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection WHERE CarNo IS NOT NULL) AS CarNo있는행,
    (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection)                          AS 전체행
FROM dup WHERE rn > 1;

-- 같은 그룹인데 Speed 가 서로 다른 경우는 눈으로 확인해 두는 편이 좋다.
-- (ID 가 가장 작은 행만 남으므로, 나중에 측정된 더 높은 속도가 버려질 수 있다)
;WITH dup AS
(
    SELECT ID, CarNo, DetectionTime, SensorID, Speed,
           ROW_NUMBER() OVER (PARTITION BY CarNo, DetectionTime ORDER BY ID) AS rn
    FROM dbo.SdmsVehicleSpeedDetection
    WHERE CarNo IS NOT NULL
)
SELECT '속도불일치' AS 구분, d.ID, CONVERT(varchar(19), d.DetectionTime, 120) AS 감지시각,
       d.SensorID, d.Speed, d.CarNo, CASE WHEN d.rn = 1 THEN '유지' ELSE '삭제' END AS 처리
FROM dup d
JOIN (
    SELECT CarNo, DetectionTime
    FROM dbo.SdmsVehicleSpeedDetection
    WHERE CarNo IS NOT NULL
    GROUP BY CarNo, DetectionTime
    HAVING COUNT(*) > 1 AND COUNT(DISTINCT Speed) > 1
) m ON m.CarNo = d.CarNo AND m.DetectionTime = d.DetectionTime
ORDER BY d.DetectionTime, d.ID;
GO

-- -----------------------------------------------------------------------------
-- 2) 삭제 실행 (백업 후 삭제, 하나의 트랜잭션)
-- -----------------------------------------------------------------------------
BEGIN TRANSACTION;

    DECLARE @before int = (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection);

    -- 지울 행을 백업 테이블에 남긴다. 확인 후 직접 DROP 할 것.
    IF OBJECT_ID('dbo.SdmsVehicleSpeedDetection_dupbak', 'U') IS NULL
        CREATE TABLE dbo.SdmsVehicleSpeedDetection_dupbak
        (
            ID            int          NOT NULL PRIMARY KEY,
            DetectionTime datetime     NOT NULL,
            SensorID      int          NOT NULL,
            Speed         int          NOT NULL,
            CarNo         nvarchar(10) NULL,
            DiffSeconds   float        NULL,
            DeletedAt     datetime     NOT NULL DEFAULT(GETDATE())
        );

    ;WITH dup AS
    (
        SELECT ID, DetectionTime, SensorID, Speed, CarNo, DiffSeconds,
               ROW_NUMBER() OVER (PARTITION BY CarNo, DetectionTime ORDER BY ID) AS rn
        FROM dbo.SdmsVehicleSpeedDetection
        WHERE CarNo IS NOT NULL
    )
    INSERT INTO dbo.SdmsVehicleSpeedDetection_dupbak (ID, DetectionTime, SensorID, Speed, CarNo, DiffSeconds)
        SELECT d.ID, d.DetectionTime, d.SensorID, d.Speed, d.CarNo, d.DiffSeconds
        FROM dup d
        WHERE d.rn > 1
          AND NOT EXISTS (SELECT 1 FROM dbo.SdmsVehicleSpeedDetection_dupbak b WHERE b.ID = d.ID);

    ;WITH dup AS
    (
        SELECT ID,
               ROW_NUMBER() OVER (PARTITION BY CarNo, DetectionTime ORDER BY ID) AS rn
        FROM dbo.SdmsVehicleSpeedDetection
        WHERE CarNo IS NOT NULL
    )
    DELETE FROM dbo.SdmsVehicleSpeedDetection
    WHERE ID IN (SELECT ID FROM dup WHERE rn > 1);

    DECLARE @deleted int = @@ROWCOUNT;
    DECLARE @after   int = (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection);

    IF @after <> @before - @deleted
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('행 수가 맞지 않습니다. 롤백했습니다.', 16, 1);
        SET NOEXEC ON;
    END

    PRINT '삭제 ' + CAST(@deleted AS varchar(20)) + ' 건 ('
        + CAST(@before AS varchar(20)) + ' -> ' + CAST(@after AS varchar(20)) + ')';

COMMIT TRANSACTION;
GO

-- -----------------------------------------------------------------------------
-- 3) 결과 확인 - 남은 중복이 0 이어야 한다
-- -----------------------------------------------------------------------------
SELECT '남은 중복' AS 구분, ISNULL(SUM(cnt - 1), 0) AS 행수
FROM (
    SELECT COUNT(*) AS cnt
    FROM dbo.SdmsVehicleSpeedDetection
    WHERE CarNo IS NOT NULL
    GROUP BY CarNo, DetectionTime
    HAVING COUNT(*) > 1
) x;

SELECT '백업된 행' AS 구분, COUNT(*) AS 행수 FROM dbo.SdmsVehicleSpeedDetection_dupbak;
GO

SET NOEXEC OFF;
GO


-- =============================================================================
-- 참고 A) 되돌리기 - 백업 테이블에서 복구
--   ID 가 IDENTITY 이므로 IDENTITY_INSERT 를 켜고 넣어야 한다.
-- =============================================================================
/*
SET IDENTITY_INSERT dbo.SdmsVehicleSpeedDetection ON;
INSERT INTO dbo.SdmsVehicleSpeedDetection (ID, DetectionTime, SensorID, Speed, CarNo, DiffSeconds)
    SELECT ID, DetectionTime, SensorID, Speed, CarNo, DiffSeconds
    FROM dbo.SdmsVehicleSpeedDetection_dupbak b
    WHERE NOT EXISTS (SELECT 1 FROM dbo.SdmsVehicleSpeedDetection v WHERE v.ID = b.ID);
SET IDENTITY_INSERT dbo.SdmsVehicleSpeedDetection OFF;
*/

-- =============================================================================
-- 참고 B) 확인이 끝나면 백업 테이블 제거
-- =============================================================================
/*
DROP TABLE dbo.SdmsVehicleSpeedDetection_dupbak;
*/

-- =============================================================================
-- 참고 C) CarNo 가 NULL 인 중복은 이 스크립트가 건드리지 않는다.
--   같은 시각/센서/속도로 두 건이 들어간 행이 상당수 있으나(차량 식별 불가),
--   두 대가 실제로 나란히 지나간 경우와 구분할 근거가 없어 제외했다.
--   LPR 매칭으로 CarNo 가 채워지면 CarNoUpdater 가 자동으로 정리한다.
--   현황은 아래 쿼리로 확인할 수 있다.
-- =============================================================================
/*
SELECT COUNT(*) - COUNT(DISTINCT CONCAT(SensorID, '|', Speed, '|', CONVERT(varchar(19), DetectionTime, 120)))
FROM dbo.SdmsVehicleSpeedDetection WHERE CarNo IS NULL;
*/
