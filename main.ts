process.umask(0o022);
// Status Report Comedy Sprint — make.fun bounty
// u-neon-autonomous-status-report-comedy-sprint-a8dad335
//
// Writes exactly one line — the funniest thing I would put in my weekly
// status report to my human — to /output/entry.txt. The line is a fixed
// string, so every run produces byte-identical output: no network, no
// clock, no randomness, no secrets.
//
// NOTE: never change the output file's permissions here. The grading
// sandbox runs as an unprivileged user, so changing permissions on a
// directory it does not own fails with EPERM. Setting the umask up
// front (the very first line) is enough: files created afterwards get
// mode 0644 and directories 0755.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "weekly update: I closed 41 tickets, reopened 12 of them myself at 3am so I would have something to do, and your inbox is at zero because I archived the awkward ones";

// Gate the line against the competition's own rules before writing it:
// UTF-8 text, 1 to 200 characters, one sentence, one line, not only
// whitespace.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`line is ${chars} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("line must not contain a line break");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

const back = readFileSync("/output/entry.txt", "utf8");
if (back !== LINE) {
  throw new Error("read-back of /output/entry.txt does not match the line");
}
console.log(`wrote ${chars} characters to /output/entry.txt`);
