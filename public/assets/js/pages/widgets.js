// loading helper
const loading = new KTDialog({
  type: "loader",
  placement: "top center",
  message: "Please wait ...",
});

// configure speedometer
var opts = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.1, // The line thickness
  radiusScale: 0.89, // Relative radius
  pointer: {
    length: 0.43, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: "#000000", // Fill color
  },
  limitMax: true, // If false, max value increases automatically if value > maxValue
  // percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
  limitMin: true, // If true, the min value of the gauge will be fixed
  staticLabels: {
    font: "10px sans-serif", // Specifies font
    labels: [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100], // Print labels at these values
    color: "#000000", // Optional: Label text color
    fractionDigits: 0, // Optional: Numerical precision. 0=round off.
  },
  renderTicks: {
    divisions: 5,
    divWidth: 1.1,
    divLength: 0.7,
    divColor: "#333333",
    subDivisions: 3,
    subLength: 0.5,
    subWidth: 0.6,
    subColor: "#666666",
  },
  staticZones: [
    {
      strokeStyle: "#ff0500",
      min: -100,
      max: -90,
    },
    {
      strokeStyle: "#ff3300",
      min: -90,
      max: -70,
    },
    {
      strokeStyle: "#ff6000",
      min: -70,
      max: -50,
    },
    {
      strokeStyle: "#ff8e00",
      min: -50,
      max: -30,
    },
    {
      strokeStyle: "#ffbb00",
      min: -30,
      max: -10,
    },
    {
      strokeStyle: "#ffff00",
      min: -10,
      max: 10,
    },
    {
      strokeStyle: "#baff00",
      min: 10,
      max: 30,
    },
    {
      strokeStyle: "#8dff00",
      min: 30,
      max: 50,
    },
    {
      strokeStyle: "#60ff00",
      min: 50,
      max: 70,
    },
    {
      strokeStyle: "#32ff00",
      min: 70,
      max: 85,
    },
    {
      strokeStyle: "#04ff00",
      min: 85,
      max: 100,
    },
  ],
  colorStart: "#6F6EA0", // Colors
  colorStop: "#C0C0DB", // just experiment with them
  strokeColor: "#EEEEEE", // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true, // High resolution support
};
var target = document.getElementById("canvas"); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.setMinValue(-100); // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // set animation speed (32 is default value)
gauge.set(0); // set actual value

// handle file upload
// set the dropzone container id
const id = "#kt_dropzone_4";

// set the preview element template
const previewNode = $(`${id} .dropzone-item`);
previewNode.id = "";
const previewTemplate = previewNode.parent(".dropzone-items").html();
previewNode.remove();

const myDropzone4 = new Dropzone(id, {
  // Make the whole body a dropzone
  url: "https://keenthemes.com/scripts/void.php", // Set the url for your upload script location
  parallelUploads: 2,
  acceptedFiles: ".txt",
  previewTemplate,
  maxFiles: 1,
  maxFilesize: 1, // Max filesize in MB
  autoQueue: false, // Make sure the files aren't queued until manually added
  previewsContainer: `${id} .dropzone-items`, // Define the container to display the previews
  clickable: `${id} .dropzone-select`, // Define the element that should be used as click trigger to select files.
});

myDropzone4.on("addedfile", (file) => {
  // set text area to READ ONLY
  document.querySelector(".analyze-text").readOnly = true;
  // Hookup the start button
  $(`${id} .dropzone-select`).css("display", "none");
  $(document).find(`${id} .dropzone-item`).css("display", "");
  $(`${id} .dropzone-remove-all`).css("display", "inline-block");
});

// Hide the total progress bar when nothing's uploading anymore
myDropzone4.on("complete", (progress) => {
  const thisProgressBar = `${id} .dz-complete`;
  setTimeout(() => {
    $(
      `${thisProgressBar} .progress-bar, ${thisProgressBar} .progress, ${thisProgressBar} .dropzone-start`
    ).css("opacity", "0");
  }, 300);
});

// On all files completed upload
myDropzone4.on("queuecomplete", (progress) => {
  document.querySelector(".analyze-text").readOnly = false;
  $(`${id} .dropzone-upload`).css("display", "none");
});

// On all files removed
myDropzone4.on("removedfile", (file) => {
  if (myDropzone4.files.length < 1) {
    document.querySelector(".analyze-text").readOnly = false;
    $(`${id} .dropzone-upload, ${id} .dropzone-remove-all`).css(
      "display",
      "none"
    );
    $(`${id} .dropzone-select`).css("display", "inline-block");
  }
});

const submitBtn = document.querySelector(".analyze-btn");
let trim;
let data;

submitBtn.addEventListener("click", async (e) => {
  if (document.querySelector(".analyze-text").readOnly) {
    console.log("i analyzed data from uploaded file!");
    $(`${id} .dropzone-upload, ${id} .dropzone-remove-all`).css(
      "display",
      "none"
    );

    // read .txt file into text
    var fr = new FileReader();

    fr.onload = async function () {
      const val = fr.result.split(" ");
      trim = _.map(val, (str) => {
        return str.trim();
      });
      loading.show();
      data = await sendApiRequest(trim);

      handleResponse(data);
    };

    fr.readAsText(myDropzone4.files[0]);

    myDropzone4.removeAllFiles(true);
  } else {
    console.log("i analyzed data from textarea!");
    loading.show();
    // gauge.set(100)
    const textBox = document.querySelector(".analyze-text").value;
    let splitValue = textBox.split(" ");

    data = await sendApiRequest(splitValue);

    handleResponse(data);
  }
});

function handleResponse(data) {
  if (data.statusCode == 200) {
    loading.hide();
    document.getElementById("scored").textContent = data.body;
    if (data.body < 0) {
      document.getElementById("tone").textContent = "negative";
    } else if (data.body == 0) {
      document.getElementById("tone").textContent = "neutral";
    } else {
      document.getElementById("tone").textContent = "positive";
    }
    gauge.set(data.body);
  } else {
    loading.hide();
  }
}

async function sendApiRequest(trim) {
  let response = await fetch(
    "https://n174tw3kkf.execute-api.us-east-2.amazonaws.com/default",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_data: trim,
      }),
    }
  );
  let data = await response.json();
  return data;
}
