import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteTransaction,
  editTransaction,
} from "../features/customers/customerSlice";
import { useState } from "react";

const TransactionTable = ({ account, customer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: "", credit: "", debit: "" });

  const handleEdit = (txn) => {
    setEditId(txn.id);
    setForm({
      date: txn.date,
      credit: txn.amount > 0 ? txn.amount : "",
      debit: txn.amount < 0 ? Math.abs(txn.amount) : "",
    });
  };

  const handleAddOrUpdate = (txnId) => {
    if (!form.credit && !form.debit) return;

    const updatedTxn = {
      date: form.date,
      amount: form.credit ? +form.credit : -form.debit,
    };

    dispatch(
      editTransaction({
        custId: customer.id,
        accId: account.id,
        txnId: txnId,
        updatedTxn,
      })
    );

    setEditId(null);
    setForm({ date: "", credit: "", debit: "" });
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Credit</th>
          <th>Debit</th>
          <th>Balance</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {account.transactions.reduce((acc, t) => {
          const lastBalance = acc.length ? acc[acc.length - 1].balance : 0;
          acc.push({
            ...t,
            balance: lastBalance + t.amount,
          });
          return acc;
        }, []).map((t) => (
          <tr key={t.id}>
            <td>
              {editId === t.id ? (
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              ) : (
                t.date
              )}
            </td>
            <td>
              {editId === t.id ? (
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={form.credit}
                  placeholder="Credit"
                  onChange={(e) =>
                    setForm({ ...form, credit: e.target.value })
                  }
                />
              ) : (
                t.amount > 0 ? t.amount : ""
              )}
            </td>
            <td>
              {editId === t.id ? (
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={form.debit}
                  placeholder="Debit"
                  onChange={(e) => setForm({ ...form, debit: e.target.value })}
                />
              ) : (
                t.amount < 0 ? Math.abs(t.amount) : ""
              )}
            </td>
            <td>₹{t.balance}</td>
            <td>
              {editId === t.id ? (
                <>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleAddOrUpdate(t.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      dispatch(
                        deleteTransaction({
                          custId: customer.id,
                          accId: account.id,
                          txnId: t.id,
                        })
                      )
                    }
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm ms-2"
                    onClick={() =>
                      navigate(`/statement/${customer.id}/${account.id}`)
                    }
                  >
                    Statement
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;