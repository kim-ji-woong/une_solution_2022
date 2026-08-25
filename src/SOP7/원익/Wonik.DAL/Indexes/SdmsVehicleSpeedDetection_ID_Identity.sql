-- =============================================================================
-- SdmsVehicleSpeedDetection.ID 를 IDENTITY 로 전환
--
--   대상 DB : 원익 사이트 DB (예: WSOP_30)   ※ appsettings.json 의 Site:DBName
--   DB 종류 : SQL Server
--
--   [배경]
--   기존에는 Wonik.DAL.CreateManager 가 채번을 직접 했다.
--       Insert into ... values (IsNull((SELECT MAX(ID) FROM ...), 0) + 1, ...)
--   DFS1 / DFS2 두 센서 스레드가 거의 동시에 감지하면 같은 MAX(ID)+1 을 읽어
--   뒤에 실행된 쪽이 PK 위반으로 죽고, 그 과속 기록이 통째로 유실됐다.
--       예) 2026-08-25 07:10:36 중복 키 (65072), 07:22:17 (65098), 08:44:22 (65236)
--   ID 를 IDENTITY 로 바꿔 채번을 DB 에 맡기면 이 경쟁 상태가 사라진다.
--
--   [주의]
--   * SQL Server 는 기존 컬럼을 ALTER 로 IDENTITY 로 바꿀 수 없다.
--     새 테이블을 만들어 옮겨 담고 이름을 바꾸는 방식이다.
--   * 반드시 WonikBeaconServer 를 내린 뒤 실행할 것.
--     실행 중 들어오는 INSERT 는 실패하고 그 과속 기록은 유실된다.
--     (데이터량 6.5만 행 기준 수 초 내에 끝난다)
--   * 기존 ID 값은 그대로 보존한다. (IDENTITY_INSERT 사용)
--   * 전체가 하나의 트랜잭션이다. 중간에 실패하면 원래 상태로 되돌아간다.
--   * 재실행해도 안전하다. 이미 IDENTITY 면 아무것도 하지 않는다.
--
--   [코드 변경과 함께 적용할 것]
--   Wonik.DAL\CreateManager.cs 가 ID 를 직접 넣지 않도록 수정되어 있어야 한다.
--   스크립트만 실행하고 옛 코드를 그대로 두면 IDENTITY 컬럼에 명시적으로 값을 넣으려다
--   "IDENTITY_INSERT 가 OFF" 오류로 INSERT 가 전부 실패한다.
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

IF COLUMNPROPERTY(OBJECT_ID('dbo.SdmsVehicleSpeedDetection'), 'ID', 'IsIdentity') = 1
BEGIN
    PRINT 'ID 가 이미 IDENTITY 입니다. 건너뜁니다.';
    SET NOEXEC ON;
END
GO

-- 다른 테이블이 이 테이블을 참조하고 있으면 DROP 이 막힌다. 먼저 확인하고 중단한다.
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE referenced_object_id = OBJECT_ID('dbo.SdmsVehicleSpeedDetection'))
BEGIN
    RAISERROR('이 테이블을 참조하는 외래키가 있습니다. FK 를 먼저 정리한 뒤 다시 실행하세요.', 16, 1);
    SET NOEXEC ON;
END
GO

-- -----------------------------------------------------------------------------
-- 전환 전 상태 기록 (되돌릴 때 대조용)
-- -----------------------------------------------------------------------------
DECLARE @rowsBefore int, @maxIdBefore int, @minIdBefore int, @carNoBefore int;

SELECT @rowsBefore = COUNT(*), @maxIdBefore = MAX(ID), @minIdBefore = MIN(ID),
       @carNoBefore = SUM(CASE WHEN CarNo IS NOT NULL THEN 1 ELSE 0 END)
FROM dbo.SdmsVehicleSpeedDetection;

PRINT '전환 전 : 행 ' + CAST(ISNULL(@rowsBefore, 0) AS varchar(20))
    + ', ID ' + CAST(ISNULL(@minIdBefore, 0) AS varchar(20)) + ' ~ ' + CAST(ISNULL(@maxIdBefore, 0) AS varchar(20))
    + ', CarNo 채워진 행 ' + CAST(ISNULL(@carNoBefore, 0) AS varchar(20));

-- 기존 비클러스터드 인덱스 존재 여부를 기억해 둔다. 있던 것만 그대로 다시 만든다.
DECLARE @hasIxDetectionTime bit =
    CASE WHEN EXISTS (SELECT 1 FROM sys.indexes
                      WHERE object_id = OBJECT_ID('dbo.SdmsVehicleSpeedDetection')
                        AND name = 'IX_SdmsVehicleSpeedDetection_DetectionTime') THEN 1 ELSE 0 END;
DECLARE @hasIdxDetectionTime bit =
    CASE WHEN EXISTS (SELECT 1 FROM sys.indexes
                      WHERE object_id = OBJECT_ID('dbo.SdmsVehicleSpeedDetection')
                        AND name = 'idx_sdms_detection_time') THEN 1 ELSE 0 END;

BEGIN TRANSACTION;

    -- 1) IDENTITY 를 가진 새 테이블
    CREATE TABLE dbo.SdmsVehicleSpeedDetection_new
    (
        ID            int            IDENTITY(1, 1) NOT NULL,
        DetectionTime datetime       NOT NULL,
        SensorID      int            NOT NULL,
        Speed         int            NOT NULL,
        CarNo         nvarchar(10)   NULL,
        CONSTRAINT PK_SdmsVehicleSpeedDetection PRIMARY KEY CLUSTERED (ID)
    );

    -- 2) 기존 ID 를 그대로 살려 복사
    SET IDENTITY_INSERT dbo.SdmsVehicleSpeedDetection_new ON;

    INSERT INTO dbo.SdmsVehicleSpeedDetection_new (ID, DetectionTime, SensorID, Speed, CarNo)
        SELECT ID, DetectionTime, SensorID, Speed, CarNo
        FROM dbo.SdmsVehicleSpeedDetection;

    SET IDENTITY_INSERT dbo.SdmsVehicleSpeedDetection_new OFF;

    -- 3) 옮겨 담긴 결과 검증. 하나라도 어긋나면 롤백한다.
    DECLARE @rowsAfter int, @maxIdAfter int, @minIdAfter int, @carNoAfter int;

    SELECT @rowsAfter = COUNT(*), @maxIdAfter = MAX(ID), @minIdAfter = MIN(ID),
           @carNoAfter = SUM(CASE WHEN CarNo IS NOT NULL THEN 1 ELSE 0 END)
    FROM dbo.SdmsVehicleSpeedDetection_new;

    IF ISNULL(@rowsAfter, 0)  <> ISNULL(@rowsBefore, 0)
    OR ISNULL(@maxIdAfter, 0) <> ISNULL(@maxIdBefore, 0)
    OR ISNULL(@minIdAfter, 0) <> ISNULL(@minIdBefore, 0)
    OR ISNULL(@carNoAfter, 0) <> ISNULL(@carNoBefore, 0)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('복사 결과가 원본과 다릅니다. 롤백했습니다.', 16, 1);
        SET NOEXEC ON;
    END

    -- 4) 교체
    DROP TABLE dbo.SdmsVehicleSpeedDetection;
    EXEC sp_rename 'dbo.SdmsVehicleSpeedDetection_new', 'SdmsVehicleSpeedDetection';

    -- 5) 있던 인덱스만 그대로 복원
    IF @hasIxDetectionTime = 1
        CREATE NONCLUSTERED INDEX IX_SdmsVehicleSpeedDetection_DetectionTime
            ON dbo.SdmsVehicleSpeedDetection (DetectionTime ASC)
            INCLUDE (SensorID, Speed)
            WITH (FILLFACTOR = 90, SORT_IN_TEMPDB = ON);

    IF @hasIdxDetectionTime = 1
        CREATE NONCLUSTERED INDEX idx_sdms_detection_time
            ON dbo.SdmsVehicleSpeedDetection (DetectionTime ASC);

COMMIT TRANSACTION;
GO

-- -----------------------------------------------------------------------------
-- 다음 채번값을 최대 ID 로 맞춘다. (IDENTITY_INSERT 로 넣으면 보통 자동 반영되지만 명시한다)
-- -----------------------------------------------------------------------------
DECLARE @maxId int = (SELECT ISNULL(MAX(ID), 0) FROM dbo.SdmsVehicleSpeedDetection);
DBCC CHECKIDENT ('dbo.SdmsVehicleSpeedDetection', RESEED, @maxId) WITH NO_INFOMSGS;
PRINT '다음 INSERT 는 ID ' + CAST(@maxId + 1 AS varchar(20)) + ' 부터 채번됩니다.';
GO

-- -----------------------------------------------------------------------------
-- 결과 확인
-- -----------------------------------------------------------------------------
SELECT
    'IsIdentity'  = COLUMNPROPERTY(OBJECT_ID('dbo.SdmsVehicleSpeedDetection'), 'ID', 'IsIdentity'),
    'RowCount'    = (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection),
    'MinID'       = (SELECT MIN(ID) FROM dbo.SdmsVehicleSpeedDetection),
    'MaxID'       = (SELECT MAX(ID) FROM dbo.SdmsVehicleSpeedDetection),
    'CarNo채움'   = (SELECT COUNT(*) FROM dbo.SdmsVehicleSpeedDetection WHERE CarNo IS NOT NULL);

SELECT i.name AS IndexName, i.type_desc, i.is_primary_key
FROM sys.indexes i
WHERE i.object_id = OBJECT_ID('dbo.SdmsVehicleSpeedDetection') AND i.type > 0;
GO

SET NOEXEC OFF;
GO


-- =============================================================================
-- 참고) 되돌리기
--   IDENTITY 를 떼려면 같은 방식으로 IDENTITY 없는 테이블을 만들어 옮겨 담으면 된다.
--   되돌릴 경우 Wonik.DAL\CreateManager.cs 도 함께 되돌려야 한다.
-- =============================================================================
/*
BEGIN TRANSACTION;
    CREATE TABLE dbo.SdmsVehicleSpeedDetection_old
    (
        ID            int          NOT NULL,
        DetectionTime datetime     NOT NULL,
        SensorID      int          NOT NULL,
        Speed         int          NOT NULL,
        CarNo         nvarchar(10) NULL,
        CONSTRAINT PK_SdmsVehicleSpeedDetection_old PRIMARY KEY CLUSTERED (ID)
    );
    INSERT INTO dbo.SdmsVehicleSpeedDetection_old (ID, DetectionTime, SensorID, Speed, CarNo)
        SELECT ID, DetectionTime, SensorID, Speed, CarNo FROM dbo.SdmsVehicleSpeedDetection;
    DROP TABLE dbo.SdmsVehicleSpeedDetection;
    EXEC sp_rename 'dbo.SdmsVehicleSpeedDetection_old', 'SdmsVehicleSpeedDetection';
    EXEC sp_rename 'PK_SdmsVehicleSpeedDetection_old', 'PK_SdmsVehicleSpeedDetection';
    CREATE NONCLUSTERED INDEX IX_SdmsVehicleSpeedDetection_DetectionTime
        ON dbo.SdmsVehicleSpeedDetection (DetectionTime ASC) INCLUDE (SensorID, Speed);
COMMIT TRANSACTION;
*/
