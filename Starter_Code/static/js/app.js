// Build the metadata panel
function buildMetadata(sample) {
  console.log("Building metadata for sample:", sample);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Data loaded:", data);

    // Get the metadata field
    let metadata = data.metadata;
    console.log("Metadata:", metadata);
    
    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    console.log("Filtered metadata result:", result);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");
    console.log("Selected panel:", PANEL);
    
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    console.log("Panel cleared");
    
    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      console.log(`Appended: ${key.toUpperCase()}: ${value}`);
    });

    console.log("Metadata panel populated");
  });
}

// function to build both charts
function buildCharts(sample) {
  console.log("Building charts for sample:", sample);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Data loaded:", data);

    // Get the samples field
    let samples = data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    console.log("Filtered result:", result);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    console.log("Bubble chart data:", bubbleData);

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    console.log("Bubble chart rendered");

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log("Y-ticks for bar chart:", yticks);

    // Build a Bar Chart
    let barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    console.log("Bar chart data:", barData);

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
    console.log("Bar chart rendered");
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Data loaded:", data);

    // Get the names field
    let names = data.names;
    console.log("Sample names:", names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    console.log("Dropdown selected:", dropdown);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
      console.log("Added option:", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];
    console.log("First sample:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

    console.log("Initial charts and metadata built");
  });
}

// Function for event listener
function optionChanged(newSample) {
  console.log("New sample selected:", newSample);
  
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
