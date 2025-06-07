import React, { useState, useEffect } from 'react';
import { styles } from './Styles';

const WaitingRoomApp = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [providers, setProviders] = useState([
    { 
      id: 1, 
      name: "Dr. Johnson", 
      waitTime: "5 minutes", 
      visible: true,
      showWaitTime: true,
      isEditingWaitTime: false,
      tempWaitTime: ""
    },
    { 
      id: 2, 
      name: "Dr. Chen", 
      waitTime: "15 minutes", 
      visible: true,
      showWaitTime: true,
      isEditingWaitTime: false,
      tempWaitTime: ""
    }
  ]);
  const [newName, setNewName] = useState('');
  const [newWaitTime, setNewWaitTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addProvider = () => {
    if (newName.trim() && newWaitTime.trim()) {
      const newProvider = {
        id: Date.now(),
        name: newName.trim(),
        waitTime: newWaitTime.trim(),
        visible: true,
        showWaitTime: true,
        isEditingWaitTime: false,
        tempWaitTime: ""
      };
      setProviders([...providers, newProvider]);
      setNewName('');
      setNewWaitTime('');
    }
  };

  const deleteProvider = (id) => {
    setProviders(providers.filter(provider => provider.id !== id));
  };

  const toggleVisibility = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, visible: !provider.visible } : provider
    ));
  };

  const toggleWaitTimeVisibility = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, showWaitTime: !provider.showWaitTime } : provider
    ));
  };

  const startEditingWaitTime = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { 
        ...provider, 
        isEditingWaitTime: true,
        tempWaitTime: provider.waitTime
      } : provider
    ));
  };

  const saveWaitTime = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { 
        ...provider, 
        isEditingWaitTime: false,
        waitTime: provider.tempWaitTime
      } : provider
    ));
  };

  const cancelEditingWaitTime = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { 
        ...provider, 
        isEditingWaitTime: false
      } : provider
    ));
  };

  const handleWaitTimeChange = (id, value) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { 
        ...provider, 
        tempWaitTime: value
      } : provider
    ));
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveWaitTime(id);
    } else if (e.key === 'Escape') {
      cancelEditingWaitTime(id);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (isAdmin) {
    return (
      <div style={styles.adminContainer}>
        <div style={styles.adminPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={styles.title}>Admin Panel</h1>
            <button
              onClick={() => setIsAdmin(false)}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              View Display
            </button>
          </div>

          <div style={styles.addSection}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>Add New Provider</h3>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Provider Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') addProvider(); }}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Wait Time (e.g., 15 minutes)"
                value={newWaitTime}
                onChange={(e) => setNewWaitTime(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') addProvider(); }}
                style={styles.input}
              />
              <button onClick={addProvider} style={styles.addButton}>
                Add Provider
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Current Providers ({providers.length})
            </h3>
            
            {providers.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '18px', color: '#666' }}>No providers available</p>
              </div>
            ) : (
              <div style={styles.providerList}>
                {providers.map((provider) => (
                  <div key={provider.id} style={styles.providerCard}>
                    <div style={styles.providerInfo}>
                      <div style={styles.avatar}>
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={styles.providerName}>{provider.name}</h4>
                        {provider.isEditingWaitTime ? (
                          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={provider.tempWaitTime}
                              onChange={(e) => handleWaitTimeChange(provider.id, e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, provider.id)}
                              style={{ 
                                ...styles.input, 
                                padding: '6px 10px',
                                fontSize: '14px',
                                width: '100px'
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveWaitTime(provider.id)}
                              style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => cancelEditingWaitTime(provider.id)}
                              style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p style={styles.waitTime}>
                            Estimated wait: {provider.waitTime}
                            <button
                              onClick={() => startEditingWaitTime(provider.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                marginLeft: '5px',
                                fontSize: '12px'
                              }}
                            >
                              (edit)
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => toggleWaitTimeVisibility(provider.id)}
                        style={{
                          background: provider.showWaitTime ? '#17a2b8' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        {provider.showWaitTime ? 'Hide Time' : 'Show Time'}
                      </button>
                      <button
                        onClick={() => toggleVisibility(provider.id)}
                        style={{
                          background: provider.visible ? '#ffc107' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        {provider.visible ? 'Hide Provider' : 'Show Provider'}
                      </button>
                      <button
                        onClick={() => deleteProvider(provider.id)}
                        style={styles.deleteButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.displayContainer}>
      <button
        onClick={() => setIsAdmin(true)}
        style={styles.adminButton}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        Admin
      </button>

      <h1 style={styles.displayTitle}>Provider Wait Times</h1>
      <p style={styles.subtitle}>Current estimated wait times</p>

      {providers.filter(p => p.visible).length === 0 ? (
        <div style={styles.emptyState}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>No providers available</h2>
          <p style={{ fontSize: '1.5rem' }}>Please check back later</p>
        </div>
      ) : (
        <div style={styles.displayGrid}>
          {providers.filter(p => p.visible).map((provider, index) => (
            <div key={provider.id} style={styles.displayCard}>
              <div style={styles.displayAvatar}>
                {provider.name.charAt(4).toUpperCase()}
              </div>
              <h3 style={styles.displayName}>{provider.name}</h3>
              {provider.showWaitTime && (
                <p style={styles.displayWaitTime}>Estimated wait: {provider.waitTime}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.currentTime}>
        Current time: {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default WaitingRoomApp;