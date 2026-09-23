import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockBugs } from "../data/mock-bugs";
import { BugNoteCard } from "./bug-note-card";

const meta = {
    title: "Features/Bugs/BugNoteCard",
    component: BugNoteCard,
    args: {
        bug: mockBugs[0],
        isSelected: false,
        onSelect: () => {}
    },
    decorators: [
        (Story) => (
            <div className="w-90 bg-white p-4">
                <Story/>
            </div>
        )
    ]
} satisfies Meta<typeof BugNoteCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
    args:{
        isSelected: true
    }
}

export const Draft: Story = {
    args: {
        bug: mockBugs[1]
    }
}

export const Resolved: Story = {
    args: {
        bug: mockBugs[2]
    }
}

export const Critical: Story = {
    args: {
        bug: {
      ...mockBugs[0],
      severity: "critical",
      title: "Production deploy breaks the full login flow",
      summary:
        "Users cannot sign in. Auth API endpoints return 500 in production.",
      tags: ["production", "auth", "critical"],
    },
    isSelected: true,
  },
    };
