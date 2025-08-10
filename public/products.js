const { useEffect, useState } = React;

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetch('/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProducts);
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const viewProduct = id => {
    window.location.href = `/product.html?id=${id}`;
  };

  return (
    <div>
      <button onClick={logout}>خروج</button>
      <h2>محصولات</h2>
      <div className="grid">
        {products.map(p => (
          <div
            key={p._id}
            className="product"
            onClick={() => viewProduct(p._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price} تومان</p>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Products />);

