import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from "../../Table/Table.jsx";

const API_URL = 'http://localhost:5000';

const MembersAdmin = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await axios.get(`${API_URL}/members`);
        setMembers(res.data);
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  // Delete member 
  const handleDelete = async (member) => {
    try {
      await axios.delete(`${API_URL}/members/${member.member_id}`);
      setMembers((prev) => prev.filter((m) => m.member_id !== member.member_id));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const columns = [
    { key: 'member_id', label: 'ID' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const actions = [
    {
      name: 'Delete',
      onClick: handleDelete,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Members</h1>

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <Table columns={columns} data={members} actions={actions} />
      )}
    </div>
  );
};

export default MembersAdmin;
