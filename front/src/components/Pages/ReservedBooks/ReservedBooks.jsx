import React, { useState, useEffect } from 'react';
import Table from "../../Table/Table.jsx";
import axios from 'axios';
import API from "../../../api";

const API_URL = 'http://localhost:5000';

const ReservedBooks = () => {
  const [reservations, setReservations] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservations, resMembers, resBooks] = await Promise.all([
          API.get(`/reservations`),
          API.get(`/members`),
          API.get(`/books`)
        ]);
        setReservations(resReservations.data.data);
        setMembers(resMembers.data.data);
        setBooks(resBooks.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (reservation) => {
    if (reservation.status === 'cancelled') return;
    try {
      await API.put(`/reservations/${reservation.reservation_id}/cancel`);
      setReservations(reservations.map(r => r.reservation_id === reservation.reservation_id ? { ...r, status: 'cancelled' } : r));
    } catch (error) {
      console.error(error);
    }
  };

  const dataForTable = reservations.map(r => {
    const member = members.find(m => m.id === r.member_id);
    const book = books.find(b => b.book_id === r.book_id);
    return {
      reservation_id: r.reservation_id,
      member_name: member ? member.full_name : r.member_id,
      book_title: book ? book.title : r.book_id,
      status: r.status
    };
  });

  const columns = [
    { key: 'reservation_id', label: 'Reservation ID' },
    { key: 'member_name', label: 'Member Name' },
    { key: 'book_title', label: 'Book Title' },
    { key: 'status', label: 'Status', render: v => <span className={v==='cancelled'?'text-red-500 font-semibold':'text-green-500 font-semibold'}>{v}</span> }
  ];

  const actions = [
    { name: 'Cancel', onClick: handleCancel, disabled: r => r.status==='cancelled', className:'bg-red-500 text-white hover:bg-red-600' }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reservations</h2>
      <Table columns={columns} data={dataForTable} actions={actions} />
    </div>
  );
};

export default ReservedBooks;
