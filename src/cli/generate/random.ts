export function getRandomInt(min: number, max: number): number {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

export function getRandomItem<T>(items: readonly T[]): T {
  return items[getRandomInt(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomFloat(min: number, max: number, digits = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(digits));
}

export function getRandomDateWithinDays(days: number): Date {
  const now = Date.now();
  const delta = getRandomInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(now - delta);
}

export function getRandomArrayItems<T>(items: readonly T[], count: number): T[] {
  if (items.length === 0) {
    return [];
  }

  if (items.length < count) {
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(getRandomItem(items));
    }
    return result;
  }

  const copy = [...items];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, count);
}
