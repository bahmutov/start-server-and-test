# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.
// tests.mjs
import assert from 'node:assert';
import test from 'node:test';

test('that 1 is equal 1', () => {
  assert.strictEqual(1, 1);
});

test('that throws as 1 is not equal 2', () => {
  // throws an exception because 1 != 2
  assert.strictEqual(1, 2);
});

// run with `node tests.mjs`
