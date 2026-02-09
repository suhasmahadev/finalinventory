import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/inventory', label: 'Inventory', icon: '📦' },
        { path: '/warehouses', label: 'Warehouses', icon: '🏭' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
        { path: '/agent', label: 'AI Agent', icon: '🤖' },
    ];

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            zIndex: 100,
        }}>
            <div style={{
                marginBottom: '2rem',
                padding: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span> InventAI
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            color: isActive(link.path) ? 'white' : 'var(--text-secondary)',
                            backgroundColor: isActive(link.path) ? 'var(--accent-color)' : 'transparent',
                            fontWeight: isActive(link.path) ? '600' : '400',
                            transition: 'background-color 0.2s, color 0.2s',
                        }}
                    >
                        <span>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    v1.0.0 Enterprise
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
