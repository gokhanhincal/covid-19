import React, { useEffect, useState } from "react";
import config from "./Config";
import axios from "axios";

interface IWorldData {

    updated: number;
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    active: number;
    critical: number;
    continent: string;
    affectedCountries: 212

}

function WorldCovidTable() {
    const [worldCovidData, setWorldCovidData] = useState<IWorldData | null>(null);

    function fetchWorldCovidData() {
        async function fetch() {
            try {
                const response = await axios.get<IWorldData>(config.worldDataUrl);
                setWorldCovidData(response.data);
            }
            catch (e) {
                console.error(e);
                setWorldCovidData(null);
            }
        }

        fetch();

        const intervalId = setInterval(fetch, 1000 * 60 * 5); // 5 minutes

        return () => {
            clearInterval(intervalId);
        }
    }

    useEffect(fetchWorldCovidData, [setWorldCovidData]);

    const loadingStyle: React.CSSProperties = {
        fontWeight: "bold",
        width: "95%",
        margin: "60px auto"
    };

    if (!worldCovidData) {
        return (<div style={loadingStyle}>Loading...</div>)
    }

    return (<React.Fragment>
        <tr>
            <th colSpan={2}>
                <b>WORLD COVID19 STATISTICS</b>
            </th>
        </tr>
        <tr>
            <th>Affected Countries</th>
            <td>{worldCovidData.affectedCountries}</td>
        </tr>
        <tr>
            <th>Deaths</th>
            <td>{worldCovidData.deaths}</td>
        </tr>
        <tr>
            <th>Today Deaths</th>
            <td>{worldCovidData.todayDeaths}</td>
        </tr>
        <tr>
            <th>Cases</th>
            <td>{worldCovidData.cases}</td>
        </tr>
        <tr>
            <th>Today Cases</th>
            <td>{worldCovidData.todayCases}</td>
        </tr>
        <tr>
            <th>Recovered</th>
            <td>{worldCovidData.recovered}</td>
        </tr>
        <tr>
            <th>Critical</th>
            <td>{worldCovidData.critical}</td>
        </tr>
        <tr>
            <th>Active</th>
            <td>{worldCovidData.active}</td>
        </tr>
    </React.Fragment >);
}


export default WorldCovidTable;

