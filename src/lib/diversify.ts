/** Round-robins items across whatever key groups them (brand, category, ...) instead of a flat
    first-N slice, so a group that happens to sort late in the data (or just has fewer items)
    still gets fair representation instead of being crowded out. */
export function diversifyByKey<T>(items: T[], keyFn: (item: T) => string, count: number): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = keyFn(item);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(item);
  }
  const queues = Array.from(groups.values());
  const result: T[] = [];
  let i = 0;
  while (result.length < count && queues.some((q) => q.length > 0)) {
    const queue = queues[i % queues.length];
    if (queue.length > 0) result.push(queue.shift()!);
    i += 1;
  }
  return result;
}
