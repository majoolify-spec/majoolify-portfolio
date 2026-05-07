import { describe, expect, it } from "vitest";
import { classifyAdminStatus } from "../components/admin/status-banner";

describe("classifyAdminStatus", () => {
  it("marks error statuses as error tone", () => {
    expect(classifyAdminStatus("save-error")).toEqual({
      label: "Save Error",
      tone: "error",
    });
  });

  it("marks dry run statuses as warning tone", () => {
    expect(classifyAdminStatus("create-dry-run")).toEqual({
      label: "Create Dry Run",
      tone: "warning",
    });
  });

  it("normalizes casing and separators for labels", () => {
    expect(classifyAdminStatus("  SITE_SAVED  ")).toEqual({
      label: "Site Saved",
      tone: "success",
    });
  });
});
