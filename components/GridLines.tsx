/**
 * Fixed engineering-grid texture: two hairlines framing the 12-column
 * content area (in the outer half-gutter). Inner column lines were dropped:
 * they cut through body text and doubled up with card borders.
 */
export function GridLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="mx-auto h-full w-full max-w-site px-5 md:px-10">
        <div className="gridline gridline-end h-full" />
      </div>
    </div>
  );
}
