import { useState, useEffect } from "react";
import axios from "axios";


function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get("http://10.148.101.197:5000/api/auth/users")
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users</h1>

      {users.map(user => (
        <div key={user._id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>

    
  );
}

export default AdminDashboard;