#!/bin/bash

echo "🔍 Running ruff linter..."
ruff check --fix .

echo "🎨 Running ruff formatter..."
ruff format .

echo "✅ Code formatting completed!"
