# Week 1 – TDD research with AI workflows

Nguyễn Thúy Ngọc · AI Training, Week 1 homework

| File | Contents |
|---|---|
| [overview.md](overview.md) | Assignment brief and acceptance criteria |
| [Report.md](Report.md) | Research report (Vietnamese): TDD, test levels, CLI tests, AI validation, common mistakes; Appendix A logs the three workflows, Appendix B is Q&A |
| [chat_history.pdf](chat_history.pdf) | Screenshots of the full Claude conversation (13/10/2026), evidence for Report Appendix A |
| [evidence/verify.test.js](evidence/verify.test.js) | Runnable checks for the claims in the report that don't depend on the chat-session code |

## Reproducing

```
node --test evidence/verify.test.js
```

Requires Node.js 20+. Expected: 5 tests pass.

The `createTicket` / `save` code and the 9 → 10 → 12 test runs described in Report Appendix A were produced inside the chat session and are not stored here; `chat_history.pdf` is the only evidence for them.
