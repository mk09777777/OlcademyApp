const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateLabel = (value) => {
  const date = parseDateValue(value);
  if (!date) {
    return null;
  }
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatDayLabel = (value) => {
  const date = parseDateValue(value);
  if (!date) {
    return null;
  }
  return DAY_LABELS[date.getDay()];
};

export const formatTimeLabel = (value) => {
  const date = parseDateValue(value);
  if (!date) {
    return null;
  }
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }
  return `${hours}:${minutes} ${suffix}`;
};

export const deriveDurationLabel = (start, end) => {
  const startDate = parseDateValue(start);
  const endDate = parseDateValue(end);

  if (!startDate || !endDate || endDate <= startDate) {
    return null;
  }

  const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours && minutes) {
    return `${hours} hr ${minutes} min`;
  }
  if (hours) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  return `${minutes} min`;
};

export const deriveAttendeeCount = (metadata = {}, fallbackValue) => {
  const candidateValues = [
    fallbackValue,
    metadata.attendees,
    metadata.currentAttendees,
    metadata?.stats?.attendees,
    metadata?.stats?.rsvp,
    metadata?.capacity ? Math.round(Number(metadata.capacity) * 0.65) : null,
  ].filter((value) => typeof value === 'number' && Number.isFinite(value));

  return candidateValues.length ? candidateValues[0] : null;
};

export const normalizeImageSource = (source, fallback = null) => {
  if (!source) {
    return fallback;
  }

  if (typeof source === 'number') {
    return source;
  }

  if (typeof source === 'string') {
    const trimmed = source.trim();
    return trimmed ? { uri: trimmed } : fallback;
  }

  if (Array.isArray(source)) {
    return normalizeImageSource(source[0], fallback);
  }

  if (typeof source === 'object' && source !== null) {
    if (source.uri) {
      return { uri: source.uri };
    }
    if (source.url) {
      return { uri: source.url };
    }
    if (source.cover || source.banner) {
      return normalizeImageSource(source.cover || source.banner, fallback);
    }
  }

  return fallback;
};

const normalizeScheduleEntries = (schedule = []) => {
  if (!Array.isArray(schedule)) {
    return [];
  }

  return schedule.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const normalizedTime = entry.time || formatTimeLabel(entry.startAt || entry.dateTime);

    return {
      id: entry.id ?? `${index}`,
      ...entry,
      time: normalizedTime,
    };
  }).filter(Boolean);
};

const mapTicketTypesToPricing = (ticketTypes = []) => {
  if (!Array.isArray(ticketTypes) || !ticketTypes.length) {
    return {};
  }

  const normalized = {};

  ticketTypes.forEach((ticket) => {
    if (!ticket || typeof ticket !== 'object') {
      return;
    }

    const label = (ticket.key || ticket.label || ticket.type || '').toLowerCase();
    const price = Number(ticket.price);

    if (!Number.isFinite(price)) {
      return;
    }

    if (label.includes('general') && normalized.general == null) {
      normalized.general = price;
      return;
    }

    if (label.includes('vip') && normalized.vip == null) {
      normalized.vip = price;
    }
  });

  if (normalized.general == null && Number.isFinite(ticketTypes[0]?.price)) {
    normalized.general = Number(ticketTypes[0].price);
  }

  if (normalized.vip == null && Number.isFinite(ticketTypes[1]?.price)) {
    normalized.vip = Number(ticketTypes[1].price);
  }

  return normalized;
};

const ensureArray = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [value].filter(Boolean);
};

const deriveCity = (payload, metadata = {}) => {
  return (
    payload.city ||
    metadata.city ||
    metadata?.location?.city ||
    metadata?.address?.city ||
    metadata?.venue?.city ||
    null
  );
};

const deriveStatus = (status, startAt, endAt) => {
  if (status) {
    return status;
  }

  const now = Date.now();
  const start = parseDateValue(startAt);
  const end = parseDateValue(endAt) || start;

  if (start && now < start.getTime()) {
    return 'upcoming';
  }

  if (end && now > end.getTime()) {
    return 'past';
  }

  return 'active';
};

const normalizeLocationValue = (value) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value.name) {
    return value.name;
  }
  const segments = [value.addressLine, value.address, value.city, value.state]
    .filter((segment) => typeof segment === 'string' && segment.trim().length);
  return segments.length ? segments.join(', ') : null;
};

const buildLocationLabel = (payload, metadata = {}) => {
  return (
    normalizeLocationValue(payload.location) ||
    normalizeLocationValue(metadata.location) ||
    normalizeLocationValue(metadata.address) ||
    payload.venue ||
    metadata.venue ||
    null
  );
};

const resolveImagePair = (payload) => {
  const imageCandidates = [
    payload.image,
    payload.images?.cover,
    payload.images?.primary,
    Array.isArray(payload.images) ? payload.images[0] : null,
  ];

  const bannerCandidates = [
    payload.bannerImage,
    payload.images?.banner,
    payload.images?.hero,
    Array.isArray(payload.images) ? payload.images[1] : null,
  ];

  return {
    image: normalizeImageSource(imageCandidates.find(Boolean)),
    bannerImage: normalizeImageSource(bannerCandidates.find(Boolean) || imageCandidates.find(Boolean)),
  };
};

export const transformEventPayload = (payload = {}) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const metadata = payload.metadata || {};
  const startAt = payload.startAt || payload.dateTime || metadata.startAt;
  const endAt = payload.endAt || metadata.endAt;
  const registrationDeadline = payload.registrationDeadline || metadata.registrationDeadline;
  const { image, bannerImage } = resolveImagePair(payload);
  const pricing = {
    ...mapTicketTypesToPricing(payload.ticketTypes),
    ...(payload.pricing || {}),
  };

  const derivedDateLabel = formatDateLabel(startAt || payload.dateTime);
  const derivedDayLabel = formatDayLabel(startAt || payload.dateTime);
  const derivedStartTime = formatTimeLabel(startAt || payload.dateTime);
  const derivedEndTime = formatTimeLabel(endAt);
  const duration = deriveDurationLabel(startAt, endAt);
  const attendees = deriveAttendeeCount(metadata, payload.attendees);

  return {
    id: String(payload.id ?? ''),
    status: deriveStatus(payload.status, startAt, endAt),
    featured: Boolean(payload.featured),
    title: payload.title,
    description: payload.description,
    tagline: payload.tagline,
    category: payload.category || payload.type || 'event',
    type: payload.type || payload.category || 'event',
    language: ensureArray(payload.language),
    images: payload.images,
    image,
    bannerImage,
    gallery: Array.isArray(payload.images?.gallery) ? payload.images.gallery : ensureArray(payload.gallery),
    dateTime: payload.dateTime || startAt || null,
    date: derivedDateLabel,
    dateLabel: derivedDateLabel,
    dayLabel: derivedDayLabel,
    startAt,
    endAt,
    startTime: derivedStartTime,
    endTime: derivedEndTime,
    duration,
    registrationDeadline,
    venue: payload.venue || metadata.venue || metadata.location,
    location: buildLocationLabel(payload, metadata),
    city: deriveCity(payload, metadata),
    pricing,
    ticketTypes: Array.isArray(payload.ticketTypes) ? payload.ticketTypes : [],
    performers: Array.isArray(payload.performers) ? payload.performers : [],
    schedule: normalizeScheduleEntries(payload.schedule),
    rating: payload.rating ?? metadata.rating ?? null,
    metadata,
    support: payload.support || metadata.support || {},
    organizer: payload.organizer || metadata.organizer || {},
    resaleRules: payload.resaleRules || metadata.resaleRules || {},
    isKidsFriendly: payload.isKidsFriendly ?? metadata.isKidsFriendly ?? false,
    isPetFriendly: payload.isPetFriendly ?? metadata.isPetFriendly ?? false,
    gatesOpen: payload.gatesOpen || metadata.gatesOpen || null,
    layout: payload.layout || metadata.layout || null,
    attendees,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  };
};

export const transformEvents = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(transformEventPayload).filter(Boolean);
};
