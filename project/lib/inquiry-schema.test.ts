import { describe, expect, it } from "vitest";
import { inquiryOptions } from "@/lib/content";
import { fieldErrors, inquirySchema, MIN_ELAPSED_MS } from "@/lib/inquiry-schema";

const validInput = () => ({
  submissionId: "3f1c9b2e-8d4a-4c1e-9b7f-2a6d5e8c1f40",
  name: "  Dana O'Neil  ",
  company: "Rose St. Barbers",
  email: "  Dana@Example.COM ",
  help: inquiryOptions.help[0],
  budget: inquiryOptions.budget[2],
  stage: inquiryOptions.stage[1],
  project: "We miss a lot of calls while we work.",
  marketingOptIn: false,
  attribution: {
    first: { source: "google", medium: "organic", landing_page: "/", ts: 1 },
    last: null,
  },
  website: "",
  elapsedMs: 12_000,
});

describe("inquirySchema", () => {
  it("accepts a valid inquiry and normalizes it", () => {
    const r = inquirySchema.parse(validInput());
    expect(r.name).toBe("Dana O'Neil");
    expect(r.email).toBe("dana@example.com");
    expect(r.attribution.first?.source).toBe("google");
    expect(r.attribution.last).toBeNull();
  });

  it("applies defaults for optional fields", () => {
    const { company, marketingOptIn, attribution, website, ...rest } = validInput();
    void company;
    void marketingOptIn;
    void attribution;
    void website;
    const r = inquirySchema.parse(rest);
    expect(r.company).toBe("");
    expect(r.marketingOptIn).toBe(false);
    expect(r.attribution).toEqual({});
    expect(r.website).toBe("");
  });

  it("strips unknown keys from attribution touches", () => {
    const input = validInput();
    const r = inquirySchema.parse({
      ...input,
      attribution: { first: { ...input.attribution.first, evil: "<script>" } },
    });
    expect(r.attribution.first).not.toHaveProperty("evil");
  });

  it.each([
    ["name", ""],
    ["name", "x".repeat(121)],
    ["company", "x".repeat(161)],
    ["email", "not-an-email"],
    ["email", `${"a".repeat(250)}@example.com`],
    ["project", "too short"],
    ["project", "x".repeat(5001)],
    ["submissionId", "123"],
    ["help", "Something else"],
    ["budget", "$1,000,000"],
    ["stage", "Done already"],
  ])("rejects bad %s", (field, value) => {
    const r = inquirySchema.safeParse({ ...validInput(), [field]: value });
    expect(r.success).toBe(false);
    if (!r.success) expect(Object.keys(fieldErrors(r.error))).toContain(field);
  });

  it("caps attribution string lengths", () => {
    const input = validInput();
    const r = inquirySchema.safeParse({
      ...input,
      attribution: { first: { ...input.attribution.first, source: "x".repeat(301) } },
    });
    expect(r.success).toBe(false);
  });

  it("returns one friendly message per field", () => {
    const r = inquirySchema.safeParse({ ...validInput(), name: "", email: "nope" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const f = fieldErrors(r.error);
      expect(f.name).toBe("Please enter your name.");
      expect(f.email).toBe("Please enter a valid email address.");
    }
  });

  it("uses a sensible bot threshold", () => {
    expect(MIN_ELAPSED_MS).toBe(3000);
  });
});

describe("enum parity with lib/content.ts", () => {
  const shape = inquirySchema.shape;
  it.each(["help", "budget", "stage"] as const)("%s options match inquiryOptions exactly", (key) => {
    expect(shape[key].options).toEqual([...inquiryOptions[key]]);
  });
});
