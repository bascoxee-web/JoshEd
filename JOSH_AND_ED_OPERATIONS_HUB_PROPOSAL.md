# Proposal: JOSH AND ED Operations Hub

**Prepared for:** Josh and Ed

**Prepared by:** Manus AI

**Date:** September 19, 2026

**Proposal status:** Presentation-ready prototype and recommended production plan

---

## Executive recommendation

Josh and Ed should approve the JOSH AND ED Operations Hub as a controlled management layer for the businesses they oversee: Titusville Self-Storage, Pizza Restaurant, Quartz Blanc, and Skinny Cookies.

The hub is designed to reduce the time required to assemble a current management picture from separate systems. It brings priorities, exceptions, customer-facing follow-up, reviews, schedules, business performance, and administrative activity into one role-aware workspace. It does not replace Easy Storage Solutions, the restaurant point-of-sale system, the Skinny Cookies commerce platform, payment systems, or other systems that already hold the source records.

The recommended approach is a staged pilot. Begin with Titusville Self-Storage, where occupancy, late-payment exceptions, support requests, gate activity, and customer reviews have a clear operational connection. After the owners approve the access model and the first connector works with test data, add Pizza Restaurant, Skinny Cookies, and Quartz Blanc according to each owner’s authorized scope.

> **The business value is not another system of record. The value is one accountable operating view across the systems the businesses already use.**

## The management problem

The businesses already produce useful information. The difficulty is that the information is separated by business and by vendor system. Owners and managers must open several dashboards, request updates, or manually combine details before they can decide what needs attention.

This creates four recurring problems. First, important exceptions can remain unnoticed until someone checks the right system. Second, follow-up work is difficult to assign and track consistently. Third, access decisions can become informal when different people need different business visibility. Fourth, executive actions are difficult to review after the fact when they are spread across messages, spreadsheets, and individual system histories.

The hub addresses these problems by organizing operational context without blending the underlying business records.

## Proposed solution

The JOSH AND ED Operations Hub provides a shared portfolio workspace with separate business boundaries. Each business can have its own connector, authorized users, metrics, review feed, and operating tasks. The executive view can compare selected signals while preserving the source system as the authoritative location for the underlying record.

The hub has three practical layers:

1. **Portfolio visibility** gives Josh and Ed a high-level view of business performance and outstanding executive work.
2. **Operating workspaces** help staff and managers act on reminders, late payments, support requests, gate activity, notes, reviews, schedules, and reports.
3. **Control and accountability** manages permissions, connector readiness, shared audit history, and owner approvals.

## What is included in the prototype

| Workspace | Business purpose |
|---|---|
| Executive Hub | Compare selected operating signals across the authorized portfolio without merging source records. |
| Operations | Coordinate tasks, staff priorities, exceptions, and next actions. |
| SMS Reminders | Prepare operational reminders and change-based notifications. |
| Late Payments | Review payment exceptions and organize follow-up work while Easy Storage Solutions remains the payment source. |
| Support Requests | Track customer and staff requests by urgency, business, and assignment. |
| Gate Access | Review gate activity and access exceptions for Titusville Self-Storage. |
| Staff Notes | Keep operational notes associated with a business and responsible person. |
| Reports | Present management metrics and portfolio trends. |
| Calendar & Reminders | Let Marisa add, modify, reschedule, cancel, and prepare meeting reminders through SMS and email templates. |
| Google Reviews | View ratings and reviews across authorized businesses, identify reviews needing a reply, and prepare owner responses. |
| Access Settings | Let Josh and Ed control business visibility for staff profiles. |
| Audit Log | Search activity by person, action, business, and date range. |
| Setup Center | Show connector ownership, readiness, data scope, and manual production setup requirements. |
| Call Conferencing | Provide a business-context workspace for owner and partner calls when a provider is connected. |

## Google Reviews workspace

The Google Reviews workspace gives owners one place to review reputation signals across the businesses. It includes an average rating summary, the number of reviews requiring a response, business filtering, keyword search, review cards, star ratings, reply status, and a prepare-reply action.

The access behavior follows the current ownership model. Josh sees Titusville Self-Storage, Pizza Restaurant, and Skinny Cookies. Ed sees those businesses plus Quartz Blanc. Marisa can view reviews for her authorized businesses but cannot change connector credentials. The settings-only administrator remains blocked from business review data.

The prototype uses representative review records so the workflow can be demonstrated immediately. Live review data requires the owners to connect each verified Google Business Profile through a secure production setup process. Google’s official Business Profile documentation describes APIs for working with review data, including listing and replying to reviews.[1] Credentials should remain server-side, and every sync and reply action should be recorded in the audit history.

## Calendar and reminder workflow

Calendar & Reminders gives Marisa a defined administrative responsibility without giving her access to change sales, payments, orders, inventory, or ownership settings. She can add a meeting, follow-up, or owner review; modify the date and time; reschedule or cancel the item; select recipients; choose SMS, email, or both; and prepare the reminder from a ready-made template.

Josh and Ed retain visibility into the schedule and related changes. In production, the system should record the sender, recipient, selected template, delivery channel, timestamp, delivery result, and related calendar item. The owners can later decide whether approved events should remain inside the hub or also publish to Google Calendar or Microsoft 365.

## Access and responsibility model

The access model is intentionally divided so administrative support does not become unrestricted business access.

| User | Recommended scope |
|---|---|
| Josh | Owner access for Titusville Self-Storage, Pizza Restaurant, and Skinny Cookies. Quartz Blanc remains hidden unless the owners change the agreement. |
| Ed | Owner and partnership access for Titusville Self-Storage, Pizza Restaurant, Skinny Cookies, and Quartz Blanc. |
| Marisa | Executive assistant access limited to owner-approved businesses and tasks. She may manage schedules, prepare reminders, coordinate support work, and view approved operational information. Her actions remain visible to Josh and Ed. |
| Admin User | Settings administration only. This user may maintain connector readiness, configuration, and permission settings but cannot view or modify sales, payments, orders, inventory, or other core business data. |

Josh and Ed should approve this matrix before live data is connected. Owner permissions should not be implemented as informal shared credentials. Each person should sign in with an individual account so the audit log can identify who performed an action.

## Expected business benefits

### Faster management decisions

The hub shortens the path from an exception to an action. An owner can see the relevant signal, identify the responsible person, and open the next operational workspace without reconstructing the context manually.

### Less repetitive follow-up

Calendar templates, SMS and email preparation, support queues, late-payment review, and Google Review reply status reduce repeated coordination work. The hub can organize the work while the existing source systems continue to hold the official records.

### Clearer accountability

The shared Audit Log records permission changes, approvals, exports, review actions, schedule changes, and other executive activity. Search and date filters make it easier to investigate a specific change without scanning the entire timeline.

### Safer delegation

Marisa can take on repeatable coordination work without receiving unrestricted access to business-critical records. Josh and Ed retain control over important data and can review her actions through shared logs.

### Expandable operating model

A future business can be added as another workspace with its own data connector, permissions, metrics, review locations, and operating tasks. This avoids redesigning the entire hub each time the portfolio changes.

## Recommended production architecture

The browser should handle the interface, filters, approvals, and user interaction. A secure backend should handle authentication, vendor API calls, database writes, secret storage, sync schedules, notification delivery, rate limits, and audit persistence.

The first production version should use deterministic synchronization. A worker can read changed records, normalize the fields needed by the hub, compare them with the last known state, and write only meaningful changes. Idempotent writes are important because a retry should not create duplicate customers, orders, reviews, or notifications.

The central database should retain the source system and source identifier for each imported record. Recommended domains include `customers`, `payments`, `orders`, `inventory`, `gate_logs`, `reviews`, `calendar_items`, `notifications`, and `audit_events`. Business and permission identifiers should be present so records cannot be shown outside the user’s approved scope.

## Implementation plan

### Phase 1: Owner approval and pilot definition

Josh and Ed confirm the business list, ownership agreements, role matrix, review locations, source systems, and the first pilot scope. The recommended pilot is Titusville Self-Storage.

### Phase 2: Secure foundation

The production team configures individual authentication, server-side secrets, database persistence, audit persistence, backup policy, HTTPS, and restricted administrative routes. No live credentials should be stored in the frontend or entered into the prototype.

### Phase 3: Titusville pilot

Connect Easy Storage Solutions in a non-production or limited-data environment. Validate occupancy, late-payment exceptions, support requests, gate logs, calendar reminders, permissions, and audit records. Connect the Titusville Google Business Profile after the review location is confirmed.

### Phase 4: Owner acceptance review

Josh, Ed, and Marisa each sign in with their own accounts. They confirm that the visible businesses, available actions, review locations, calendar permissions, and audit visibility match the approved matrix.

### Phase 5: Portfolio expansion

After the pilot is stable, connect Pizza Restaurant and Skinny Cookies. Add Quartz Blanc according to Ed’s partnership scope and any partner-approved visibility rules. Introduce additional businesses through the same workspace and connector pattern.

## Owner decisions required

Before production setup begins, Josh and Ed should decide the following:

- Which Google Business Profile locations belong to each business and who may reply to reviews.
- Which calendar provider, SMS provider, email provider, and conferencing provider the hub should use.
- Which records Marisa may view, create, modify, export, or send.
- Whether the Admin User may change connector settings without owner approval, or only prepare changes for approval.
- Which database, hosting account, domain, backup policy, and retention period will be used.
- Which business will serve as the pilot and what acceptance criteria will determine success.

## Risks and controls

The most important risk is accidental overexposure of business data. The control is server-enforced role and business scoping, not only visual hiding in the interface.

The second risk is treating the hub as the source of truth when it is an aggregation layer. Each workspace should clearly identify the source system and last sync time. The owner should be able to see when a connector is not connected or when data is stale.

The third risk is duplicate or unauthorized notifications. Change detection, opt-out handling, delivery logs, and idempotent notification keys should be required before automated SMS or email is enabled.

The fourth risk is unclear review ownership. Google review replies should be attributable to an authorized business user, and the system should preserve the response history in the audit log.

## Success measures for the pilot

The pilot should be evaluated using practical measures rather than activity volume. Recommended measures include the time required to prepare the daily owner view, the number of late-payment or support exceptions assigned within one business day, the percentage of calendar reminders sent through approved templates, the percentage of Google reviews reviewed within the agreed response window, and the number of permission or connector issues discovered during acceptance testing.

The pilot should also confirm that the hub reduces duplicate checking without creating a second manual reporting burden. If owners still need to recreate the same report outside the hub, the next iteration should focus on the missing source or workflow rather than adding more dashboard cards.

## Approval request

Josh and Ed are asked to approve the following decision:

> **Approve a staged pilot of the JOSH AND ED Operations Hub beginning with Titusville Self-Storage, using owner-approved permissions, secure connector setup, and test data before any production synchronization.**

Approval of the prototype does not authorize live access to financial, customer, payment, employee, or partner records. Live activation should occur only after the owners approve the permission matrix, credentials, database, security controls, backup policy, and acceptance test results.

**Josh approval:** _______________________________  **Date:** __________________

**Ed approval:** _________________________________  **Date:** __________________

## References

[1]: https://developers.google.com/my-business/content/review-data "Google Business Profile APIs: Work with review data"

[2]: https://developers.google.com/my-business "Google Business Profile APIs"

[3]: https://www.storageunitsoftware.com/ "Easy Storage Solutions official product site"
