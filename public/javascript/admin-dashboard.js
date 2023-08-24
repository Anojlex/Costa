

document.addEventListener('DOMContentLoaded', () => {
    const dateRangeForm = document.getElementById('dateRangeForm');
    dateRangeForm.addEventListener('submit', handleFormSubmit);

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawInitialSalesReportChart); 

    async function handleFormSubmit(event) {
        event.preventDefault();
        drawSalesReportChart();
    }

    async function drawInitialSalesReportChart() {
        const today = new Date();

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);

        const defaultStartDate = formatDate(startDate);
        const defaultEndDate = formatDate(today);

        const response = await fetch('/admin/salesReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate: defaultStartDate, endDate: defaultEndDate }),
        });

        if (response.ok) {
            const data = await response.json();
            const salesReports = data.salesReports;

            if (salesReports.length === 0) {
                console.log('No sales data available for the selected date range.');
                return;
            }
            // Prepare data for Google Charts
            const chartData = [['Date', 'Total Sales', { role: 'annotation' }, 'Product Sold', { role: 'annotation' }, 'Orders Placed', { role: 'annotation' }]];
            salesReports.forEach(report => {
                chartData.push([
                    new Date(report.date), // Convert date to JavaScript Date object
                    report.totalSales,
                    `₹${report.totalSales}`, // Annotation for Total Sales
                    report.productCount,
                    report.productCount.toString(), // Annotation for Product Count
                    report.orderCount,
                    report.orderCount.toString(), // Annotation for Order Count
                ]);
            });

            const dataTable = google.visualization.arrayToDataTable(chartData);

            // Define chart options (same as before)
            const options = {
                title: 'Daily Sales Report',
                width: 700,
                height: 400,
                legend: { position: 'top', maxLines: 3 },
                isStacked: false,
                seriesType: 'bars',
                series: {
                    0: { targetAxisIndex: 0, color: '#f26402' }, // Total Sales (Orange)
                    1: { targetAxisIndex: 1, color: '#f26896' }, // Product Count (Line)
                    2: { targetAxisIndex: 1, color: '#f29939' }, // Order Count (Line)
                },
                vAxes: {
                    0: { title: 'Total Revenue', format: 'currency', format: '₹#,##0.00' },
                    1: { title: 'Count' },
                },
                hAxis: {
                    title: 'Date',
                    format: 'MMM dd, yyyy', // Customize date format as needed
                },
            };

            const chart = new google.visualization.ComboChart(document.getElementById('salesChart'));
            chart.draw(dataTable, options);
        } else {
            document.getElementById('salesChart').innerText="No sales Today"
            
        }
    }

    async function drawSalesReportChart() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const response = await fetch('/admin/salesReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        });

        if (response.ok) {
            // Rest of the code remains the same as before
            const data = await response.json();
            const salesReports = data.salesReports;

            // Prepare data for Google Charts
            const chartData = [['Date', 'Total Sales', { role: 'annotation' }, 'Product Sold', { role: 'annotation' }, 'Orders Placed', { role: 'annotation' }]];
            salesReports.forEach(report => {
                chartData.push([
                    new Date(report.date), 
                    report.totalSales,
                    `₹${report.totalSales}`, 
                    report.productCount,
                    report.productCount.toString(), 
                    report.orderCount,
                    report.orderCount.toString(), 
                ]);
            });

            const dataTable = google.visualization.arrayToDataTable(chartData);


            // Define chart options
            const options = {
                title: 'Sales Report',
                width: 700,
                height: 400,
                legend: { position: 'top', maxLines: 3 },
                isStacked: false,
                seriesType: 'bars',
                series: {
                    0: { targetAxisIndex: 0, color: '#f26402' }, // Total Sales (Orange)
                    1: { targetAxisIndex: 1, color: '#f26896' }, // Product Count (Line)
                    2: { targetAxisIndex: 1, color: '#f29939' }, // Order Count (Line)
                },
                vAxes: {
                    0: { title: 'Total Revenue', format: 'currency', format: '₹#,##0.00' },
                    1: { title: 'Count' },
                },
                hAxis: {
                    title: 'Date',
                    format: 'MMM dd, yyyy',
                },
            };

          
            const chart = new google.visualization.ComboChart(document.getElementById('salesChart'));
            chart.draw(dataTable, options);
        } else {
            console.error('Error loading sales report:', response.statusText);
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});





// Assuming you have an element with the ID "monthlySalesTable" for displaying the sales data
const monthlySalesTable = document.getElementById("monthlySalesTable");
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
// Function to update the table with fetched monthly sales data
const updateTable = (monthlySales) => {
    monthlySalesTable.innerHTML = "";
    const headingsRow = document.createElement("tr");
    headingsRow.innerHTML = `
        <th>Month</th>
        <th>No Of Orders</th>
        <th>No of Products</th>
        <th>Total Revenue</th>
    `;

    monthlySalesTable.appendChild(headingsRow);
    monthlySales.forEach((item) => {
        const row = document.createElement("tr");
        const monthIndex = parseInt(item._id.month) - 1; // Month value is 1-based
        const monthName = monthNames[monthIndex];
        row.innerHTML = `
            <td>${monthName}</td>
            <td>${item.totalOrderCount}</td>
            <td>${item.totalProductCount}</td>
            <td>₹ ${item.totalSales}</td>
        `;
        monthlySalesTable.appendChild(row);
    });
};



const loadDefaultReport = async () => {
    try {
        const response = await fetch("/admin/monthlySales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedYear: "2023" }), // Default selected year
        });

        const data = await response.json();
        if (data.success) {
            updateTable(data.monthlySales);
        } else {
            console.error("Error loading default monthly sales data.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

// Load the default report when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadDefaultReport();
});
// Event listener for the form submission
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedYear = form.querySelector("#selectedYear").value;

    try {
        const response = await fetch("/admin/monthlySales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedYear }),
        });

        const data = await response.json();
        if (data.success) {
            updateTable(data.monthlySales);
        } else {
            console.error("Error loading monthly sales data.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});





document.addEventListener('DOMContentLoaded', function () {
    const timeIntervalForm = document.getElementById('timeInterval');
   
    const chartContainer = document.getElementById('salesChartContainer');

    timeIntervalForm.addEventListener('submit', drawSalesReportChart);

    async function drawSalesReportChart(e) {
        e.preventDefault(); // Prevent the form from submitting and reloading the page

        const selectedInterval = timeIntervalForm.selectedChart.value; // Use the form element's name
        const Year=timeIntervalForm.selectedYear.value
        let data;

        if (selectedInterval === 'yearly') {
            // Fetch data for yearly report (example)
            data = await fetchYearlySalesData();
            drawYearlyChart(data)
        } else if (selectedInterval === 'monthly') {
            // Fetch data for monthly report (example)
            data = await fetchMonthlySalesData(Year); 
            drawMonthlyChart(data)
        } else if (selectedInterval === 'daily') {
            // Fetch data for daily report (example)
            data = await fetchDailySalesData();
        }

    }  
    async function fetchYearlySalesData() {
       
        const response = await fetch('/admin/chartType', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedChart:"yearly" }),
        });

        if (response.ok) {
           
            const data = await response.json();
            const yearlyData = data.yearlyData;

            return yearlyData

        } else {
            console.error('Error loading sales report:', response.statusText);
        }


    }

    async function fetchMonthlySalesData(Year) {
         
        const response = await fetch('/admin/chartType', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedChart:"monthly",selectedYear:Year}),
        });

        if (response.ok) {
           
            const data = await response.json();
            const monthlyData = data.monthlyData;
            return monthlyData

        } else {
            console.error('Error loading sales report:', response.statusText);
        }

    }

    async function fetchDailySalesData() {
         
        const response = await fetch('/admin/chartType', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedType:"daily" }),
        });

        if (response.ok) {
           
            const data = await response.json();
            const yearlyData = data.yearlyData;

        } else {
            console.error('Error loading sales report:', response.statusText);
        }

    }




const drawYearlyChart = (data) => {
    const chartData = [['Year', 'Total Sales', 'Product Sold', 'Orders Placed']];
    
    data.forEach(yearlyData => {
        chartData.push([
            yearlyData.year,
            yearlyData.totalSales,
            yearlyData.productCount,
            yearlyData.orderCount,
        ]);
    });

    const dataTable = google.visualization.arrayToDataTable(chartData);

    // Define chart options for yearly report
    const options = {
        title: 'Yearly Sales Report',
        width: 700,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
       
        isStacked: false,
        seriesType: 'bars',
        series: {
            0: { targetAxisIndex: 0, color: '#f26402' }, // Total Sales (Orange)
            1: { targetAxisIndex: 1, color: '#f26896' }, // Product Count (Line)
            2: { targetAxisIndex: 1, color: '#f29939' }, // Order Count (Line)
        },
        vAxes: {
            0: { title: 'Total Revenue', format: 'currency', format: '₹#,##0.00' },
            1: { title: 'Count' },
        },
        hAxis: {
            title: 'Year',
            format: 'yyyy', // Format including year and month
        },
        seriesType: 'bars',
    };
    
    // Create and draw the chart
    const chart = new google.visualization.ComboChart(chartContainer);
    chart.draw(dataTable, options);
};



const drawMonthlyChart = (data) => {
    function getMonthName(monthNumber) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
    }
console.log(data);
    const chartData = [['Month', 'Total Sales', 'Product Sold', 'Orders Placed']];
    data.forEach(monthlyData => {
        const month = monthlyData._id.month; // Extract month from _id
        const year = monthlyData._id.year; // Extract year from _id
        const label = `${getMonthName(month)} ${year}`; // Combine month and year
        chartData.push([
            label,
            monthlyData.totalSales,
            monthlyData.productCount,
            monthlyData.orderCount,
        ]);
    });

    const dataTable = google.visualization.arrayToDataTable(chartData);

    // Define chart options for monthly report
    const options = {
        title: 'Monthly Sales Report',
        width: 700,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
       
        isStacked: false,
    
        series: {
            0: { targetAxisIndex: 0, color: '#f26402' }, // Total Sales (Orange)
            1: { targetAxisIndex: 1, color: '#f26896' }, // Product Count (Line)
            2: { targetAxisIndex: 1, color: '#f29939' }, // Order Count (Line)
        },
        vAxes: {
            0: { title: 'Total Revenue', format: 'currency', format: '₹#,##0.00' },
            1: { title: 'Count' },
        },
        hAxis: {
            title: 'Year and Month',
            format: 'yyyy-MM', // Format including year and month
        },
        seriesType: 'bars',
    };
    
    // Create and draw the chart
    const chart = new google.visualization.ComboChart(chartContainer);
    chart.draw(dataTable, options);
};



    // Load Google Charts library
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawSalesReportChart);
});



document.addEventListener('DOMContentLoaded', function () {
    const chartContainer = document.getElementById('salesChartContainer');
    async function drawDefaultSalesReportChart() {
        let data;
        const d = new Date();
        let year = d.getFullYear();
    
        data = await fetchDefaultMonthlySalesData(year); 
        drawDefaultMonthlyChart(data);
    }  
    
    async function fetchDefaultMonthlySalesData(Year) {
        const response = await fetch('/admin/chartType', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedChart: "monthly", selectedYear: Year }),
        });

        if (response.ok) {
            const data = await response.json();
            const monthlyData = data.monthlyData;
            console.log(monthlyData);
            return monthlyData;
        } else {
            console.error('Error loading sales report:', response.statusText);
        }
    }

    const drawDefaultMonthlyChart = (data) => {
        function getMonthName(monthNumber) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return monthNames[monthNumber - 1];
        }

        const chartData = [['Month', 'Total Sales', 'Product Sold', 'Orders Placed']];
        data.forEach(monthlyData => {
            const month = monthlyData._id.month; // Extract month from _id
            const year = monthlyData._id.year; // Extract year from _id
            const label = `${getMonthName(month)} ${year}`; // Combine month and year
            chartData.push([
                label,
                monthlyData.totalSales,
                monthlyData.productCount,
                monthlyData.orderCount,
            ]);
        });

        const dataTable = google.visualization.arrayToDataTable(chartData);

        // Define chart options for monthly report
        const options = {
            title: 'Monthly Sales Report',
            width: 700,
            height: 400,
            legend: { position: 'top', maxLines: 3 },
            isStacked: false,
            series: {
                0: { targetAxisIndex: 0, color: '#f26402' }, // Total Sales (Orange)
                1: { targetAxisIndex: 1, color: '#f26896' }, // Product Count (Line)
                2: { targetAxisIndex: 1, color: '#f29939' }, // Order Count (Line)
            },
            vAxes: {
                0: { title: 'Total Revenue', format: 'currency', format: '₹#,##0.00' },
                1: { title: 'Count' },
            },
            hAxis: {
                title: 'Year and Month',
                format: 'yyyy-MM', // Format including year and month
            },
            seriesType: 'bars',
        };

        // Load Google Charts library
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(function () {
            const chart = new google.visualization.ComboChart(chartContainer);
            chart.draw(dataTable, options);
        });
    };

    drawDefaultSalesReportChart();
});

