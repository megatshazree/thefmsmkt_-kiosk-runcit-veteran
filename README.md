# THEFMSMKT: POS Interaktif dengan Gemini

THEFMSMKT is a comprehensive Point of Sale (POS) web application designed for modern retail environments. It integrates interactive features, robust inventory management, customer relationship management (CRM), employee management, insightful reporting, and cutting-edge Gemini AI integration for smart suggestions, description generation, report summarization, and more. The application supports both English and Bahasa Malaysia.

This version primarily focuses on the frontend implementation, with backend services and data largely simulated or mocked for demonstration and development purposes.

## Features

*   **Point of Sale (POS)**: Intuitive interface for processing sales, managing cart items, and handling payments.
    *   Product search and category filtering.
    *   Discount application.
    *   Order hold/recall functionality.
    *   Simulated E-Invoice generation (LHDN format).
*   **Vision AI Checkout**: Autonomous checkout by placing items in a scanning area (simulated item recognition).
    *   Handles item ambiguity, weighable items, and age verification.
    *   Anonymized customer analytics (age, gender, sentiment) with AI insights.
*   **Inventory Management**:
    *   Manual product addition and editing.
    *   **Gemini AI Product Description Generation**: Automatically create compelling product descriptions.
    *   **Vision AI Product Addition**: Extract product details from descriptive text (simulating image/camera input).
    *   **Vision AI Stock-In**: Smartly scan and verify goods receiving against Purchase Orders.
    *   **AI Inventory Monitoring**: Simulate real-time stock level monitoring, shelf display visualization, and alerts for low stock or misplaced items.
*   **Product Sets**: Create and manage product bundles or packages, easily addable to cart.
*   **Customer Management (CRM)**: Manage customer information and track purchase history (mocked data).
*   **Employee Management**: Manage employee details, roles, and permissions (mocked data).
*   **Reporting & Analytics**:
    *   View sales data (daily, weekly, monthly).
    *   Analyze sales by category, top-selling products, and sales by employee.
    *   Payment method distribution.
    *   **Gemini AI Report Summarization**: Get AI-generated summaries for various reports.
*   **Settings & Configuration**:
    *   Customize store details.
    *   Theme engine for primary color and font family selection.
    *   Tax configuration.
    *   Manage ConnectLink Integrations (Gemini AI, LHDN e-Invoice, Stripe, Shopify - status display).
*   **Gemini AI Integration**:
    *   Product suggestions in POS based on cart items.
    *   Automated product description generation in Inventory.
    *   Executive summaries for reports.
    *   AI-driven insights for anonymized customer analytics.
    *   Structured data extraction for Vision AI product addition.
    *   Simulated E-Invoice data generation.
*   **Bilingual Support**: Switch between English (en) and Bahasa Malaysia (ms).
*   **Responsive Design**: UI adaptable to various screen sizes, with a focus on tablet/kiosk use for POS.
*   **Toast Notifications**: User-friendly feedback for actions.

## Tech Stack

*   **Frontend**:
    *   React (v19+)
    *   React Router (v7+ for navigation)
    *   Tailwind CSS (for styling)
    *   Heroicons (v2+ for icons)
    *   Recharts (for data visualization in reports)
    *   `@google/genai` (Google Gemini API SDK for AI features)
    *   ESM.sh (for module imports in `index.html`)
*   **State Management**: React Context API (Auth, Cart, Language, Navigation, Toast)
*   **Backend**: Primarily simulated/mocked within the frontend for this project. API interactions are mainly with the Google Gemini API.
*   **Data**: Mock data (`constants/mockData.ts`) is used for products, customers, employees, etc.

## Prerequisites

Before you begin, ensure you have the following:

*   A modern web browser (e.g., Chrome, Firefox, Edge).
*   An active internet connection (especially for Gemini API features).
*   **Gemini API Key**: You **must** have a valid Gemini API key.

## Getting Started

**1. Environment Setup (API Key)**

This application requires a Google Gemini API key to function correctly.

*   The API key **must** be set as an environment variable named `process.env.API_KEY`.
*   The application code (`services/geminiService.ts` and `services/visionAIService.ts`) directly uses `process.env.API_KEY` to initialize the `@google/genai` client.
*   **Crucially, you need to ensure that `process.env.API_KEY` is properly defined in the execution environment where this application runs.** How you set this variable depends on your development/deployment setup. For local development with some bundlers or Node.js-based servers, you might use a `.env` file. However, given the current `index.html` structure, this variable would need to be available globally as `process.env.API_KEY` in the browser's JavaScript context *before* the scripts run, or your development server/platform must inject it.

    **Example for local development (conceptual, if using a Node server to inject):**
    If you were using a Node.js server to serve `index.html` and pre-process files, you might create a mechanism to replace a placeholder or inject this.
    For platforms that host static sites with build steps, they often provide a way to set environment variables that get baked in or made available.

    **For the current setup (direct `index.html` with ES modules):**
    You might need to manually define `process.env` before your main script runs if your environment doesn't do this. For example, in `index.html`, before importing `index.tsx`:
    ```html
    <script>
      // WARNING: This is for local development & demonstration only.
      // Do NOT commit your API key directly into version control.
      // In a real deployment, use secure environment variable management.
      window.process = { env: { API_KEY: "YOUR_ACTUAL_GEMINI_API_KEY" } };
    </script>
    <script type="module" src="/index.tsx"></script>
    ```
    **Replace `"YOUR_ACTUAL_GEMINI_API_KEY"` with your real key. Remember to secure your API key and avoid committing it to version control.**

**2. Running the Application**

*   The application is structured with an `index.html` file that loads the main React application from `index.tsx` using ES modules and an import map.
*   To run this, you'll need a local development server that can serve `index.html` and correctly handle the ES module imports and JSX in `index.tsx`.
    *   Many simple HTTP servers can serve static files. If your browser supports JSX and the specific React features out-of-the-box (which is unlikely for raw `.tsx` files without a build step), it might work.
    *   More commonly, a development tool like Vite, Parcel, or Create React App (though this project isn't set up with CRA) would handle the compilation of `.tsx` to JavaScript and serve the application.
    *   **If you are using a specific platform to run this code (e.g., an online IDE or a project scaffold), follow its instructions for running the application.** The platform usually handles the build process.

**3. Accessing the Application**

*   Once the server is running (and `API_KEY` is set), open your web browser and navigate to the local address provided by your server (e.g., `http://localhost:3000`, `http://localhost:5173`, or as specified by your development environment).
*   Default login credentials (from `AuthContext.tsx`):
    *   Username/Email: `admin@example.com` or `test@example.com`
    *   Password: `password`

## Project Structure

```
/
├── components/             # Reusable UI components
│   ├── common/             # Generic components (Button, Modal, Loader, Input, PageHeader, Toast)
│   ├── layout/             # Layout components (Sidebar, MainAppLayout)
│   ├── inventory/          # Components specific to Inventory feature (e.g., PurchaseOrderSelector, ShelfDisplay)
│   └── pos/                # Components specific to POS feature (e.g., EInvoiceDisplayModal)
├── constants/              # Static data and configurations
│   ├── menuItems.tsx       # Definitions for sidebar, kiosk, form options
│   ├── mockData.ts         # Mock data for products, customers, etc.
│   └── translations.ts     # Language strings for i18n
├── contexts/               # React Context API providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── LanguageContext.tsx
│   ├── NavigationContext.tsx
│   └── ToastContext.tsx
├── pages/                  # Page-level components (routed components)
│   ├── DashboardPage.tsx
│   ├── POS/                # POS specific pages (POSPage, etc.) and related components (ProductGrid, CartDisplay)
│   ├── Inventory/          # Inventory specific pages (InventoryPage, VisionStockInPage, etc.)
│   ├── CRM/                # CRM specific pages (CRMPage)
│   ├── Employee/           # Employee specific pages (EmployeePage, EmployeeModal)
│   ├── Reports/            # Reports specific pages (ReportsPage, SalesChart)
│   ├── SettingsPage.tsx
│   ├── VisionCheckout/     # Vision Checkout specific pages and components
│   └── ProductSet/         # Product Set specific pages and components
├── services/               # API call services and AI logic
│   ├── geminiService.ts    # For Gemini text-based AI features
│   └── visionAIService.ts  # For Gemini Vision-related AI simulations
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component with routing
├── index.html              # Entry HTML file
├── index.tsx               # Main React entry point, renders App
├── metadata.json           # Project metadata, permissions for camera
└── README.md               # This file
```

## Key Functionalities & AI Usage

*   **Gemini API (`@google/genai`)**:
    *   Used in `geminiService.ts` for:
        *   Generating product descriptions.
        *   Suggesting related products.
        *   Summarizing report data.
        *   Generating demographic insights.
        *   Creating simulated E-Invoice JSON data.
    *   Used in `visionAIService.ts` for:
        *   Extracting structured product details from descriptive text (simulating Vision AI OCR processing).
    *   The client is initialized using `new GoogleGenAI({ apiKey: process.env.API_KEY })`.
    *   Model used: `gemini-2.5-flash-preview-04-17`.
    *   JSON responses are requested using `responseMimeType: "application/json"` and parsed carefully.

*   **Camera Access**:
    *   Requested in `metadata.json` for features like Vision AI Checkout and Vision AI Stock-In.
    *   Implemented in `CameraFeedDisplay.tsx` using `navigator.mediaDevices.getUserMedia`.

## Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository (if applicable).
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Ensure your code adheres to the project's coding standards and the Gemini API usage guidelines.
5.  Commit your changes (`git commit -m 'Add some feature'`).
6.  Push to the branch (`git push origin feature/your-feature-name`).
7.  Open a Pull Request.

## License

This project is typically licensed under a permissive license like MIT (though no `LICENSE` file is currently present). Please assume standard copyright unless a license is explicitly provided.
