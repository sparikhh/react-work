import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
} from "../features/customers/customerSlice";
import { useState } from "react";

const StatementPage = () => {
  const { custId, accId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers);

  const customer = customers.find((c) => c.id === Number(custId));
  const account = customer.accounts.find((a) => a.id === Number(accId));

  const [form, setForm] = useState({ date: "", header: "", credit: "", debit: "" });
  const [editId, setEditId] = useState(null);

  const handleAddOrEdit = () => {
    if (!form.credit && !form.debit) return;

    const txnData = {
      date: form.date,
      header: form.header,
      amount: form.credit ? +form.credit : -form.debit,
    };

    if (editId) {
      dispatch(
        editTransaction({
          custId: customer.id,
          accId: account.id,
          txnId: editId,
          updatedTxn: txnData,
        })
      );
      setEditId(null);
    } else {
      dispatch(
        addTransaction({
          custId: customer.id,
          accId: account.id,
          transaction: { id: Date.now(), ...txnData },
        })
      );
    }

    setForm({ date: "", header: "", credit: "", debit: "" });
  };

  const handleEdit = (txn) => {
    setEditId(txn.id);
    setForm({
      date: txn.date,
      header: txn.header,
      credit: txn.amount > 0 ? txn.amount : "",
      debit: txn.amount < 0 ? Math.abs(txn.amount) : "",
    });
  };

  let runningBalance = 0;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h3>Statement for {account.type} Account</h3>

      <h5>Balance: ₹{account.transactions.reduce((s, t) => s + t.amount, 0)}</h5>

      <div className="mb-3 d-flex gap-2">
        <input
          type="date"
          className="form-control"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Header/Description"
          value={form.header}
          onChange={(e) => setForm({ ...form, header: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Credit"
          value={form.credit}
          onChange={(e) => setForm({ ...form, credit: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Debit"
          value={form.debit}
          onChange={(e) => setForm({ ...form, debit: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleAddOrEdit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Header</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {account.transactions
            .reduce((acc, t) => {
              const lastBalance = acc.length ? acc[acc.length - 1].balance : 0;
              acc.push({ ...t, balance: lastBalance + t.amount });
              return acc;
            }, [])
            .map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>

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
                      type="text"
                      className="form-control form-control-sm"
                      value={form.header}
                      onChange={(e) => setForm({ ...form, header: e.target.value })}
                    />
                  ) : (
                    t.header
                  )}
                </td>

                <td>
                  {editId === t.id ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={form.credit}
                      placeholder="Credit"
                      onChange={(e) => setForm({ ...form, credit: e.target.value })}
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
                        onClick={() => handleAddOrEdit()}
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
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatementPage;