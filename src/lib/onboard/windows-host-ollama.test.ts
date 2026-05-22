// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { afterEach, describe, expect, it, vi } from "vitest";

const runCapture = vi.fn<(command: string | string[]) => string>(() => "");

vi.mock("../runner", () => ({
  runCapture: (command: string | string[]) => runCapture(command),
}));

vi.mock("../platform", () => ({
  isWsl: vi.fn(() => true),
}));

import { isWsl } from "../platform";
import { detectWindowsHostOllama } from "./windows-host-ollama";

describe("detectWindowsHostOllama", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.mocked(isWsl).mockReturnValue(true);
  });

  it("detects installed-but-not-running Ollama via known install path (#4066)", () => {
    const knownPath = "C:\\Users\\tester\\AppData\\Local\\Programs\\Ollama\\ollama.exe";
    runCapture.mockImplementation((command) => {
      const cmd = Array.isArray(command) ? command.join(" ") : command;
      if (cmd.includes("Get-Command ollama.exe")) return "";
      if (cmd.includes("Get-Process ollama") && cmd.includes("Path")) return "";
      if (cmd.includes("Get-Process ollama") && cmd.includes("Id")) return "";
      if (cmd.includes("Test-Path -LiteralPath")) return knownPath;
      if (cmd.includes("Get-NetTCPConnection")) return "";
      return "";
    });

    expect(detectWindowsHostOllama()).toEqual({
      installed: true,
      installedPath: knownPath,
      loopbackOnly: false,
    });
  });
});
