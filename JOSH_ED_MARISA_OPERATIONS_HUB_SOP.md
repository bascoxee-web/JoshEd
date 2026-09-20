# Standard Operating Procedure Guide
## JOSH AND ED Operations Hub

**Prepared for:** Josh, Ed, and Marisa  
**Prepared by:** Manus AI  
**Version:** 1.0  
**Date:** September 20, 2026  
**Applies to:** Titusville Self-Storage, Pizza Restaurant, Quartz Blanc, and Skinny Cookies

---

## 1. Purpose

This Standard Operating Procedure explains how Josh, Ed, and Marisa should use and govern the JOSH AND ED Operations Hub during the recommended launch sequence.

The hub is an operating layer. It organizes information, exceptions, tasks, reminders, reviews, approvals, and management visibility across several businesses. It does not replace Easy Storage Solutions, the restaurant point-of-sale system, the Skinny Cookies commerce platform, payment processors, accounting systems, or other systems that remain the source of truth for their own records.

This guide is written for the staged launch beginning with Titusville Self-Storage and expanding only after the owners approve the results.

> **Operating principle:** The hub coordinates work and visibility. The original business system remains authoritative for financial, customer, payment, order, and inventory records.

---

## 2. Roles and authority

### Josh — Owner

Josh has owner access to Titusville Self-Storage, Pizza Restaurant, and Skinny Cookies. Quartz Blanc is not visible to Josh unless Josh and Ed approve a change to the partnership access model.

Josh may review business performance, approve permissions, review audit activity, approve production connectors, and make owner-level decisions for his authorized businesses. Josh must not use another person’s account, share credentials, or approve a permission change without confirming the affected business and user.

### Ed — Owner and partnership manager

Ed has owner and partnership access to Titusville Self-Storage, Pizza Restaurant, Skinny Cookies, and Quartz Blanc. Ed may review the full authorized portfolio, approve partnership-related visibility, review audit activity, and manage owner-level decisions for the businesses within his scope.

Ed must confirm that Quartz Blanc data is shown only to people approved under the partnership arrangement. Any change to Quartz Blanc access must be recorded and reviewed by the appropriate owners or partners.

### Marisa — Executive Assistant

Marisa has limited, owner-controlled access. Her permitted work may include calendar management, meeting reminders, support coordination, approved operational follow-up, review monitoring, and preparation of SMS or email messages.

Marisa may add, edit, reschedule, and cancel calendar items when the relevant business and recipients are within her approved scope. She may prepare a review response or notification for owner approval. She must not change ownership, permissions, connector credentials, sales data, payment records, orders, inventory, or other protected business information.

Marisa’s actions are visible to Josh and Ed through the shared audit log.

### Separate Admin User — Settings administrator

The separate Admin User is responsible for technical configuration but must not view or modify sales, payments, orders, inventory, customer financial data, or other important business records.

The Admin User may maintain connector readiness, configuration settings, deployment settings, and technical setup. Owner approval is required before a connector is connected to live business data or before a permission model is changed.

---

## 3. Launch sequence

The hub must be launched in the following order. Do not skip a phase because the next phase depends on the controls established in the previous phase.

| Phase | Objective | Owner exit decision |
|---|---|---|
| 1 | Approve businesses, users, permissions, and review locations | Josh and Ed approve the access matrix in writing. |
| 2 | Establish real authentication and secure accounts | Each user signs in individually and passes access testing. |
| 3 | Establish the database and persistent audit log | Test records, audit events, backups, and rollback procedures work. |
| 4 | Deploy a secure staging environment | Staging is separated from production and secrets are protected. |
| 5 | Connect Titusville Self-Storage first | Titusville data is correctly scoped and sync health is visible. |
| 6 | Test permissions and syncs with sample data | Josh, Ed, Marisa, and Admin User pass role testing. |
| 7 | Connect Titusville Google Reviews | Reviews display for the correct authorized users. |
| 8 | Run a limited pilot | Owners approve pilot results and unresolved issues are documented. |
| 9 | Add Pizza Restaurant and Skinny Cookies | Each business passes connector and permission testing. |
| 10 | Add Quartz Blanc within Ed’s approved scope | Partnership visibility and audit rules are confirmed. |
| 11 | Enable notifications, calendar, and conferencing integrations | Sending, opt-out, delivery, and audit behavior are tested. |
| 12 | Move to full production operation | Josh and Ed approve production launch. |

---

## 4. Phase 1 — Approve the access and business matrix

### Procedure

1. Josh and Ed review the business list in the hub.
2. Josh confirms access to Titusville Self-Storage, Pizza Restaurant, and Skinny Cookies.
3. Ed confirms access to Titusville Self-Storage, Pizza Restaurant, Skinny Cookies, and Quartz Blanc.
4. Josh and Ed decide which businesses Marisa may view and which operational tasks she may perform.
5. Josh and Ed confirm that the Admin User has settings access but no business-data access.
6. The owners identify the correct Google Business Profile location for each business.
7. Any partner-specific restriction for Quartz Blanc is documented before data is connected.
8. The approved matrix is saved with the approval date and the names of the approving owners.

### Required evidence

- Approved user and business matrix
- Approved Quartz Blanc partnership scope
- Approved Google Business Profile location list
- Approved Marisa task list
- Named Admin User
- Owner approval record in the Audit Log or signed document

### Do not proceed if

- A business owner is unclear.
- A Google Business Profile location cannot be verified.
- Marisa’s access is described only as “limited” without specific actions.
- The Admin User can see sales, payments, orders, inventory, or customer financial data.
- Josh and Ed disagree about a business or partner scope.

---

## 5. Phase 2 — Create secure user accounts

### Procedure for Josh and Ed

1. Create individual owner accounts using unique credentials.
2. Enable multi-factor authentication when available.
3. Confirm the account recovery email and phone number.
4. Sign out and sign back in to verify the account.
5. Confirm that the correct business workspaces appear.
6. Confirm that the user cannot open an unauthorized business by manually changing a URL or selecting a hidden workspace.

### Procedure for Marisa

1. Sign in using her own individual account.
2. Confirm the approved business list.
3. Confirm Calendar & Reminders is available.
4. Confirm she can prepare approved reminders and support work.
5. Confirm she cannot access Access Settings, connector secrets, protected sales data, payment records, orders, or inventory.
6. Confirm her actions appear in the Audit Log.

### Account rules

- Never share an owner account.
- Never use another person’s login to complete a task.
- Never paste passwords, API keys, OAuth secrets, or database credentials into chat or frontend fields.
- Report a lost device, suspected password exposure, or unexpected login immediately to the Admin User and both owners.

---

## 6. Phase 3 — Database, audit, and backup readiness

Before any live connector is enabled, the technical administrator must confirm that the production database and audit log are persistent.

### Minimum data domains

The initial database should support separate records for:

- Businesses and locations
- Users and permissions
- Customers
- Payments
- Orders
- Inventory
- Gate logs
- Support requests
- Google reviews
- Calendar items
- Notifications
- Sync runs
- Audit events

Every imported record must retain its source system, source record ID, business ID, created timestamp, updated timestamp, last sync time, and sync status.

### Audit requirements

The Audit Log must record the user, business, action, timestamp, previous value, new value, and result for changes involving permissions, connector configuration, schedules, review replies, exports, and notifications.

A safe undo action may reverse configuration changes, permission visibility, calendar changes, and other reversible actions. It must not automatically reverse payments, refunds, sales, orders, or other irreversible financial activity.

### Backup requirements

The technical administrator must document:

- Backup schedule
- Backup retention period
- Recovery owner
- Recovery location
- Restore test date
- Recovery time objective
- Recovery point objective

A backup is not considered verified until a restore test has succeeded.

---

## 7. Phase 4 — Staging environment

The staging environment is used for testing. It must not be treated as production.

### Staging rules

- Use sample, synthetic, or approved limited records.
- Use separate credentials from production.
- Label all displayed data as staging or test data.
- Confirm that staging cannot write to production systems.
- Test failure states before enabling live synchronization.
- Record each test result and unresolved issue.

The owner acceptance review must occur in staging before the first production connector is enabled.

---

## 8. Phase 5 — Titusville Self-Storage pilot

Titusville is the recommended first business because its operating signals provide a clear pilot scope: occupancy, late-payment exceptions, gate activity, support requests, and customer reviews.

### Daily Titusville owner review

Josh or Ed should review the following at the beginning of the operating day:

1. Last successful Easy Storage Solutions sync.
2. Occupancy percentage and any unexpected change.
3. Late-payment exceptions requiring follow-up.
4. Gate access exceptions or unusual activity.
5. New support requests.
6. Google Reviews needing a response.
7. Open executive tasks and overdue reminders.

The owner should assign a responsible person and due date for each exception that requires action.

### Marisa’s Titusville workflow

Marisa may review approved operating queues, coordinate support follow-up, add a calendar item, prepare an SMS or email reminder, and prepare a Google Review response for owner approval.

Marisa must not change payment status, edit source-system financial records, change permissions, connect credentials, or send an owner-sensitive response without the required approval.

### Sync verification

The Admin User or technical operator checks the Titusville connector after deployment and at least once each operating day during the pilot. The check must confirm:

- Last successful sync time
- Number of records read
- Number of records changed
- Number of records rejected
- Error message, if any
- Next retry time, if applicable

If the sync fails, the operator must not manually duplicate records until the failure is understood.

---

## 9. Google Reviews procedure

The Google Reviews workspace is an operational view, not a replacement for Google Business Profile.

### Review monitoring

1. Open Google Reviews for the authorized business.
2. Check the average rating and the number of reviews needing a reply.
3. Filter by business when working on one location.
4. Read the full review before preparing a response.
5. Identify whether the review is positive, neutral, negative, urgent, or potentially sensitive.
6. Prepare a response using the approved tone.
7. Escalate legal threats, safety concerns, discrimination claims, privacy complaints, or allegations involving an employee to Josh or Ed.
8. Record the response status and owner decision in the hub.

### Reply authority

Marisa may prepare a draft response. Josh or Ed must approve sensitive responses or any response that discusses refunds, disputes, employee conduct, legal issues, personal information, or service recovery.

Responses should not reveal customer account details, payment information, gate codes, employee personal information, or private business information. Google’s official Business Profile documentation describes review-data operations, including retrieving and replying to reviews.[1]

### Connector failure

If Google Reviews shows a stale timestamp, authentication error, or missing business location:

1. Do not assume that no new reviews exist.
2. Capture the connector error.
3. Notify the Admin User.
4. Notify the affected owner if the issue continues beyond the agreed response window.
5. Use the Google Business Profile interface directly for urgent review responses until the connector is restored.
6. Record the outage and recovery in the Audit Log.

---

## 10. Calendar and reminder procedure

### Creating a calendar item

Marisa follows this sequence:

1. Select the business.
2. Enter the meeting or task title.
3. Add the date, time, location, and attendees.
4. Select the owner or responsible person.
5. Choose a reminder template.
6. Select SMS, email, or both.
7. Review the recipient list.
8. Save the calendar item.
9. Prepare the reminder for approval or send it only if her permission includes sending.
10. Confirm the result in the activity history.

### Modifying or cancelling an item

Before changing a calendar item, Marisa confirms the business, attendees, and original time. She records the reason for a significant change, such as an owner request, a schedule conflict, or a cancelled meeting.

For an owner meeting, partner meeting, financial review, or sensitive personnel discussion, Marisa should notify Josh or Ed before sending the updated reminder.

### Reminder standards

- Use the shortest template that contains the necessary information.
- Do not include passwords, payment details, gate codes, or sensitive customer information.
- Confirm the time zone.
- Check for duplicate reminders before sending.
- Respect opt-out and do-not-contact instructions.
- Record failed delivery results.

---

## 11. Audit Log procedure

### Daily review

Josh and Ed should review new audit events when a permission, connector, export, calendar, review, or notification action could affect more than one business.

### Searching the log

Use the search field to enter a person, action, or business. Use the profile selector to narrow the result to Josh, Ed, Marisa, or Admin User. Use the From and To date fields when investigating a specific period.

### Investigating an event

1. Identify the actor.
2. Confirm the business scope.
3. Read the action and result.
4. Compare the previous and new values.
5. Determine whether the action was authorized.
6. Contact the actor if clarification is needed.
7. Use Undo only for a safe reversible change.
8. Record the investigation outcome if the event was significant.

### Escalate immediately when

- A user accessed an unauthorized business.
- A permission changed without owner approval.
- A connector credential was changed unexpectedly.
- A payment, sales, order, or inventory record was modified outside the source system.
- A notification was sent to the wrong recipient.
- An export contains data outside the user’s approved scope.

---

## 12. Notification and sync incident procedure

When a connector or notification fails, the responsible person follows this sequence:

1. Capture the business, connector, timestamp, and error message.
2. Check whether the source system is available.
3. Check whether the last successful sync is within the acceptable operating window.
4. Do not retry repeatedly if the error suggests invalid credentials or a provider outage.
5. Notify the Admin User.
6. Notify Josh or Ed when the issue affects a critical business process or review response.
7. Use the source system directly for urgent work.
8. Record the workaround and final resolution in the Audit Log.
9. Confirm that the next successful sync does not create duplicate records.

Notifications must be change-based. The hub should not send the same SMS or email repeatedly when the underlying record has not changed.

---

## 13. Adding Pizza Restaurant and Skinny Cookies

After the Titusville pilot passes owner acceptance, repeat the same procedure for Pizza Restaurant and Skinny Cookies.

For each new business:

1. Confirm the source platform and account owner.
2. Confirm the data fields the hub may read.
3. Confirm the business-to-user permissions.
4. Configure the connector in staging.
5. Run an initial read-only sync.
6. Validate sales, orders, inventory, and customer scopes.
7. Test failure recovery and duplicate prevention.
8. Confirm the dashboard totals against the source system.
9. Confirm Google Business Profile mapping if reviews are included.
10. Obtain owner approval before production activation.

Do not compare businesses using metrics that are not defined consistently. For example, restaurant sales and storage occupancy should be shown as different measures rather than blended into one unsupported score.

---

## 14. Adding Quartz Blanc

Quartz Blanc requires additional partnership discipline because Ed has access and other business partners may be involved.

Before activation:

1. Ed confirms the approved Quartz Blanc data scope.
2. Relevant partners confirm what may be viewed by Josh, Marisa, and the Admin User.
3. The connector owner and technical contact are identified.
4. Sensitive partnership, financial, or legal records are excluded unless explicitly approved.
5. The access matrix is updated.
6. The Audit Log is tested with a Quartz Blanc action.
7. Ed confirms that the workspace displays only the approved records.

If there is disagreement about Quartz Blanc visibility, pause the connector and escalate to the owners and relevant partners. Do not resolve a partnership access question by copying data into the hub.

---

## 15. Weekly owner review

Josh and Ed should hold a weekly fifteen- to thirty-minute review during the pilot and the first month of production.

The review should cover:

- Business performance signals
- Open late-payment or support exceptions
- Google Reviews needing a reply
- Calendar items and overdue reminders
- Connector health and last sync timestamps
- Failed notifications
- New audit events
- Permission changes
- Outstanding owner approvals
- Issues that should be removed from or added to the hub

The meeting should end with named owners and due dates for unresolved actions.

---

## 16. Monthly governance review

Once the hub is in regular use, Josh and Ed should review the following each month:

- Active users and access scopes
- Marisa’s current task permissions
- Admin User configuration access
- Unused connectors
- Failed syncs and repeated errors
- Review response performance
- Notification opt-outs and delivery failures
- Audit retention and backup status
- Recovery test status
- New business requests
- Whether any dashboard measure is misleading or no longer useful

Permissions should be removed promptly when a person’s responsibilities change.

---

## 17. Go-live acceptance checklist

The owners should not approve full production until every applicable item is complete.

### Security and accounts

- [ ] Individual accounts exist for Josh, Ed, Marisa, and Admin User.
- [ ] Owner and administrator multi-factor authentication is enabled.
- [ ] Backend authorization prevents unauthorized business access.
- [ ] Secrets are stored server-side.
- [ ] HTTPS and secure session controls are active.

### Data and integrations

- [ ] Production database is persistent.
- [ ] Backups are configured and restore-tested.
- [ ] Audit events persist after logout and restart.
- [ ] Titusville connector is validated.
- [ ] Google Business Profile locations are verified.
- [ ] Each business has an approved connector owner.
- [ ] Sync timestamps and failure states are visible.
- [ ] Duplicate prevention is tested.

### Permissions

- [ ] Josh sees only his approved businesses.
- [ ] Ed sees his approved businesses including Quartz Blanc.
- [ ] Marisa sees only approved businesses and tasks.
- [ ] Admin User cannot view business data.
- [ ] Permission changes appear in the Audit Log.
- [ ] Safe undo works for reversible changes.

### Operations

- [ ] Calendar creation and modification works.
- [ ] SMS and email templates are approved.
- [ ] Notification opt-out behavior is tested.
- [ ] Google review filtering works.
- [ ] Review reply authority is confirmed.
- [ ] Support and late-payment workflows have owners.
- [ ] Connector failure procedures are documented.

### Owner approval

- [ ] Josh completes an owner acceptance review.
- [ ] Ed completes an owner acceptance review.
- [ ] Marisa completes a limited-access acceptance review.
- [ ] Admin User completes a settings-only acceptance review.
- [ ] Open risks have an owner and due date.
- [ ] Production launch date is approved.

---

## 18. Quick reference: who does what

| Task | Josh | Ed | Marisa | Admin User |
|---|---:|---:|---:|---:|
| Approve business access | Yes | Yes | No | No |
| View authorized business dashboards | Yes | Yes | Limited | No |
| Manage owner permissions | Yes | Yes | No | Technical settings only |
| Manage calendar items | Review | Review | Yes, within scope | No |
| Prepare reminders | Review | Review | Yes | No |
| Approve sensitive review replies | Yes | Yes | Prepare only | No |
| Configure connector readiness | Review | Review | No | Yes |
| Enter production credentials | Approve | Approve | No | Technical setup only through secure flow |
| Review audit log | Yes | Yes | View approved activity | Configuration activity only |
| Modify sales or payment records | Through source system only | Through source system only | No | No |
| Approve production launch | Yes | Yes | No | No |

---

## 19. Final operating rule

When there is uncertainty, pause the hub action and use the source system or contact an owner. Do not guess about permissions, financial records, partnership data, review replies, or notification recipients.

The hub is successful when it makes decisions faster without creating a new source of confusion. Clear ownership, individual accounts, accurate sync timestamps, limited permissions, and a reliable audit trail are more important than adding more dashboard features.

## References

[1]: https://developers.google.com/my-business/content/review-data "Google Business Profile APIs: Work with review data"

[2]: https://developers.google.com/my-business "Google Business Profile APIs"

[3]: https://www.storageunitsoftware.com/ "Easy Storage Solutions official product site"
