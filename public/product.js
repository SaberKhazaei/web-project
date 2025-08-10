const { useEffect, useState } = React;

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetch(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProduct);

    fetch('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(cart => setCartCount(cart.length));
  }, [id, token]);

  const addToCart = () => {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId: id })
    }).then(() => {
      alert('به سبد خرید اضافه شد');
      setCartCount(c => c + 1);
    });
  };

  if (!product) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price} تومان</p>
      <div style={{ marginTop: '10px' }}>
        <button onClick={addToCart}>افزودن به سبد خرید</button>
        <span style={{ marginRight: '10px' }}>({cartCount})</span>
      </div>
      <button style={{ marginTop: '10px' }} onClick={() => (window.location.href = '/products.html')}>
        بازگشت
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProductDetail />);
