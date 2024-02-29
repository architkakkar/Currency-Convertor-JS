// API Endpoint.
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

// DOM elements.
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const interchange = document.querySelector(".dropdown i");
const message = document.querySelector(".msg");

// add dropdown options dynamically at runtime.
for (let select of dropdowns) {
  // countryList exported from codes.js.
  Object.keys(countryList).forEach((currCode) => {
    // add new option element.
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // select USD as default 'from' currency.
    if (select.name === "from" && currCode === "USD") {
      newOption.setAttribute("selected", true);
    }
    // select INR as default 'to' currency.
    else if (select.name === "to" && currCode === "INR") {
      newOption.setAttribute("selected", true);
    }

    // append the option under both select tags.
    select.append(newOption);
  });

  // when currency code is changed, update the country flag too.
  select.addEventListener("change", (e) => {
    setFlag(e.target);
  });
}

// set the country flag for selected currency code.
const setFlag = (element) => {
  // get the currencyCode.
  const selectedCurrCode = element.value;
  // get the countryCode.
  const countryCode = countryList[selectedCurrCode];
  // select the image element.
  const img = element.parentElement.querySelector("img");
  // set new image src value.
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  // update image src attribute value.
  img.setAttribute("src", newSrc);
};

// setting the exchange rate value for default case.
document.addEventListener("load", updateExchangeRate("1", "USD", "INR"));

// get currency exchange rates.
btn.addEventListener("click", (e) => {
  // prevents the default behavior of form submit button.
  e.preventDefault();

  // getting the amount entered by user.
  const amount = document.querySelector(".amount input");
  let amountVal = amount.value;

  // checking if amount is empty or less than equal to 0, set it to default 1.
  if (amount === "" || amountVal <= 0) {
    amountVal = 1;
    amount.value = 1;
  }

  // Accessing to and from currency elements.
  const from = document.querySelector("#from");
  const to = document.querySelector("#to");

  // Accessing to and from currency values.
  let fromCurr = from.value;
  let toCurr = to.value;

  // calling function to print final message.
  updateExchangeRate(amountVal, fromCurr, toCurr);
});

// function to get the conversion rate from API.
async function updateExchangeRate(amount, from, to) {
  // update API endpoint with params.
  const URL = `${BASE_URL}/${from.toLowerCase()}/${to.toLowerCase()}.json`;

  // fetching the data from API.
  const response = await fetch(URL);
  const data = await response.json();

  // parsing the rate to float and multiplying with the amount later.
  const rate = parseFloat(data[to.toLowerCase()]);
  let result = rate * amount;

  // rounding off result value.
  if (result >= 100000) {
    result = result.toFixed(2);
  } else if (result >= 1 && result < 100000) {
    result = result.toFixed(4);
  } else {
    result = result.toFixed(6);
  }

  // updating final result message.
  message.innerText = `${amount} ${from} = ${result} ${to}`;
}

// interchange 'to' and 'from' currencies.
interchange.addEventListener("click", () => {
  // Accessing to and from currency elements.
  const from = document.querySelector("#from");
  const to = document.querySelector("#to");

  // Accessing to and from currency values.
  let fromCountry = from.value;
  let toCountry = to.value;

  // swapping the values.
  from.value = toCountry;
  to.value = fromCountry;

  // updating their flags too.
  setFlag(from);
  setFlag(to);

  // rotate effect.
  interchange.classList.add("exchange");

  setTimeout(() => {
    interchange.classList.remove("exchange");
  }, 250);
});
