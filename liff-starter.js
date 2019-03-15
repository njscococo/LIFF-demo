window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

function initializeApp(data) {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;

    //signature
    var wrapper = document.getElementById("signature-pad");
    var clearButton = wrapper.querySelector("[data-action=clear]");
    var changeColorButton = wrapper.querySelector("[data-action=change-color]");
    var undoButton = wrapper.querySelector("[data-action=undo]");
    // var savePNGButton = wrapper.querySelector("[data-action=save-png]");
    var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
    //var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
    var canvas = wrapper.querySelector("canvas");
    var signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    });

    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });

    undoButton.addEventListener("click", function (event) {
        var data = signaturePad.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
    });

    changeColorButton.addEventListener("click", function (event) {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var color = "rgb(" + r + "," + g + "," + b + ")";

        signaturePad.penColor = color;
    });

    // savePNGButton.addEventListener("click", function (event) {
    //     if (signaturePad.isEmpty()) {
    //         alert("Please provide a signature first.");
    //     } else {
    //         var dataURL = signaturePad.toDataURL();
    //         download(dataURL, "signature.png");
    //     }
    // });

    saveJPGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Draw something first!!");
        } else {
            var sendImageUrl = ' https://linetestingserver.herokuapp.com/users';
            var dataURL = signaturePad.toDataURL("image/jpeg");

            let config = {
                url: sendImageUrl,
                method: 'post',
                data:{
                    userId: 'test',
                    drawImage: dataURL
                }
            }

            axios(config).then(res=>{
                console.log('send img done:', res);
            }).catch(err=>{
                console.log('err:', err);
            });
            //download(dataURL, "signature.jpg");
            // liff.sendMessages([{
            //     type: 'text',
            //     text: "來畫圖!"
            // }, {
            //     "type": "flex",
            //     "altText": "this is a flex message",
            //     "contents": {
            //         "type": "bubble",
            //         "body": {
            //             "type": "box",
            //             "layout": "vertical",
            //             "contents": [
            //                 {
            //                     "type": "text",
            //                     "text": "hello"
            //                 },
            //                 {
            //                     "type": "separator",
            //                     "color": "#000000"
            //                 },
            //                 {
            //                     "type": "text",
            //                     "text": "world"
            //                 },
            //                 {
            //                     "type": "image",
            //                     "url": "https://www.w3schools.com/css/img_lights.jpg",
            //                     "size": "full",
            //                     "aspectRatio": "1.91:1"
            //                   }
            //             ]
            //         }
            //     }
            // }]).then(function () {
            //     window.alert("Message sent");
            // }).catch(function (error) {
            //     window.alert("Error sending message: " + error);
            // });
        }
    });

    // saveSVGButton.addEventListener("click", function (event) {
    //     if (signaturePad.isEmpty()) {
    //         alert("Please provide a signature first.");
    //     } else {
    //         var dataURL = signaturePad.toDataURL('image/svg+xml');
    //         download(dataURL, "signature.svg");
    //     }
    // });



    //send axios call
    document.getElementById('btnaxios').addEventListener('click', function () {
        console.log('axios')
        let config = {
            //url: 'https://ebp.tmnewa.com.tw/Partner/App/SignIn',
            url: 'https://api.github.com',
            method: 'get',

        };

        //console.log('config:', config)
        axios(config)
            .then(function (res) {
                console.log('response:', res.data);
                //Actions.carsearch({token: res.data});
            })
            .catch(function (err) { console.log('err:', err) });
    });

    // openWindow call
    document.getElementById('openwindowbutton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://line.me'
        });
    });

    // closeWindow call
    document.getElementById('closewindowbutton').addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        liff.sendMessages([{
            type: 'text',
            text: "You've successfully sent a message! Hooray!"
        }, {
            "type": "flex",
            "altText": "this is a flex message",
            "contents": {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "text",
                            "text": "hello"
                        },
                        {
                            "type": "separator",
                            "color": "#000000"
                        },
                        {
                            "type": "text",
                            "text": "world"
                        }
                    ]
                }
            }
        }]).then(function () {
            window.alert("Message sent");
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });
    });

    // get access token
    document.getElementById('getaccesstoken').addEventListener('click', function () {
        const accessToken = liff.getAccessToken();
        document.getElementById('accesstokenfield').textContent = accessToken;
        toggleAccessToken();
    });

    // get profile call
    document.getElementById('getprofilebutton').addEventListener('click', function () {
        liff.getProfile().then(function (profile) {
            document.getElementById('useridprofilefield').textContent = profile.userId;
            document.getElementById('displaynamefield').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilepicturediv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = "Profile Picture";
            profilePictureDiv.appendChild(img);

            document.getElementById('statusmessagefield').textContent = profile.statusMessage;
            toggleProfileData();
        }).catch(function (error) {
            window.alert("Error getting profile: " + error);
        });
    });
}

function toggleAccessToken() {
    toggleElement('accesstokendata');
}

function toggleProfileData() {
    toggleElement('profileinfo');
}

function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
}


function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio = Math.max(window.devicePixelRatio || 1, 1);

    // This part causes the canvas to be cleared
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);

    // This library does not listen for canvas changes, so after the canvas is automatically
    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
    // that the state of this library is consistent with visual state of the canvas, you
    // have to clear it manually.
    signaturePad.clear();
}

function download(dataURL, filename) {
    if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
      window.open(dataURL);
    } else {
      var blob = dataURLToBlob(dataURL);
      var url = window.URL.createObjectURL(blob);
  
      var a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;
  
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(url);
    }
  }
  
  // One could simply use Canvas#toBlob method instead, but it's just to show
  // that it can be done using result of SignaturePad#toDataURL.
  function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
  
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  }

