module.exports.VerifyEmailHTML = (code) => {
  return `<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    .brand {
      font-size: 3rem;
      display: flex;
      align-items: center;
      height: 64px;
      font-weight: 700;
      color: var(#fff);
      position: sticky;
      top: 0;
      left: 0;
      z-index: 100;
      background: var(#1775F1);
      transition: all .3s ease;
      padding: 0 6px;
    }
  </style>
  
  <body>
    <div class="container">
      <div class="d-flex flex-column align-items-center vh-100">
        <div class="card shadow border-0">
          <div class="card-header float-start bg-white border-0">
            <div class="d-flex flex-column">
              <div class="p-3">
                <a class="brand link-underline-light"><i class="fa-regular fa-face-smile mx-3"></i>smileClinic</a>
              </div>
              <div class="pt-3">
                <h1>Verify Your Email</h1>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column  px-3 ">
              <div class="p-2">
                Thanks for signup with us. Click on the button below to verify your email address
              </div>
              <div class="p-2 text-center fw-bold fs-1 text-break">
                ${code}
              </div>
              <div class="text-center">
                Or click
              </div>
              <div class="p-2 ms-auto me-auto">
                <a class="btn btn-primary me-auto  text-uppercase">verfiy here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  
  </html>
    `
}