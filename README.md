# 📊 Expense Tracker (React Native + Expo)

A simple and elegant mobile app to track daily expenses with features
like sorting, priority indicators, data analysis, and CSV
import/export.\
This is one of my first full-fledged React Native + Expo apps.

---

## 🚀 Features

- ➕ Add, ✏️ Edit, 🗑️ Delete expense items\
- 🏷️ Fields: **title, amount, date, priority, author**
- 🎨 Priority color indicators (URGENT, HIGH, MEDIUM, LOW)
- ↔️ Swipe-to-delete (left → right)
- 🔍 Sort by **amount, date, priority**
- 📦 Local storage using **SQLite** (data persists even after closing
  app)
- 📈 Analysis screen with **line chart** (weekly & monthly expenses)
- 📤 Export all expenses to CSV & share (WhatsApp, etc.)
- 📥 Import expenses from CSV
- 🎛️ Clean, Groww-inspired UI (dark theme planned)

---

## 🧰 Tech Stack

- **React Native + Expo (TypeScript)**
- **Expo SQLite** (local database)
- **react-native-chart-kit** (analytics chart)
- **CSV parser** (for import/export)
- **Expo Router** (navigation)

---

## 📁 Folder Structure

    Expense-Tracker/
    │
    ├── app/                 # Main application source
    │   ├── components/      # HeaderSort, ExpenseItem, DrawerForm, etc.
    │   ├── assets/          # Icons, images
    │   ├── utils/           # Helpers (DB, CSV, formatting)
    │   └── ...              # Screens, hooks, context, etc.
    │
    ├── package.json
    ├── app.json
    ├── tsconfig.json
    └── README.md

---

## 🛠️ Installation & Setup

1.  Clone the repository

    ```bash
    git clone https://github.com/ExploreWithMeet/Expense-Tracker.git
    ```

2.  Navigate to project

    ```bash
    cd Expense-Tracker
    ```

3.  Install dependencies

    ```bash
    npm install
    ```

4.  Start the development server

    ```bash
    npx expo start
    ```

5.  Open the app using Expo Go or an emulator.

---

## 🎯 How to Use

- Add expenses through the drawer-based form\
- Long-press an item → Edit\
- Swipe an item → Delete\
- Sort using the header controls\
- Visit **Analysis** tab for weekly/monthly trends\
- Export → CSV (then share)\
- Import → Choose CSV file and load data

---

## 🛣️ Future Improvements

- Dark theme (Groww-style)
- Expense categories (Food, Travel, Shopping, etc.)
- Recurring expenses
- Yearly summary dashboard
- Cloud backup / sync
- Enhanced CSV validation

---

## 🧑‍💻 Author

Built by **M.S (ExploreWithMeet)** --- Student & developer learning
full-stack & mobile development.
