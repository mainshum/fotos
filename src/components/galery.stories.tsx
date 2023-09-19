import type { Meta, StoryObj } from "@storybook/react";

import Galery from "./galery";

const meta: Meta<typeof Galery> = {
  component: Galery,
  title: "Galery",
};

export default meta;

type Story = StoryObj<typeof Galery>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Happy: Story = {
  render: () => <Galery />,
};
