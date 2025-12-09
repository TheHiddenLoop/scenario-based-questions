import { useState, useCallback } from "react";
import React from "react";
import "./App.css";
import Search from "./components/Search";
import Records from "./components/Records";
import medical_records from "./medicalRecords";

const title = "Patient Medical Records";

const App = () => {
  const [selectedPatientId, setSelectedPatientId] = useState("0");
  const [showTable, setShowTable] = useState(false);

  const handleShow = useCallback(() => {
    if (!selectedPatientId || selectedPatientId === "0") {
      alert("Please select a patient name");
      setShowTable(false);
      return;
    }
    setShowTable(true);
  }, [selectedPatientId]);

  const handleNext = () => {
    const currentIndex = medical_records.findIndex(
      (record) => record.id === selectedPatientId
    );
    
    const nextIndex = (currentIndex + 1) % medical_records.length;
    const nextPatientId = medical_records[nextIndex].id;
    
    setSelectedPatientId(nextPatientId);
    setShowTable(true);
  };

  const currentPatientData = medical_records.find(
    (record) => record.id === selectedPatientId
  );

  return (
    <div className="App">
      <div className="content">
        <Search
          selectedPatientId={selectedPatientId}
          setSelectedPatientId={setSelectedPatientId}
          handleShow={handleShow}
        />
        {showTable && currentPatientData && (
          <Records
            patientData={currentPatientData}
            handleNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default App;