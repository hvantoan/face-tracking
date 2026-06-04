/** Format a face index as a Vietnamese label: 0 → "Người 1", 2 → "Người 3" */
export function formatFaceLabel(index: number): string {
  return `Người ${index + 1}`
}