import { api, normalizeApiError } from '@/config/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import { transformEventPayload, transformEvents } from '@/utils/eventUtils';
import { events as fallbackEvents } from '@/Data/EventData';

let cachedEvents = [];
const eventCache = new Map();

const cacheEvents = (events = []) => {
  cachedEvents = events;
  events.forEach((event) => {
    if (event?.id) {
      eventCache.set(String(event.id), event);
    }
  });
};

const resolveResponsePayload = (response) => {
  if (!response) {
    return null;
  }

  const payload = response.data ?? response;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return payload;
};

const pickCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.events)) {
    return payload.events;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
};

const withFallbackEvents = (error) => {
  const normalizedError = normalizeApiError(error);
  console.warn('[eventService] Falling back to static events', normalizedError);
  const normalized = transformEvents(fallbackEvents);
  cacheEvents(normalized);
  return normalized;
};

export const fetchEvents = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.EVENTS.LIST, { params });
    const payload = resolveResponsePayload(response);
    const rawCollection = pickCollection(payload);
    const normalized = transformEvents(rawCollection);
    cacheEvents(normalized);
    return normalized;
  } catch (error) {
    return withFallbackEvents(error);
  }
};

export const fetchEventById = async (id) => {
  if (!id) {
    return null;
  }

  const cacheKey = String(id);

  if (eventCache.has(cacheKey)) {
    return eventCache.get(cacheKey);
  }

  try {
    const response = await api.get(API_ENDPOINTS.EVENTS.DETAIL(id));
    const payload = resolveResponsePayload(response);
    const normalized = transformEventPayload(payload);

    if (normalized?.id) {
      eventCache.set(normalized.id, normalized);
    }

    return normalized;
  } catch (error) {
    const normalizedError = normalizeApiError(error);
    console.warn(`[eventService] Unable to fetch event ${id}`, normalizedError);
    const fallback = fallbackEvents.find((event) => String(event.id) === cacheKey);
    const normalizedFallback = fallback ? transformEventPayload(fallback) : null;

    if (normalizedFallback?.id) {
      eventCache.set(normalizedFallback.id, normalizedFallback);
    }

    return normalizedFallback;
  }
};

export const getCachedEvents = () => cachedEvents;
