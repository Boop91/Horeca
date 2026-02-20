const UX_EVENTS_KEY = 'bianchipro.ux-events.v1';
const UX_EVENTS_LIMIT = 200;

export type UxEventName =
  | 'search_submit'
  | 'search_suggestion_click'
  | 'mobile_catalog_toggle'
  | 'mobile_catalog_expand'
  | 'filters_toggle'
  | 'filters_apply'
  | 'filters_reset'
  | 'filter_chip_remove'
  | 'sort_change'
  | 'pagination_navigate'
  | 'empty_state_preventivo_click'
  | 'empty_state_call_click'
  | 'contact_prefill_view'
  | 'contact_submit_error'
  | 'contact_submit_success'
  | 'help_widget_open'
  | 'help_chat_open'
  | 'help_chat_send'
  | 'help_quick_message_open'
  | 'help_whatsapp_open'
  | 'cwv_metric';

export interface UxEvent {
  name: UxEventName;
  timestamp: string;
  path: string;
  payload?: Record<string, unknown>;
}

function canUseDOM() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function readUxEvents(): UxEvent[] {
  if (!canUseDOM()) return [];
  const raw = window.sessionStorage.getItem(UX_EVENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as UxEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUxEvents(events: UxEvent[]) {
  if (!canUseDOM()) return;
  const capped = events.slice(-UX_EVENTS_LIMIT);
  window.sessionStorage.setItem(UX_EVENTS_KEY, JSON.stringify(capped));
}

export function trackUxEvent(name: UxEventName, payload?: Record<string, unknown>) {
  if (!canUseDOM()) return;

  const event: UxEvent = {
    name,
    timestamp: new Date().toISOString(),
    path: window.location.pathname + window.location.search,
    payload,
  };

  const nextEvents = [...readUxEvents(), event];
  writeUxEvents(nextEvents);

  window.dispatchEvent(new CustomEvent<UxEvent>('bianchipro:ux-event', { detail: event }));
}
