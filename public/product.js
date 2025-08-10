const { useEffect, useState } = React;

function ProductDetail() {
  const [product, setProduct] = useState(null);
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
  }, [id, token]);

  const addToCart = () => {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId: id })
    }).then(() => alert('به سبد خرید اضافه شد'));
  };

  if (!product) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price} تومان</p>
      <button onClick={addToCart}>افزودن به سبد خرید</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProductDetail />);
