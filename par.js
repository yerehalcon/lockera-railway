<input type="file" id="fileInput" />
<button onclick="uploadFile()">Upload Video to Drive</button>

<script>
  function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const metadata = {
      name: file.name,
      mimeType: file.type
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: form
    }).then(response => response.json())
      .then(result => {
        console.log('File uploaded successfully:', result);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  }
</script>