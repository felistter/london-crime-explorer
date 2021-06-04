import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import {
  countDataCategories,
  getStopForceUrl,
  getCrimeCategoriesUrl,
  getAllCrimesAtLocationUrl,
  createCategoricalMappingFromArray,
  CRIMES_STREER_DATES,
} from "./utils";
import { CriminalMap } from "./CriminalMap";
import PieChart from "./PieChart";
import DateFnsUtils from "@date-io/date-fns";
import { Typography, Grid, CircularProgress } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";

function App() {
  const [isMapDataLoading, setIsMapDataLoading] = useState(true);
  const [isChartDataLoading, setIsChartDataLoading] = useState(null);
  const [datesFetchingError, setDatesFetchingError] = useState(null);
  const [mapFetchingError, setMapFetchingError] = useState(null);
  const [crimesFetchingError, setCrimesFetchingError] = useState(null);
  const [crimesAtLocationFetchingError, setCrimesAtLocationFetchingError] =
    useState(null);

  const [zoom] = useState(14);
  const [center] = useState([51.51253016551876, -0.0908797239395862]);

  const [force] = useState("city-of-london");
  const [crimes, setCrimes] = useState([]);
  const [selectedCrimeCounts, setSlectedCrimeCounts] = useState(null);
  const [crimeCategories, setCrimeCategories] = useState(null);

  const [date, setDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    axios.get(CRIMES_STREER_DATES).then(
      (response) => {
        setDatesFetchingError(null);

        const dates = response.data.map((item) => new Date(item.date));
        const maxDateValue = Math.max(...dates);
        const minDateValue = Math.min(...dates);

        setMaxDate(maxDateValue);
        setMinDate(minDateValue);
        setDate(maxDateValue);
      },
      (error) => {
        setDatesFetchingError(`Dates fetching (${error})`);
      }
    );
  }, []);

  useEffect(() => {
    if (date != null) {
      axios.get(getStopForceUrl(force, date)).then(
        (response) => {
          setMapFetchingError(null);
          setCrimes(response.data);
          setIsMapDataLoading(false);
        },
        (error) => {
          setMapFetchingError(`Map crimes fetching (${error})`);
        }
      );

      axios.get(getCrimeCategoriesUrl(date)).then(
        (response) => {
          setCrimesFetchingError(null);
          const categories = createCategoricalMappingFromArray(response.data);
          setCrimeCategories(categories);
        },
        (error) => {
          setCrimesFetchingError(`Crimes categories fetching (${error})`);
        }
      );
    }
  }, [date]);

  const handleChangeDate = (d) => {
    setDate(d);
    setSlectedCrimeCounts(null);
  };

  const getCrimesAtLocation = (crimes) => {
    setIsChartDataLoading(true);

    const { latitude, longitude } = crimes.location;

    axios.get(getAllCrimesAtLocationUrl(latitude, longitude, date)).then(
      (response) => {
        setCrimesAtLocationFetchingError(null);

        const crimeCounts = countDataCategories(response.data);
        setSlectedCrimeCounts(crimeCounts);

        setIsChartDataLoading(false);
      },
      (error) => {
        setCrimesAtLocationFetchingError(
          `Crimes at location fetching (${error})`
        );
      }
    );
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="column" alignItems="center">
          {datesFetchingError && (
            <Alert severity="error">{datesFetchingError}</Alert>
          )}
          {mapFetchingError && (
            <Alert severity="error">{mapFetchingError}</Alert>
          )}
          {crimesFetchingError && (
            <Alert severity="error">{crimesFetchingError}</Alert>
          )}
          {crimesAtLocationFetchingError && (
            <Alert severity="error">{crimesAtLocationFetchingError}</Alert>
          )}
          <Typography variant="h4">London Crime Explorer</Typography>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs={12}>
                <DatePicker
                  views={["year", "month"]}
                  helperText={
                    <Typography
                      variant="caption"
                      style={{ textAlign: "center" }}
                      display="block"
                    >
                      Year and Month
                    </Typography>
                  }
                  minDate={minDate}
                  maxDate={maxDate}
                  value={date}
                  onChange={handleChangeDate}
                  autoOk={true}
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            {isMapDataLoading ? (
              <CircularProgress />
            ) : (
              <CriminalMap
                center={center}
                zoom={zoom}
                stype={{ height: "500px", width: "600px" }}
                crimes={crimes}
                onMarkerClick={getCrimesAtLocation}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {isChartDataLoading != null && isChartDataLoading ? (
              <CircularProgress style={{ marginTop: "130px" }} />
            ) : (
              selectedCrimeCounts && (
                <PieChart
                  data={selectedCrimeCounts}
                  categories={crimeCategories}
                  width={700}
                  height={300}
                  innerRadius={60}
                  outerRadius={100}
                />
              )
            )}
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </>
  );
}

export default App;
