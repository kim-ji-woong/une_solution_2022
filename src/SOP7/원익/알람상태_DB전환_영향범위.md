# SOPWebServer 알람 상태 DB 전환 — 영향범위

작성일 2026-08-05 / 대상 `C:\UnESolution2022\src\SOP7\SOPWebServer2`

## 배경

알람 판정에 쓰이는 값들이 프로세스 메모리(static 싱글톤)에만 존재해서, 장시간 구동 중
DB와 어긋나면 신규 알람 신호가 "이미 알람 발생중"으로 잘못 판정되어 **이력도 로그도 없이
사라지는** 문제가 있었다. SOP8처럼 DB를 기준으로 삼도록 바꾼다.

메모리에 있던 값은 이미 전부 DB에도 저장되고 있었으므로 **스키마 변경은 없다.**

| 메모리 | DB 원본 |
|---|---|
| `SensorZoneGroup.m_dicSensorDatas` (탐지중 SensorZone) | `SdmsSensorZone.Data` / `IsAlarmStatus` |
| `SensorZoneGroup.m_alarm` (CurrentAlarm) | `SdmsAlarmCurrent` |
| `AlarmManager.m_dicSensorZoneHistoryIDAlarms` (CurrentAlarms) | `SdmsAlarmCurrent` ⨝ `SdmsHistorySensorZone` |

## 설계 방침

호출부 370곳(`CurrentAlarm`), 159곳(`GetSensors()`)을 고치지 않는다.
**모든 센서 서버가 `SensorManager.GetSensorZoneGroup(int)` 한 곳으로 그룹을 얻으므로**,
그 지점에서 DB 기준으로 되맞춘 그룹을 돌려준다. 요청 처리 도중의 객체 변경 의미(intra-request)는
기존 그대로 유지된다.

```
신호 수신
  → GetSensorZoneGroup(sensorZoneID)
      → ReloadGroupFromDB()
          ① group.ReloadSensorDatas()   : SdmsSensorZone 조회 → m_dicSensorDatas 재구성
          ② AlarmManager.FindAlarm()    : SdmsAlarmCurrent 조회 → CurrentAlarm 재구성 + 캐시 동기화
  → 기존 알람 판정 로직 (수정 없음)
```

## 수정된 파일 (4개)

### 1. `SOPWebServer.BLL/Models/SensorZoneGroup.cs`

| 추가 | 내용 |
|---|---|
| `m_dicMembers` | 그룹에 속한 **전체** SensorZone (설정). 기존 `m_dicSensorDatas`는 "알람 발생한" 것만 담아서 조회 대상 목록으로 쓸 수 없었다 |
| `AddMember(SensorZone)` | 멤버 등록 |
| `Members` / `GetMemberIDs()` | 멤버 조회 |
| `ReloadSensorDatas(IDataManager)` | `SdmsSensorZone`에서 멤버들의 `Data`/`IsAlarmStatus`를 읽어 `m_dicSensorDatas` 재구성 |

`ReloadSensorDatas`는 **조회 실패 시 기존 메모리를 유지한다.** DB 일시 장애로 진행중인
알람 상태를 잃지 않기 위함이다.

기존 `GetSensors()` / `SetSensorData()` / `RemoveSensorData()`는 **시그니처·동작 모두 그대로**다.

### 2. `SOPWebServer.BLL/SensorManager.cs`

| 위치 | 변경 |
|---|---|
| `GetSensorZoneGroup(int)` | 반환 전 `ReloadGroupFromDB(group)` 호출 — **전 센서 공통 적용 지점** |
| `ReloadGroupFromDB()` (신규) | ①탐지중 목록 ②CurrentAlarm 을 DB에서 재구성 |
| `LoadSensorZones()` | 그룹 구성 시 `group.AddMember(sensorZone)` 추가 |
| `AddSensorZone()` | 동일 |

### 3. `SOPWebServer.BLL/Process/AlarmManager.cs`

| 위치 | 변경 |
|---|---|
| `FindAlarm(ICollection<int>, ...)` (신규) | 여러 SensorZone 중 하나라도 물고 있는 미해제 알람을 **DB 1회 조회**로 찾는다. 기존 `FindAlarm(int, ...)`을 멤버 수만큼 호출하면 조회가 반복되므로 별도 구현 |
| 위 메서드 내 캐시 동기화 | `SdmsAlarmCurrent`에 없는 항목을 `m_dicSensorZoneHistoryIDAlarms`에서 제거. **이 캐시는 `CurrentAlarms` 프로퍼티로 `CheckAlarmDuplication`에서 그대로 쓰이므로**, 남겨두면 이미 해제된 알람 때문에 신규 알람이 "중복"으로 판정되어 사라진다 |
| 생성자 | `ReadSensorHistory()`를 try/catch로 감쌈. 이제 신호마다 DB를 다시 읽으므로 기동 복원이 실패해도 알람 처리에 지장이 없다. 반면 여기서 예외가 나면 `MainManager` 생성이 통째로 실패해 **첫 요청이 500으로 죽는다** |

### 4. `SOPWebServer.BLL/Server/FireSensor.cs`

알람 생성 3단계를 하나의 트랜잭션으로 묶었다.

```csharp
SDMS.IDAL.IDataManager txDataManager = m_mainManager.SDMSDataManager.Clone();
bool bInTransaction = txDataManager.BeginBatch();

group.SetSensorData(...,  txDataManager);                    // ① SdmsSensorZone UPDATE
alarm = AlarmManager.AddAlarm(..., txDataManager, ...);      // ② SdmsHistorySensorZone INSERT
...
if (AddReactionHistory(..., txDataManager))                  // ③ SdmsHistorySensorReaction INSERT
    txDataManager.BatchCommit();
else
    txDataManager.BatchRollback();
```

- **`Clone()` 필수** — 공용 `SDMSDataManager`에 `BeginBatch`를 걸면 동시에 처리중인 다른 신호까지 한 트랜잭션에 묶인다
- `BeginBatch` 실패 시 기존 방식(단일 연결)으로 진행 — 알람을 놓치지 않기 위한 폴백
- `CheckAlarmDuplication` 병합 시에도 롤백

## 확인된 동작 (로컬 실측)

운영 DB 덤프를 적재한 로컬 환경에서 검증.

| 단계 | 조작 | 결과 |
|---|---|---|
| 1 | 화재 신호 (SensorZone 1159) | 알람 생성 (이력 100868, `SdmsAlarmCurrent` 1건) |
| 2 | 같은 신호 반복 | 흡수, 로그 `AddAlarm 무시(이미 알람 발생중...)` |
| 3 | **서버 재시작 없이 DB만 삭제** | 메모리-DB 불일치 강제 |
| 4 | 같은 신호 재전송 | **신규 알람 생성 (이력 100869)** ← 수정 전에는 무시되던 상황 |

## 미적용 / 후속 과제

### 트랜잭션 — `FireSensor`만 적용

나머지 25개 센서(`PSMSensor`, `SecuritySensor` 등)의 `AddAlarm`은 아직 트랜잭션이 없다.
**DB 조회 전환(①②③)은 전 센서에 이미 적용**되어 있으므로, 트랜잭션은 필요에 따라 순차 확대하면 된다.

### 알람 해제 경로

`RemoveAlarm` / `ProcessAllClear`도 다단계 DB 작업이지만 트랜잭션 미적용이다.

### `SdmsAlarmCurrent` INSERT 시점

`AddAlarm`은 이력만 넣고, `SdmsAlarmCurrent`는 그 뒤 `ProcessManager.NewAlarm()`에서 넣는다.
그 사이에 예외가 나면 **이력은 있는데 현재알람이 없는** 상태가 된다.
이 경우 다음 신호에서 CurrentAlarm이 null로 읽혀 신규 알람이 정상 생성되므로 신호 유실은 없지만,
근본적으로는 `AddAlarm` 트랜잭션 안으로 옮기는 것이 맞다.

### 성능 — 인덱스 권장

신호 1건마다 조회 2건이 추가된다.

```sql
CREATE INDEX IX_SdmsSensorZone_EquipZone_SensorType
    ON SdmsSensorZone (EquipZoneID, SensorType);

CREATE INDEX IX_SdmsHistorySensorReaction_SZHist_Type
    ON SdmsHistorySensorReaction (SensorZoneHistoryID, ReactionType);
```

`SdmsHistorySensorReaction`(376,908행)에는 현재 `ID` 클러스터드 PK **하나뿐**이라
`SensorZoneHistoryID` 조회가 매번 풀스캔이다.

### 별건 — 기동 쿼리 버그

`SDMS.DAL/SelectManager.cs`의 `SelectCurrentAlarmHistories()`에서
`strAlarmOffSubQuery`에 대입해야 할 것을 `strAlarmOnSubQuery`에 덮어쓴다.
"발생 이력이 있는 것" 조건이 사라져 **한 번도 닫히지 않은 모든 과거 이력**을 5개 테이블 조인으로
끌어온다. 기동 비용을 불필요하게 키운다. 이번 변경 범위 밖이라 수정하지 않았다.

## 롤백 방법

4개 파일 모두 기존 메서드 시그니처를 바꾸지 않았다.
`SensorManager.GetSensorZoneGroup(int)`에서 `ReloadGroupFromDB(group)` 호출 한 줄만 제거하면
DB 조회 전환 전 동작으로 즉시 되돌아간다. (추가된 메서드는 호출되지 않을 뿐 무해)
