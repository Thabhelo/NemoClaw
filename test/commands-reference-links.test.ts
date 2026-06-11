// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const commandsReference = path.join(repoRoot, "docs/reference/commands.mdx");
const installPluginsDoc = path.join(repoRoot, "docs/deployment/install-openclaw-plugins.mdx");

describe("commands reference doc links (#5080)", () => {
  it("links Install OpenClaw Plugins to the deployment guide", () => {
    const markdown = fs.readFileSync(commandsReference, "utf8");

    expect(markdown).toContain("[Install OpenClaw Plugins](../deployment/install-openclaw-plugins)");
    expect(markdown).not.toContain("../manage-sandboxes/install-openclaw-plugins");
    expect(fs.existsSync(installPluginsDoc)).toBe(true);
  });
});
