# Contributing to AnimateIcons

Thank you for your interest in contributing!

AnimateIcons is a collection of **animated SVG icons** built with React and motion/react, supporting multiple icon libraries such as **Lucide** and **Huge**.

We welcome contributions of:

- New icons
- Bug fixes
- Performance improvements
- Documentation updates

Please follow the guidelines below to keep the project consistent and maintainable.

---

## Prerequisites

This project uses **pnpm** for dependency management.

Install pnpm globally if you don’t have it:

```bash
npm install -g pnpm
```

Please avoid using npm or yarn to prevent lockfile conflicts.

---

## Getting Started

1. Fork the repository and clone it:

```bash
git clone https://github.com/your-username/animateicons.git
```

2. Navigate to the project directory:

```bash
cd animateicons
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

This will run the docs playground where you can preview and test icons.

---

## Project Structure

AnimateIcons supports multiple icon libraries. Each library maintains its own icons and `ICON_LIST`.

```
icons/
 ├─ lucide/
 │   ├─ index.ts
 │   └─ Icon files...
 └─ huge/
     ├─ index.ts
     └─ Icon files...
```

- `icons/lucide/index.ts` exports the Lucide `ICON_LIST`
- `icons/huge/index.ts` exports the Huge `ICON_LIST`

Always add your icon to the appropriate library.

---

## Adding a New Icon

### 1. Choose the Library

Add your icon to one of the following folders:

```
icons/lucide/
icons/huge/
```

Your icon style must match the selected library.

---

### 2. Create the Icon File

Example:

```
icons/lucide/dashboard-icon.tsx
```

or

```
icons/huge/dashboard-icon.tsx
```

**Important**

Use the existing icon template from the same folder.

Each library already contains icons that follow the correct structure and animation pattern.  
Open any existing icon in that folder and copy its implementation as a starting point.

All new icons must follow the **exact structure** of existing icons in the target folder.

**Do not:**

- Create a custom component structure
- Change animation architecture
- Use a different animation pattern
- Add new dependencies

Requirements:

- Must be a React component
- Animation implemented using `motion/react`
- Hover animation support
- Imperative control support (`startAnimation`, `stopAnimation`)
- Follow the naming convention: `your-icon-name-icon.tsx`

Use the existing icons as a reference template.

---

### 3. Register the Icon

We use an automated JSON-based registry. **You do not need to manually edit any `index.ts` files!**

Open the corresponding JSON manifest in the `data/` directory:
- For Lucide: `data/lucide-icons.json`
- For Huge: `data/huge-icons.json`

Add a new JSON object for your icon to the array:

```json
{
  "name": "your-icon-name",
  "addedAt": "YYYY-MM-DD",
  "category": ["CategoryName"],
  "keywords": ["keyword1", "keyword2"]
}
```

**Important Naming Rules:**
- The `name` string in the JSON **must match** your filename exactly, minus the `-icon` suffix.
- The exported React component **must** exactly match the PascalCase of your filename.

**Example**

| Item           | Format                 |
| -------------- | ---------------------- |
| File name      | `dashboard-icon.tsx`   |
| Component      | `DashboardIcon`        |
| JSON name      | `"dashboard"`          |

### 4. Generate the Registry

Run the following command to automatically build the index map so the application can use it:

```bash
pnpm run gen:icons
```

---

### 5. Test Your Icon

Run the playground:

```bash
pnpm dev
```

Then:

- Select the correct library (Lucide or Huge)
- Verify hover animation works
- Test programmatic control if applicable
- Check responsiveness and visual consistency

---

## Icon Guidelines

- Match the visual style of the target library
- Keep animations smooth and subtle (0.3s – 0.8s recommended)
- Avoid heavy or distracting motion
- Keep SVG structure clean and minimal
- Reuse existing animation patterns when possible

---

## Commit Guidelines

Create a feature branch:

```bash
git checkout -b feat/icon-name
```

Commit message examples:

- `feat: add dashboard-icon`
- `fix: correct animation in dashboard-icon`
- `perf: optimize icon rendering`

Push your branch:

```bash
git push origin feat/icon-name
```

Then open a Pull Request to the **dev** branch.

Maintainers will merge `dev → main` during release.

---

## Pull Request Checklist

Before submitting your PR:

- [ ] Icon follows the existing template and structure
- [ ] Animation implemented using `motion/react`
- [ ] Icon added to the correct library (lucide or huge)
- [ ] Icon added to the correct JSON manifest and `pnpm run gen:icons` was run
- [ ] Tested locally using `pnpm dev`
- [ ] PR targets the **dev** branch

---

## Tips

- Match the visual style of the target library (Lucide or Huge)
- Use Lucide shapes as a base when contributing to the Lucide library
- Keep animations subtle and consistent with existing icons
- Keep changes focused and minimal
- Small, well-scoped PRs are preferred
- Check existing icons in the target folder for consistency before adding a new one

---

## Thank You

Your contributions help make AnimateIcons better for everyone.
