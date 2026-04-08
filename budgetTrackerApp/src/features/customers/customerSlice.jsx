import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    name: "Shubham parikh",
    mobile: "9876543210",
    email: "xyz@example.com",
    accounts: [
      {
        id: 101,
        type: "Savings",
        number: "1234",
        transactions: [
          { id: 1, date: "2024-01-01", header: "Salary", amount: 1000 },
          { id: 2, date: "2024-01-02", header: "Groceries", amount: -200 },
        ],
      },
    ],
  },
];

const customerSlice = createSlice({
  name: "customers",
  initialState,

  reducers: {
    addTransaction: (state, action) => {
      const { custId, accId, transaction } = action.payload;
      const customer = state.find(c => c.id === custId);
      const account = customer.accounts.find(a => a.id === accId);
      account.transactions.push(transaction);
    },

    deleteTransaction: (state, action) => {
      const { custId, accId, txnId } = action.payload;
      const customer = state.find(c => c.id === custId);
      const account = customer.accounts.find(a => a.id === accId);
      account.transactions = account.transactions.filter(t => t.id !== txnId);
    },

    editTransaction: (state, action) => {
      const { custId, accId, txnId, updatedTxn } = action.payload;

      const customer = state.find(c => c.id === custId);
      const account = customer.accounts.find(a => a.id === accId);

      const index = account.transactions.findIndex(t => t.id === txnId);
      account.transactions[index] = {
        ...account.transactions[index],
        ...updatedTxn,
      };
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  editTransaction,
} = customerSlice.actions;

export default customerSlice.reducer;