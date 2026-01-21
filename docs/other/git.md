# Git

Distributed version control system for tracking changes in source code.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `git init` | Initialize repository |
| `git clone <url>` | Clone repository |
| `git status` | Show working tree status |
| `git add <file>` | Stage changes |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit staged changes |
| `git log` | Show commit history |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |

## Branching

| COMMAND | DESCRIPTION |
| --- | --- |
| `git branch` | List branches |
| `git branch <name>` | Create new branch |
| `git checkout <name>` | Switch to branch |
| `git checkout -b <name>` | Create and switch |
| `git branch -d <name>` | Delete branch |
| `git branch -D <name>` | Force delete |
| `git branch -m <old> <new>` | Rename branch |
| `git merge <branch>` | Merge branch |
| `git merge --no-ff <branch>` | Merge without fast-forward |

## Remote Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `git remote -v` | List remotes |
| `git remote add <name> <url>` | Add remote |
| `git push -u origin main` | Push and set upstream |
| `git push` | Push to upstream |
| `git pull` | Pull and merge |
| `git pull --rebase` | Pull and rebase |
| `git fetch` | Fetch changes without merging |
| `git remote set-url origin <url>` | Change remote URL |

## Undoing Changes

| COMMAND | DESCRIPTION |
| --- | --- |
| `git checkout -- <file>` | Discard unstaged changes |
| `git restore <file>` | Restore file (Git 2.23+) |
| `git reset HEAD <file>` | Unstage file |
| `git reset --soft HEAD~1` | Undo last commit, keep changes |
| `git reset --hard HEAD~1` | Undo last commit, discard changes |
| `git revert <commit>` | Create new commit to undo |
| `git clean -fd` | Remove untracked files |
| `git checkout HEAD -- <file>` | Restore file to last commit |

## History & Log

| COMMAND | DESCRIPTION |
| --- | --- |
| `git log --oneline` | Show compact log |
| `git log --graph` | Show branch graph |
| `git log --all --decorate` | Show all branches |
| `git log --author="name"` | Filter by author |
| `git log --since="1 week"` | Filter by time |
| `git log <file>` | Show file history |
| `git show <commit>` | Show commit details |
| `git blame <file>` | Show line-by-line blame |

## Stashing

| COMMAND | DESCRIPTION |
| --- | --- |
| `git stash` | Stash changes |
| `git stash save "message"` | Stash with message |
| `git stash list` | List stashes |
| `git stash show` | Show stash contents |
| `git stash apply` | Apply stash |
| `git stash pop` | Apply and remove stash |
| `git stash drop` | Remove stash |
| `git stash clear` | Remove all stashes |

## Tagging

| COMMAND | DESCRIPTION |
| --- | --- |
| `git tag` | List tags |
| `git tag <name>` | Create lightweight tag |
| `git tag -a <name> -m "msg"` | Create annotated tag |
| `git tag -d <name>` | Delete tag |
| `git push origin <tag>` | Push tag |
| `git push --tags` | Push all tags |
| `git checkout <tag>` | Checkout tag |

## Rebase & Interactive Rebase

| COMMAND | DESCRIPTION |
| --- | --- |
| `git rebase <branch>` | Rebase onto branch |
| `git rebase -i HEAD~3` | Interactive rebase last 3 commits |
| `git rebase --continue` | Continue rebase |
| `git rebase --abort` | Abort rebase |
| `git rebase --skip` | Skip commit |

### Interactive Rebase Commands
- `pick` - Use commit
- `reword` - Edit commit message
- `edit` - Edit commit
- `squash` - Merge with previous
- `fixup` - Merge with previous, discard message
- `drop` - Remove commit

## Gitignore

### Common Patterns
```
# OS files
.DS_Store
Thumbs.db

# Node modules
node_modules/
npm-debug.log
yarn-error.log

# Python
__pycache__/
*.py[cod]
*.so
.Python

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
*.o
```

## Useful Aliases

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## Searching

| COMMAND | DESCRIPTION |
| --- | --- |
| `git grep "pattern"` | Search in working directory |
| `git grep "pattern" HEAD~10` | Search in history |
| `git log --grep="pattern"` | Search commit messages |
| `git log --all -- "filename"` | Find commits affecting file |

## Bisect

```bash
# Start bisect
git bisect start
git bisect bad
git bisect good <commit-hash>

# Mark commit
git bisect bad
git bisect good

# Finish
git bisect reset
```

## Common Workflows

### Feature Branch Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Update from main
git checkout main
git pull
git checkout feature/new-feature
git rebase main

# Merge feature
git checkout main
git merge --no-ff feature/new-feature
git push origin main
```

### Squash Commits
```bash
# Interactive rebase last 4 commits
git rebase -i HEAD~4

# Change 'pick' to 'squash' for commits to squash
# Save and exit, edit commit message

# Force push if needed
git push --force
```

### Resolve Merge Conflicts
```bash
# After git merge or git rebase
# Edit conflicting files
# Add and commit
git add .
git commit

# For rebase conflicts
git add .
git rebase --continue
```

## Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `git config --global user.name "Name"` | Set user name |
| `git config --global user.email "email"` | Set user email |
| `git config --global core.editor vim` | Set editor |
| `git config --global color.ui auto` | Enable colors |
| `git config --list` | Show all config |
| `git config --global alias.<name> <cmd>` | Set alias |

## Viewing Differences

```bash
# Show diff between commits
git diff commit1 commit2

# Show diff between branches
git diff branch1 branch2

# Show diff for specific file
git diff commit1 commit2 -- path/to/file

# Show changed files
git diff --name-only HEAD~5

# Show statistics
git diff --stat HEAD~5
```

## Submodules

| COMMAND | DESCRIPTION |
| --- | --- |
| `git submodule add <url>` | Add submodule |
| `git submodule update --init` | Initialize submodules |
| `git submodule update --remote` | Update submodules |
| `git clone --recursive <url>` | Clone with submodules |

## Clean Up

```bash
# Remove untracked files
git clean -fd

# Remove untracked and ignored files
git clean -fdX

# Remove merged branches
git branch --merged | xargs git branch -d

# Prune remote tracking branches
git remote prune origin
```

## Cherry-pick

```bash
# Cherry-pick commit
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>

# Cherry-pick without committing
git cherry-pick -n <commit>
```

## Best Practices

- Write clear, descriptive commit messages
- Use conventional commit format (feat:, fix:, etc.)
- Commit often, commit small
- Review changes before committing
- Use `.gitignore` to exclude files
- Never commit sensitive data
- Keep commit history clean (rebase, squash)
- Use meaningful branch names
- Delete merged feature branches
- Use pull requests for code review
- Test before merging

::: tip
Use `git help <command>` or `git <command> --help` to get detailed documentation for any Git command.
:::
