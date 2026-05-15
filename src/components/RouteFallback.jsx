export default function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="route-skeleton-page"
    >
      <span className="app-skeleton route-skeleton-hero" />
      <div className="route-skeleton-grid">
        <span className="app-skeleton route-skeleton-card" />
        <span className="app-skeleton route-skeleton-card" />
        <span className="app-skeleton route-skeleton-card" />
      </div>
      <span className="app-skeleton route-skeleton-table" />
    </div>
  );
}
