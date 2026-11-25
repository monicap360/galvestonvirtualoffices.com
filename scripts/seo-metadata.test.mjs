import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const read = (path) => ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
const prop = (object, name) => object?.properties?.find((p) => ts.isPropertyAssignment(p) && p.name.getText().replace(/^["']|["']$/g, "") === name)?.initializer;
function metadata(path) {
  return read(path).statements.filter(ts.isVariableStatement)
    .filter((s) => s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
    .flatMap((s) => [...s.declarationList.declarations])
    .find((d) => d.name.getText() === "metadata")?.initializer;
}
const canonical = (path) => prop(prop(metadata(path), "alternates"), "canonical")?.text;
test("root layout does not point unrelated pages to the homepage", () => {
  assert.equal(canonical("src/app/layout.tsx"), undefined);
});
for (const [file, route] of [["page", "/"], ["mailboxes/page", "/mailboxes"], ["pricing/page", "/pricing"], ["offices/page", "/offices"]]) {
  test(route + " points to itself", () => {
    assert.equal(canonical("src/app/" + file + ".tsx"), route);
  });
}
