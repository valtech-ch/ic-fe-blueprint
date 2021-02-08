export function addNumbers (numbers) {
  if (!numbers.length) return
  return numbers.map(x => {
    return {
      [x]: x + 1
    }
  })
}
