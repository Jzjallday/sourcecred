// @flow

import {type TimestampMs} from "../../util/timestamp";
import * as Timestamp from "../../util/timestamp";
import {
  type NodeEntry,
  type NodeEntryJson,
  normalizeNodeEntry,
  _titleSlug,
} from "./nodeEntry";

describe("plugins/initiatives/nodeEntry", () => {
  describe("normalizeNodeEntry", () => {
    it("should throw without a title", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {key: "no-title"};
      const f = () => normalizeNodeEntry(entry, timestampMs);
      expect(f).toThrow(TypeError);
    });

    it("should handle a minimal entry", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {title: "Most minimal"};
      const expected: NodeEntry = {
        title: "Most minimal",
        key: "most-minimal",
        contributors: [],
        timestampMs,
        weight: null,
      };
      expect(normalizeNodeEntry(entry, timestampMs)).toEqual(expected);
    });

    it("should handle an entry with weights", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {title: "Include weight", weight: 42};
      const expected: NodeEntry = {
        title: "Include weight",
        key: "include-weight",
        contributors: [],
        timestampMs,
        weight: 42,
      };
      expect(normalizeNodeEntry(entry, timestampMs)).toEqual(expected);
    });

    it("should handle an entry with contributors", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {
        title: "Include contributors",
        contributors: ["https://foo.bar/u/abc"],
      };
      const expected: NodeEntry = {
        title: "Include contributors",
        key: "include-contributors",
        contributors: ["https://foo.bar/u/abc"],
        timestampMs,
        weight: null,
      };
      expect(normalizeNodeEntry(entry, timestampMs)).toEqual(expected);
    });

    it("should handle an entry with timestamp", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {
        title: "Include timestamp",
        timestampIso: Timestamp.toISO(Date.parse("2018-02-03T12:34:56.789Z")),
      };
      const expected: NodeEntry = {
        title: "Include timestamp",
        key: "include-timestamp",
        contributors: [],
        timestampMs: Timestamp.fromNumber(
          Date.parse("2018-02-03T12:34:56.789Z")
        ),
        weight: null,
      };
      expect(normalizeNodeEntry(entry, timestampMs)).toEqual(expected);
    });

    it("should handle an entry with key", () => {
      const timestampMs: TimestampMs = Timestamp.fromNumber(123);
      const entry: NodeEntryJson = {
        title: "Include key",
        key: "much-different-key",
      };
      const expected: NodeEntry = {
        title: "Include key",
        key: "much-different-key",
        contributors: [],
        timestampMs,
        weight: null,
      };
      expect(normalizeNodeEntry(entry, timestampMs)).toEqual(expected);
    });
  });

  describe("_titleSlug", () => {
    it("should handle example titles", () => {
      const expected: {[string]: string} = {
        "should-be-lowercased": "Should-be-LowerCased",
        "special-characters-as-dashes": "Special@$Characters #As$dashes",
        "no-starting-trailing-dashes": "-No starting / trailing dashes-",
        "no-duplicate-dashes": "No - Duplicate -%- Dashes",
      };
      const actual = Object.keys(expected).map((k) => _titleSlug(expected[k]));
      expect(actual).toEqual(Object.keys(expected));
    });
  });
});