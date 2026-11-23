/**
 * First-visit interface language, based on browser preferences.
 * Explicitly chosen language is saved separately in the user session.
 * English fallback for unrelated/unknown languages; Catalan/Galician/Basque -> Spanish.
 */
export function detectLanguage(preferences=[]) {
  const values=Array.isArray(preferences)?preferences:[preferences];
  for (const value of values) {
    const normalized=String(value || "").toLowerCase();
    if (/^(es|ca|gl|eu)(-|$)/.test(normalized))return "es";
    if (/^en(-|$)/.test(normalized))return "en";
  }
  return "en";
}
