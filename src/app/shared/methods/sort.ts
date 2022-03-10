export function name(a: any, b: any): number {
  const a_name = a.name.toLowerCase();
  const b_name = b.name.toLowerCase();
  if (a_name < b_name) return -1;
  if (a_name > b_name) return 1;
  return 0;
}

export function translation(a: any, b: any): number {
  const a_translation = a.translation.toLowerCase();
  const b_translation = b.translation.toLowerCase();
  if (a_translation < b_translation) return -1;
  if (a_translation > b_translation) return 1;
  return 0;
}

export function id(a: any, b: any): number {
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}
