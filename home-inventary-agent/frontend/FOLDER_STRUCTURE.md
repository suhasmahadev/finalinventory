# Frontend Folder Structure

## Complete Directory Tree

```
frontend/
│
├── public/                          # Static assets
│
├── src/
│   │
│   ├── services/                    # API Layer
│   │   ├── apiClient.js            # Axios instance with interceptors
│   │   └── api.js                  # All API endpoints (products, categories, etc.)
│   │
│   ├── components/
│   │   │
│   │   ├── common/                 # Reusable Components
│   │   │   ├── LoadingSpinner/
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── LoadingSpinner.css
│   │   │   ├── ErrorMessage/
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── ErrorMessage.css
│   │   │   ├── SuccessMessage/
│   │   │   │   ├── SuccessMessage.jsx
│   │   │   │   └── SuccessMessage.css
│   │   │   └── DataTable/
│   │   │       ├── DataTable.jsx
│   │   │       └── DataTable.css
│   │   │
│   │   ├── products/               # Products Module (FULLY IMPLEMENTED)
│   │   │   ├── ProductForm/
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── ProductForm.css
│   │   │   ├── ProductList/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductList.css
│   │   │   ├── ProductDetail/
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   └── ProductDetail.css
│   │   │   └── MLStatus/
│   │   │       ├── MLStatus.jsx
│   │   │       └── MLStatus.css
│   │   │
│   │   ├── categories/             # TO BE IMPLEMENTED
│   │   │   ├── CategoryForm/
│   │   │   ├── CategoryList/
│   │   │   └── CategoryDetail/
│   │   │
│   │   ├── inventory/              # TO BE IMPLEMENTED
│   │   │   ├── AddStockForm/
│   │   │   ├── DeductStockForm/
│   │   │   └── StockSummary/
│   │   │
│   │   ├── analytics/              # TO BE IMPLEMENTED
│   │   │   ├── Dashboard/
│   │   │   ├── SalesChart/
│   │   │   ├── TopSelling/
│   │   │   └── Forecast/
│   │   │
│   │   ├── warehouse/              # TO BE IMPLEMENTED
│   │   │   ├── WarehouseForm/
│   │   │   ├── WarehouseList/
│   │   │   ├── WarehouseDashboard/
│   │   │   ├── RoomForm/
│   │   │   └── RoomDetail/
│   │   │
│   │   ├── billing/                # TO BE IMPLEMENTED
│   │   │   ├── BillForm/
│   │   │   ├── BillList/
│   │   │   └── BillDetail/
│   │   │
│   │   └── movement/               # TO BE IMPLEMENTED
│   │       ├── AdjustmentForm/
│   │       ├── TransferForm/
│   │       └── MovementLedger/
│   │
│   ├── App.jsx                     # Main app with routing
│   ├── App.css                     # Global app styles
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Base CSS reset
│
├── .env                            # Environment variables (API_BASE_URL)
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── IMPLEMENTATION_GUIDE.md         # Complete implementation guide
└── FOLDER_STRUCTURE.md             # This file
```

## Module Status

### ✅ Fully Implemented
- **Products Module**
  - Create Product Form
  - Products List with Pagination
  - Product Detail View
  - Edit Product
  - Delete Product
  - ML Status Page

### 📦 Ready to Implement (API layer complete)
- Categories
- Inventory
- Analytics
- Warehouse
- Billing
- Movement
- Voice
- Health

## File Naming Conventions

### Components
- **Component Files**: PascalCase (e.g., `ProductForm.jsx`)
- **CSS Files**: Match component name (e.g., `ProductForm.css`)
- **Folder Names**: PascalCase (e.g., `ProductForm/`)

### Services
- **Service Files**: camelCase (e.g., `apiClient.js`, `api.js`)

### Configuration
- **Config Files**: lowercase with dots (e.g., `.env`, `vite.config.js`)

## Import Patterns

### Absolute Imports (from src/)
```javascript
import { productsApi } from '../../../services/api';
import LoadingSpinner from '../../common/LoadingSpinner';
```

### Component Imports
```javascript
// Import component and its styles
import ProductForm from './ProductForm/ProductForm';
import './ProductForm/ProductForm.css';
```

### API Imports
```javascript
// Import specific API modules
import { productsApi, categoriesApi } from '../services/api';
```

## Component Organization

Each feature module follows this structure:

```
ModuleName/
├── ComponentName/
│   ├── ComponentName.jsx    # Component logic
│   └── ComponentName.css    # Component styles
```

### Example: Products Module
```
products/
├── ProductForm/
│   ├── ProductForm.jsx      # Form for create/edit
│   └── ProductForm.css
├── ProductList/
│   ├── ProductList.jsx      # List with pagination
│   └── ProductList.css
├── ProductDetail/
│   ├── ProductDetail.jsx    # Detail view
│   └── ProductDetail.css
└── MLStatus/
    ├── MLStatus.jsx         # ML model status
    └── MLStatus.css
```

## Quick Navigation

- **API Definitions**: `src/services/api.js`
- **Reusable Components**: `src/components/common/`
- **Products Reference**: `src/components/products/`
- **Routing**: `src/App.jsx`
- **Environment Config**: `.env`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Create New Module**
   - Create folder in `src/components/`
   - Create Form, List, and Detail components
   - Add routes in `App.jsx`
   - Use existing API methods from `services/api.js`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Notes

- All API endpoints are pre-configured in `src/services/api.js`
- All common components are ready to use
- Products module serves as the complete reference implementation
- Follow the same pattern for all other modules
- Error handling and validation are built into the API client
