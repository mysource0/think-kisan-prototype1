// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, getDoc, collection, setDoc, getDocs, doc as docRef } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// nav buttons

// let nav_last_recent_button = document.getElementById("last_recent_updated_section");
//let nav_search_operation_button = document.getElementById("search_results_section");
// let nav_database_reading_operations_button = document.getElementById("range_data_operations");

// nav_last_recent_button.style.display="block";
// nav_search_operation_button.style.display="none";
// nav_database_reading_operations_button.style.display="none"

// function displayLastRecentData(){
//   if(nav_last_recent_button.style.display=="none"){
//     nav_last_recent_button.style.display="block";
//     nav_search_operation_button.style.display="none";
//     nav_database_reading_operations_button.style.display="none"
//   }
// }

// function showdatabaseoperations(){
//   if(nav_database_reading_operations_button.style.display=="none"){
//     nav_database_reading_operations_button.style.display="block";
//     nav_last_recent_button.style.display="none";  // Fixed typo here
//     nav_search_operation_button.style.display="none";
//   }
// }




// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBfUMZZyYlA7WcpwlLeM3KbtxhBsmJ_3N8",
    authDomain: "thinksong-b4086.firebaseapp.com",
    projectId: "thinksong-b4086",
    storageBucket: "thinksong-b4086.firebasestorage.app",
    messagingSenderId: "68241922299",
    appId: "1:68241922299:web:a0d329ee7c3e741f18b85e",
    measurementId: "G-1QJ8HTK9N9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Function to fetch and display All sensor data
const complete_database = document.getElementById("complete_database_data");
complete_database.style.display="none";
export async function getSensorData() {
  // Get the container for displaying complete database data
  let dataContainer = document.getElementById("complete_database_data");
  if(dataContainer.style.display == "none"){
        dataContainer.style.display = "block"
        document.getElementById("entire_db_button").textContent = "close database"
    }
    else{
        dataContainer.style.display = "none"

        document.getElementById("entire_db_button").textContent = "Show Entire Data In DataBase"
    }
  try {
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    dataContainer.innerHTML = ""; // Clear previous data

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert the document ID (assumed to be epoch in seconds) to a local date string
      const time_convert = new Date(parseInt(doc.id, 10) * 1000).toLocaleString();

      const dataHtml = `
        <div class="data-card">
          <h3>Sensor ID: ${doc.id} [<i>recorded at</i>] ${time_convert}</h3>
          <p><strong>Moisture:</strong> ${data.Moisture}</p>
          <p><strong>Temperature:</strong> ${data.Temperature}°C</p>
          <p><strong>pH:</strong> ${data.pH}</p>
          <p><strong>Nitrogen:</strong> ${data.Nitrogen}</p>
          <p><strong>Phosphorus:</strong> ${data.Phosphorus}</p>
          <p><strong>Potassium:</strong> ${data.Potassium}</p>
          <p><strong>Electrical Conductivity:</strong> ${data.Electrical_Conductivity}</p>
          <p><strong>RSSI:</strong> ${data.RSSI}</p>
          <p><strong>Timestamp:</strong> ${data.Timestamp}</p>
        </div>
      `;
      dataContainer.innerHTML += dataHtml;
    });
  } catch (error) {
    dataContainer.innerHTML = `Error fetching data: ${error}`;
    console.error("Error fetching data:", error);
  }
}

// Expose the function to the global scope so it can be called from the HTML button
window.getSensorData = getSensorData;

////


// Function to fetch & display the last recent data (highest doc.id as epoch)
// Function to fetch and display MOST RECENT sensor data
async function displayLastRecentData() {

  
    console.log("displayLastRecentData function triggered.");
    try {
      // Fetch all documents from the "SensorData" collection
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      console.log("Number of documents fetched:", querySnapshot.size);
  
      // Check if there are no documents
      if (querySnapshot.empty) {
        document.getElementById("lastRecentOutput").innerText = "No data found.";
        console.warn("QuerySnapshot is empty.");
        return;
      }
  
      let lastDoc = null;
      let maxEpoch = -Infinity;
  
      // Iterate over each document and check its ID as epoch
      querySnapshot.forEach((doc) => {
        const docEpoch = parseInt(doc.id, 10);
        if (isNaN(docEpoch)) {
          console.warn("Document ID is not a valid number (epoch):", doc.id);
          return; // skip this document
        }
        console.log("Document ID:", doc.id, "Epoch:", docEpoch);
        if (docEpoch > maxEpoch) {
          maxEpoch = docEpoch;
          lastDoc = doc;
        }
      });
  
      // Check if no valid document was found
      if (!lastDoc) {
        document.getElementById("lastRecentOutput").innerText = "No valid data found.";
        console.warn("No valid document with a numeric ID found.");
        return;
      }
  
      // Convert epoch to a readable local time
      const localTime = new Date(maxEpoch * 1000).toLocaleString();
      const data = lastDoc.data();
  
      console.log("Most recent document:", lastDoc.id, data);
  
      // Build the HTML table to display the data in a clean format
      document.getElementById("lastRecentOutput").innerHTML = `
        <h3>Most Recent Sensor Data</h3>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px;">Field</th>
              <th style="text-align: left; padding: 8px;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px;">Doc ID (Epoch)</td>
              <td style="padding: 8px;">${lastDoc.id}</td>
            </tr>
             <tr>
              <td style="padding: 8px;">Timestamp </td>
              <td style="padding: 8px;">${data.Timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Moisture</td>
              <td style="padding: 8px;">${data.Moisture}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Temperature</td>
              <td style="padding: 8px;">${data.Temperature}°C</td>
            </tr>
            <tr>
              <td style="padding: 8px;">pH</td>
              <td style="padding: 8px;">${data.pH}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Nitrogen</td>
              <td style="padding: 8px;">${data.Nitrogen}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Phosphorus</td>
              <td style="padding: 8px;">${data.Phosphorus}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Potassium</td>
              <td style="padding: 8px;">${data.Potassium}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Electrical Conductivity</td>
              <td style="padding: 8px;">${data.Electrical_Conductivity}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">RSSI</td>
              <td style="padding: 8px;">${data.RSSI}</td>
            </tr>

          </tbody>
        </table>
      `;
    } catch (error) {
      console.error("Error fetching last recent data:", error);
      document.getElementById("lastRecentOutput").innerText = "Error loading data.";
    }
  }
  
  // Attach the function to DOMContentLoaded so it runs once the DOM is ready
  document.addEventListener('DOMContentLoaded', displayLastRecentData);
  

//////////////// range data and operations
// --- Assuming Firebase is already imported and initialized ---
// e.g., 
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

/**
 * Fetches sensor data within a specified date range.
 * Assumes the document IDs in "SensorData" are epoch timestamps (in seconds).
 */
let date_range_data_block = document.getElementById("last_date_range_data");
date_range_data_block.style.display="none";

async function fetchRangeData() {

 // let dataContainer = document.getElementById("last_date_range_data");
  if(date_range_data_block.style.display=="none"){
    date_range_data_block.style.display="block";
    document.getElementById("last_date_data_button").textContent="close data"
  }
  else{
    date_range_data_block.style.display="none";
    document.getElementById("last_date_data_button").textContent="fetch data"

  }
  // Get the input values for start and end date
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;

  if (!startDateInput || !endDateInput) {
    document.getElementById("last_date_range_data").innerText = "Please enter both start and end date/time.";
    return;
  }

  // Convert input date strings to epoch (in seconds)
  const startEpoch = Math.floor(new Date(startDateInput).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endDateInput).getTime() / 1000);

  try {
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    const results = [];

    // Filter documents based on doc.id (epoch)
    querySnapshot.forEach(doc => {
      const docEpoch = parseInt(doc.id, 10);
      if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
        results.push({ id: doc.id, data: doc.data() });
      }
    });

    let html = "";
    if (results.length === 0) {
      html = "<p>No records found in the selected range.</p>";
    } else {
      html += `<h3>Records from ${new Date(startEpoch * 1000).toLocaleString()} to ${new Date(endEpoch * 1000).toLocaleString()}</h3>`;
      // Loop through each record and create an outlined block for it
      results.forEach(rec => {
        html += `
          <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;">
            <h4>Doc ID (Epoch): ${rec.id}</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>`;
        // Create a row for each key-value pair in the document data
        for (const key in rec.data) {
          if (rec.data.hasOwnProperty(key)) {
            html += `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${rec.data[key]}</td>
                  </tr>`;
          }
        }
        html += `
              </tbody>
            </table>
          </div>`;
      });
    }
    document.getElementById("last_date_range_data").innerHTML = html;
  } catch (error) {
    console.error("Error fetching range data:", error);
    document.getElementById("last_date_range_data").innerText = "Error fetching data.";
  }
}

// Expose the function to the global scope
window.fetchRangeData = fetchRangeData;

//////// Last N range of data
let n_range_data_block = document.getElementById("last_n_range_data");
n_range_data_block.style.display="none";

async function fetchLastNRangeData() {

  if(n_range_data_block.style.display=="none"){
    n_range_data_block.style.display="block";
    document.getElementById("last_n_range_data_button").textContent="close data"
  }
  else{
    n_range_data_block.style.display="none";

    document.getElementById("last_n_range_data_button").textContent="last N data"

  }


  const nRecords = parseInt(document.getElementById('nRecordsInput').value, 10);
  
  if (isNaN(nRecords) || nRecords <= 0) {
      document.getElementById("last_n_range_data").innerText = "Please enter a valid number of records.";
      return;
  }

  try {
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      const records = [];

      // Sort documents by ID (Epoch) in descending order
      querySnapshot.forEach(doc => {
          records.push({ id: doc.id, data: doc.data() });
      });

      records.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Newest first
      const lastNRecords = records.slice(0, nRecords);

      let html = "";
      if (lastNRecords.length === 0) {
          html = "<p>No records found.</p>";
      } else {
          html += `<h3>Last ${nRecords} Records</h3>`;
          lastNRecords.forEach(rec => {
              html += `
              <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;">
                  <h4>Doc ID (Epoch): ${rec.id}</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                      <tbody>`;
              for (const key in rec.data) {
                  if (rec.data.hasOwnProperty(key)) {
                      html += `
                      <tr>
                          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
                          <td style="padding: 8px; border: 1px solid #ddd;">${rec.data[key]}</td>
                      </tr>`;
                  }
              }
              html += `
                      </tbody>
                  </table>
              </div>`;
          });
      }
      document.getElementById("last_n_range_data").innerHTML = html;
  } catch (error) {
      console.error("Error fetching last N records:", error);
      document.getElementById("last_n_range_data").innerText = "Error fetching data.";
  }
}

// Expose function globally
window.fetchLastNRangeData = fetchLastNRangeData;

/// search document 
const search_results_section = document.getElementById("search_results_section");

// Assume db is already initialized
async function searchDocumentById() {
  search_results_section.style.display = "block";
  // Get the selected radio button
  const selectedRadio = document.querySelector('input[name="search-type"]:checked');
  if (!selectedRadio) {
    document.getElementById("search_results").innerHTML =
      "Please select a search type (Name, doc id, or Location).";
    return;
  }

  // Check if the selected type is "doc_id"
  if (selectedRadio.value === "doc_id") {
    // Get the search term (document ID)
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (!searchTerm) {
      document.getElementById("search_results").innerHTML =
        "Please enter a document ID to search.";
      return;
    }

    try {
      // Use docRef instead of doc
      const documentRef = docRef(db, "SensorData", searchTerm);
      const docSnap = await getDoc(documentRef);
      let html = "";
      
      if (!docSnap.exists()) {
        html = `<p>No record found with document ID "${searchTerm}".</p>`;
      } else {
        const data = docSnap.data();
        html += `<h3>Record for Document ID: ${searchTerm}</h3>`;
        html += `<table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th style="text-align:left; padding:8px;">Field</th>
                      <th style="text-align:left; padding:8px;">Value</th>
                    </tr>
                  </thead>
                  <tbody>`;

for (const key in data) {
  if (!data.hasOwnProperty(key)) continue;
  if (key === "SourceDocIDs") continue; // Skip the SourceDocIDs field
  html += `<tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">${key}</td>
            <td style="padding:8px; border:1px solid #ddd;">${data[key]}</td>
          </tr>`;
}


        }
        html += `</tbody></table>`;
      document.getElementById("search_results").innerHTML = html;
    } catch (error) {
      console.error("Error searching document by ID:", error);
      document.getElementById("search_results").innerText = "Data not found.";
    }
  } else {
    // For other search types, notify the user that only document ID search is supported.
    document.getElementById("search_results").innerHTML =
      "This search function currently supports document ID search only.";
  }
}

window.searchDocumentById = searchDocumentById;

const doc_updated_feedback_block = document.getElementById("doc_updated_feedback");
doc_updated_feedback_block.style.display = "none"; ///// document create feed back

document.addEventListener('DOMContentLoaded', () => {
  const range_operations_nav = document.getElementById("range_data_operations");
  const last_recent_updated_section = document.getElementById("last_recent_updated_section");


  // Set initial visibility
  range_operations_nav.style.display = "none";
  last_recent_updated_section.style.display = "block";
 

  window.display_db_reading_operations = function display_db_reading_operations() {
    last_recent_updated_section.style.display = "none";
    search_results_section.style.display = "none";
    document.getElementById("create_report_container").style.display = "none";
    doc_updated_feedback_block.style.display="none";
    document.getElementById("creationFeedback").style.display = "none";
    document.getElementById("inputFormContainer").style.display="none";
    // Use getComputedStyle if needed:
    if (window.getComputedStyle(range_operations_nav).display === "none") {
      range_operations_nav.style.display = "block";
    }
  };

  window.displayLastRecentData = function displayLastRecentData(){
    search_results_section.style.display = "none";
    range_operations_nav.style.display = "none";
    doc_updated_feedback_block.style.display="none";
    document.getElementById("creationFeedback").style.display = "none";
    document.getElementById("inputFormContainer").style.display="none";

    document.getElementById("create_report_container").style.display = "none";
    search_results_section.style.display = "none";
    if(window.getComputedStyle(last_recent_updated_section).display === "none"){
      last_recent_updated_section.style.display = "block";
    }
  };


  // Now you can call display_db_reading_operations() via a button click or other event.
});








// Toggle display of the create report container
function create_report() {
  document.getElementById("last_recent_updated_section").style.display="none";
  
  const container = document.getElementById("create_report_container");
  // Toggle visibility
  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
    document.getElementById("range_data_operations").style.display="none";

  } else {
    container.style.display = "none";
  }
}
window.create_report = create_report;

// Function to submit the report
// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Function to submit the report
  async function submitReport() {
    // Get input values
    const startDate = document.getElementById("reportStartDate").value;
    const endDate = document.getElementById("reportEndDate").value;
    const reportDocName = document.getElementById("reportDocName").value.trim();
    const location = document.getElementById("reportLocation").value.trim();

    // Use the feedback element
    doc_updated_feedback_block.style.display = "block"
    const feedbackEl = document.getElementById("doc_update_results");

    if (!startDate || !endDate || !reportDocName || !location) {
      feedbackEl.innerHTML = "Please fill in all fields.";
      return;
    }

    // Convert the date inputs to epoch (seconds)
    const startEpoch = Math.floor(new Date(startDate).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endDate).getTime() / 1000);

    try {
      // Query the SensorData collection for documents in the given date range
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      const filteredDocs = [];
      querySnapshot.forEach(doc => {
        const docEpoch = parseInt(doc.id, 10);
        if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
          filteredDocs.push({ id: doc.id, data: doc.data() });
        }
      });

      if (filteredDocs.length === 0) {
        feedbackEl.textContent = "No sensor data found in the selected range.";
        return;
      }

      // Initialize sums for each numeric field (assume these fields are numbers)
      let sumMoisture = 0, sumTemperature = 0, sumPH = 0, sumNitrogen = 0, sumPhosphorus = 0, sumPotassium = 0, sumEC = 0, sumRSSI = 0;
      let count = 0;
      const sourceDocIDs = [];

      filteredDocs.forEach(rec => {
        const d = rec.data;
        sumMoisture += Number(d.Moisture) || 0;
        sumTemperature += Number(d.Temperature) || 0;
        sumPH += Number(d.pH) || 0;
        sumNitrogen += Number(d.Nitrogen) || 0;
        sumPhosphorus += Number(d.Phosphorus) || 0;
        sumPotassium += Number(d.Potassium) || 0;
        sumEC += Number(d.Electrical_Conductivity) || 0;
        sumRSSI += Number(d.RSSI) || 0;
        count++;
        sourceDocIDs.push(rec.id);
      });

      // Calculate averages
      const avgMoisture = (sumMoisture / count).toFixed(2);
      const avgTemperature = (sumTemperature / count).toFixed(2);
      const avgPH = (sumPH / count).toFixed(2);
      const avgNitrogen = (sumNitrogen / count).toFixed(2);
      const avgPhosphorus = (sumPhosphorus / count).toFixed(2);
      const avgPotassium = (sumPotassium / count).toFixed(2);
      const avgEC = (sumEC / count).toFixed(2);
      const avgRSSI = (sumRSSI / count).toFixed(2);

      // Build the report data object (excluding Timestamp and doc id as per requirements)
      const reportData = {
        Moisture: avgMoisture,
        Temperature: avgTemperature,
        pH: avgPH,
        Nitrogen: avgNitrogen,
        Phosphorus: avgPhosphorus,
        Potassium: avgPotassium,
        Electrical_Conductivity: avgEC,
        RSSI: avgRSSI,
        Location: location,
        SourceDocIDs: sourceDocIDs,
        ReportCreatedAt: new Date().toISOString(),
        ReportStartDate: startDate,
        ReportEndDate: endDate
      };

      // Create a new document in the "Reports" collection using the provided reportDocName
      await setDoc(docRef(db, "Reports", reportDocName), reportData);

      feedbackEl.textContent = "Report created successfully!";
      // Optionally, hide the container or clear inputs
      document.getElementById("create_report_container").style.display = "none";
    } catch (error) {
      console.error("Error creating report:", error);
      feedbackEl.textContent = "Error creating report. Please try again.";
    }
  }

  // Expose the function to the global scope
  window.submitReport = submitReport;
});



// Toggle the visibility of the input form
function toggleForm() {
  const formContainer = document.getElementById("inputFormContainer");

  if (!formContainer) {
    console.error("Form container not found.");
    return;
  }

  if (formContainer.style.display === "none" || formContainer.style.display === "") {
    formContainer.style.display = "block";
    hideSections([
      "last_recent_updated_section",
      "range_data_operations",
      "create_report_container",
      "search_results_section"
    ]);
  } else {
    formContainer.style.display = "none";
  }
}
window.toggleForm = toggleForm;

// Utility function to hide multiple sections
function hideSections(sectionIds) {
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.display = "none";
  });
}



// Function to create a new document in Firestore
async function createNewDocument() {
  const feedbackEl = document.getElementById("creationFeedback");
  const submitButton = document.getElementById("submitButton");

  if (!feedbackEl || !submitButton) {
    console.error("Missing required elements: creationFeedback or submitButton.");
    return;
  }

  submitButton.disabled = true;
  feedbackEl.textContent = "";

  // Retrieve input values
  const getInputValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : null;
  };

  const document_name = getInputValue("document_name");
  const location_name = getInputValue("location");
  const moisture = parseFloat(getInputValue("moisture"));
  const temperature = parseFloat(getInputValue("temperature"));
  const pH = parseFloat(getInputValue("pH"));
  const nitrogen = parseFloat(getInputValue("nitrogen"));
  const phosphorus = parseFloat(getInputValue("phosphorus"));
  const potassium = parseFloat(getInputValue("potassium"));
  const electricalConductivity = parseFloat(getInputValue("electricalConductivity"));
  const rssi = parseFloat(getInputValue("rssi"));
  const timestamp = getInputValue("timestamp");
  const remark = getInputValue("remark");

  if (!document_name || isNaN(moisture) || isNaN(temperature) || isNaN(pH) ||
      isNaN(nitrogen) || isNaN(phosphorus) || isNaN(potassium) ||
      isNaN(electricalConductivity) || isNaN(rssi) || !timestamp) {
    feedbackEl.textContent = "Please fill in all required fields correctly.";
    submitButton.disabled = false;
    return;
  }

  const docData = {
    Document_Name: document_name,
    Location_Data: location_name || "Unknown",
    Moisture: moisture,
    Temperature: temperature,
    pH: pH,
    Nitrogen: nitrogen,
    Phosphorus: phosphorus,
    Potassium: potassium,
    Electrical_Conductivity: electricalConductivity,
    RSSI: rssi,
    Timestamp: timestamp,
    Remark: remark || "No remarks"
  };

  try {
    // Use docRef (the alias) to create a reference
    await setDoc(docRef(db, "SensorData", document_name), docData);
    feedbackEl.textContent = "Document created successfully!";
    document.getElementById("inputFormContainer").style.display = "none";
  } catch (error) {
    console.error("Error creating document:", error);
    feedbackEl.textContent = "Error creating document. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
}
window.createNewDocument = createNewDocument;
