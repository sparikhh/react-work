import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3000/customers";

export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async () => {
    const res = await fetch(BASE_URL);
    return res.json();
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (customer) => {
    const res = await fetch(`${BASE_URL}/${customer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    return res.json();
  }
);

const slice = createSlice({
  name: "customers",
  initialState: {
    list: [],
    editing: null,
  },
  reducers: {
    startEdit: (state, action) => {
      state.editing = action.payload;
    },
    cancelEdit: (state) => {
      state.editing = null;
    },

    // 🔥 optimistic edit
    updateTxnLocal: (state, action) => {
      const { custId, accId, txnId, data } = action.payload;

      state.list = state.list.map((c) => {
        if (c.id !== custId) return c;

        return {
          ...c,
          accounts: c.accounts.map((a) => {
            if (a.id !== accId) return a;

            return {
              ...a,
              transactions: a.transactions.map((t) =>
                t.id === txnId ? { ...t, ...data } : t
              ),
            };
          }),
        };
      });

      state.editing = null;
    },

    // 🔥 optimistic delete
    deleteTxnLocal: (state, action) => {
      const { custId, accId, txnId } = action.payload;

      state.list = state.list.map((c) => {
        if (c.id !== custId) return c;

        return {
          ...c,
          accounts: c.accounts.map((a) => {
            if (a.id !== accId) return a;

            return {
              ...a,
              transactions: a.transactions.filter(
                (t) => t.id !== txnId
              ),
            };
          }),
        };
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.list = state.list.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      });
  },
});

export const {
  startEdit,
  cancelEdit,
  updateTxnLocal,
  deleteTxnLocal,
} = slice.actions;

export default slice.reducer;