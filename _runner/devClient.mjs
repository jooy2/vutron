import * as hotClient from 'webpack-hot-middleware/client.js?noInfo=true&reload=true'

hotClient.subscribe(event => {
  if (event.action === 'compiling') {
    document.body.innerHTML += `
      <style>
        .root {
          color: #000;
          padding: 10px 20px;
        }
      </style>
      <div class="root">Compiling Main Process...</div>
    `
  }
})
