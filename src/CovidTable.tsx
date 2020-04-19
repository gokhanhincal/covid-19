import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "./Config";

interface ICovidData {
  country: string;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  updated: number;
}

interface ICountry {
  country: string;
  countryInfo: {
    iso2: string;
    flag: string;
  };
}

interface ILocationData {
  country: string;
}

function CovidTable() {
  const [countryCovidData, setCountryCovidData] = useState<ICovidData>();
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [currentLocation, setCurrentLocation] = useState<string>();

  async function getLocation() {
    const response = await axios.get<ILocationData>(config.currentLocationUrl);
    return response.data.country;
  }

  useEffect(() => {
    async function fetchCountries() {
      if (countries.length > 0) {
        return;
      }
      const response = await axios.get<ICountry[]>(
        config.covidApiUrl
      );
      const filteredCountries = response.data.filter(x => x.countryInfo.iso2);
      const currentCountryCode = await getLocation();

      const filteredCountry = filteredCountries.find(country => country.countryInfo.iso2 === currentCountryCode);
      setSelectedCountry(filteredCountry);
      setCurrentLocation(filteredCountry?.country);
      setCountries(filteredCountries);
    }
    fetchCountries();
  }, [countries, setCountries, setSelectedCountry, setCurrentLocation]);

  useEffect(() => {
    if (!selectedCountry)
      return;
    async function fetchData() {
      const response = await axios.get<ICovidData>(
        `${config.covidApiUrl}${selectedCountry?.countryInfo.iso2}`
      );
      setCountryCovidData(response.data);
    }

    const intervalValue = setInterval(() => {
      fetchData();
    }, 1000 * 60 * 5);
    fetchData();
    return () => {
      clearInterval(intervalValue);
    };
  }, [setCountryCovidData, selectedCountry]);

  function countryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCountry = countries[event.target.selectedIndex];
    setSelectedCountry(selectedCountry);
  }

  function generateCountry(country: ICountry, index: number, array: ICountry[]) {
    return <option key={country.countryInfo.iso2} value={country.countryInfo.iso2}>{country.country}</option>
  }

  if (!countryCovidData || countries.length === 0 || !selectedCountry) {
    return <div>Loading</div>;
  }

  const selectStyle = {
    marginTop: "60px"
  };

  const imageStyle = {
    padding: "10px"
  };

  return (
    <div className="CovidTable">
      <div>
        <img src={"corona.png"} alt="corona" style={imageStyle}></img>
      </div>
      <select value={selectedCountry.countryInfo.iso2}
        onChange={countryChanged}
        className="form-control-lg text-center covid-select"
        style={selectStyle}>
        {countries.map(generateCountry)}
      </select>
      <table className="table text-center table-striped" style={selectStyle}>
        <thead>
          <tr>
            <th colSpan={2}>
              COVID19 STATISTICS
            </th></tr></thead>
        <tbody>
          <tr>
            <td colSpan={2}>
              <img src={selectedCountry.countryInfo.flag}
                height="60px" alt="covid"></img>
            </td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{countryCovidData.country}</td>
          </tr>
          <tr>
            <th>Deaths</th>
            <td>{countryCovidData.deaths}</td>
          </tr>
          <tr>
            <th>Today Deaths</th>
            <td>{countryCovidData.todayDeaths}</td>
          </tr>
          <tr>
            <th>Today Cases</th>
            <td>{countryCovidData.todayCases}</td>
          </tr>
          <tr>
            <th>Recovered</th>
            <td>{countryCovidData.recovered}</td>
          </tr>
          <tr>
            <th>Active</th>
            <td>{countryCovidData.active}</td>
          </tr>
          <tr>
            <th>Updated</th>
            <td>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(countryCovidData.updated)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2}>Current Location: {currentLocation}</th>
          </tr>
        </tfoot>
      </table>
    </div >
  );
}

export default CovidTable;