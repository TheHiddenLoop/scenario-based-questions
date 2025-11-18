import React, { useEffect, useState, useRef } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");

  const stateController = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        if (!res.ok) throw new Error("Cannot load countries");

        const data = await res.json();
        setCountries(data.data);
      } catch (err) {
        setCountryError(err.message);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    if (stateController.current) {
      stateController.current.abort();
    }

    const controller = new AbortController();
    stateController.current = controller;

    const fetchStates = async () => {
      setLoadingStates(true);
      setStateError("");
      setStates([]); 

      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: selectedCountry }),
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to load states");

        const data = await res.json();
        setStates(data.data.states);
      } catch (err) {
        if (err.name !== "AbortError") {
          setStateError(err.message);
        }
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();

    return () => controller.abort();
  }, [selectedCountry]);

  return (
    <div>
      <h3>Select Country</h3>

      {countryError ? (
        <p>{countryError}</p>
      ) : (
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">
            {loadingCountries ? "Loading..." : "Select Country"}
          </option>

          {countries.map((c, idx) => (
            <option key={idx} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      <h3>Select State</h3>

      {stateError ? (
        <p>{stateError}</p>
      ) : (
        <select disabled={!selectedCountry}>
          <option value="">
            {loadingStates ? "Loading..." : "Select State"}
          </option>

          {states.map((s, idx) => (
            <option key={idx} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default App;
