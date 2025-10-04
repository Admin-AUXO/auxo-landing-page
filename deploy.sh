#!/bin/bash

set -e

echo "Adding all files to staging..."
git add -A

echo "Committing changes..."
git commit -m "Deploying to GitHub Pages"

echo "Pushing to gh-pages branch..."
git push -f https://github.com/Admin-AUXO/auxo-landing-page.git master:gh-pages

echo "Deployment successful!"