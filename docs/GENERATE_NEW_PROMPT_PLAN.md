# Plan to Add "Generate New Prompt" Button to `/prompt` Page

## Objective
Add a "Generate New Prompt" button to the `/prompt` page. When clicked, this button calls a Next.js action to generate a new prompt. The action should not send an email but should refresh the `/prompt` page to display the new, un-responded-to prompt in the list.

---

## Task List

### Backend
1. **Create Prompt Generation Action**
   - Implement a server-side Next.js action to generate a new prompt.
   - The action should:
     - Authenticate the user (reuse `requireAuth` logic).
     - Generate and save a new prompt in the database.
     - Return success or failure status.

### Frontend
2. **Create Frontend Button Component**
   - Add a "Generate New Prompt" button to the `/prompt` page.
   - Style the button to align with existing design.

3. **Integrate Button with Action**
   - Add `onClick` logic to call the `generatePrompt` Next.js action.
   - Use `fetch` or `Next.js` server action invocation tools.
   - Add a loading state to the button while the action executes.

4. **Refresh Page on Success**
   - On successful prompt creation, reload the `/prompt` page to reflect the new prompt in the list.

### Validation
5. **Test Functionality**
   - Verify the button generates new prompts correctly without errors.
   - Ensure the new prompt appears immediately after page reload.
   - Test edge cases (e.g., network failure, backend errors).

### Documentation
6. **Update Documentation**
   - Document the new action and UI logic for future maintainability.

---

## Deliverable
Upon completion, the `/prompt` page will feature a working "Generate New Prompt" button. Clicking it will generate a new prompt and display it in the list without sending any emails.

