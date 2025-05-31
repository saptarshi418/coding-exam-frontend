import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Contests = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('contests/');
        setContests(response.data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="bg-[#1F4068] text-[#E0E0E0] p-4">
      <h2 className="text-2xl font-bold mb-4">Available Contests</h2>
      <ul>
        {contests.map((contest) => (
          <li key={contest.id} className="mb-2 p-2 bg-[#1A1A2E] rounded-lg">
            <h3 className="text-xl font-semibold">{contest.role}</h3>
            <p>{contest.company_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contests;
