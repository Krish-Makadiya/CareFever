# CareFever

## About
CareFever is a healthcare platform designed to [brief description of your project]

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Commit Guidelines](#commit-guidelines)
- [License](#license)

## Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/CareFever.git

# Navigate to the project directory
cd CareFever

# Install dependencies
npm install
```

## Usage
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Contributing

### Setting Up Development Environment
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/CareFever.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Commit Guidelines

We follow conventional commits for clear communication. Format:
```
<type>(<scope>): <description>
```

#### Commit Types
- **feat**: New features
- **fix**: Bug fixes
- **refactor**: Code refactoring
- **chore**: Build process or auxiliary tool changes

#### Examples
```
feat(auth): implement user authentication
fix(api): resolve data fetching issue
refactor(database): optimize queries
```

### Pull Request Process (when a feature is complete)
1. Update your branch
   - git fetch origin (Sync Branch if any updates)

2. Run checks locally (If provided any)
   - npm test
   - npm run lint
   - npm run build

3. Clean commits
   - Squash or fix WIP commits so history is tidy
   - Use conventional commit style: type(scope): short description
     - e.g. feat(auth): add login, fix(api): correct user fetch

4. Push your branch
   - git push origin your-branch

5. Open the Pull Request
   - Title: use conventional commit style (same format as commits)
   - Description: what you changed, why, how to test, related issue (if any)

6. Address review feedback
   - Make changes on the same branch, commit, push
   - Reply to reviewers when done

7. Merge & cleanup (after approval and CI pass)
   - Merge per project policy (squash/rebase/merge)
   - git checkout main && git pull
   - git push origin --delete your-branch

## Project Structure
```
CareFever/
├── client/             # Frontend code
└── server/             # Backend code
```

## Tech Stack
- Frontend: [Your frontend tech]
- Backend: [Your backend tech]
- Database: [Your database]

## Contact
krishmakadiya2005@gmail.com
