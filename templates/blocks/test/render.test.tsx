import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AppShell,
  BarChart,
  Button,
  DataTable,
  DetailView,
  EmptyState,
  Field,
  FormCard,
  KpiGroup,
  StatusBadge,
  TextInput,
  type Kpi,
  type KpiVariant,
  type NavFamily,
} from "../src";

const kpis: Kpi[] = [
  {
    label: "Available",
    value: "412",
    delta: { text: "+4%", good: true },
    progress: 0.7,
    series: [1, 3, 2, 5],
    status: "success",
  },
  {
    label: "Missing",
    value: "3",
    delta: { text: "+1", good: false },
    caption: "vs last month",
    status: "danger",
  },
];

describe("blocks render", () => {
  it.each<KpiVariant>(["standard", "comparison", "progress", "outlined", "strip", "terminal"])(
    "KPI recipe %s shows every label and value",
    (variant) => {
      const html = renderToStaticMarkup(<KpiGroup items={kpis} variant={variant} />);
      for (const k of kpis) {
        expect(html).toContain(k.label);
        expect(html).toContain(k.value);
      }
    },
  );

  it.each<NavFamily>(["rail", "sidebar", "top"])(
    "app shell %s has a skip link, main landmark and nav",
    (nav) => {
      const html = renderToStaticMarkup(
        <AppShell
          nav={nav}
          appName="Lab Inventory"
          mark="L"
          items={[{ label: "Home", href: "/", icon: "H", active: true }]}
        >
          <p>content</p>
        </AppShell>,
      );
      expect(html).toContain('href="#main"');
      expect(html).toContain('id="main"');
      expect(html).toContain('aria-current="page"');
    },
  );

  it("table renders rows, or the empty state when there are none", () => {
    const columns = [{ key: "name", header: "Name", cell: (r: { name: string }) => r.name }];
    const full = renderToStaticMarkup(
      <DataTable
        caption="Equipment"
        columns={columns}
        rows={[{ name: "Microscope" }]}
        getRowKey={(r) => r.name}
      />,
    );
    expect(full).toContain("Microscope");
    expect(full).toContain('scope="col"');

    const empty = renderToStaticMarkup(
      <DataTable
        caption="Equipment"
        columns={columns}
        rows={[]}
        getRowKey={(r) => r.name}
        empty={<EmptyState title="No equipment yet" description="Add your first item." />}
      />,
    );
    expect(empty).toContain("No equipment yet");
    expect(empty).not.toContain("<table");
  });

  it("form fields link labels, hints and errors", () => {
    const html = renderToStaticMarkup(
      <FormCard title="Add equipment" actions={<Button>Save</Button>}>
        <Field id="name" label="Name" hint="As printed on the label" error="Enter a name" required>
          {(describedBy, invalid) => (
            <TextInput id="name" aria-describedby={describedBy} aria-invalid={invalid} />
          )}
        </Field>
      </FormCard>,
    );
    expect(html).toContain('for="name"');
    expect(html).toContain('aria-describedby="name-hint name-error"');
    expect(html).toContain('aria-invalid="true"');
  });

  it("detail view, chart and badge render", () => {
    const html = renderToStaticMarkup(
      <>
        <DetailView
          title="Microscope #12"
          status={<StatusBadge tone="success">Available</StatusBadge>}
          fields={[{ label: "Room", value: "Lab 3" }]}
          history={[{ when: "2 Oct", text: "Returned" }]}
        />
        <BarChart label="Issues per month" data={[{ label: "Jan", value: 3 }]} highlight={0} />
      </>,
    );
    expect(html).toContain("Microscope #12");
    expect(html).toContain("Returned");
    expect(html).toContain('aria-label="Issues per month"');
  });
});
