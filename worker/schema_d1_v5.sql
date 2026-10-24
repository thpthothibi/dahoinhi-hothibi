-- SCHEMA D1 ĐỘC LẬP CHO HTB ĐA HỘI NGHỊ V5.0
CREATE TABLE IF NOT EXISTS conferences (
  conf_key TEXT PRIMARY KEY,
  badge TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  ballot_title TEXT NOT NULL,
  max_pick INTEGER NOT NULL DEFAULT 5,
  ballot_locked INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS delegates (
  id TEXT PRIMARY KEY,
  conf_key TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  present INTEGER NOT NULL DEFAULT 0,
  checkin_time TEXT DEFAULT '--:--',
  device_fingerprint TEXT DEFAULT '',
  voted INTEGER NOT NULL DEFAULT 0,
  ballot_hash TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS drive_documents (
  id TEXT PRIMARY KEY,
  conf_key TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'PDF',
  title TEXT NOT NULL,
  drive_url TEXT NOT NULL,
  summary TEXT DEFAULT '',
  body TEXT DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ballots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conf_key TEXT NOT NULL,
  delegate_code TEXT NOT NULL,
  candidate_ids_json TEXT NOT NULL,
  receipt_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS motion_votes (
  id TEXT PRIMARY KEY,
  conf_key TEXT NOT NULL,
  motion_id TEXT NOT NULL,
  delegate_code TEXT NOT NULL,
  choice TEXT NOT NULL,
  note TEXT DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS speeches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conf_key TEXT NOT NULL,
  delegate_code TEXT NOT NULL,
  delegate_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);
