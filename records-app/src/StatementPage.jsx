import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateTxnLocal,
  deleteTxnLocal,
  updateCustomer,
} from "./customerSlice";

export default function StatementPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { customer, acc, selectedTxn } = state || {};

  const [transactions, setTransactions] = useState(
    acc?.transactions || []
  );

  const [editingId, setEditingId] = useState(
    selectedTxn?.id || null
  );

  const [form, setForm] = useState(
    selectedTxn || {
      id: null,
      date: "",
      description: "",
      amount: "",
    }
  );

  if (!customer || !acc) return <div>No Data</div>;

  const handleAdd = () => {
    const newTxn = {
      id: Date.now(),
      date: "",
      description: "",
      amount: "",
    };

    setForm(newTxn);
    setEditingId(newTxn.id);
    setTransactions([...transactions, newTxn]);
  };

  const handleSave = () => {
    const updatedTxns = transactions.map((t) =>
      t.id === editingId ? form : t
    );

    setTransactions(updatedTxns);
    setEditingId(null);

    dispatch(
      updateTxnLocal({
        custId: customer.id,
        accId: acc.id,
        txnId: form.id,
        data: form,
      })
    );

    const updatedCustomer = {
      ...customer,
      accounts: customer.accounts.map((a) =>
        a.id !== acc.id
          ? a
          : { ...a, transactions: updatedTxns }
      ),
    };

    dispatch(updateCustomer(updatedCustomer));
  };

  const handleDelete = (id) => {
    const updatedTxns = transactions.filter(
      (t) => t.id !== id
    );

    setTransactions(updatedTxns);

    dispatch(
      deleteTxnLocal({
        custId: customer.id,
        accId: acc.id,
        txnId: id,
      })
    );

    const updatedCustomer = {
      ...customer,
      accounts: customer.accounts.map((a) =>
        a.id !== acc.id
          ? a
          : { ...a, transactions: updatedTxns }
      ),
    };

    dispatch(updateCustomer(updatedCustomer));
  };

  return (
    <div className="container py-4">
      <h3>Statement - Account {acc.id}</h3>

      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <button
        className="btn btn-primary mb-3"
        onClick={handleAdd}
      >
       Add Transaction
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>
                {editingId === txn.id ? (
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                  />
                ) : (
                  txn.date
                )}
              </td>

              <td>
                {editingId === txn.id ? (
                  <input
                    className="form-control"
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  txn.description
                )}
              </td>

              <td>
                {editingId === txn.id ? (
                  <input
                    className="form-control"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                  />
                ) : (
                  txn.amount
                )}
              </td>

              <td>
                {editingId === txn.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleSave}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditingId(txn.id);
                        setForm(txn);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(txn.id)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}