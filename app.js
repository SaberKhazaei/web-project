const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [products, setProducts] = React.useState([]);
  const [form, setForm] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');
  const [selected, setSelected] = React.useState(null);

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
    fetch('/api/login', {
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
          placeholder="نام کاربری"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
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

  const viewDetail = id => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setSelected(data));
  };

  const addToCart = () => {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ productId: selected._id })
    }).then(() => alert('به سبد خرید اضافه شد'));
  };

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)}>بازگشت</button>
        <h2>{selected.name}</h2>
        <img src={selected.imageUrl} style={{ maxWidth: '400px', width: '100%' }} />
        <p>{selected.description}</p>
        <div>{selected.price} تومان</div>
        <button onClick={addToCart}>افزودن به سبد خرید</button>
      </div>
    );
  }

  return (
    <div>
      <h2>لیست محصولات</h2>
      <ul>
        {products.map(p => (
          <li key={p._id} onClick={() => viewDetail(p._id)}>
            <img src={p.imageUrl} width="100" />
            <strong>{p.name}</strong>
            <div>{p.price} تومان</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
