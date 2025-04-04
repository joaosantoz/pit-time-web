export const ValidationMessage = {
  NO_SPACES: (item: string) => `${item} cannot contain spaces.`,
  EMPTY: (item: string) => `${item} cannot be empty.`,
  MIN_LENGTH: (item: string, length: number) => `${item} must be at least ${length} characters.`,
  MAX_LENGTH: (item: string, length: number) => `${item} must be at most ${length} characters.`,
  INVALID: (item: string) => `Invalid ${item}.`
} as const;
