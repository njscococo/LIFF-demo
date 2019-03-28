window.onload = function (e) {
    liff.init(function (data) {
        axios({
            url: `https://linetestingserver.herokuapp.com/line/istmnewa/${data.context.userId}`,
            method: 'get'
        }).then(res => {
            console.log('istmnewa:', res.data.isTmnewa);
            initializeApp(data, res.data.isTmnewa);
        })
        console.log('init data:', data);

        // liff.getProfile().then(function (profile) {
        //     //console.log('profile:', profile)

        // }).catch(function (error) {
        //     window.alert("Error getting profile: " + error);
        // });
    });
};

// initializeApp
function initializeApp(data, istmnewa) {
    if (!istmnewa) {
        let account = prompt('Input your account', '');
        if (account) {
            axios({
                url: 'https://linetestingserver.herokuapp.com/line/linktmnewa',
                method: 'post',
                data: {
                    tmnewaid: account,
                    userid: data.context.userId
                }
            }).then(res => {
                console.log('linktmnewa:', res.data)

            }).catch(err => {
                console.log('')
            })

        } else {
            liff.closeWindow();
        }

    }


    var tmnewaDiv = document.querySelector('#tmnewa');

    // document.getElementById('languagefield').textContent = data.language;
    // document.getElementById('viewtypefield').textContent = data.context.viewType;
    // document.getElementById('useridfield').textContent = data.context.userId;
    // document.getElementById('utouidfield').textContent = data.context.utouId;
    // document.getElementById('roomidfield').textContent = data.context.roomId;
    // document.getElementById('groupidfield').textContent = data.context.groupId;

    //signature
    var wrapper = document.getElementById("signature-pad");
    var clearButton = wrapper.querySelector("[data-action=clear]");
    var changeColorButton = wrapper.querySelector("[data-action=change-color]");
    var undoButton = wrapper.querySelector("[data-action=undo]");
    // var savePNGButton = wrapper.querySelector("[data-action=save-png]");
    var drawImage = wrapper.querySelector("[data-action=save-jpg]");
    //var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
    var canvas = wrapper.querySelector('canvas');
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

    drawImage.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Draw something first!!");
        } else {
            //console.log('jpg:', data.context.userId, signaturePad)
            var sendImageUrl = 'https://linetestingserver.herokuapp.com/users';

            var dataURL = signaturePad.toDataURL("image/jpeg");

            let config = {
                url: sendImageUrl,
                method: 'post',
                data: {
                    userId: data.context.userId,
                    drawImage: dataURL
                }
            }

            axios(config)
                .then(function (res) {
                    console.log('send img done id:', res.data.id);
                    liff.sendMessages([
                        // {
                        //     type: 'text',
                        //     text: 'Hello, World123!'
                        // },

                        {
                            type: "image",
                            originalContentUrl: `https://linetestingserver.herokuapp.com/user/${data.context.userId}/${res.data.id}`,
                            previewImageUrl: `https://linetestingserver.herokuapp.com/user/${data.context.userId}/${res.data.id}`
                            // "size": "full",
                            // "aspectRatio": "1.91:1"
                        }
                    ]).then(function (resp) {
                        console.log('liff.sendMessages', resp)
                        //window.alert("Message sent");
                    }).catch(function (error) {
                        window.alert("Error sending message: " + error);
                    });
                }).catch(function (err) {
                    console.log('err:', err);
                });

        }
    });

    // // openWindow call
    document.getElementById('openwindowbutton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://www.tmnewa.com.tw'
        });
    });

    //productlist
    document.getElementById('productlist').addEventListener('click', () => {
        let config = {
            url: 'https://linetestingserver.herokuapp.com/products',
            method: 'get'
        };

        axios(config)
            .then(res => {
                let inner = res.data.map((elm, idx) => {
                    return `<div><img src="https://linetestingserver.herokuapp.com/productimg/${elm.id}" height="342" width="342">
                    <div>${elm.title}</div>
                    <div>${elm.price}</div>
                    </div>`
                })
                tmnewaDiv.innerHTML = inner
                console.log('product list', res.data)
            })
            .catch(err => console.log('productlist err', err))
    })

    // document.getElementById('redirectbutton').addEventListener('click', function () {
    //     //location.href = 'https://www.tmnewa.com.tw';
    //     //location.replace('https://www.tmnewa.com.tw');
    //     let config = {
    //         //url: 'https://ebptest.tmnewa.com.tw/!carapp/Partner/App/SignIn',
    //         url: 'https://linetestingserver.herokuapp.com/tmtoken',
    //         method: 'post',
    //         data: {
    //             client: '061782',
    //             secret: 'Newa1234'
    //         },
    //         headers: {
    //             'Authorization': 'Basic VE1OZXdhOlRNTmV3YUFwcA==',
    //         }
    //     };

    //     axios(config)
    //         .then(res => {
    //             console.log('token:', res)
    //             //tmnewaDiv.innerHTML = res.data

    //         })
    //         .catch(err => {
    //             console.log('tmnewa err:', err)
    //         })


    // });

    // // closeWindow call
    // document.getElementById('closewindowbutton').addEventListener('click', function () {
    //     liff.closeWindow();
    // });


    // // get access token
    // document.getElementById('getaccesstoken').addEventListener('click', function () {
    //     const accessToken = liff.getAccessToken();
    //     document.getElementById('accesstokenfield').textContent = accessToken;
    //     toggleAccessToken();
    // });

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

// function toggleAccessToken() {
//     toggleElement('accesstokendata');
// }

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




