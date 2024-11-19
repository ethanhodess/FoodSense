// LogDisplay.tsx
import React, { useEffect, useState } from 'react';
import { db, collection } from '../firebase'; // Adjust import based on your file structure

interface Log {
  dayRating: number;
  food: string;
  timestamp: string;
  mealType: string;
  notes: string;
}

const LogDisplay: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const snapshot = await db.collection('foodLogs').get();
      const logsData = snapshot.docs.map(doc => doc.data() as Log);
      setLogs(logsData);
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Food Logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <p><strong>Meal:</strong> {log.food}</p>
            <p><strong>Day Rating:</strong> {log.dayRating}</p>
            <p><strong>Timestamp:</strong> {log.timestamp}</p>
            <p><strong>Note:</strong> {log.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogDisplay;
