import test from "node:test";
import assert from "node:assert/strict";
import {detectLanguage} from "../js/locale.js";

test("detect Spanish and English browser preferences",()=>{
  assert.equal(detectLanguage(["es-ES","en-US"]),"es");
  assert.equal(detectLanguage(["en-GB","es-ES"]),"en");
  assert.equal(detectLanguage(["fr-FR","es-MX"]),"es");
  assert.equal(detectLanguage(["en-US"]),"en");
});

test("Catalan/Galician/Basque are served in Spanish when no earlier English language is chosen",()=>{
  assert.equal(detectLanguage(["ca-ES"]),"es");
  assert.equal(detectLanguage(["gl-ES"]),"es");
  assert.equal(detectLanguage(["eu-ES"]),"es");
  assert.equal(detectLanguage(["en-US","ca-ES"]),"en");
});

test("fallback is English, unknown/empty languages are ignored",()=>{
  assert.equal(detectLanguage(["de-DE","fr-FR"]),"en");
  assert.equal(detectLanguage([]),"en");
  assert.equal(detectLanguage([null,"es-419"]),"es");
});
