import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Plus, Search } from "lucide-react";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "New Bug",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "icon"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "New Bug",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Link Card",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "Cancel",
  },
};

export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Save",
  },
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: (
      <>
        <Plus className="w-4 h-4" />
        New Bug
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: "secondary",
    size: "icon",
    "aria-label": "Search",
    children: <Search className="h-4 w-4" />,
  },
};

export const AllVariant: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">New Bug</Button>
      <Button variant="secondary">Link Card</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary" size="sm">
        Save
      </Button>
      <Button variant="secondary" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="primary">
        <>
          <Plus className="w-4 h-4" />
          New Bug
        </>
      </Button>
    </div>
  ),
};
