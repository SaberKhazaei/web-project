const { useState } = React;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = e => {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/products.html';
        } else {
          console.error('Login failed', res.status, data);
          setError('ورود ناموفق بود');
        }
      })
      .catch(err => {
        console.error('Login request error', err);
        setError('ورود ناموفق بود');
      });
  };

  return (
    <div className="login-wrapper">
      <img src="my_photo.jpeg" alt="login" className="login-image" />
      <form onSubmit={submit} className="login-form">
        <input
          placeholder="نام کاربری"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">ورود</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Login />);

