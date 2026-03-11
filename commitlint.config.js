export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',      // A new feature
        'fix',       // A bug fix
        'docs',      // Documentation only changes
        'style',     // Changes that don't affect code meaning (formatting, missing semicolons, etc.)
        'refactor',  // Code change that neither fixes a bug nor adds a feature
        'perf',      // Code change that improves performance
        'test',      // Adding missing tests or correcting existing tests
        'chore',     // Changes to build process, dependencies, tooling
        'ci',        // Changes to CI configuration files and scripts
      ],
    ],
    'type-case': [2, 'always', 'lowercase'],
    'type-empty': [2, 'never'],
    'scope-empty': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
