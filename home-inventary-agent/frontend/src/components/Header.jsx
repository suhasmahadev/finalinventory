const Header = ({ title }) => {
    return (
        <header style={{
            height: 'var(--header-height)',
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-width)',
            right: 0,
            backgroundColor: 'var(--bg-primary)', // Semi-transparent or solid matching bg
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 90,
            backdropFilter: 'blur(10px)',
            background: 'rgba(26, 26, 26, 0.8)'
        }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    AD
                </div>
            </div>
        </header>
    );
};

export default Header;
