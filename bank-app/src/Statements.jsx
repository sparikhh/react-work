import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Statements() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [records, setRecords] = useState(state?.statements || []);
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (record = null) => {
    setEditRecord(record || { id: Date.now(), taxid: "", taxdate: "", taxheader: "", taxcredit: "", taxdebit: "" });
    setShowModal(true);
  };

  const saveRecord = () => {
    if (records.some((r) => r.id === editRecord.id)) {
      setRecords(records.map((r) => (r.id === editRecord.id ? editRecord : r)));
    } else {
      setRecords([...records, editRecord]);
    }
    setShowModal(false);
  };

  const deleteRecord = (id) => {
    if (window.confirm("Delete this record?")) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Transaction Statements</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>Statements Records</span>
          <button className="btn btn-light btn-sm" onClick={() => openModal()}>
            Add Record
          </button>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Tax ID</th>
                <th>Date</th>
                <th>Header</th>
                <th>Credit</th>
                <th>Debit</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No records found.
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.taxid}</td>
                  <td>{r.taxdate}</td>
                  <td>{r.taxheader}</td>
                  <td>{r.taxcredit}</td>
                  <td>{r.taxdebit}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openModal(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteRecord(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    {records.some((r) => r.id === editRecord.id) ? "Edit Record" : "Add Record"}
                  </h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Tax ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRecord.taxid}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, taxid: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editRecord.taxdate}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, taxdate: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Header</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRecord.taxheader}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, taxheader: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Credit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editRecord.taxcredit}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, taxcredit: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Debit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editRecord.taxdebit}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, taxdebit: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={saveRecord}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}