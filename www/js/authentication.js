// initialize Account Kit with CSRF protection
  AccountKit_OnInteractive = function(){
    AccountKit.init(
      {
        appId:"1687593194900572",
        state:"2ed0f6b2effaf447d746e666e4429c87",
        version:"v1.0",
        fbAppEventsEnabled:true
      }
    );
  };

  // login callback
  function emailLoginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      var code = response.code;
      var csrf = response.state;
      // Send code to server to exchange for access token
      alert("Success");

    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
      alert("Fail");
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
      alert("Bad Param");
    }
  }
  function phoneLoginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      var code = response.code;
      var csrf = response.state;
      // Send code to server to exchange for access token
      alert("Success");
    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
      alert("Fail");
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
      alert("Bad Param");
    }
  }

  // phone form submission handler
  function smsLogin() {
    var countryCode = document.getElementById("country_code").value;
    var phoneNumber = document.getElementById("phone_number").value;
    AccountKit.login(
      'PHONE',
      {countryCode: countryCode, phoneNumber: phoneNumber}, // will use default values if not specified
      phoneLoginCallback
    );
  }
  // email form submission handler
  function emailLogin() {
    var emailAddress = document.getElementById("email").value;
    AccountKit.login(
      'EMAIL',
      {emailAddress: emailAddress},
      emailLoginCallback
    );
  }
