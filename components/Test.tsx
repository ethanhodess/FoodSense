import React, { useEffect, useState } from 'react';
import { db, collection } from '../firebase'; // Firestore configuration
import { Log } from '../app/types'; // Import Log interface

const LogDisplay: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]); // State to hold logs
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true); // Start loading
        const snapshot = await db.collection('foodLogs').orderBy('timestamp', 'desc').get();
        const logsData = snapshot.docs.map(doc => doc.data() as Log); // Map Firestore docs to Log[]
        setLogs(logsData); // Set logs in state
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Food Logs</h1>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {logs.map((log, index) => (
            <li
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <p><strong>Food:</strong> {log.food}</p>
              <p><strong>Meal Type:</strong> {log.mealType}</p>
              <p><strong>Day Rating:</strong> {log.dayRating}</p>
              <p><strong>Notes:</strong> {log.notes}</p>
              <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogDisplay;
