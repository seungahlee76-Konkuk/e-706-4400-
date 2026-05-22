# Firebase Security Specification & TDD Spec

## Data Invariants
1. **Unauthenticated / Guest Submissions**: Any user (authenticated or guest) can create a lead document under `/leads/{leadId}`.
2. **Access Control**: Only verified administrators mapped under `/admins/{adminId}` can read, update, or delete any lead.
3. **Data Integrity for Leads**:
   - `id`: alphanumeric string, max 128 chars.
   - `name`: string, 1 to 64 chars.
   - `phone`: string, 1 to 24 chars representing a phone number.
   - `interest`: string, 1 to 64 chars.
   - `createdAt`: server timestamp equal to `request.time`.
4. **Immutability**: Once created, `createdAt` and `id` in any lead cannot be modified.
5. **No Admin Self-Promotion**: Users cannot write to `/admins/{adminId}` to grant themselves administrator privileges.

---

## The "Dirty Dozen" Malicious Payloads
The following payloads list 12 malicious operations that must be strictly rejected by the rules:

1. **Anonymous / Unauthorized Read of Leads**: A non-admin attempts to read the `/leads` collection.
2. **Lead ID Poisoning**: Creating a lead with an extremely large, invalid ID (e.g., a 1MB junk string).
3. **Leads Creation without Required Fields**: Creating a lead that is missing the `phone` field.
4. **Leads Creation with Ghost Fields (Shadow Update)**: Appending unrequested fields like `isApproved: true` or `role: 'admin'`.
5. **Client-Provided Timestamp (Temporal Spoofing)**: Submitting a lead where `createdAt` is set to old date to bypass order or forge history.
6. **Leads Update by Non-Admin**: A general user attempts to alter lead interest or owner data.
7. **Lead Modification of Immutable Fields by Admin**: Even an administrator attempts to overwrite the original `createdAt` timestamp of an existing lead.
8. **Admin Self-Assignment**: A normal registered user attempts to write to `/admins/{theirUid}` to set their own role to 'admin'.
9. **Admin List Read by Rogue Guest**: Unauthenticated user tries to pull the list of admins.
10. **Admin Self-Promotion Update**: A user attempts to change `role` to `'superuser'` using `update`.
11. **Rogue Lead Deletion**: A general user or malicious scraper attempts to delete a lead by targeting `/leads/{leadId}` directly.
12. **Typing Value Poisoning**: Creating a lead where `phone` is passed as a boolean `true` instead of a string value.

---

## The Test Runner Blueprint (firestore.rules.test.ts)
The code validates the "Dirty Dozen" states by asserting `PERMISSION_DENIED` on all malicious actions.
