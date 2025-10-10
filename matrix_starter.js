/* matrix_starter.js — v11
 * Provides lightweight compatibility logic used by the Summary stage.
 * Exports:
 *   - window.getCompatibility(typeA, typeB)
 *   - window.getSpeciesCompatibilityByIds(idA, idB)
 *
 * Flags returned:
 *   'Y' = OK/Green, 'C' = Caution/Yellow, 'N' = Incompatible/Red
 */

/** Coral family compatibility
 * @param {string} typeA - 'soft' | 'lps' | 'sps' (case-insensitive) or friendly labels
 * @param {string} typeB - same as typeA
 * @returns {{flag:'Y'|'C'|'N', reason:string}}
 */
function getCompatibility(typeA, typeB) {
  const a = normalizeCoralType(typeA);
  const b = normalizeCoralType(typeB);

  // Same-family baselines
  if (a === b) {
    if (a === 'lps') {
      return { flag: 'C', reason: 'LPS frequently have long sweeper tentacles—maintain generous spacing.' };
    }
    // soft-soft or sps-sps
    return { flag: 'Y', reason: 'Generally compatible within family with reasonable spacing and stable parameters.' };
  }

  // Cross-family heuristics
  const key = [a, b].sort().join('+');
  const rules = {
    'lps+soft': {
      flag: 'C',
      reason: 'Chemical warfare/mucus contact likely—use carbon, ensure flow, and give distance.'
    },
    'lps+sps': {
      flag: 'C',
      reason: 'LPS sweepers can sting SPS—establish clear zones and avoid down-current placement onto SPS.'
    },
    'soft+sps': {
      flag: 'C',
      reason: 'Soft coral allelopathy can stress SPS—strong export (skimming/carbon) and spacing recommended.'
    }
  };

  return rules[key] || { flag: 'Y', reason: 'No major issues known with proper placement and husbandry.' };
}

/** Pairwise fish/invert compatibility by species IDs (from data_species.js FISH array)
 * @param {string} idA
 * @param {string} idB
 * @returns {{flag:'Y'|'C'|'N', reason:string}}
 */
function getSpeciesCompatibilityByIds(idA, idB) {
  const fish = (window.FISH || []);
  const A = fish.find(x => x.id === idA);
  const B = fish.find(x => x.id === idB);
  if (!A || !B) return { flag: 'Y', reason: '' };

  const nameA = (A.name || '').toLowerCase();
  const nameB = (B.name || '').toLowerCase();
  const groupA = (A.group || '').toLowerCase();
  const groupB = (B.group || '').toLowerCase();

  // --- Rules (lightweight heuristics) ---

  // Tang vs Tang — territorial without ample space/length
  if (includesAny(groupA, ['tang', 'surgeon']) && includesAny(groupB, ['tang', 'surgeon'])) {
    return { flag: 'C', reason: 'Multiple tangs can be territorial—need ample swimming length and careful introduction order.' };
  }

  // Wrasses vs Shrimp — some wrasses may pick at smaller shrimp
  const wrasseInvolved = includesAny(groupA, ['wrasse']) || includesAny(groupB, ['wrasse']);
  const shrimpInvolved = nameA.includes('shrimp') || nameB.includes('shrimp');
  if (wrasseInvolved && shrimpInvolved) {
    return { flag: 'C', reason: 'Some wrasses may harass small shrimp—add shrimp first, provide caves, and feed well.' };
  }

  // Dottybacks vs small/passive fish — potential bullying
  const dottyInvolved = includesAny(groupA, ['dottyback']) || includesAny(groupB, ['dottyback']);
  const passiveHit = ['firefish', 'goby', 'blenny'].some(k => nameA.includes(k) || nameB.includes(k));
  if (dottyInvolved && passiveHit) {
    return { flag: 'C', reason: 'Dottybacks can bully small/passive fish—dense rockwork and timing help mitigate.' };
  }

  // Damsels — notorious territorial behavior
  if (includesAny(groupA, ['damsel']) || includesAny(groupB, ['damsel'])) {
    return { flag: 'C', reason: 'Many damsels are territorial—introduce last or in groups with adequate space.' };
  }

  // Rabbitfish vs aggressive tangs — usually fine in larger tanks but watch early days
  const rabbitInvolved = includesAny(groupA, ['rabbit']) || includesAny(groupB, ['rabbit']);
  if (rabbitInvolved && (includesAny(groupA, ['tang','surgeon']) || includesAny(groupB, ['tang','surgeon']))) {
    return { flag: 'C', reason: 'Rabbitfish and tangs can posture; provide nori stations at both ends and observe.' };
  }

  // Basslets generally okay with most community fish
  if (includesAny(groupA, ['basslet']) || includesAny(groupB, ['basslet'])) {
    return { flag: 'Y', reason: 'Basslets are generally peaceful—provide caves; avoid similar-looking species in tight spaces.' };
  }

  // Default: OK
  return { flag: 'Y', reason: '' };
}

/* ----------------- helpers ----------------- */

function normalizeCoralType(t) {
  const s = String(t || '').trim().toLowerCase();
  if (s === 'soft' || s.includes('soft')) return 'soft';
  if (s === 'lps') return 'lps';
  if (s === 'sps') return 'sps';
  // map friendly labels
  if (s.includes('leather') || s.includes('zoa') || s.includes('mushroom')) return 'soft';
if (
  s.includes('hammer') || s.includes('frogspawn') || s.includes('torch') ||
  s.includes('euphyllia') || s.includes('goni') || s.includes('acan') ||
  s.includes('trachy') || s.includes('galaxea') || s.includes('hydnophora') // <-- add these
) return 'lps';
return 'sps'; // safe default toward higher sensitivity
}

function includesAny(hay, needles) {
  const s = String(hay || '').toLowerCase();
  return needles.some(n => s.includes(n));
}

/* ----------------- exports ----------------- */
window.getCompatibility = getCompatibility;
window.getSpeciesCompatibilityByIds = getSpeciesCompatibilityByIds;
