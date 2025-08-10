const { useEffect, useState } = React;

function Cart() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetch('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setItems);
  }, [token]);

  const back = () => {
    window.location.href = '/products.html';
  };

  const removeItem = id => {
    fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setItems(prev => prev.filter(item => item._id !== id));
    });
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <div>
      <button onClick={back}>بازگشت</button>
      <h2>سبد خرید</h2>
      <p>تعداد محصولات: {items.length}</p>
      <div className="grid">
        {items.map(item => (
          <div key={item._id} className="product">
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price} تومان</p>
            <button onClick={() => removeItem(item._id)}>حذف</button>
          </div>
        ))}
      </div>
      <div className="total">
        <p>جمع کل: {total} تومان</p>
        <button>پرداخت</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Cart />);
