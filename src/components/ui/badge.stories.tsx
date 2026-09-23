import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "auth",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "orange", "red", "green", "slate"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "auth",
  },
};

export const Orange: Story = {
  args: {
    variant: "orange",
    children: "Investigating",
  },
};

export const Red: Story = {
  args: {
    variant: "red",
    children: "High",
  },
};

export const Green: Story = {
  args: {
    variant: "green",
    children: "Resolved",
  },
};

export const Slate: Story = {
  args: {
    variant: "slate",
    children: "Critical",
  },
};

export const AllVariant: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>default</Badge>
      <Badge variant="orange">Investigating</Badge>
      <Badge variant="red">High</Badge>
      <Badge variant="green">Resolved</Badge>
      <Badge variant="slate">Critical</Badge>
    </div>
  ),
};
