// handle file upload
    // set the dropzone container id
    const id = '#kt_dropzone_4';

    // set the preview element template
    const previewNode = $(`${id} .dropzone-item`);
    previewNode.id = '';
    const previewTemplate = previewNode.parent('.dropzone-items').html();
    previewNode.remove();

    const myDropzone4 = new Dropzone(id, { // Make the whole body a dropzone
      url: 'https://keenthemes.com/scripts/void.php', // Set the url for your upload script location
      parallelUploads: 2,
      acceptedFiles: '.txt',
      previewTemplate,
      maxFiles: 1,
      maxFilesize: 1, // Max filesize in MB
      autoQueue: false, // Make sure the files aren't queued until manually added
      previewsContainer: `${id} .dropzone-items`, // Define the container to display the previews
      clickable: `${id} .dropzone-select`, // Define the element that should be used as click trigger to select files.
    });

    myDropzone4.on('addedfile', (file) => {
      // Hookup the start button
      $(`${id} .dropzone-select`).css('display', 'none');
      $(document).find(`${id} .dropzone-item`).css('display', '');
    //   $(`${id} .dropzone-remove-all`).css('display', 'inline-block');
    });

    // Update the total progress bar
    myDropzone4.on('totaluploadprogress', function (progress) {
      $(this).find(`${id} .progress-bar`).css('width', `${progress}%`);
    });

    myDropzone4.on('sending', (file) => {
      // Show the total progress bar when upload starts
      $(`${id} .progress-bar`).css('opacity', '1');
      // And disable the start button
    });

    // Hide the total progress bar when nothing's uploading anymore
    myDropzone4.on('complete', (progress) => {
      const thisProgressBar = `${id} .dz-complete`;
      setTimeout(() => {
        $(`${thisProgressBar} .progress-bar, ${thisProgressBar} .progress, ${thisProgressBar} .dropzone-start`).css('opacity', '0');
      }, 300);
    });

    // Setup the buttons for all transfers

    // Setup the button for remove all files
    document.querySelector(`${id} .dropzone-remove-all`).onclick = function () {
      $(`${id} .dropzone-upload, ${id} .dropzone-remove-all`).css('display', 'none');
      myDropzone4.removeAllFiles(true);
    };

    // On all files completed upload
    myDropzone4.on('queuecomplete', (progress) => {
      $(`${id} .dropzone-upload`).css('display', 'none');
    });

    // On all files removed
    myDropzone4.on('removedfile', (file) => {
      if (myDropzone4.files.length < 1) {
        $(`${id} .dropzone-upload, ${id} .dropzone-remove-all`).css('display', 'none');
        $(`${id} .dropzone-select`).css('display', 'inline-block');
      }
    });

    

const submitBtn = document.querySelector('.analyze-btn');

submitBtn.addEventListener('click', async (e) => {
    const textBox = document.querySelector('.analyze-text').value;
    let splitValue = textBox.split(' ')

    console.log(splitValue)

     let response = await fetch('https://n174tw3kkf.execute-api.us-east-2.amazonaws.com/default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({input_data: splitValue})
      });
      await response.json()

    //   console.log(myDropzone4.files[0])

      var fr=new FileReader(); 

      fr.onload=function(){ 
          const val = fr.result.split(' ');
          const trim = _.map( val, str => {
             return str.trim()
          })

          console.log(trim)
    } 

    fr.readAsText(myDropzone4.files[0]); 
})

