import { db } from '../../../shared/db/client';
import { ComponentCode, MeasurementUnit, TestItemCode } from '../../../shared/api/types';

export type PapsRecord = {
  testItemCode: TestItemCode;
  componentCode: ComponentCode;
  testItemName: string;
  value: number;
  unit: MeasurementUnit;
  grade: number;
  standardVersionCode: string | null;
  measuredAt: string;
};

type PapsRecordRow = {
  test_item_code: TestItemCode;
  component_code: ComponentCode;
  test_item_name: string;
  value: number;
  unit: MeasurementUnit;
  grade: number;
  standard_version_code: string | null;
  measured_at: string;
};

export function insertPapsRecord(record: PapsRecord): void {
  db.runSync(
    `INSERT INTO paps_records
       (test_item_code, component_code, test_item_name, value, unit, grade, standard_version_code, measured_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.testItemCode,
      record.componentCode,
      record.testItemName,
      record.value,
      record.unit,
      record.grade,
      record.standardVersionCode,
      record.measuredAt,
      new Date().toISOString(),
    ]
  );
}

// Latest record per test item, most recent measurement wins.
export function getLatestPapsRecords(): PapsRecord[] {
  const rows = db.getAllSync<PapsRecordRow>(
    `SELECT test_item_code, component_code, test_item_name, value, unit, grade, standard_version_code, measured_at
     FROM paps_records p
     WHERE created_at = (
       SELECT MAX(created_at) FROM paps_records WHERE test_item_code = p.test_item_code
     )
     ORDER BY created_at DESC`
  );
  return rows.map((r) => ({
    testItemCode: r.test_item_code,
    componentCode: r.component_code,
    testItemName: r.test_item_name,
    value: r.value,
    unit: r.unit,
    grade: r.grade,
    standardVersionCode: r.standard_version_code,
    measuredAt: r.measured_at,
  }));
}
