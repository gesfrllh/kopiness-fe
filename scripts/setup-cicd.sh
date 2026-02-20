#!/bin/bash

# CI/CD Setup Script for Kopiness Frontend
# Run this script to setup local development hooks and Vercel

set -e

echo "🚀 Kopiness CI/CD Setup"
echo "======================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "⚠️  Yarn not installed. Installing yarn..."
    npm install -g yarn
fi

echo "✅ Yarn version: $(yarn --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

echo "✅ Dependencies installed"
echo ""

# Setup Husky for pre-commit hooks
echo "🪝 Setting up Husky pre-commit hooks..."
yarn husky install

# Create pre-commit hook if not exists
if [ ! -f .husky/pre-commit ]; then
    echo "Creating pre-commit hook..."
    npx husky add .husky/pre-commit "yarn lint-staged"
fi

echo "✅ Husky hooks setup complete"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not installed. Install it with:"
    echo "   npm i -g vercel"
    echo ""
fi

# Check if .vercel exists
if [ -d .vercel ]; then
    echo "✅ Vercel project already linked"
else
    echo "⚠️  Vercel project not linked yet."
    echo ""
    echo "To link your project to Vercel:"
    echo "   1. vercel login"
    echo "   2. vercel link"
    echo ""
fi

echo ""
echo "======================="
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review CI-CD-SETUP.md for detailed instructions"
echo "2. Add GitHub secrets (VERCEL_TOKEN, VERCEL_PROJECT_ID, etc)"
echo "3. Make a test push to 'development' branch"
echo "4. Check GitHub Actions tab for pipeline status"
echo ""
echo "💡 Useful Commands:"
echo "   yarn dev       - Start development server"
echo "   yarn build     - Build for production"
echo "   yarn lint      - Run ESLint"
echo "   vercel login   - Login to Vercel"
echo "   vercel link    - Link project to Vercel"
echo ""
