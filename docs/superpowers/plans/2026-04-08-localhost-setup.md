# Localhost Frontend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure and run the Domínio Processos React frontend in local development environment

**Architecture:** Standard Vite + React development server using npm for dependency management

**Tech Stack:** Node.js, NPM, Vite 6.3.5, React 18.3.1

---

## Prerequisites

**Required:**
- Node.js version 18 or higher
- NPM version 8 or higher (included with Node.js)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

**Working Directory:** `c:\00. Processos - DOM DS`

---

## Task 1: Verify Prerequisites

**Files:**
- None (verification only)

- [ ] **Step 1: Check Node.js version**

Run:
```bash
node --version
```

Expected output: `v18.x.x` or higher (e.g., `v18.19.0`, `v20.11.0`)

If Node.js is not installed or version is below 18:
- Download from https://nodejs.org/
- Install LTS version (20.x recommended)
- Restart terminal after installation

- [ ] **Step 2: Check NPM version**

Run:
```bash
npm --version
```

Expected output: `8.x.x` or higher (e.g., `8.19.3`, `10.2.4`)

NPM is bundled with Node.js, so if Node.js installation succeeded, NPM should be available.

- [ ] **Step 3: Verify current directory**

Run:
```bash
pwd
```

Expected output (Windows): `/c/00. Processos - DOM DS` or similar

If in wrong directory:
```bash
cd "c:\00. Processos - DOM DS"
```

---

## Task 2: Install Dependencies

**Files:**
- Reads: `package.json`
- Creates: `node_modules/` directory, `package-lock.json`

- [ ] **Step 1: Clean any existing installations (if needed)**

Only run if you've previously attempted installation and encountered errors:
```bash
rm -rf node_modules package-lock.json
```

For first-time setup, skip this step.

- [ ] **Step 2: Install all dependencies**

Run:
```bash
npm install
```

Expected behavior:
- Downloads and installs all packages listed in package.json
- Creates `node_modules/` directory with all dependencies
- Creates `package-lock.json` lockfile
- Process may take 2-5 minutes depending on internet speed

Expected final output:
```
added XXX packages, and audited XXX packages in XXs

XXX packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

If you see warnings (yellow text), that's normal and acceptable.
If you see errors (red text), check:
- Internet connection is stable
- No firewall blocking npm registry
- Node.js version is correct

- [ ] **Step 3: Verify installation**

Run:
```bash
ls node_modules | head -20
```

Expected: Should see directory listing including folders like:
- `react`
- `react-dom`
- `vite`
- `@mui`
- `@radix-ui`
- etc.

---

## Task 3: Start Development Server

**Files:**
- Reads: `vite.config.ts`, `index.html`, `src/main.tsx`
- Creates: `.vite/` cache directory (temporary)

- [ ] **Step 1: Start Vite development server**

Run:
```bash
npm run dev
```

Expected output:
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Note:** Port may differ if 5173 is occupied (e.g., 5174, 5175).

Server is now running. **Keep this terminal open** — closing it will stop the server.

If you see errors:
- "Cannot find module": Run `npm install` again
- Port errors: Vite will auto-select next available port
- Permission errors (Windows): Run terminal as Administrator

- [ ] **Step 2: Verify server is responsive**

Open new terminal (keep dev server running) and run:
```bash
curl http://localhost:5173
```

Expected: HTML content including `<div id="root"></div>`

Alternative if curl not available:
```bash
wget -qO- http://localhost:5173 | head -20
```

---

## Task 4: Validate in Browser

**Files:**
- None (browser validation)

- [ ] **Step 1: Open application in browser**

Open your web browser and navigate to:
```
http://localhost:5173
```

(Use the exact URL shown in the Vite output from Task 3, Step 1)

Expected behavior:
- Page loads without errors
- Browser console (F12 → Console tab) shows no red errors
- Application UI renders (you should see the Domínio Processos interface)

If you see blank page:
- Open browser console (F12)
- Check for JavaScript errors in red
- Verify dev server is still running in terminal

- [ ] **Step 2: Verify Hot Module Replacement (HMR)**

1. Keep browser open at http://localhost:5173
2. Open any source file (e.g., `src/app/App.tsx`) in code editor
3. Make a small visible change (e.g., change a text string)
4. Save the file

Expected behavior:
- Browser automatically updates within 1-2 seconds
- No page refresh needed
- Change is visible immediately

If page doesn't update:
- Check terminal for errors
- Manually refresh browser (F5)
- Verify file was actually saved

- [ ] **Step 3: Check browser console for warnings**

In browser, open Developer Tools (F12) → Console tab

Expected:
- No red errors
- Yellow warnings are acceptable (typically from third-party libraries)

Common warnings you can ignore:
- React deprecation warnings
- PropTypes warnings in development
- Source map warnings

Red errors to investigate:
- Module not found errors → re-run `npm install`
- Syntax errors → check recent code changes
- Network errors → verify dev server is running

---

## Task 5: Documentation and Cleanup

**Files:**
- Create: `docs/SETUP.md` (optional quick reference)

- [ ] **Step 1: Create quick reference document** (Optional)

Create file `docs/SETUP.md`:

```markdown
# Quick Setup Reference

## First Time Setup

1. Install Node.js 18+ from https://nodejs.org/
2. Run `npm install` in project root
3. Run `npm run dev` to start development server
4. Open http://localhost:5173 in browser

## Daily Development

1. Run `npm run dev`
2. Open http://localhost:5173
3. Make changes - browser updates automatically
4. Press Ctrl+C in terminal to stop server

## Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
Vite automatically uses next available port (check terminal output)

**Changes not reflecting:**
- Hard refresh browser (Ctrl+Shift+R)
- Restart dev server (Ctrl+C, then `npm run dev`)
```

- [ ] **Step 2: Verify setup is complete**

Checklist:
- ✅ Node.js 18+ installed and verified
- ✅ `npm install` completed without errors
- ✅ `npm run dev` starts server successfully
- ✅ Browser loads application at localhost:5173
- ✅ Hot reload works when files are changed
- ✅ No red errors in browser console

If all items checked, setup is complete.

---

## Common Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Clean installation:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Update dependencies:**
```bash
npm update
```

---

## Success Criteria

✅ Development server starts without errors  
✅ Application loads in browser at http://localhost:5173  
✅ No red errors in terminal or browser console  
✅ Hot Module Replacement works (changes reflect automatically)  
✅ All React components render correctly  

---

## Next Steps After Setup

1. Explore existing components in `src/app/components/`
2. Review project structure and routing
3. Test navigation between different views
4. Review PRD at `src/imports/prd-dominio-processos.md` for feature requirements
5. Consider backend/API implementation for full functionality
