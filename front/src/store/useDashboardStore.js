import { create } from "zustand";

const getUserFromLocalStorage = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

const useDashboardStore = create((set) => ({
    user: getUserFromLocalStorage() || null,

    notifications: [
        { id: 1, message: "Your reservation for 'Node.js Guide' is confirmed!", type: 'info', read: false },
        { id: 2, message: "Fine of $5 for 'React Basics' is due.", type: 'warning', read: false },
    ],

    borrowedBooks: [
        { id: 1, title: "React Basics", author: "John Doe", dueDate: "2025-12-05" },
        { id: 2, title: "JavaScript Deep Dive", author: "Jane Smith", dueDate: "2025-12-10" },
    ],
    fines: [
        { id: 1, reason: "Late return", amount: 5, paid: false },
        { id: 2, reason: "Damaged book", amount: 10, paid: false },
    ],
    reservations: [
        { id: 1, title: "Node.js Guide", reservedDate: "2025-11-28" },
    ],

    login: (userData, token) => {
        // localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        // set({ user: userData });
        if (token) localStorage.setItem("token", token);
        set({ user: userData });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        set({
            user: null,
            borrowedBooks: [],
            fines: [],
            reservations: [],
        });
    },

    markAsRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        }));
    },

    updateUser: (newData) => set((state) => ({
        user: { ...state.user, ...newData }
    })),

    changePassword: (newPassword) => set((state) => ({
        user: { ...state.user, password: newPassword }
    })),

    returnBook: (id) => set((state) => ({
        borrowedBooks: state.borrowedBooks.filter(b => b.id !== id)
    })),

    cancelReservation: (id) => set((state) => ({
        reservations: state.reservations.filter(r => r.id !== id)
    })),

    payFine: (id) => set((state) => ({
        fines: state.fines.map(f => f.id === id ? { ...f, paid: true } : f)
    })),
}));

export default useDashboardStore;