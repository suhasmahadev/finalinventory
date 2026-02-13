# Enterprise Inventory Management System - Frontend

Production-ready React frontend application with ML-powered inventory predictions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## 📋 Prerequisites

- Node.js 18+ 
- Backend API running at `http://localhost:8000`
- npm or yarn package manager

## 🏗️ Tech Stack

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling (no framework dependencies)

## 📦 What's Included

### ✅ Fully Implemented: Products Module

Complete CRUD implementation with:
- Create Product with automatic ML prediction
- List Products with pagination
- View Product details
- Edit Product with re-prediction
- Delete Product with confirmation
- ML Model Status page

### 🔧 Ready to Use: API Service Layer

All backend endpoints are pre-configured:
- Products API (8 endpoints)
- Categories API (4 endpoints)
- Inventory API (3 endpoints)
- Analytics API (11 endpoints)
- Warehouse API (9 endpoints)
- Billing API (6 endpoints)
- Movement API (4 endpoints)
- Voice API (1 endpoint)
- Health API (1 endpoint)

### 🎨 Reusable Components

- **LoadingSpinner** - Async operation indicator
- **ErrorMessage** - Handles 422 validation errors and general errors
- **SuccessMessage** - Operation success feedback
- **DataTable** - Dynamic table with custom column rendering

## 📁 Project Structure

```
src/
├── services/
│   ├── apiClient.js          # Axios instance with error handling
│   └── api.js                # All API endpoints
├── components/
│   ├── common/               # Reusable components
│   └── products/             # Products module (reference implementation)
├── App.jsx                   # Main app with routing
└── main.jsx                  # Entry point
```

See `FOLDER_STRUCTURE.md` for complete directory tree.

## 🎯 Key Features

### 1. Strict API Schema Compliance
- Field names match backend exactly
- Proper type conversions (string → number/integer)
- Required field validation
- Null handling for optional fields

### 2. Comprehensive Error Handling
- 422 validation errors displayed with field names and messages
- General error handling with user-friendly messages
- Network error recovery
- Loading states for all async operations

### 3. Pagination Support
- Skip/limit parameters
- Previous/Next navigation
- Current page indicator

### 4. ML Integration
- Automatic sales prediction on product create
- Re-prediction on product update
- Prediction display in list and detail views
- ML model status monitoring

### 5. Responsive Design
- Mobile-friendly layouts
- Flexible grid systems
- Touch-friendly buttons
- Responsive navigation

## 🔌 API Configuration

### Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Client Features

**Request Interceptor:**
- Adds authentication headers (ready for token implementation)
- Sets default content type

**Response Interceptor:**
- Handles 422 validation errors
- Extracts error details (loc, msg)
- Formats validation errors for display

## 📖 Implementation Guide

### Creating a New Module

Follow the Products module pattern:

1. **Create Form Component**
   - Use controlled inputs
   - Match API schema exactly
   - Handle create/edit modes
   - Implement proper validation

2. **Create List Component**
   - Use DataTable component
   - Implement pagination
   - Add row click navigation
   - Format display values

3. **Create Detail Component**
   - Display all fields
   - Add edit/delete actions
   - Format dates and numbers
   - Handle loading states

4. **Add Routes**
   - List route: `/module`
   - Create route: `/module/create`
   - Detail route: `/module/:id`
   - Edit route: `/module/:id/edit`

See `IMPLEMENTATION_GUIDE.md` for detailed instructions.

## 🧪 Example: Creating a Category

```jsx
// 1. Form Component
import { categoriesApi } from '../../../services/api';

const CategoryForm = () => {
  const [formData, setFormData] = useState({ name: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await categoriesApi.createCategory(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ name: e.target.value })}
        required
        maxLength={255}
      />
      <button type="submit">Create</button>
    </form>
  );
};

// 2. List Component
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetch = async () => {
      const res = await categoriesApi.getAllCategories();
      setCategories(res.data);
    };
    fetch();
  }, []);
  
  return (
    <DataTable
      data={categories}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' }
      ]}
    />
  );
};

// 3. Add Routes in App.jsx
<Route path="/categories" element={<CategoryList />} />
<Route path="/categories/create" element={<CategoryForm />} />
```

## 🎨 Styling Guidelines

### CSS Organization
- Component-specific styles in component folder
- Global styles in `App.css`
- Base reset in `index.css`

### Color Palette
- Primary: `#3498db` (Blue)
- Success: `#27ae60` (Green)
- Danger: `#e74c3c` (Red)
- Secondary: `#95a5a6` (Gray)
- Dark: `#2c3e50`

### Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔒 Security Considerations

### Current Implementation
- Environment variables for API URL
- CORS handled by backend
- Input validation on client and server

### Ready for Production
- Add authentication token storage
- Implement protected routes
- Add CSRF protection
- Enable HTTPS in production

## 📊 Performance Optimizations

- Lazy loading for route components (ready to implement)
- Pagination to limit data transfer
- Optimistic UI updates (ready to implement)
- Request caching (ready to implement)

## 🐛 Debugging

### Common Issues

**API Connection Failed**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env file exists
cat .env
```

**422 Validation Errors**
- Check field names match API schema exactly
- Verify data types (string vs number)
- Ensure required fields are provided

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- `IMPLEMENTATION_GUIDE.md` - Complete implementation guide
- `FOLDER_STRUCTURE.md` - Directory structure reference
- `README.md` - This file

## 🔄 Development Workflow

### 1. Start Backend
```bash
cd backend
uvicorn main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## 🚢 Deployment

### Build Production Bundle
```bash
npm run build
```

Output will be in `dist/` folder.

### Serve Production Build
```bash
npm run preview
```

### Deploy to Production
1. Build the application
2. Upload `dist/` folder to your server
3. Configure web server (nginx, Apache, etc.)
4. Set production environment variables
5. Enable HTTPS

## 🤝 Contributing

### Code Style
- Use functional components
- Use hooks for state management
- Follow existing naming conventions
- Add comments for complex logic
- Keep components focused and reusable

### Before Committing
1. Test all CRUD operations
2. Check for console errors
3. Verify responsive design
4. Test error handling
5. Update documentation if needed

## 📝 License

Copyright © 2026 Enterprise Inventory Management System

## 🆘 Support

For issues or questions:
1. Check `IMPLEMENTATION_GUIDE.md`
2. Review Products module implementation
3. Check API documentation at `/docs`
4. Review backend router files for exact schemas

## 🎯 Next Steps

1. **Implement Categories Module** (simplest)
2. **Implement Warehouse Module** (moderate)
3. **Implement Analytics Dashboard** (display-only)
4. **Implement Billing Module** (complex nested items)
5. **Add Authentication** (login/logout)
6. **Add Charts** (for analytics visualization)
7. **Add Voice Integration** (audio recording)

---

**Remember**: The Products module is your complete reference implementation. Copy its patterns exactly for other modules, just changing the API endpoints and field names to match each module's schema.
