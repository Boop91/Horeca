import { trackUxEvent } from './uxTelemetry';

let initialized = false;

function canObserve() {
  return typeof window !== 'undefined' && typeof PerformanceObserver !== 'undefined';
}

export function initCWVObservers() {
  if (initialized || !canObserve()) return;
  initialized = true;

  let latestLcp = 0;
  let clsValue = 0;

  try {
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          trackUxEvent('cwv_metric', { metric: 'FCP', value: Number(entry.startTime.toFixed(2)) });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch {
    // unsupported browser
  }

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        latestLcp = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    let lcpStopped = false;
    const onLcpVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopLcp();
      }
    };

    const stopLcp = () => {
      if (lcpStopped) return;
      lcpStopped = true;
      if (latestLcp > 0) {
        trackUxEvent('cwv_metric', { metric: 'LCP', value: Number(latestLcp.toFixed(2)) });
      }
      lcpObserver.disconnect();
      document.removeEventListener('visibilitychange', onLcpVisibilityChange);
      window.removeEventListener('pagehide', stopLcp);
    };

    document.addEventListener('visibilitychange', onLcpVisibilityChange);
    window.addEventListener('pagehide', stopLcp, { once: true });
  } catch {
    // unsupported browser
  }

  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<{ value: number; hadRecentInput: boolean }>) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    let clsStopped = false;
    const onClsVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopCls();
      }
    };

    const stopCls = () => {
      if (clsStopped) return;
      clsStopped = true;
      if (clsValue > 0) {
        trackUxEvent('cwv_metric', { metric: 'CLS', value: Number(clsValue.toFixed(4)) });
      }
      clsObserver.disconnect();
      document.removeEventListener('visibilitychange', onClsVisibilityChange);
      window.removeEventListener('pagehide', stopCls);
    };

    document.addEventListener('visibilitychange', onClsVisibilityChange);
    window.addEventListener('pagehide', stopCls, { once: true });
  } catch {
    // unsupported browser
  }
}
