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
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/products.html';
        } else {
          setError('ورود ناموفق بود');
        }
      });
  };

  return (
    <form onSubmit={submit}>
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Login />);

