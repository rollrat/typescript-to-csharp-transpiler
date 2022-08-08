export function EqualStringArraySet(a: string[], b: string[]) {
  let s = new Set<string>();
  a.forEach((e) => s.add(e));
  return b.every((e) => s.has(e));
}

type IntersectPosition = {
  a: number;
  b: number;
};

export function IntersectStringArray(
  a: string[],
  b: string[]
): IntersectPosition[] {
  let s = new Map<string, number>();
  a.forEach((e, i) => s.set(e, i));
  return b
    .filter((e) => s.has(e))
    .map((e, i) => {
      return { a: s.get(e)!, b: i };
    });
}

// return a - b
export function ComplementStringArray(a: string[], b: string[]): string[] {
  let s = new Set<string>();
  b.forEach((e) => s.add(e));
  return a.filter((e) => !s.has(e));
}
