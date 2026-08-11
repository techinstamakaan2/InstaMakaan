**Contributing Guide.**

Short, practical rules to keep collaboration efficient and safe.

**Main branch**: `main` is the production branch. Never push directly to `main`.


- Clone the repo:

```bash
git clone git@github.com:instamakaan/instamakaan-website.git
cd instamakaan-website
git fetch origin
git checkout -b feature/short-desc origin/main
```

**Branching & naming conventions**
- Use short, descriptive, kebab-case names with a type prefix:
  - `feature/short-desc` — new features
  - `fix/<issue-number>/short-desc` — bug fixes , can use line ticket number also 
  - `hotfix/short-desc` — urgent production fixes
  - `chore/short-desc` — maintenance, dependency bumps
  - `docs/short-desc` — documentation only
- Examples: `feature/alice/property-filter`, `fix/123/login-crash`.
- Keep branches focused (one logical change per branch).


**Commit messages**
- Follow Conventional Commits: `<type>(scope?): short summary`
  - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `style`
- Keep subject <= 50 chars, lower-case, imperative. Optional longer body after a blank line.
- Always reference an issue or ticket if applicable: `fix(auth): handle null token (#123)`
- Example:

```text
feat(auth): add refresh token endpoint

Adds `/token/refresh` and unit tests. Closes #234.
```

**Local workflow (step-by-step)**
1. Sync main:

```bash
git checkout main
git fetch origin
git pull origin main
```
2. Create branch from latest main:

```bash
git checkout -b feature/yourname/short-desc
```
3. Work locally; stage and commit small incremental changes:

```bash
git add <files>
git commit -m "feat(module): short summary"
```
4. Push branch to origin:

```bash
git push -u origin feature/yourname/short-desc
```
5. Open a Pull Request targeting `main` (use GitHub UI).

**Keeping your branch up to date**
- Preferred: rebase onto latest `main` to keep history linear:

```bash
git fetch origin
git checkout feature/yourname/short-desc
git rebase origin/main
# Resolve conflicts, then:
git add <resolved-files>
git rebase --continue
git push --force-with-lease
```
- If you don’t know rebase, use merge instead:

```bash
git fetch origin
git merge origin/main
git push
```

**Pull Request checklist (for author)**
- Title clearly describes change and uses commit/issue refs.
- Small, focused PR (avoid huge monolithic changes).
- All tests passing locally; run project's tests and linters.
- Add/update unit/integration tests when relevant.
- Update docs or `README` if public behavior changes.
- No secrets or credentials in commits.

**Review & merge rules**
- Use protected `main`: require at least one approving review and passing CI.
- Maintainers should squash-merge or rebase & merge (choose squash for cleaner history).
- Do not merge your own PR unless explicitly authorized.

**Resolving conflicts & force pushes**
- After rebasing you will need `--force-with-lease` to update remote safely:

```bash
git push --force-with-lease
```
- Do not use `--force` without `--force-with-lease`.

**Common Git commands quick reference**
- Create branch: `git checkout -b <branch>`
- Switch branch: `git checkout <branch>`
- Update local main: `git checkout main && git pull origin main`
- Stage files: `git add <file>` or `git add -p`
- Commit: `git commit -m "type(scope): summary"`
- Push branch: `git push -u origin <branch>`
- Update branch from main (rebase): `git fetch origin && git rebase origin/main`
- Force-push after rebase: `git push --force-with-lease`
- Create PR: push branch and open via GitHub web UI

**Etiquette & best practices**
- Keep PRs small and reviewable (under ~300 changed lines if possible).
- Write clear PR descriptions: what, why, and impact.
- Label PRs and link issues.
- Ask for help on complex refactors — pair when needed.

**If something goes wrong**
- Revert a bad merge: `git revert <merge-commit>` and open a PR.
- Abort an in-progress rebase: `git rebase --abort`.

Thank you — concise, consistent rules help us move faster. If you'd like, I can add a PR template and Issue template next.
