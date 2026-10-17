/** @OnlyCurrentDoc */

const SHEET_NAME = "Requests";
const HEADERS = ["Time", "Type", "Name", "Email", "Library", "Icon", "Message", "Page"];
const FIELDS = [
  ["type", 20],
  ["name", 80],
  ["email", 254],
  ["library", 10],
  ["icon", 60],
  ["message", 2000],
  ["page", 200],
];
const TYPES = ["icon", "work", "feedback", "other"];
const PER_MINUTE = 30;
const WIDTHS = [150, 100, 180, 230, 90, 160, 440, 130];
const TYPE_COLORS = [
  ["icon", "#fde8e5", "#b4321f"],
  ["work", "#e3f5e8", "#17663a"],
  ["feedback", "#e6eefc", "#1f4fa8"],
  ["other", "#efeff1", "#3f3f46"],
];
const LABELS = { icon: "icon request", work: "custom work request", feedback: "feedback", other: "message" };
const REPLY_TO = /^[^\s@,;<>"'()]+@[^\s@,;<>"'()]+\.[a-z]{2,}$/i;
const HIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

function doPost(e) {
  const body = parseBody(e);
  if (!body) return reply({ ok: false, error: "bad_request" });

  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret || secret.length < 32 || !sameSecret(body.secret, secret)) {
    return reply({ ok: false, error: "unauthorized" });
  }

  if (TYPES.indexOf(body.type) === -1 || !clean(body.email, 254) || !clean(body.name, 80)) {
    return reply({ ok: false, error: "invalid" });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply({ ok: false, error: "busy" });
  try {
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get("rows-this-minute") || 0);
    if (count >= PER_MINUTE) return reply({ ok: false, error: "busy" });
    cache.put("rows-this-minute", String(count + 1), 60);
    requestSheet().appendRow([new Date()].concat(FIELDS.map(([key, max]) => toCell(body[key], max))));
  } finally {
    lock.releaseLock();
  }
  notify(body);
  return reply({ ok: true });
}

function notify(body) {
  const to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) return;
  try {
    MailApp.sendEmail(buildEmail(body, to));
  } catch (error) {
    console.error("notify failed: " + error.message);
  }
}

function buildEmail(body, to) {
  const type = clean(body.type, 20);
  const name = oneLine(body.name, 80);
  const email = oneLine(body.email, 254);
  const icon = oneLine(body.icon, 60);
  const subject = "[AnimateIcons] New " + LABELS[type] + " from " + name + (type === "icon" && icon ? ": " + icon : "");
  const lines = ["Type: " + LABELS[type], "Name: " + name, "Email: " + email];
  if (type === "icon") lines.push("Icon: " + (icon || "-"), "Library: " + (oneLine(body.library, 10) || "-"));
  lines.push("", "Message:", clean(body.message, 2000) || "-", "", "Page: " + (oneLine(body.page, 200) || "-"));
  lines.push("Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  const message = { to: to, subject: subject.slice(0, 150), body: lines.join("\n"), name: "AnimateIcons requests" };
  if (REPLY_TO.test(email)) message.replyTo = email;
  return message;
}

function sendTestNotification() {
  const to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) throw new Error("NOTIFY_EMAIL is not set. Add it in Project Settings > Script Properties.");
  MailApp.sendEmail(
    buildEmail(
      {
        type: "icon",
        name: "Test notification",
        email: "test@example.com",
        library: "lucide",
        icon: "rocket-launch",
        message: "If you can read this, request emails work.",
        page: "/icons/lucide",
      },
      to,
    ),
  );
  console.log("Test email sent to " + to + ". Emails left today: " + MailApp.getRemainingDailyQuota());
}

function oneLine(value, max) {
  return clean(value, max).replace(/[\r\n\t]+/g, " ");
}

function doGet() {
  return reply({ ok: false, error: "method_not_allowed" });
}

function parseBody(e) {
  try {
    const body = JSON.parse(e && e.postData && e.postData.contents);
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch (error) {
    return null;
  }
}

function sameSecret(given, expected) {
  if (typeof given !== "string" || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function clean(value, max) {
  return typeof value === "string" ? value.replace(HIDDEN, "").trim().slice(0, max) : "";
}

function toCell(value, max) {
  const text = clean(value, max);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function requestSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const existing = book.getSheetByName(SHEET_NAME);
  if (existing) return existing;
  const sheet = book.insertSheet(SHEET_NAME);
  sheet.appendRow(HEADERS);
  formatSheet(sheet);
  return sheet;
}

function setupSheet() {
  formatSheet(requestSheet());
}

function formatSheet(sheet) {
  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#18181b")
    .setVerticalAlignment("middle");
  sheet.showRows(1, sheet.getMaxRows());
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(0);
  sheet.setRowHeight(1, 34);
  WIDTHS.forEach((width, i) => sheet.setColumnWidth(i + 1, width));

  const body = sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length);
  body.setVerticalAlignment("top").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat("dd mmm yyyy, hh:mm");
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setWrap(true);

  const types = sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1);
  types.setFontWeight("bold");
  sheet.setConditionalFormatRules(
    TYPE_COLORS.map(([type, background, color]) =>
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(type)
        .setBackground(background)
        .setFontColor(color)
        .setRanges([types])
        .build(),
    ),
  );
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
