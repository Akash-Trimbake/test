"use client";
import React, { useState } from "react";
import axios from "axios";
import Card from "./Card";

import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

function valuetext(value) {
  return `${value}°C`;
}

export default function Search() {
  const [chips, setChips] = useState([]);
  const [stars, setStars] = useState([100, 226322]);
  const [forks, setForks] = useState([200, 226322]);
  const [language, setLanguage] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState("lazy");
  const [data, setData] = useState([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleStarChange = (event, newValue) => {
    setStars(newValue);
    // console.log(newValue);
  };

  const handleForkChange = (event, newValue) => {
    setForks(newValue);
    // console.log(newValue);
  };
  const handleSearchChange = (event) => {
    setSelectedSearchType(event.target.value);
  };
  const handleChipChange = (event, value) => {
    setChips(value);
  };

  function formatNumberToK(number) {
    if (number >= 1000) {
      const suffixes = ["", "k", "M", "B", "T"]; // Add more suffixes as needed
      const magnitude = Math.floor(Math.log10(number) / 3);
      const scaledNumber = number / Math.pow(1000, magnitude);
      return `${scaledNumber.toFixed(1)}${suffixes[magnitude]}`;
    }
    return number.toString();
  }

  // ............................................................................................................

  const getSearchData = async () => {
    try {
      const response = await axios.post("/api/users/homesearch", {
        chips,
        language,
        selectedSearchType,
        stars,
        forks,
      });

      console.log(response.data.items);
      setData(response.data.items);
    } catch (error) {
      console.log("Error at home client :", error.message);
    }
  };

  // ............................................................................................................
  return (
    <div>
      <div className="mt-10 w-full ">
        <Autocomplete
          multiple
          id="chip-input"
          options={[]}
          freeSolo
          value={chips}
          onChange={handleChipChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <div key={option}>
                <Chip
                  className="mx-1"
                  variant="outlined"
                  label={option}
                  onDelete={() => {
                    const updatedChips = chips.filter(
                      (chip) => chip !== option
                    );
                    setChips(updatedChips);
                  }}
                />
              </div>
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Add Keywords"
              placeholder="Add Keywords"
            />
          )}
        />
      </div>
      <div className="flex flex-col w-full ">
        <div className="flex flex-col sm:flex-row justify-between">
          <FormControl className="m-1 min-w-[50%]">
            <InputLabel id="demo-simple-select-helper-label">
              Language
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={language}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"javascript"}>javascript</MenuItem>
              <MenuItem value={"typescript"}>typescript</MenuItem>
              <MenuItem value={"python"}>python</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Search Type :
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={selectedSearchType}
              onChange={handleSearchChange}
            >
              <FormControlLabel
                value="strict"
                control={<Radio />}
                label="Strict Search"
              />
              <FormControlLabel
                value="lazy"
                control={<Radio />}
                label="Lazy Search"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="flex flex-col sm:flex-row">
          <Box className="w-70 sm:w-96 mx-3 mt-12">
            <Typography variant="p" gutterBottom>
              Stars:
            </Typography>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={stars}
              onChange={handleStarChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatNumberToK(value)}
              getAriaValueText={valuetext}
              max={226322} // Set the maximum range
            />
          </Box>
          <Box className="w-70 sm:w-96 mx-3 mt-12">
            <Typography variant="p" gutterBottom>
              Forks:
            </Typography>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={forks}
              onChange={handleForkChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatNumberToK(value)}
              getAriaValueText={valuetext}
              max={226322} // Set the maximum range
            />
          </Box>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={getSearchData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Show search data
        </button>
      </div>
      <p className="m-2">{data && `${data.length} results found :`}</p>
      <div className="grid grid-flow-row gap-4 grid-cols-1 md:grid-cols-2">
        {data &&
          data.map((item) => (
            <Card
              key={item.name}
              name={item.name}
              homepage={item.homepage}
              git_url={item.svn_url}
              topics={item.topics}
              stars={item.stargazers_count}
              owner={item.owner.login}
              img={item.owner.avatar_url}
              forks={item.forks_count}
              description={item.description}
            />
          ))}
      </div>
    </div>
  );
}
