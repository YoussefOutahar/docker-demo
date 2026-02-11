import React, { useState, useEffect } from 'react';

function App() {
  const [flaskData, setFlaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentTime = new Date().toLocaleString();

  useEffect(() => {
    // Fetch data from Flask API
    fetch('http://localhost:5001/api/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from Flask API');
        }
        return response.json();
      })
      .then(data => {
        setFlaskData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1>Hello from React</h1>

      <div style={{
        backgroundColor: '#20232a',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        minWidth: '400px'
      }}>
        <p><strong>Framework:</strong> JavaScript React</p>
        <p><strong>Timestamp:</strong> {currentTime}</p>
      </div>

      {/* API Call Demo */}
      <div style={{
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        minWidth: '400px',
        border: '2px solid #61dafb'
      }}>
        <h2 style={{ marginTop: 0, color: '#61dafb' }}>
          🔗 Docker Network Demo
        </h2>
        <p style={{ fontSize: '14px', color: '#aaa' }}>
          React container calling Flask API container
        </p>

        {loading && <p>Loading data from Flask API...</p>}

        {error && (
          <div style={{ color: '#ff6b6b' }}>
            <p><strong>Error:</strong> {error}</p>
            <p style={{ fontSize: '12px' }}>
              Make sure Flask is running on port 5001
            </p>
          </div>
        )}

        {flaskData && (
          <div>
            <p>✅ <strong>Status:</strong> Connected to Flask API</p>
            <p><strong>Message:</strong> {flaskData.message}</p>
            <p><strong>Container:</strong> {flaskData.container}</p>

            <div style={{
              backgroundColor: '#282c34',
              padding: '15px',
              borderRadius: '4px',
              marginTop: '15px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                Data from Flask:
              </h3>
              {flaskData.data.items.map(item => (
                <div key={item.id} style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#20232a',
                  borderRadius: '4px',
                  borderLeft: '3px solid #61dafb'
                }}>
                  <strong>{item.name}</strong> - {item.type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
