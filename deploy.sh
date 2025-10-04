#!/bin/bash

# Abort on errors
set -e

# Navigate to your project directory if you are not already there
# cd /path/to/your/project

echo "Initializing new git repository..."
git init

echo "Adding all files to staging..."
git add -A

echo "Committing changes..."
# Use a generic commit message
git commit -m "Deploying to GitHub Pages"

# This command force pushes the current commit to the 'gh-pages' branch
# of your remote repository. This is a destructive action for that branch.
#
# Replace <YOUR_GITHUB_USERNAME> with your actual GitHub username.
# Replace <YOUR_REPOSITORY_NAME> with your actual GitHub repository name.

echo "Pushing to gh-pages branch..."
git push -f git@github.com:<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git main:gh-pages

echo "Deployment successful!"