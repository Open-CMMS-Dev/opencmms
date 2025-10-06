# Open CMMS Governance

Open CMMS is an open-source project maintained by a small group of core maintainers with input from the broader community. This document clarifies how decisions are made, how maintainers are added, and how releases are managed.

## Roles

- **Core Maintainers** – Own the long-term direction of the project. They review and merge pull requests, manage releases, and steward the roadmap.
- **Module Maintainers** – Contributors who own a specific module or subsystem (for example, Work Orders or Asset Registry). They have merge rights for their area once approved by Core Maintainers.
- **Contributors** – Anyone opening pull requests, filing issues, or participating in discussions.

The initial Core Maintainers group consists of:

- @opencmms/maintainers (GitHub team)

## Decision Making

- **Consensus Seeking** – Most decisions (features, architectural changes) are made through consensus among the Core Maintainers and active contributors. Discussions happen in GitHub Issues or Discussions.
- **Request for Comments (RFCs)** – Large architectural changes require an RFC issue tagged with `rfc`. The proposal remains open for at least five business days to gather feedback before a decision is made.
- **Disagreements** – If consensus cannot be reached, Core Maintainers make the final decision with an explanation shared publicly.

## Becoming a Maintainer

We grant maintainer access to contributors who:

1. Consistently deliver high-quality contributions across code, docs, or community support.
2. Demonstrate alignment with the Code of Conduct and project values.
3. Are willing to review pull requests and triage issues regularly.

New maintainers are nominated by an existing maintainer and approved by a simple majority of the Core Maintainers.

## Release Process

1. Ensure `main` is stable and passing CI.
2. Draft release notes summarizing changes since the previous release.
3. Tag a release (e.g., `v0.2.0`) and publish on GitHub with the changelog.
4. Announce the release in GitHub Discussions.
5. Update documentation for any breaking changes.

## Roadmap Management

- The roadmap is tracked via GitHub Projects.
- Issues are triaged weekly, labeled, and assigned to milestones.
- Community members are encouraged to comment on roadmap items and volunteer to help.

## Governance Changes

Any changes to this document require approval by a majority of Core Maintainers and must be proposed through a pull request with community review.

We aim to build a transparent, inclusive community—thank you for being part of it!
