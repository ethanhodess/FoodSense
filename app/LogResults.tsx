import React, { useEffect, useState } from 'react';
import { useRoute } from 'expo-router'; // Use useRoute from expo-router
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this points to your Firebase config

const LogResults: React.FC = () => {
  // Get query parameters from the route
  const route = useRoute();
  const { mealType } = route.params || {}; // Destructure the mealType from route params

  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Build the query to filter by mealType if it exists
        let logsCollectionRef = collection(db, 'logs');
        if (mealType) {
          // If mealType is specified, filter by mealType
          logsCollectionRef = query(logsCollectionRef, where('mealType', '==', mealType));
        }

        const snapshot = await getDocs(logsCollectionRef);

        if (snapshot.empty) {
          console.log('No documents found.');
          setLogs([]); // Set empty logs if no data found
        } else {
          const retrievedLogs = snapshot.docs.map((doc) => {
            console.log('Document data:', doc.data()); // Debugging: Print each document's data
            return { id: doc.id, ...doc.data() }; // Add document ID and data
          });
          setLogs(retrievedLogs); // Set logs in state
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError('Failed to fetch logs.');
      }
    };

    fetchLogs();
  }, [mealType]); // Re-run the effect when 'mealType' changes

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
  };

  if (error) return <p>{error}</p>;
  if (logs.length === 0) return <p>No logs found.</p>;

  return (
    <div>
      <h1>Log Results for {mealType}</h1>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <p>Date: {formatDate(log.timestamp)}</p>
            <p>Food: {log.food}</p>
            <p>Meal Type: {log.mealType}</p>
            <p>Day Rating: {log.dayRating}</p>
            <p>Notes: {log.notes}</p>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogResults;
