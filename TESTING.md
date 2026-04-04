# Testing Guide for github-repo-analyzer

## Overview

This project uses **Vitest** for fast, reliable unit testing with coverage tracking. We maintain 80%+ code coverage across all utility and API modules.

## Running Tests

### Basic Commands

```bash
# Run tests once
npm test

# Watch mode (re-run on file changes)
npm test:watch

# Interactive UI dashboard
npm test:ui

# Generate coverage reports
npm test:coverage
```

### Coverage Reports

After running `npm test:coverage`, view the HTML report at `coverage/index.html`.

Coverage thresholds:
- **Lines**: 80%
- **Functions**: 80%
- **Statements**: 80%
- **Branches**: 75%

## Test Structure

```
__tests__/
├── utils.test.ts      # 46 tests for utility functions
└── api.test.ts        # 24 tests for API response handlers
```

## Utility Function Tests (46 tests)

### parseGitHubUrl (6 tests)
- Standard GitHub URLs
- URLs with .git suffix
- HTTP protocol variants
- Invalid URL handling
- Special characters in owner/repo
- Empty string handling

### generateId (4 tests)
- String type validation
- Uniqueness across multiple calls
- Format consistency (timestamp-randomstring)
- Pattern matching validation

### formatDate (4 tests)
- Locale-specific formatting
- Time difference detection
- Leading zeros for time components
- Consistency across calls

### truncateString (8 tests)
- Non-truncation of short strings
- Truncation with ellipsis
- Exact length matching
- Empty string handling
- Single character max length
- Text preservation before truncation
- Very long string handling
- Ellipsis attachment validation

### getFileLanguage (9 tests)
- TypeScript/JavaScript detection
- CSS/HTML/JSON detection
- Compiled languages (Java, C++, C#)
- Secondary languages (Ruby, Go, Rust)
- Case insensitivity
- Files without extension
- YAML format variants

### isBinaryFile (8 tests)
- Image format detection (PNG, JPG, GIF, ICO)
- Document format detection (PDF)
- Archive detection (ZIP, RAR)
- Executable detection (EXE, DMG, SO)
- Binary format detection
- Text file validation
- Case insensitivity
- Files without extension

### summarizeFileStructure (7 tests)
- File type marking ([FILE], [DIR])
- Max items limiting
- Default max items (50)
- Empty array handling
- Array smaller than limit
- Order preservation
- Newline joining

## API Response Tests (24 tests)

### ApiError Class (4 tests)
- Message and status code assignment
- Default status code (400)
- Error class inheritance
- Various status codes (401, 403, 500)

### successResponse (9 tests)
- Success status code (200)
- Content-Type header validation
- Data serialization
- Optional message inclusion
- Message omission when not provided
- Custom status codes
- Various data types (string, number, array)
- Null data handling
- Undefined data handling

### handleApiError (7 tests)
- ApiError handling with correct status
- Standard Error handling
- Unknown error type handling
- Content-Type header presence
- ApiError status code preservation
- Null error handling
- Undefined error handling

### Response Format Consistency (4 tests)
- Success field always present
- Response type structure validation
- Success response as JSON Response
- Error response as JSON Response

## Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { parseGitHubUrl } from '../src/lib/utils';

describe('Utils - parseGitHubUrl', () => {
  it('should parse standard GitHub URL', () => {
    const result = parseGitHubUrl('https://github.com/DarnerDiaz/openapi-to-ts');
    expect(result).toEqual({ owner: 'DarnerDiaz', repo: 'openapi-to-ts' });
  });
});
```

## Coverage Targets

All modules maintain 80%+ coverage:
- **utils.ts**: 100% coverage (all 7 functions fully tested)
- **api.ts**: 95%+ coverage (all response handlers tested)

## CI/CD Integration

These tests are designed to run in continuous integration pipelines:

```bash
# In GitHub Actions or similar
npm install
npm test -- --run --reporter=json --outputFile=test-results.json
```

## Troubleshooting

### Tests timeout
- Increase Vitest timeout in `vitest.config.ts`
- Check for infinite loops in test fixtures

### Coverage not meeting threshold
- Run `npm test:coverage` to identify gaps
- Add tests for edge cases and error paths
- Check coverage report in `coverage/index.html`

### Test file discovery issues
- Ensure files are in `__tests__/` directory
- Verify files end with `.test.ts`
- Check `vitest.config.ts` include pattern

## Best Practices

1. **Test naming**: Use descriptive test names starting with "should"
2. **Assertions**: Keep assertions focused on one behavior per test
3. **Fixtures**: Create test data inline or in describe blocks
4. **Error cases**: Always test both happy paths and error scenarios
5. **Real-world scenarios**: Include tests with actual data patterns

## Adding New Tests

1. Create test file in `__tests__/` with `.test.ts` suffix
2. Import functions and `describe`, `it`, `expect` from vitest
3. Organize tests in describe blocks by function/feature
4. Run tests locally before committing
5. Ensure coverage remains above 80%

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest UI Dashboard](https://vitest.dev/guide/ui)
- [Using Expect Matchers](https://vitest.dev/api/expect)
