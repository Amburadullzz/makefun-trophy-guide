// The spoiler setting. One job — decide what a reader is allowed to read.
// Story trophies keep their name and description behind the shield until they
// are earned; the guide text and steps are hidden with them.

export const MASKED_NAME = 'Hidden story trophy';
export const MASKED_DESCRIPTION = 'The name and description of this story trophy stay hidden until you earn it.';
export const MASKED_GUIDE = 'This is a story trophy. Its guide names missions and characters, so it is masked while the spoiler shield is on.';

export function isMasked(trophy, settings, earned) {
  if (!settings || !settings.spoilerShield) return false;
  if (earned && earned.has(trophy.id)) return false;
  return trophy.kind === 'story';
}

export function visibleName(trophy, masked) {
  return masked ? MASKED_NAME : trophy.name;
}

export function visibleDescription(trophy, masked) {
  return masked ? MASKED_DESCRIPTION : trophy.description;
}

export function maskedCount(trophies, settings, earned) {
  return trophies.filter((trophy) => isMasked(trophy, settings, earned)).length;
}
