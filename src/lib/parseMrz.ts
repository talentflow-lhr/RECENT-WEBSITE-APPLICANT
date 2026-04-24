/**
 * parseMrz.ts
 *
 * Extracts passport fields from the markdown text returned by docstrange.
 * Handles two strategies:
 *   1. MRZ line detection — finds the two 44-char TD3 lines and decodes them.
 *   2. Labeled-field fallback — scans for "Key: Value" patterns in the markdown.
 *
 * Returns a partial profile object ready to be merged into tempProfile.
 */

export interface ParsedPassportData {
  passportNumber?: string;
  passportPlace?: string;      // issuing country (from MRZ)
  passportIssueDate?: string;  // YYYY-MM-DD  (not in MRZ; extracted from labeled fields only)
  passportExpiryDate?: string; // YYYY-MM-DD
  nationality?: string;
  firstName?: string;
  lastName?: string;
  /** Raw DOB from MRZ as YYYY-MM-DD */
  dob?: string;
  dobDay?: string;
  dobMonth?: string;
  dobYear?: string;
  gender?: string;
}

// ---------------------------------------------------------------------------
// MRZ line detection
// ---------------------------------------------------------------------------

/** A TD3 MRZ line is exactly 44 uppercase alphanumeric / < chars */
const MRZ_LINE_RE = /^[A-Z0-9<]{44}$/;

function findMrzLines(text: string): [string, string] | null {
  const candidates = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => MRZ_LINE_RE.test(l));

  // Need two consecutive (or near-consecutive) lines starting with 'P'
  for (let i = 0; i < candidates.length - 1; i++) {
    const a = candidates[i];
    const b = candidates[i + 1];
    if (a.startsWith('P') && /^[A-Z0-9]/.test(b)) {
      return [a, b];
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// MRZ decoding
// ---------------------------------------------------------------------------

function mrzYYMMDD(raw: string): string {
  // raw = YYMMDD → YYYY-MM-DD
  // Heuristic: year < 60 → 2000s, else → 1900s
  const yy = parseInt(raw.slice(0, 2), 10);
  const mm = raw.slice(2, 4);
  const dd = raw.slice(4, 6);
  const yyyy = yy < 60 ? 2000 + yy : 1900 + yy;
  return `${yyyy}-${mm}-${dd}`;
}

function stripFiller(s: string): string {
  return s.replace(/</g, ' ').trim();
}

function decodeMrz(line1: string, line2: string): ParsedPassportData {
  // ── Line 1 ──────────────────────────────────────────────────
  // 0      : 'P'
  // 1      : subtype
  // 2–4    : issuing state (3 chars)
  // 5–43   : names  (SURNAME<<GIVENNAMES)
  const issuingState = line1.slice(2, 5).replace(/</g, '');
  const namePart = line1.slice(5); // 39 chars
  const [surnamePart, givenPart = ''] = namePart.split('<<');
  const lastName  = stripFiller(surnamePart);
  const firstName = stripFiller(givenPart.replace(/<+/g, ' '));

  // ── Line 2 ──────────────────────────────────────────────────
  // 0–8    : document number (9 chars)
  // 9      : check digit
  // 10–12  : nationality
  // 13–18  : DOB YYMMDD
  // 19     : check digit
  // 20     : sex
  // 21–26  : expiry YYMMDD
  // 27     : check digit
  const rawPassportNum = line2.slice(0, 9).replace(/</g, '');
  const nationality    = line2.slice(10, 13).replace(/</g, '');
  const rawDob         = line2.slice(13, 19);
  const sexChar        = line2[20];
  const rawExpiry      = line2.slice(21, 27);

  const dob    = mrzYYMMDD(rawDob);
  const expiry = mrzYYMMDD(rawExpiry);
  const [yyyy, mm, dd] = dob.split('-');

  const genderMap: Record<string, string> = { M: 'male', F: 'female', X: 'other' };

  return {
    passportNumber:    rawPassportNum,
    passportPlace:     issuingState,
    passportExpiryDate: expiry,
    nationality,
    firstName,
    lastName,
    dob,
    dobDay:   dd,
    dobMonth: mm,
    dobYear:  yyyy,
    gender: genderMap[sexChar] ?? '',
  };
}

// ---------------------------------------------------------------------------
// Labeled-field fallback
// ---------------------------------------------------------------------------

type FieldMap = Record<string, string>;

function extractLabeledFields(text: string): FieldMap {
  const result: FieldMap = {};
  // Match "Label: value" or "Label : value", case-insensitive key
  const re = /^[\s*_-]*([A-Za-z ]+?)\s*[:：]\s*(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    result[key] = val;
  }
  return result;
}

/** Convert various date strings to YYYY-MM-DD */
function normalizeDate(raw: string): string {
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // DD/MM/YYYY or MM/DD/YYYY — assume DD/MM/YYYY for passports
  const slash = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slash) return `${slash[3]}-${slash[2].padStart(2, '0')}-${slash[1].padStart(2, '0')}`;
  // Month name: "15 January 2020"
  const named = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (named) {
    const months: Record<string, string> = {
      january:'01', february:'02', march:'03', april:'04',
      may:'05', june:'06', july:'07', august:'08',
      september:'09', october:'10', november:'11', december:'12',
      jan:'01', feb:'02', mar:'03', apr:'04',
      jun:'06', jul:'07', aug:'08',
      sep:'09', oct:'10', nov:'11', dec:'12',
    };
    const mon = months[named[2].toLowerCase()];
    if (mon) return `${named[3]}-${mon}-${named[1].padStart(2, '0')}`;
  }
  return raw; // return as-is if we can't parse
}

function extractFromLabels(fields: FieldMap): ParsedPassportData {
  const get = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const v = Object.entries(fields).find(([fk]) => fk.includes(k))?.[1];
      if (v) return v;
    }
    return undefined;
  };

  const result: ParsedPassportData = {};

  const pn = get('passport number', 'document number', 'doc number');
  if (pn) result.passportNumber = pn.replace(/\s/g, '');

  const place = get('place of issue', 'issuing authority', 'issuing state', 'issued at', 'country');
  if (place) result.passportPlace = place;

  const expiry = get('expiry', 'expiration', 'date of expiry', 'valid until');
  if (expiry) result.passportExpiryDate = normalizeDate(expiry);

  const issue = get('issue date', 'date of issue', 'issued on', 'issued date');
  if (issue) result.passportIssueDate = normalizeDate(issue);

  const nat = get('nationality', 'citizenship');
  if (nat) result.nationality = nat;

  const surname = get('surname', 'last name', 'family name');
  if (surname) result.lastName = surname;

  const given = get('given name', 'first name', 'forename', 'given names');
  if (given) result.firstName = given;

  const dob = get('date of birth', 'birth date', 'dob', 'born');
  if (dob) {
    const iso = normalizeDate(dob);
    result.dob = iso;
    const [y, mo, d] = iso.split('-');
    result.dobYear  = y;
    result.dobMonth = mo;
    result.dobDay   = d;
  }

  const sex = get('sex', 'gender');
  if (sex) {
    const s = sex.toLowerCase();
    result.gender = s.startsWith('m') ? 'male' : s.startsWith('f') ? 'female' : 'other';
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Main entry point.
 * Pass in the raw markdown string from docstrange and get back
 * a ParsedPassportData object with whichever fields were found.
 */
export function parsePassportMarkdown(markdown: string): ParsedPassportData {
  // Strategy 1: MRZ lines
  const mrzLines = findMrzLines(markdown);
  if (mrzLines) {
    const fromMrz = decodeMrz(mrzLines[0], mrzLines[1]);
    // Also run label extraction to pick up issue date (not in MRZ)
    const labels  = extractFromLabels(extractLabeledFields(markdown));
    return { ...fromMrz, passportIssueDate: labels.passportIssueDate };
  }

  // Strategy 2: Labeled fields only
  const fields = extractLabeledFields(markdown);
  return extractFromLabels(fields);
}