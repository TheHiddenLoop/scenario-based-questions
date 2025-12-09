import React from "react";
import medical_records from "../medicalRecords";

function Search({ selectedPatientId, setSelectedPatientId, handleShow }) {
  return (
    <div className="layout-row align-items-baseline select-form-container">
      <div className="select">
        <select
          value={selectedPatientId}
          data-testid="patient-name"
          onChange={(e) => setSelectedPatientId(e.target.value)}
        >
          <option value="0" disabled>
            Select Patient
          </option>
          {medical_records.map((record) => (
            <option key={record.id} value={record.id}>
              {record.data[0].userName}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleShow} type="button" data-testid="show">
        Show
      </button>
    </div>
  );
}

export default Search;