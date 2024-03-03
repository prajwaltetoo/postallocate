import React, { useState } from 'react';
import axios from 'axios';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d{0,6}$/.test(value)) { // Only allow up to 6 digits
      setPincode(value);
    }
  };

  const handleLookup = async () => {
    if (pincode.length !== 6) {
      setError('Postal code must be 6 digits');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data[0].PostOffice;
      setPostalData(data);
      setFilteredData(data);
    } catch (error) {
      setError('Error fetching postal data');
    }
    setLoading(false);
  };

  const handleFilter = (e) => {
    const { value } = e.target;
    const filtered = postalData.filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    if (filtered.length === 0) {
      setError("Couldn't find the postal data you're looking for...");
    } else {
      setError('');
    }
  };

  return (
    <div className="pincode-lookup">
      <h1>Pincode Lookup</h1>
      <input
        type="text"
        placeholder="Enter Pincode"
        value={pincode}
        onChange={handleChange}
      />
      <button onClick={handleLookup}>Lookup</button>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        placeholder="Filter by Post Office Name"
        onChange={handleFilter}
      />
      <div className="postal-data">
        {filteredData.map((item, index) => (
          <div key={index} className="postal-item">
            <p><strong>Post Office Name:</strong> {item.Name}</p>
            <p><strong>Branch Type - Delivery Status:</strong> {item.BranchType}</p>
            <p><strong>District:</strong> {item.District}</p>
            <p><strong>State:</strong> {item.State}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PincodeLookup;

