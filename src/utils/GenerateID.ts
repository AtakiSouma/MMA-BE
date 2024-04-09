import { generateCustomUuid, generateShortUuid, generateStrongCompactUuid } from 'custom-uuid'
// generateCustomUuid("123456789ABC", 20); // ⇨ 'C12B1B2A9382A488B43A'
// generateShortUuid(); // ⇨ 'yT1xoeCt6fvdDf6a'
// generateStrongCompactUuid(); // ⇨ 'BYFGhRjnn83hHCarT09H'
function GenerateID() {
  return generateStrongCompactUuid()
}

export default GenerateID
