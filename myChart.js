var currentChart;

document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json&per_page=60';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        var indicatorName = getIndicatorName(fetchedData);
        renderChart(data, labels, countryName, indicatorName);
        fetchInfo();
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    var indicatorName = data[1][0].indicator.value;
    return indicatorName;
}

function renderChart(data, labels, countryName, indicatorName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }
    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: indicatorName + ' - ' + countryName,
                data: data,
                borderColor: 'rgba(142, 63, 191, 1)',
                backgroundColor: 'rgba(142, 63, 191, 0.2)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 5000
            }
        }
    });
}

async function fetchInfo() {
    var countryCode = document.getElementById('country').value;
    const baseUrl = 'https://restcountries.eu/rest/v2/alpha/';
    const url = baseUrl + countryCode;
    console.log('Fetching info from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedInfo = await response.json();
        console.log(fetchedInfo);

        var countryName = fetchedInfo.name;
        var capital = fetchedInfo.capital;
        var region = fetchedInfo.region;
        var flagUrl = fetchedInfo.flag;

        renderCountryInfo(countryName, capital, region, flagUrl);

        //document.getElementById('info').innerHTML =
        //    "<p>Capital: " + capital + ", Region: " + region + ", Flag: <img src='" + flag + "'></p>";
    }
}

function renderCountryInfo(countryName, capital, region, flagUrl) {
    // Create an image element
    var img = document.createElement('img');
    img.src = flagUrl;
    img.id = 'flag';
    img.alt = 'Country flag';

    // Insert the texts and image element into the HTML document
    document.getElementById('countryName').textContent = countryName;
    document.getElementById('capital').textContent = 'Capital: ' + capital;
    document.getElementById('region').textContent = 'Region: ' + region;
    if (document.getElementById('flagContainer').firstChild !== null) {
        document.getElementById('flagContainer').firstChild.remove();
    }
    document.getElementById('flagContainer').appendChild(img);
}