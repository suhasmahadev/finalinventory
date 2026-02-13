# Frontend Application - Complete Implementation Guide

## 📁 Project Structure

```
frontend/
├── src/
│   ├── services/
│   │   ├── apiClient.js          # Axios instance with interceptors
│   │   └── api.js                # All API endpoints organized by module
│   ├── components/
│   │   ├── common/               # Reusable components
│   │   │   ├── LoadingSpinner/
│   │   │   ├── ErrorMessage/
│   │   │   ├── SuccessMessage/
│   │   │   └── DataTable/
│   │   └── products/             # Product module components
│   │       ├── ProductForm/
│   │       ├── ProductList/
│   │       ├── ProductDetail/
│   │       └── MLStatus/
│   ├── App.jsx                   # Main app with routing
│   ├── App.css                   # Global styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Base CSS
├── .env                          # Environment variables
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
The `.env` file is already configured with:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## 📦 Fully Implemented Module: Products

The Products module is **100% complete** and serves as the reference implementation for all other modules.

### Features Implemented:
- ✅ **Create Product** - POST /products with all required fields
- ✅ **List Products** - GET /products with pagination (skip/limit)
- ✅ **View Product** - GET /products/{id} with full details
- ✅ **Update Product** - PUT /products/{id} with validation
- ✅ **Delete Product** - DELETE /products/{id} with confirmation
- ✅ **ML Status** - GET /products/ml/status display

### Key Implementation Details:

#### 1. **ProductForm Component** (`components/products/ProductForm/ProductForm.jsx`)
- Controlled form inputs
- Strict field type matching:
  - `name`: string (required, max 512 chars)
  - `sku`: string (optional, max 128 chars)
  - `price`: number (required, min 0, step 0.01)
  - `in_stock`: boolean (checkbox)
  - `category_id`: integer (required, dropdown)
  - `unit`: string (optional, max 32 chars)
  - `reorder_threshold`: number (optional, min 0)
  - `lead_time_days`: integer (optional, min 0)
- Handles both create and edit modes
- Proper type conversion before API submission
- 422 validation error handling
- Success/error message display

#### 2. **ProductList Component** (`components/products/ProductList/ProductList.jsx`)
- Pagination with skip/limit parameters
- DataTable integration
- Displays ML predicted_sales field
- Row click navigation to detail page
- Formatted date display
- Badge styling for in_stock status

#### 3. **ProductDetail Component** (`components/products/ProductDetail/ProductDetail.jsx`)
- Full product information display
- ML prediction highlighting
- Edit and delete actions
- Formatted currency and dates
- Confirmation dialog for delete

#### 4. **MLStatus Component** (`components/products/MLStatus/MLStatus.jsx`)
- Model readiness check
- Model metadata display
- Status badge (ready/not ready)

## 🔧 API Service Layer

### Structure (`src/services/api.js`)
All endpoints are organized by module:

```javascript
// Products
productsApi.createProduct(data)
productsApi.getAllProducts(skip, limit)
productsApi.getProduct(id)
productsApi.updateProduct(id, data)
productsApi.deleteProduct(id)
productsApi.getMLStatus()

// Categories
categoriesApi.getAllCategories()
categoriesApi.getCategory(id)
categoriesApi.createCategory(data)
categoriesApi.deleteCategory(id)

// Inventory
inventoryApi.addStock(data)
inventoryApi.deductStock(data)
inventoryApi.getItemStock(itemId)

// Analytics
analyticsApi.getSoldToday()
analyticsApi.getRevenueToday()
analyticsApi.getTopSelling(limit)
analyticsApi.getLeastSelling(limit)
analyticsApi.getExpiring(days)
analyticsApi.getStockSummary()
analyticsApi.getDeadStock(days)
analyticsApi.getStockTurnover(itemId, days)
analyticsApi.getSalesHistory(itemId, days)
analyticsApi.getForecast(itemId, days)
analyticsApi.getReorderSuggestion(itemId, days)

// Warehouse
warehouseApi.createWarehouse(data)
warehouseApi.deleteWarehouse(id)
warehouseApi.listWarehouses()
warehouseApi.getWarehouse(id)
warehouseApi.getWarehouseDashboard(id)
warehouseApi.createRoom(data)
warehouseApi.updateRoom(id, data)
warehouseApi.deleteRoom(id)
warehouseApi.getRoom(id)

// Billing
billingApi.createBill(data)
billingApi.postBill(id)
billingApi.getBill(id)
billingApi.getBillByNumber(billNumber)
billingApi.listBills()
billingApi.deleteBill(id)

// Movement
movementApi.adjustStock(data)
movementApi.transferStock(data)
movementApi.getItemLedger(itemId)
movementApi.getBatchMovements(batchId)

// Voice
voiceApi.voiceInteraction(data)

// Health
healthApi.healthCheck()
```

## 🎨 Reusable Components

### 1. **LoadingSpinner** (`components/common/LoadingSpinner.jsx`)
```jsx
<LoadingSpinner message="Loading..." />
```

### 2. **ErrorMessage** (`components/common/ErrorMessage.jsx`)
Handles both validation errors (422) and general errors:
```jsx
<ErrorMessage error={error} onClose={() => setError(null)} />
```

### 3. **SuccessMessage** (`components/common/SuccessMessage.jsx`)
```jsx
<SuccessMessage message="Success!" onClose={() => setSuccess(null)} />
```

### 4. **DataTable** (`components/common/DataTable.jsx`)
```jsx
<DataTable 
  data={items} 
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'price', 
      label: 'Price',
      render: (value) => `$${value.toFixed(2)}`
    }
  ]}
  onRowClick={(row) => navigate(`/items/${row.id}`)}
/>
```

## 📋 How to Implement Other Modules

Follow this pattern for **Categories**, **Inventory**, **Analytics**, **Warehouse**, **Billing**, and **Movement**:

### Step 1: Create Form Component
```jsx
// Example: CategoryForm.jsx
import { useState } from 'react';
import { categoriesApi } from '../../../services/api';
import ErrorMessage from '../../common/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage';

const CategoryForm = ({ categoryId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', // Match API schema exactly
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = categoryId 
        ? await categoriesApi.updateCategory(categoryId, formData)
        : await categoriesApi.createCategory(formData);
      setSuccess('Category saved!');
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessage error={error} onClose={() => setError(null)} />
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />
      
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        maxLength={255}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

### Step 2: Create List Component
```jsx
// Example: CategoryList.jsx
import { useState, useEffect } from 'react';
import { categoriesApi } from '../../../services/api';
import DataTable from '../../common/DataTable';
import LoadingSpinner from '../../common/LoadingSpinner';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await categoriesApi.getAllCategories();
      setCategories(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (val) => new Date(val).toLocaleDateString()
    }
  ];

  return <DataTable data={categories} columns={columns} />;
};
```

### Step 3: Create Detail Component
```jsx
// Example: CategoryDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await categoriesApi.getCategory(id);
      setCategory(response.data);
    };
    fetchData();
  }, [id]);

  if (!category) return <LoadingSpinner />;

  return (
    <div>
      <h1>{category.name}</h1>
      <p>ID: {category.id}</p>
      <p>Created: {new Date(category.created_at).toLocaleString()}</p>
    </div>
  );
};
```

### Step 4: Add Routes
```jsx
// In App.jsx
<Route path="/categories" element={<CategoryList />} />
<Route path="/categories/create" element={<CategoryForm />} />
<Route path="/categories/:id" element={<CategoryDetail />} />
<Route path="/categories/:id/edit" element={<CategoryEditPage />} />
```

## 🔍 Special Cases

### Billing Module (Nested Items Array)
```jsx
const [formData, setFormData] = useState({
  billing_type: 'INCOMING',
  warehouse_id: '',
  supplier_id: '',
  customer_info: null,
  agent_id: '',
  items: [
    { item_id: '', quantity: '', unit_price: '', room_id: '' }
  ]
});

const addItem = () => {
  setFormData({
    ...formData,
    items: [...formData.items, { item_id: '', quantity: '', unit_price: '', room_id: '' }]
  });
};

const removeItem = (index) => {
  setFormData({
    ...formData,
    items: formData.items.filter((_, i) => i !== index)
  });
};

const updateItem = (index, field, value) => {
  const newItems = [...formData.items];
  newItems[index][field] = value;
  setFormData({ ...formData, items: newItems });
};
```

### Analytics Module (Display Only)
Most analytics endpoints return data for display, not forms:

```jsx
const AnalyticsDashboard = () => {
  const [soldToday, setSoldToday] = useState(null);
  const [revenueToday, setRevenueToday] = useState(null);
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [sold, revenue, top] = await Promise.all([
        analyticsApi.getSoldToday(),
        analyticsApi.getRevenueToday(),
        analyticsApi.getTopSelling(5)
      ]);
      setSoldToday(sold.data);
      setRevenueToday(revenue.data);
      setTopSelling(top.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Today's Stats</h2>
      <p>Sold: {soldToday}</p>
      <p>Revenue: ${revenueToday}</p>
      <DataTable data={topSelling} columns={...} />
    </div>
  );
};
```

## ⚠️ Critical Rules (NO EXCEPTIONS)

1. **Field Names**: Use EXACT field names from API schema
2. **Type Conversion**: Convert strings to numbers/integers before submission
3. **Required Fields**: Mark with `required` attribute and `<span className="required">*</span>`
4. **Validation Errors**: Always handle 422 responses with `error.validationErrors`
5. **Null vs Empty**: Send `null` for optional empty fields, not empty strings
6. **Pagination**: Always implement skip/limit where available
7. **Date Formatting**: Use `new Date(value).toLocaleDateString()` for display
8. **Loading States**: Show LoadingSpinner during async operations
9. **Error Handling**: Use ErrorMessage component for all errors
10. **Success Feedback**: Use SuccessMessage for successful operations

## 🧪 Testing Checklist

For each module implementation:

- [ ] Create form submits with correct field types
- [ ] Update form submits with correct field types
- [ ] List displays all response fields
- [ ] Detail page shows all information
- [ ] Delete operation works with confirmation
- [ ] Pagination works (if applicable)
- [ ] 422 validation errors display properly
- [ ] Success messages display
- [ ] Loading states show during operations
- [ ] Navigation between pages works
- [ ] Required fields are marked
- [ ] Optional fields can be left empty

## 📚 API Schema Reference

Always refer to the backend schemas for exact field definitions:
- `backend/schemas/product_schemas.py` - Product schemas
- `backend/routers/*.py` - Request/response models
- `backend/models/schema.py` - Database models

## 🎯 Next Steps

1. **Implement Categories Module** (simplest - only has `name` field)
2. **Implement Warehouse Module** (moderate - has nested rooms)
3. **Implement Inventory Module** (moderate - stock operations)
4. **Implement Analytics Module** (display-only, no forms)
5. **Implement Billing Module** (complex - nested items array)
6. **Implement Movement Module** (moderate - stock transfers)
7. **Add Voice Integration** (advanced - audio handling)

## 🔗 Resources

- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/
- Vite: https://vitejs.dev/

---

**Remember**: The Products module is your complete reference. Copy its patterns exactly for other modules, just changing the API endpoints and field names to match each module's schema.
