let lat;
let long;
let dataFromCurrLoc;
let dataAccToAdd;

let urlKey = "56fc71b7577d4f69893de06c4dde6c75";

function findCurrLatLong() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      lat = position.coords.latitude;
      long = position.coords.longitude;
      findCurrentLocationInfo();
    });
  } else {
    alert("not able to find the current location");
    return;
  }
}

findCurrLatLong();

function findCurrentLocationInfo() {
  let url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${urlKey}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      dataFromCurrLoc = data.results[0];
      console.group(dataFromCurrLoc);
      showCurrDetails(dataFromCurrLoc);
    })
    .catch((error) => {
      console.group(error);
      return;
    });
}

let box1 = document.getElementById("box1");

function showCurrDetails(data) {
  box1.innerHTML += `
<div class="infoBox">
          <div class="timezone data">
            <span>Time Zone:</span>
            <strong>${data.timezone.name}</strong>
          </div>

          <div class="latlong data">
            <div class="let">
              <span>Lat: </span>
              <strong>${data.lat.toFixed(2)}</strong>
            </div>
            <div class="long">
              <span>Long:</span>
              <strong>${data.lon.toFixed(2)}</strong>
            </div>
          </div>
          <div class="offset1 data">
            <span>Offset STD: </span>
            <strong>${data.timezone.offset_STD}</strong>
          </div>
          <div class="offset2 data">
            <span>Offset STD Seconds :</span>
            <strong>${data.timezone.offset_STD_seconds}</strong>
          </div>
          <div class="offset3 data">
            <span>Offset DST : </span>
            <strong>${data.timezone.offset_DST}</strong>
          </div>
          <div class="offset4 data">
            <span>Offset DST Seconds:</span>
            <strong>${data.timezone.offset_DST_seconds}</strong>
          </div>
          <div class="country data">
            <span>Country:</span>
            <strong>${data.country}</strong>
          </div>
          <div class="postcode data">
            <span>Postcode:</span>
            <strong>${data.postcode}</strong>
          </div>
          <div class="city data">
            <span>City:</span>
            <strong>${data.city}</strong>
          </div>
        </div>
`;
}

// ---------------------------------------------------------------------------
let inputValue = document.getElementById("search");
let address;
document.getElementById("submit-btn").addEventListener("click", () => {
  console.log(inputValue.value);
  if (inputValue.value.trim() == "") {
    document.getElementById("msg").style.display = "block";
    return;
  } else {
    address = inputValue.value.trim().toLowerCase();
    document.getElementById("result").style.display = "block";
    document.getElementById("msg").style.display = "none";

    findDataAccToAdd();
  }
});

function findDataAccToAdd() {
  fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address
    )}&apiKey=${urlKey}`
  )
    .then((resp) => resp.json())
    .then((result) => {
      dataAccToAdd = result.features;
      showDetailsAccToAdress(dataAccToAdd);
      // console.log("woking");
    })
    .catch((error) => {
      console.log(error);
    });
}

let box2 = document.getElementById("box2");

function showDetailsAccToAdress(Alldata) {
  if (Alldata.length == 0) {
    document.getElementById("notfound").style.display = "block";
    inputValue.value = "";
    return;
  }
  console.log(Alldata[0]);

  box2.innerHTML = "";

  let postcode = Alldata[0].properties.postcode;
  let city = Alldata[0].properties.city;
  if (!postcode) {
    postcode = "N.A";
  }
  if (!city) {
    city = "N.A";
  }

  box2.innerHTML += `
<div class="infoBox">

<p id="msg">Please enter an address!</p>
<div class="timezone data">
  <span>Time Zone :</span>
  <strong>${Alldata[0].properties.timezone.name}</strong>
</div>

<div class="latlong data">
  <div class="let">
    <span>Lat: </span>
    <strong>${Alldata[0].properties.lat.toFixed(2)}</strong>
  </div>
  <div class="long">
    <span>Long:</span>
    <strong>${Alldata[0].properties.lon.toFixed(2)}</strong>
  </div>
</div>
<div class="offset1 data">
  <span>Offset STD: </span>
  <strong>${Alldata[0].properties.timezone.offset_STD}</strong>
</div>
<div class="offset2 data">
  <span>Offset STD Seconds :</span>
  <strong>${Alldata[0].properties.timezone.offset_STD_seconds}</strong>
</div>
<div class="offset3 data">
  <span>Offset DST : </span>
  <strong>${Alldata[0].properties.timezone.offset_DST}</strong>
</div>
<div class="offset4 data">
  <span>Offset DST Seconds:</span>
  <strong>${Alldata[0].properties.timezone.offset_DST_seconds}</strong>
</div>
<div class="country data">
  <span>Country:</span>
  <strong>${Alldata[0].properties.country}</strong>
</div>
<div class="postcode data">
  <span>PostCode:</span>
  <strong>${postcode}</strong>
</div>
<div class="city data">
  <span>City:</span>
  <strong>${city}</strong>
</div>
</div>
`;
}
