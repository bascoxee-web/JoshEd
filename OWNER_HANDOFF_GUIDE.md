# JOSH AND ED Operations Hub

## Owner Handoff and Setup Guide

### Executive summary

The **JOSH AND ED Operations Hub** is a management layer for Titusville Self-Storage, Pizza Restaurant, Quartz Blanc, and Skinny Cookies. It gives owners and executives one place to review business performance, assign priorities, manage access, coordinate support work, and review important actions.

The hub is not intended to replace Easy Storage Solutions, a restaurant point-of-sale system, an e-commerce platform, or a payment processor. Those systems remain the source of truth for their own records. The hub is designed to organize the information and workflow that managers currently assemble manually.

The current prototype is presentation-ready. The owner can use the in-app **Setup Center** to mark each connector ready for configuration. Production credentials, real authentication, database persistence, automated jobs, and live conferencing must be configured in the production environment before the system handles real business data.

## What the hub does

The Executive Hub provides a portfolio view without merging business records. It compares Pizza Restaurant sales, Skinny Cookies activity, and Titusville occupancy in one dashboard. It also provides operational workspaces for SMS reminders, late-payment review, support requests, gate events, staff notes, and management reporting.

The access model is designed around the current organization:

| User | Access | Quartz Blanc | Shared executive logs |
|---|---|---:|---:|
| Josh | Owner with full business and permission access for Titusville, Pizza Restaurant, and Skinny Cookies | Hidden | Yes |
| Ed | Owner with full business and partnership access for Titusville, Pizza Restaurant, Skinny Cookies, and Quartz Blanc | Visible | Yes |
| Marisa | Executive Assistant with limited, owner-controlled view access | Owner-controlled | View-only shared logs |
| Admin User | Settings administrator; can maintain configuration but cannot view or modify sales, payments, orders, or other core business data | No business data | Configuration audit only |

Josh and Ed can use **Access Settings** to decide what Marisa can view. Marisa cannot change those permissions. The separate **Admin User** can maintain settings and connector configuration, but the account is intentionally blocked from sales, payments, orders, and other important business data. Permission changes should be written to the audit log with the actor, timestamp, business, previous value, and new value. The owner workspace includes an **Undo last change** control that restores the previous permission state during the current session.

## Business benefits

The main benefit is **management visibility**. Owners can see the most important signals without opening several systems or waiting for separate updates. This shortens the time between an issue appearing and a manager acting on it.

The second benefit is **clear accountability**. Tasks can be associated with a business, owner, manager, or partner. The audit log creates a shared record of approvals, exports, permission changes, and executive actions.

The third benefit is **less repetitive follow-up**. Once the source systems are connected, the hub can identify changed records and create work for the appropriate person. SMS reminders and notifications should be sent only when a record changes, which helps avoid duplicate messages.

The fourth benefit is **controlled growth**. A new business can be added as a workspace with its own permissions, source connector, reporting metrics, and audit scope. The central schema is designed around reusable domains such as customers, payments, orders, inventory, and gate logs.

The fifth benefit is **better owner conversations**. A manager can bring an issue to a call with the relevant business context already visible. The conferencing workspace is ready for a provider such as Zoom, Google Meet, or Twilio Video once the owner chooses a provider and supplies credentials.

## Owner setup sequence

1. **Confirm the business and permission matrix.** Approve the users, business workspaces, partner visibility, admin roles, and shared-log rules. Do not connect live data until this matrix is approved.

2. **Choose the source systems.** Confirm the exact Easy Storage Solutions account, Pizza point-of-sale provider, Skinny Cookies commerce platform, SMS/VoIP provider, and database engine. The prototype uses neutral connector labels until the vendor names are confirmed.

3. **Create production credentials.** Create separate service credentials for each connector. Use least-privilege access. Do not paste production secrets into the frontend or send them through chat.

4. **Configure the central database.** Choose PostgreSQL or MySQL. Create separate tables or schemas for `customers`, `payments`, `orders`, `inventory`, and `gate_logs`. Each source record should retain its source name and source identifier.

5. **Enable the sync worker.** Run a background worker every ten minutes. Use `updated_at`, version numbers, or source cursors to read only changed records. Use idempotent upserts so a retry cannot duplicate data.

6. **Enable change-only notifications.** Compare normalized values before sending SMS, VoIP, or staff notifications. Record the notification decision and provider response in an audit table.

7. **Connect hosting and security.** Point the chosen domain through Cloudflare, enforce HTTPS, restrict administrative routes, and place API keys in server-side environment variables or a secrets vault. GoDaddy may remain the domain registrar if DNS is managed through Cloudflare.

8. **Test with non-production records.** Test account linking, payments, orders, inventory, gate logs, permissions, audit history, notification opt-out behavior, and failed sync recovery before using live records.

9. **Run an owner acceptance review.** Josh, Ed, and Marisa should each sign in with their own account and confirm that the visible businesses and actions match the approved matrix.

## Recommended production architecture

The browser should handle presentation, filters, approvals, and user interaction. A secure backend should handle vendor API calls, database writes, scheduled synchronization, secret storage, webhook verification, rate limits, and audit persistence.

The first production version should use deterministic synchronization rather than AI. The worker should fetch changed records, normalize them, compare them with the last known state, and write an audit event when a meaningful change occurs. AI can be added later for support-ticket classification or management summaries, but it should not be responsible for payment truth or permission decisions.

The ten-minute schedule is appropriate for routine operational visibility. If the owners later require near-real-time gate or order events, use vendor webhooks where supported and retain the ten-minute job as a reconciliation check.

## What is ready in the prototype

The prototype includes the neutral public landing page, role-based sign-in preview, profile-specific business visibility, Executive Hub charts, Access Settings, shared Audit Log, Call Conferencing workspace, connector readiness cards, sync rules, central data schema, and mobile-responsive styling.

The **Setup Center** is intentionally manual. It shows who owns each connector, what data it covers, what remains to be configured, and the safe boundary for entering credentials. It does not pretend that an integration is live when a credential or API connection has not been verified.

## What still requires owner setup

Real authentication requires an identity provider or a secure application backend. Real permission persistence requires a database. Real synchronization requires vendor API credentials and confirmed API access. Real SMS, VoIP, and conferencing require provider accounts, approved sender numbers, and server-side credentials. Production hosting requires the owners to choose the domain, deployment account, database, and backup policy.

## Suggested owner presentation

Begin with the problem: each business already has useful information, but the owners must manually assemble the current picture. Then show the portfolio chart and explain that the hub does not replace source systems; it makes their important changes visible in one place.

Next, demonstrate Marisa’s Access Settings and the shared Audit Log. This shows that visibility is controlled rather than accidental. Select Josh to demonstrate owner access and Quartz Blanc hidden. Select Ed to demonstrate partnership visibility. Select Marisa to demonstrate the limited assistant view. Select Admin User to demonstrate settings-only access with no sales dashboard. Finish with the Setup Center and explain that the owners retain control over credentials and activation.

The recommended decision is to approve a small pilot with one source system first. Titusville Self-Storage is a practical starting point because occupancy, payment follow-up, support requests, and gate events already have clear operational value. After the pilot is stable, add restaurant sales and Skinny Cookies orders.

## References

[1]: https://www.storageunitsoftware.com/ "Easy Storage Solutions official product site"

[2]: https://support.davincilock.com/connect-a-facility-to-easy-storage-solutions-ess?hsLang=en "Easy Storage Solutions facility connection reference"

## Calendar and reminder workflow

The **Calendar & Reminders** workspace gives Marisa a defined administrative task that does not change sales, payments, orders, inventory, or ownership settings. She can add, edit, reschedule, cancel, and prepare reminders for meetings and follow-ups. Each item includes a business, date, time, recipients, a ready-made template, and the selected delivery channels.

The built-in templates cover owner meetings, follow-up tasks, and owner reviews. Marisa can prepare an SMS reminder, an email reminder, or both. In production, sending should use the approved SMS and email providers, respect opt-out rules, and record the sender, recipient, template, timestamp, delivery result, and related calendar item in the audit log. Josh and Ed can review the schedule and changes without giving Marisa access to sensitive business modification controls.

A production calendar connector should be selected by the owners. The first version can keep the hub as the operational calendar and optionally publish approved events to Google Calendar or Microsoft 365. The connector should use server-side credentials and should never expose access tokens in the browser.

## Google Reviews workspace

The **Google Reviews** workspace gives Josh and Ed one place to review ratings and customer feedback across their authorized businesses. It includes portfolio metrics, business filtering, review search, reply-status tracking, and a prepared reply action. Josh sees Titusville Self-Storage, Pizza Restaurant, and Skinny Cookies; Ed also sees Quartz Blanc. Marisa can view reviews for her authorized businesses but cannot change connector credentials.

The current preview uses representative review records so the workflow can be presented immediately. To show live Google reviews, the owner must connect each verified Google Business Profile through the secure production setup flow. The production connector should use server-side OAuth credentials, preserve each location’s business scope, respect Google API quotas and policies, and record sync timestamps and reply actions in the shared audit log.
