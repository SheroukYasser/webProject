import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Table';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const ReservedBooks = () => {
  const [reservations, setReservations] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservations, resMembers, resBooks] = await Promise.all([
          axios.get(`${API_URL}/reservations`),
          axios.get(`${API_URL}/members`),
          axios.get(`${API_URL}/books`)
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
      await axios.put(`${API_URL}/reservations/${reservation.reservation_id}/cancel`);
      setReservations(reservations.map(r =>
        r.reservation_id === reservation.reservation_id
          ? { ...r, status: 'cancelled' }
          : r
      ));
    } catch (error) {
      console.error(error);
    }
  };

  // Map IDs to names for display
  const dataForTable = reservations.map((res) => {
    const member = members.find((m) => m.id === res.member_id);
    const book = books.find((b) => b.book_id === res.book_id);
    return {
      reservation_id: res.reservation_id,
      member_name: member ? member.full_name : res.member_id,
      book_title: book ? book.title : res.book_id,
      status: res.status
    };
  });

  const columns = ['reservation_id', 'member_name', 'book_title', 'status'];
  const actions = [
    { name: 'Cancel', onClick: handleCancel }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reservations</h2>
      <Table
        columns={columns}
        data={dataForTable}
        actions={actions}
      />
    </div>
  );
};

export default ReservedBooks;


// const ReservedBooks = () => {
//   const [reservations, setReservations] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     // Load dummy data inside a function to avoid cascading setState warning
//     const loadDummyData = () => {
//       const dummyMembers = [
//         { id: 1, full_name: 'Alice' },
//         { id: 2, full_name: 'Bob' },
//         { id: 3, full_name: 'Charlie' }
//       ];

//       const dummyBooks = [
//         { book_id: 101, title: '1984' },
//         { book_id: 102, title: 'Alchemist' },
//         { book_id: 103, title: 'Harry Potter' }
//       ];

//       const dummyReservations = [
//         { reservation_id: 1, member_id: 1, book_id: 101, status: 'pending' },
//         { reservation_id: 2, member_id: 2, book_id: 102, status: 'cancelled' },
//         { reservation_id: 3, member_id: 3, book_id: 103, status: 'pending' }
//       ];

//       setMembers(dummyMembers);
//       setBooks(dummyBooks);
//       setReservations(dummyReservations);
//     };

//     loadDummyData();
//   }, []);

//   const handleCancel = (reservation) => {
//     if (reservation.status === 'cancelled') return;

//     setReservations(reservations.map(r =>
//       r.reservation_id === reservation.reservation_id
//         ? { ...r, status: 'cancelled' }
//         : r
//     ));
//   };

//   // Map IDs to names for display
//   const dataForTable = reservations.map((res) => {
//     const member = members.find((m) => m.id === res.member_id);
//     const book = books.find((b) => b.book_id === res.book_id);
//     return {
//       reservation_id: res.reservation_id,
//       member_name: member ? member.full_name : res.member_id,
//       book_title: book ? book.title : res.book_id,
//       status: res.status
//     };
//   });

//   // Define columns
//   const columns = [
//     { key: 'reservation_id', label: 'Reservation ID' },
//     { key: 'member_name', label: 'Member Name' },
//     { key: 'book_title', label: 'Book Title' },
//     { 
//       key: 'status', 
//       label: 'Status',
//       render: (value) => (
//         <span className={value === 'cancelled' ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
//           {value}
//         </span>
//       )
//     }
//   ];

//   // Define actions
//   const actions = [
//     {
//       name: 'Cancel',
//       onClick: handleCancel,
//       disabled: (row) => row.status === 'cancelled',
//       className: 'bg-red-500 text-white hover:bg-red-600'
//     }
//   ];

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Reservations (Dummy Data)</h2>
//       <Table
//         columns={columns}
//         data={dataForTable}
//         actions={actions}
//       />
//     </div>
//   );
// };