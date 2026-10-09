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
  PageHeader,
  SelectInput,
  StatusBadge,
  TextArea,
  TextInput,
  type Column,
  type Kpi,
  type KpiVariant,
  type NavFamily,
  type Tone,
} from "@nexora/blocks";
import {
  Boxes,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  PackageOpen,
  Plus,
  Settings,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

// Sample "college lab inventory" app (the docs' reference use case), rendered with template blocks.

const KPIS: Kpi[] = [
  {
    label: "Available",
    value: "412",
    delta: { text: "+4%", good: true },
    caption: "vs last month",
    progress: 0.72,
    series: [380, 392, 388, 401, 397, 412],
    status: "success",
  },
  {
    label: "Issued",
    value: "86",
    delta: { text: "+12%", good: null },
    caption: "vs last month",
    progress: 0.21,
    series: [64, 70, 75, 72, 80, 86],
    status: "info",
  },
  {
    label: "Damaged",
    value: "7",
    delta: { text: "−2", good: true },
    caption: "vs last month",
    progress: 0.04,
    series: [11, 10, 9, 9, 8, 7],
    status: "warning",
  },
  {
    label: "Missing",
    value: "3",
    delta: { text: "+1", good: false },
    caption: "vs last month",
    progress: 0.01,
    series: [1, 1, 2, 2, 2, 3],
    status: "danger",
  },
];

const REQUESTS_PER_MONTH = [
  { label: "May", value: 42 },
  { label: "Jun", value: 38 },
  { label: "Jul", value: 55 },
  { label: "Aug", value: 61 },
  { label: "Sep", value: 74 },
  { label: "Oct", value: 68 },
];

type Status = "Available" | "Issued" | "Damaged" | "Missing";

interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  status: Status;
  quantity: number;
}

const STATUS_TONE: Record<Status, Tone> = {
  Available: "success",
  Issued: "info",
  Damaged: "warning",
  Missing: "danger",
};

const EQUIPMENT: Equipment[] = [
  {
    id: "EQ-1042",
    name: "Digital microscope DM-300",
    category: "Optics",
    location: "Lab 3",
    status: "Issued",
    quantity: 4,
  },
  {
    id: "EQ-1043",
    name: "Oscilloscope 100 MHz",
    category: "Electronics",
    location: "Lab 1",
    status: "Available",
    quantity: 9,
  },
  {
    id: "EQ-1050",
    name: "Centrifuge mini",
    category: "Biology",
    location: "Lab 2",
    status: "Damaged",
    quantity: 1,
  },
  {
    id: "EQ-1061",
    name: "Soldering station",
    category: "Electronics",
    location: "Workshop",
    status: "Available",
    quantity: 12,
  },
  {
    id: "EQ-1077",
    name: "pH meter",
    category: "Chemistry",
    location: "Lab 4",
    status: "Missing",
    quantity: 1,
  },
];

const COLUMNS: Column<Equipment>[] = [
  {
    key: "id",
    header: "ID",
    cell: (r) => <span className="type-numeric text-ink-muted">{r.id}</span>,
  },
  { key: "name", header: "Item", cell: (r) => <span className="font-semibold">{r.name}</span> },
  { key: "category", header: "Category", cell: (r) => r.category },
  { key: "location", header: "Location", cell: (r) => r.location },
  {
    key: "status",
    header: "Status",
    cell: (r) => <StatusBadge tone={STATUS_TONE[r.status]}>{r.status}</StatusBadge>,
  },
  { key: "quantity", header: "Qty", numeric: true, cell: (r) => r.quantity },
];

function Block({ name, children }: { name: string; children: ReactNode }) {
  return <div data-block={name}>{children}</div>;
}

export function SampleApp({ nav, kpi }: { nav: NavFamily; kpi: KpiVariant }) {
  return (
    <AppShell
      nav={nav}
      appName="Lab Inventory"
      mark={
        <span className="flex size-9 items-center justify-center rounded-control bg-primary text-on-primary">
          <FlaskConical size={18} />
        </span>
      }
      items={[
        {
          label: "Dashboard",
          href: "#dashboard",
          icon: <LayoutDashboard size={18} />,
          active: true,
        },
        { label: "Equipment", href: "#equipment", icon: <Boxes size={18} /> },
        { label: "Requests", href: "#request", icon: <ClipboardList size={18} /> },
        { label: "Repairs", href: "#detail", icon: <Wrench size={18} /> },
        { label: "Settings", href: "#empty", icon: <Settings size={18} /> },
      ]}
      actions={
        <span className="hidden sm:block">
          <Button>
            <Plus size={16} aria-hidden="true" /> New request
          </Button>
        </span>
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <Block name="header">
          <PageHeader
            title="Dashboard"
            description="Equipment across all labs, updated a minute ago."
            actions={<Button variant="secondary">Export</Button>}
          />
        </Block>

        <Block name="kpis">
          <div id="dashboard">
            <KpiGroup items={KPIS} variant={kpi} />
          </div>
        </Block>

        <Block name="chart">
          <section
            className="surface-card flex flex-col gap-4 p-card"
            aria-labelledby="chart-title"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="chart-title" className="type-heading text-lg">
                Requests per month
              </h2>
              <p className="text-sm text-ink-muted">October is 8% below September</p>
            </div>
            <BarChart
              label="Requests per month, May to October"
              data={REQUESTS_PER_MONTH}
              highlight={4}
            />
          </section>
        </Block>

        <Block name="table">
          <div id="equipment">
            <DataTable
              caption="Equipment"
              columns={COLUMNS}
              rows={EQUIPMENT}
              getRowKey={(r) => r.id}
              toolbar={
                <>
                  <TextInput
                    aria-label="Search equipment"
                    placeholder="Search equipment"
                    className="max-w-xs flex-1"
                  />
                  <Button className="ms-auto">
                    <Plus size={16} aria-hidden="true" /> Add equipment
                  </Button>
                </>
              }
            />
          </div>
        </Block>

        <Block name="form">
          <div id="request">
            <FormCard
              title="Request equipment"
              description="Your lab head approves requests, usually within a day."
              actions={
                <>
                  <Button variant="ghost">Cancel</Button>
                  <Button type="submit">Send request</Button>
                </>
              }
            >
              <Field id="item" label="Item" required>
                {(describedBy) => (
                  <SelectInput id="item" defaultValue="EQ-1042" aria-describedby={describedBy}>
                    {EQUIPMENT.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </SelectInput>
                )}
              </Field>
              <Field
                id="quantity"
                label="Quantity"
                required
                error="Only 4 are available. Choose 4 or fewer."
              >
                {(describedBy, invalid) => (
                  <TextInput
                    id="quantity"
                    type="number"
                    defaultValue={6}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                  />
                )}
              </Field>
              <Field
                id="needed"
                label="Needed by"
                hint="We'll remind you two days before it's due back."
              >
                {(describedBy) => (
                  <TextInput
                    id="needed"
                    type="date"
                    defaultValue="2026-10-20"
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
              <Field id="purpose" label="Purpose">
                {(describedBy) => (
                  <TextArea
                    id="purpose"
                    placeholder="What will you use it for?"
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
            </FormCard>
          </div>
        </Block>

        <Block name="detail">
          <div id="detail">
            <DetailView
              title="Digital microscope DM-300"
              subtitle="EQ-1042 · Optics · Lab 3"
              status={<StatusBadge tone="info">Issued</StatusBadge>}
              actions={
                <>
                  <Button variant="secondary">Mark returned</Button>
                  <Button variant="danger">Report missing</Button>
                </>
              }
              fields={[
                { label: "Issued to", value: "Priya Raman (Physics)" },
                { label: "Due back", value: "20 Oct 2026" },
                { label: "Purchase date", value: "12 Jan 2024" },
                { label: "Condition", value: "Good" },
                { label: "Serial number", value: "DM3-88412-K" },
                { label: "Units in stock", value: "4 of 6" },
              ]}
              history={[
                { when: "6 Oct 2026", text: "Issued to Priya Raman" },
                { when: "5 Oct 2026", text: "Request approved by Dr. Iyer" },
                { when: "2 Sep 2026", text: "Returned in good condition" },
              ]}
            />
          </div>
        </Block>

        <Block name="empty">
          <div id="empty">
            <DataTable
              caption="Damage reports"
              columns={COLUMNS}
              rows={[]}
              getRowKey={(r) => r.id}
              empty={
                <EmptyState
                  icon={<PackageOpen size={22} />}
                  title="No damage reports yet"
                  description="When someone reports broken or missing equipment, it shows up here for you to follow up."
                  action={<Button>Report damage</Button>}
                />
              }
            />
          </div>
        </Block>
      </div>
    </AppShell>
  );
}
