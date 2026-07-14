#!/bin/bash
# LOKI AI — Quick Test Script

echo "🛡️ LOKI AI — Quick Test Suite"
echo "=============================="
echo ""

# Test 1: Check Node version
echo "✓ Test 1: Node.js version"
node --version
echo ""

# Test 2: Check dependencies
echo "✓ Test 2: Checking dependencies..."
npm list @google/generative-ai react-markdown 2>/dev/null | head -3
echo ""

# Test 3: Check LOKI files
echo "✓ Test 3: LOKI files structure"
echo "  lib/loki/:"
ls -la src/lib/loki/*.js 2>/dev/null | wc -l
echo "  services/loki/:"
ls -la src/services/loki/*.js 2>/dev/null | wc -l
echo "  components/loki/:"
ls -la src/components/loki/*.jsx 2>/dev/null | wc -l
echo ""

# Test 4: Check .env
echo "✓ Test 4: Environment setup"
if [ -f ".env" ]; then
    echo "  .env file found ✓"
    grep "VITE_GEMINI_API_KEY=" .env | head -1 | sed 's/=.*/=***SET***/g'
else
    echo "  .env file NOT found ✗"
fi
echo ""

# Test 5: Quick build check
echo "✓ Test 5: Build check (dry-run)"
npm run build -- --dry-run 2>&1 | tail -3
echo ""

echo "=============================="
echo "✅ Quick test complete!"
echo ""
echo "Next steps:"
echo "1. npm install (if dependencies missing)"
echo "2. npm run dev"
echo "3. Visit http://localhost:5173"
echo "4. Click LOKI AI button (bottom-right)"
echo ""
echo "🛡️ Good luck!"
