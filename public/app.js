const { useState, useEffect } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
    if (token) {
      fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setUser(data.username))
        .catch(() => setToken(null));
    }
  }, [token]);

  const login = (e) => {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
        }
      });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {token ? (
        <div>
          <p>سلام {user}</p>
          <button onClick={logout}>خروج</button>
        </div>
      ) : (
        <form onSubmit={login}>
          <input placeholder="نام کاربری" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="رمز" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">ورود</button>
        </form>
      )}
      <h2>محصولات</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p._id} className="product">
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price} تومان</p>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
