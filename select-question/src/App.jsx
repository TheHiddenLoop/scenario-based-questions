import { useCallback, useEffect, useState } from "react"
import { countries } from "./data/countries"

function App() {
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);


  const handleChnage = (e)=>{
    const seleted = e.target.value;
    setCountry(seleted);

    const found = countries.find(e=>e.value === seleted);
    setCities(found? found.cities : []);

  };
    
  
  return (
    <div>
      <select value={country} onChange={handleChnage}>
        <option value="">Select country</option>
        {countries.map((items, index)=>(
          <option key={index} value={items.value}>{items.name}</option>
        ))}
      </select>

      <select disabled={!country} value={country} onChange={(e)=>setCountry(e.target.value)}>
        <option value="">Select state</option>
        {cities.map((items, index)=>(
          <option key={index} value={items}>{items}</option>
        ))}
      </select>

    </div>
  )
}

export default App
