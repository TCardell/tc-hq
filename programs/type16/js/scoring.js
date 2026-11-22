/**
 * OEJTS 1.2 exact published scoring key.
 * Source: https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf
 * Original data: CC BY-NC-SA 4.0, Eric Jorgenson.
 */
export const AXES = Object.freeze([
  { id:"IE", low:"I", high:"E", base:30, items:[[3,-1],[7,-1],[11,-1],[15,1],[19,-1],[23,1],[27,1],[31,-1]] },
  { id:"SN", low:"S", high:"N", base:12, items:[[4,1],[8,1],[12,1],[16,1],[20,1],[24,-1],[28,-1],[32,1]] },
  { id:"FT", low:"F", high:"T", base:30, items:[[2,-1],[6,1],[10,1],[14,-1],[18,1],[22,1],[26,1],[30,-1]] },
  { id:"JP", low:"J", high:"P", base:18, items:[[1,1],[5,1],[9,-1],[13,1],[17,-1],[21,1],[25,-1],[29,1]] }
]);
const isValid = value => Number.isInteger(value) && value >= 1 && value <= 5;

export function scoreAll(answers = {}) {
  const axes = AXES.map(axis => {
    const observed = axis.items.filter(([id]) => isValid(answers[id]));
    const count = observed.length;
    const centered = observed.reduce((sum,[id,sign]) => sum + sign * (answers[id]-3),0);
    const raw = count === 8 ? axis.base + axis.items.reduce((sum,[id,sign]) => sum + sign * answers[id],0) : null;
    const position = count ? 50 + 25 * centered / count : null; // 0..100, midpoint 50
    const preferred = !count || centered === 0 ? null : centered > 0 ? axis.high : axis.low;
    return {
      id:axis.id, low:axis.low, high:axis.high, count,
      complete:count===8, centered, raw, position, preferred,
      officialLetter:raw===null ? null : raw>24 ? axis.high : axis.low,
      ambiguous:count>0 && centered===0
    };
  });
  const complete = axes.every(axis => axis.complete);
  const provisional = axes.map(axis => axis.preferred || "?").join("");
  const officialType = complete ? axes.map(axis=>axis.officialLetter).join("") : null;
  return {
    axes, complete, officialType, provisional,
    answered:axes.reduce((total,axis)=>total+axis.count,0),
    isPreliminary:!complete
  };
}
