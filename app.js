const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [products, setProducts] = React.useState([]);
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (token) {
      fetch('/api/products', {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [token]);

  const handleLogin = e => {
    e.preventDefault();
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          setError('ورود ناموفق بود');
        }
      });
  };

  if (!token) {
    return (
      <form onSubmit={handleLogin}>
        <h2>ورود</h2>
        <input
          placeholder="ایمیل"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">ورود</button>
        {error && <p>{error}</p>}
      </form>
    );
  }

  return (
    <div>
      <h2>لیست محصولات</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <img src={p.image} width="100" />
            <strong>{p.name}</strong>
            <div>{p.price} تومان</div>
            <button>افزودن به سبد خرید</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
