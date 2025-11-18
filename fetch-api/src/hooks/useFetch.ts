import { useState } from "react";

interface User {
  _id: string;
  name: string;
  email:string;
  role: string;
}

export function useFetch() {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUsers = async (role: string) => {
    try {
      setLoading(true);
      const res = await fetch("https://mocki.io/v1/8ac4a906-c5e0-4971-ae30-d1dd095e3421");

      if (!res.ok) {
        throw new Error("Error loading users");
      }
      
      const data: User[] = await res.json(); 

      const filteredData = data.filter(e => e.role !== role);

      setUsers(filteredData);

    } catch (er: unknown) { 
      const errorMessage = er instanceof Error ? er.message : "An unknown error occurred";
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return { users, loading, error, fetchUsers };
}