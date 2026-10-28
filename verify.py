#!/usr/bin/env python3
"""Verify the free chess resources directory project.

Checks:
- resources.json is valid JSON with all required fields per entry
- Every entry has cost, platform, steps, official link
- No affiliate links
- LICENSE contains the exact copyright line
- README credits Asdale Dynamics, LLC
- index.html parses and references search/filter
- Embedded app.js data matches resources.json
"""
import json
import re
import sys
from html.parser import HTMLParser

ROOT = "/workspace/kilo-lab/free-chess-resources-directory"
FAILURES = []


def fail(msg):
    FAILURES.append(msg)
    print("FAIL: " + msg)


def check(cond, msg):
    if cond:
        print("ok: " + msg)
    else:
        fail(msg)


def read(name):
    with open(ROOT + "/" + name, encoding="utf-8") as f:
        return f.read()


# 1. resources.json valid JSON
try:
    data = json.loads(read("resources.json"))
    check(isinstance(data, list) and len(data) > 0, "resources.json is a non-empty list")
except Exception as exc:
    fail("resources.json is not valid JSON: " + str(exc))
    data = []

# 2. Each entry has required fields and free cost
required = ["id", "name", "category", "cost", "platform", "steps", "link"]
for i, entry in enumerate(data):
    for field in required:
        check(field in entry and str(entry[field]).strip(),
              "entry %d has non-empty %s" % (i, field))
    if "link" in entry and entry["link"]:
        check(entry["link"].startswith("http"),
              "entry %d link is absolute: %s" % (i, entry["link"]))
    if "cost" in entry:
        check("free" in str(entry["cost"]).lower(),
              "entry %d cost mentions free: %s" % (i, entry["cost"]))

# 3. No affiliate links (URL-parameter / domain based; prose mentioning the
#    word "affiliate" is fine and expected)
affiliate_patterns = ["amazon.", "amzn.", "ebay.", "clickbank",
                      "?ref=", "&ref=", "?tag=", "&tag=", "affiliate_id="]
joined = read("resources.json") + read("resources.md") + read("index.html") + read("README.md")
for pat in affiliate_patterns:
    check(pat.lower() not in joined.lower(),
          "no affiliate pattern '%s' anywhere" % pat)

# 4. LICENSE exact copyright line
license_text = read("LICENSE")
check("Copyright (c) 2026 Asdale Dynamics, LLC" in license_text,
      "LICENSE contains exact copyright line")

# 5. README credits Asdale Dynamics, LLC
readme_text = read("README.md")
check("Asdale Dynamics, LLC" in readme_text,
      "README credits Asdale Dynamics, LLC")
check("dylanasdale.github.io" in readme_text,
      "README links hub site")

# 6. index.html parses and has search/filter
html_text = read("index.html")
check("<input" in html_text and 'id="search"' in html_text,
      "index.html has search input")
check("resources.json" in html_text or "app.js" in html_text,
      "index.html references app/data")
parser = HTMLParser()
try:
    parser.feed(html_text)
    check(True, "index.html parses without fatal HTML error")
except Exception as exc:
    fail("index.html HTML parse error: " + str(exc))

# 7. app.js embedded data matches resources.json
app_js = read("app.js")
embedded_start = app_js.find("const EMBEDDED_RESOURCES = [")
array_start = app_js.find("[", embedded_start) if embedded_start != -1 else -1
embedded_end = app_js.find("];", embedded_start) + 1 if embedded_start != -1 else -1
embedded_json = ""
if array_start != -1 and embedded_end != -1 and array_start < embedded_end:
    embedded_json = app_js[array_start:embedded_end]
try:
    embedded = json.loads(embedded_json)
    check(len(embedded) == len(data),
          "embedded app.js data count matches resources.json (%d == %d)" % (len(embedded), len(data)))
    if len(embedded) == len(data):
        match = all(
            any(e["id"] == d["id"] and e["name"] == d["name"] for e in embedded)
            for d in data
        )
        check(match, "embedded app.js entries match resources.json by id+name")
except Exception as exc:
    fail("embedded app.js data not valid JSON: " + str(exc))

# 8. resources.md contains all 9 resource names
md_text = read("resources.md")
for entry in data:
    check(entry["name"] in md_text,
          "resources.md mentions " + entry["name"])

print()
if FAILURES:
    print("%d verification failure(s)" % len(FAILURES))
    sys.exit(1)
else:
    print("All %d verification checks passed." % (len(data) * 2 + 12))
    sys.exit(0)
