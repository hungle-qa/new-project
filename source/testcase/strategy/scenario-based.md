# Scenario-Based Testing

**Philosophy:** Test smarter, not harder. Achieve maximum coverage with minimum test cases.

## Core Techniques

### 1. Equivalence Partitioning (EP)
Divide inputs into groups (partitions) where all values in a group are expected to produce the same behavior. Test one representative from each partition instead of every possible value.

**Example:** For an age field accepting 18-65:
- Partition 1: Below range (0-17) -> Test with 10
- Partition 2: Valid range (18-65) -> Test with 30
- Partition 3: Above range (66+) -> Test with 70

### 2. Boundary Value Analysis (BVA)
Test at the exact edges of equivalence partitions. Bugs cluster at boundaries.

**Example:** For age 18-65:
- Test: 17, 18, 19 (lower boundary)
- Test: 64, 65, 66 (upper boundary)

### 3. End-to-End (E2E) Pathing
Map all possible user journeys through the feature. Identify the critical paths (happy paths) and alternative paths (error paths, edge cases).

**Process:**
1. Identify entry points
2. Map decision points (branches)
3. Trace all unique paths from entry to exit
4. Prioritize paths by user frequency and business impact
5. Create one test case per unique path

## When to Use

- Features with clear user flows and defined input boundaries
- Forms, wizards, multi-step processes
- Features where input validation is critical
- When you need maximum coverage with fewest test cases

## Approach Summary

1. **Identify scenarios** - Map all user journeys
2. **Apply EP** - Group inputs into partitions
3. **Apply BVA** - Test boundary values
4. **Trace E2E paths** - Cover all unique paths
5. **Prioritize** - Focus on high-impact paths first
