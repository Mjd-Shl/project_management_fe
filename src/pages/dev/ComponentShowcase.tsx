import { useState } from "react";
import type { ReactNode } from "react";
import { Plus, Pencil, Trash2, X, Ellipsis, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/Button";
import { IconButton } from "../../components/ui/IconButton";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Checkbox } from "../../components/ui/Checkbox";
import { Avatar } from "../../components/ui/Avatar";
import { AvatarGroup } from "../../components/ui/AvatarGroup";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Drawer } from "../../components/ui/Drawer";
import { Dropdown } from "../../components/ui/Dropdown";
import { Tooltip } from "../../components/ui/Tooltip";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-card border border-border bg-surface p-6">
      <h2 className="mb-5 border-b border-border pb-3 text-xl font-semibold">
        {title}
      </h2>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const options = [
    { value: "todo", label: "To do" },
    { value: "progress", label: "In progress" },
    { value: "review", label: "In review" },
    { value: "done", label: "Done" },
  ];

  const users = [
    { id: "1", name: "Ali Ahmad" },
    { id: "2", name: "Habib Khalil" },
    { id: "3", name: "Sara Hassan" },
    { id: "4", name: "Omar Ibrahim" },
    { id: "5", name: "Nour Ahmad" },
    { id: "6", name: "Adam Khalil" },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          TASKLINE / DEVELOPMENT
        </p>

        <h1 className="text-3xl font-bold">
          Design System
        </h1>

        <p className="mt-2 text-muted">
          Design tokens, reusable components and interactive states.
        </p>
      </header>

      {/* Design Tokens */}

      <Section title="Design Tokens — Colours">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Primary", "bg-primary", "#3B5BDB"],
            ["Background", "bg-background", "#F8FAFC"],
            ["Surface", "bg-surface", "#FFFFFF"],
            ["Content", "bg-content", "#1E293B"],
            ["Muted", "bg-muted", "#64748B"],
            ["Border", "bg-border", "#CBD5E1"],
            ["Success", "bg-success", "#15803D"],
            ["Warning", "bg-warning", "#92400E"],
            ["Danger", "bg-danger", "#B91C1C"],
            ["Info", "bg-info", "#1D4ED8"],
          ].map(([name, color, hex]) => (
            <div key={name}>
              <div
                className={`h-16 rounded-control border border-border ${color}`}
              />
              <p className="mt-2 text-sm font-medium">{name}</p>
              <p className="text-xs text-muted">{hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Design Tokens — Typography">
        <h1 className="text-3xl font-bold">Heading 1</h1>
        <h2 className="text-2xl font-semibold">Heading 2</h2>
        <h3 className="text-xl font-semibold">Heading 3</h3>
        <p className="text-base">Body text — Inter</p>
        <p className="text-sm">Small text</p>
        <p className="text-xs text-muted">Extra small text</p>
      </Section>

      {/* 1. Button */}

      <Section title="01 — Button">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button>
            <Plus size={16} /> Create task
          </Button>
        </div>
      </Section>

      {/* 2. IconButton */}

      <Section title="02 — IconButton">
        <div className="flex flex-wrap gap-3">
          <IconButton
            icon={<Plus size={18} />}
            label="Add task"
            variant="primary"
          />

          <IconButton
            icon={<Pencil size={18} />}
            label="Edit task"
          />

          <IconButton
            icon={<Trash2 size={18} />}
            label="Delete task"
            variant="danger"
          />

          <IconButton
            icon={<X size={18} />}
            label="Close"
            disabled
          />
        </div>
      </Section>

      {/* 3. Input */}

      <Section title="03 — Input">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Task title" placeholder="Enter task title" />

          <Input
            label="Email"
            type="email"
            defaultValue="invalid-email"
            error="Please enter a valid email address."
          />

          <Input
            label="Username"
            placeholder="Enter username"
            helperText="Use at least 3 characters."
          />

          <Input
            label="Project ID"
            defaultValue="TL-106"
            disabled
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Input
            label="Read only"
            defaultValue="Taskline"
            readOnly
          />
        </div>
      </Section>

      {/* 4. Textarea */}

      <Section title="04 — Textarea">
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Description"
            placeholder="Describe the task..."
          />

          <Textarea
            label="Error state"
            error="Description is required."
          />

          <Textarea
            label="Helper text"
            helperText="Include relevant task details."
          />

          <Textarea
            label="Disabled"
            defaultValue="This description cannot be edited."
            disabled
          />
        </div>
      </Section>

      {/* 5. Select */}

      <Section title="05 — Select">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Status"
            options={options}
            placeholder="Select status"
            defaultValue=""
          />

          <Select
            label="Selected status"
            options={options}
            defaultValue="progress"
          />

          <Select
            label="Error state"
            options={options}
            placeholder="Select status"
            defaultValue=""
            error="Status is required."
          />

          <Select
            label="Disabled"
            options={options}
            defaultValue="done"
            disabled
          />
        </div>
      </Section>

      {/* 6. Checkbox */}

      <Section title="06 — Checkbox">
        <div className="flex flex-col gap-4">
          <Checkbox
            label="Unchecked"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />

          <Checkbox label="Checked" defaultChecked />

          <Checkbox label="Disabled" disabled />

          <Checkbox
            label="Checked and disabled"
            defaultChecked
            disabled
          />
        </div>
      </Section>

      {/* 7. Avatar */}

      <Section title="07 — Avatar">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Ali Ahmad" size="sm" />
          <Avatar name="Habib Khalil" size="md" />
          <Avatar name="Sara Hassan" size="lg" />

          <Avatar
            name="Image fallback"
            src="/missing-avatar.png"
          />
        </div>
      </Section>

      {/* 8. AvatarGroup */}

      <Section title="08 — AvatarGroup">
        <AvatarGroup users={users} max={3} size="sm" />
        <AvatarGroup users={users} max={4} size="md" />
        <AvatarGroup users={users} max={5} size="lg" />
      </Section>

      {/* 9. Badge */}

      <Section title="09 — Badge">
        <p className="text-sm font-medium">Variants</p>

        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>

        <p className="text-sm font-medium">Task statuses</p>

        <div className="flex flex-wrap gap-2">
          <Badge>To do</Badge>
          <Badge variant="info">In progress</Badge>
          <Badge variant="warning">In review</Badge>
          <Badge variant="success">Done</Badge>
        </div>

        <p className="text-sm font-medium">Task priorities</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="danger">Urgent</Badge>
          <Badge variant="warning">High</Badge>
          <Badge variant="info">Medium</Badge>
          <Badge>Low</Badge>
        </div>
      </Section>

      {/* 10. Modal */}

      <Section title="10 — Modal">
        <Button onClick={() => setModalOpen(true)}>
          Open modal
        </Button>

        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Delete task"
          description="This action cannot be undone."
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setModalOpen(false);
                  toast.success("Task deleted");
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          <p className="text-sm">
            Are you sure you want to delete this task?
          </p>
        </Modal>
      </Section>

      {/* 11. Drawer */}

      <Section title="11 — Drawer">
        <Button onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>

        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Task details"
          description="View and edit task information."
          footer={
            <Button
              onClick={() => {
                setDrawerOpen(false);
                toast.success("Changes saved");
              }}
            >
              Save changes
            </Button>
          }
        >
          <div className="space-y-4">
            <Input
              label="Task title"
              defaultValue="Design system"
            />

            <Textarea
              label="Description"
              defaultValue="Build reusable UI components."
            />

            <Select
              label="Status"
              options={options}
              defaultValue="progress"
            />
          </div>
        </Drawer>
      </Section>

      {/* 12. Dropdown */}

      <Section title="12 — Dropdown">
        <Dropdown
          trigger={
            <IconButton
              icon={<Ellipsis size={20} />}
              label="Task actions"
              variant="outline"
            />
          }
          items={[
            {
              id: "edit",
              label: "Edit task",
              icon: <Pencil size={16} />,
              onSelect: () => toast.info("Edit selected"),
            },
            {
              id: "duplicate",
              label: "Duplicate",
              icon: <Copy size={16} />,
              onSelect: () => toast.success("Task duplicated"),
            },
            {
              id: "archive",
              label: "Archive",
              disabled: true,
              onSelect: () => {},
            },
            {
              id: "delete",
              label: "Delete task",
              icon: <Trash2 size={16} />,
              danger: true,
              onSelect: () => toast.error("Delete selected"),
            },
          ]}
        />
      </Section>

      {/* 13. Toast */}

      <Section title="13 — Toast">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => toast.success("Task created successfully")}
          >
            Success
          </Button>

          <Button
            variant="danger"
            onClick={() => toast.error("Something went wrong")}
          >
            Error
          </Button>

          <Button
            variant="outline"
            onClick={() => toast.warning("Unsaved changes")}
          >
            Warning
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast.info("New task assigned")}
          >
            Info
          </Button>
        </div>
      </Section>

      {/* 14. Tooltip */}

      <Section title="14 — Tooltip">
        <div className="flex flex-wrap gap-4">
          <Tooltip content="Edit task" side="top">
            <IconButton
              icon={<Pencil size={18} />}
              label="Edit task"
            />
          </Tooltip>

          <Tooltip content="Create a new task" side="bottom">
            <Button>Create task</Button>
          </Tooltip>
        </div>
      </Section>

      {/* 15. Skeleton */}

      <Section title="15 — Skeleton">
        <div role="status" aria-label="Loading task details">
          <div className="flex max-w-md items-center gap-4">
            <Skeleton variant="circle" />

            <div className="flex-1 space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </div>
          </div>

          <div className="mt-4 max-w-md">
            <Skeleton variant="rectangle" />
          </div>
        </div>
      </Section>

      {/* 16. EmptyState */}

      <Section title="16 — EmptyState">
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started."
          action={
            <Button onClick={() => toast.info("Create task selected")}>
              <Plus size={16} />
              Create task
            </Button>
          }
        />
      </Section>

      <footer className="py-6 text-center text-sm text-muted">
        Taskline Design System — TL-106
      </footer>
    </main>
  );
}