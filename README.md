# marketplace

Streamr marketplace, yeah!

## Development

### ESLint Git pre commit hook

Install Git pre commit hook to your local repository by executing:

```
% npm install
```

Now ESLint runs with --fix option before commit on staged files.

You can remove pre commit hook by executing:
```
% rm .git/hooks/pre-commit
```

# Sentry

## Deployment

- When production build
  - Webpack creates `.map`-file in `dist` -directory with bundled JS
  - Travis has script container (Runnes when deploying in production)
    - Creates a new release in Sentry by `TRAVIS_TAG`
    - Pushes source map -file from `dist` into Sentry with tagged release
    - Removes the `.map`-file so it doesn't end up in production
  - Client has a `analytics.js` which tells Sentry on what release is run on
    - Maps with Sentry's source map
  - Should provide us more details when debugging issues from production reported to Sentry
