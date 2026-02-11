import React from 'react';

function App() {
  const currentTime = new Date().toLocaleString();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Hello from React</h1>
      <div style={{
        backgroundColor: '#20232a',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p><strong>Framework:</strong> JavaScript React</p>
        <p><strong>Timestamp:</strong> {currentTime}</p>
      </div>
    </div>
  );
}

export default App;
