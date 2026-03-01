import React, { useState } from "react";

export const UploadFile: React.FC = () => {

    const [status,setStatus] = useState('');

async function uploadFile() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch('https://n8n.srv1133301.hstgr.cloud/webhook-test/my-work-flow', {
            method: 'POST',
            mode: 'cors',
            // credentials: 'include',
            // headers: {
            //   'Accept': 'application/json',
            //   'X-Requested-With': 'XMLHttpRequest',
            //   'Access-Control-Allow-Origin':'*'
            // },
            body: formData
          });

          
          const content = await res.text();
          if (!res.ok) throw new Error(content || res.statusText);
         setStatus('Upload successful');
        } catch (err:unknown) {
            const message = err instanceof Error ? err.message : String(err);
          setStatus('Upload failed: ' + message);
        }
    }
}

    return (
        <div>
            <h1>Upload File</h1>
            <input type="file" />
            <button onClick={uploadFile}>Upload</button>
            <p>{status}</p>
        </div>
    );
};