import type { ReactNode } from "react";
import { cn } from "./cn";

export interface Column<Row> {
  key: string;
  header: string;
  numeric?: boolean;
  cell: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  /** Search, filters and actions shown above the table. */
  toolbar?: ReactNode;
  /** Shown instead of the table when there are no rows. */
  empty?: ReactNode;
}

/** List page table: sticky header, row height from the style's density, scrolls sideways on phones. */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  toolbar,
  empty,
}: DataTableProps<Row>) {
  return (
    <section className="surface-solid min-w-0 overflow-hidden" aria-label={caption}>
      {toolbar ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-card">
          {toolbar}
        </div>
      ) : null}
      {rows.length === 0 && empty ? (
        <div className="p-card">{empty}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-surface-2 text-ink-muted">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "h-row px-4 font-semibold whitespace-nowrap",
                      col.numeric ? "text-end" : "text-start",
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-t border-border motion-colors hover:bg-surface-2"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "h-row px-4 whitespace-nowrap",
                        col.numeric ? "type-numeric text-end" : "text-start",
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
