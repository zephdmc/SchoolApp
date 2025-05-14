import React, { useState} from 'react';
// import { getAllRoutes } from '../../../services/SessionService';  // Assume you have these functions to fetch data from backend
// import { getAllCars } from '../../../services/carService';  // Assume you have these functions to fetch data from backend
import SearchForm from '../booking1';
const SearchCars = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchData) => {
      setLoading(true);
      console.log(searchData);
      
    try {
      const { startLocation, endLocation, date } = searchData;
      
      // Step 1: Fetch routes where start and end locations match
      const routes = await getAllRoutes();
      const matchingRoutes = routes.filter(
        route => route.startLocation === startLocation && route.endLocation === endLocation
      );

      if (matchingRoutes.length === 0) {
        setError('No matching routes found.');
        setAvailableCars([]);
        return;
      }

      // Step 2: Use the routeId from the matched route(s) to fetch cars
      const routeIds = matchingRoutes.map(route => route._id);  // Assuming `_id` is routeId in your data
      const cars = await getAllCars();
      
      // Step 3: Filter cars by routeId and available date
      const filteredCars = cars.filter(car => 
        routeIds.includes(car.routeId) && car.availableDates.includes(date)
      );
      
      if (filteredCars.length === 0) {
        setError('No available cars found for the selected date.');
        setAvailableCars([]);
      } else {
        setError(null);
        setAvailableCars(filteredCars);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while searching for cars.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {availableCars.length > 0 && (
        <div>
          <h2>Available Cars</h2>
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Price</th>
                <th>Available Seats</th>
                <th>Car Number</th>
              </tr>
            </thead>
            <tbody>
              {availableCars.map((car) => (
                <tr key={car._id}>
                  <td>{car.carname}</td>
                  <td>{car.price}</td>
                  <td>{car.availableSeats}</td>
                  <td>{car.carNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchCars;
