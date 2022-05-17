// const { musicDB, playlistDB } = require("./music-server/src/data/data");

// const { playlistDB } = require("./music-server/src/data/data");

// const { playlistDB } = require("./music-server/src/data/data");
/////////////////////////////////////////////////////////////////////////////////////////////LOGIN
const SERVER_ROOT = 'http://localhost:3000';
window.onload = function () {

    if (localStorage.getItem('accessToken')) {
        afterLogin();
    } else {
        notLogin();
    }

    document.getElementById('loginBtn').onclick = function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;


        fetch(`${SERVER_ROOT}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => loggedInFeatures(data));
    }

    document.getElementById('logoutBtn').onclick = function () {
        localStorage.removeItem('accessToken');
        notLogin();
    }

    function loggedInFeatures(data) {
        if (data.status) {
            document.getElementById('errormessage').innerHTML = data.message;
        } else {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            localStorage.setItem('accessToken', data.accessToken);
            afterLogin();
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////SEARCH

    document.getElementById("search1").onclick = function () {
        let txtValue;
        let inputSearch = document.getElementById("search-input");
        let filter = inputSearch.value.toUpperCase();
        let table1 = document.getElementById("table1");
        let tr = table1.getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////ADD MUSIC
function fetchMusic() {
    fetch(`${SERVER_ROOT}/api/music`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => response.json())
        .then(musicDB => {
            let html = `
                <table class="table" id="table1">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">title</th>
                            <th scope="col">releaseDate</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    <tbody id="table-body">`;

            musicDB.forEach(music => {

                html += `<tr>
                                <th scope="row">${musicDB.indexOf(music) + 1}</th>
                                <td>${music.title}</td>
                                <td>${music.releaseDate}</td>
                                <td><button id="btnAdd"  data-music='${music.id}'
                                    onclick = "addMusicToPlayList(this)"><img id="plusSign" src="/CS445FinalProject/Plus.jpg"/>
                                    </button></td>
                            </tr>`;
            })
            html += `
                    </tbody>
                </table>`;
            document.getElementById("final").innerHTML = html
            console.log(html)
        })
}

///////////////////////////////////////////////////////////////////////////////////////////////PLAY LIST
function fetchPlayList() {
    fetch(`${SERVER_ROOT}/api/playlist`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => response.json())
        .then(playlistDB => {
            let html = `
                <table class="table" id="table2">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">title</th>
                            <th scope="col">Actions</th>

                        </tr>
                    </thead>
                    <tbody id="table-body">`;

            playlistDB.forEach(music => {

                html += `<tr>
                                <th scope="row">${playlistDB.indexOf(music) + 1}</th>
                                <td>${music.title}</td>                              
                                <td><button id="btnPlay"
                                onclick = "playMusic(${music.id})"><img id="playSign" src="/CS445FinalProject/play.png"/>                                 
                                </button>
                                <button id="btnRemove" data-music='${music.songId}'
                                    onclick = "removeList(this)"><img id="xSign" src="/CS445FinalProject/remove.png"/>                                  
                                    </button>
                                    
                                    </td>
                            </tr>`;
            })
            html += `
                    </tbody>
                </table>`;
            document.getElementById("playList").innerHTML = html
        })
}
////////////////////////////////////////////////////////////////////////////////////////////////// PLAY MUSIC  LIST
function playMusic() {

}
////////////////////////////////////////////////////////////////////////////////////////////ADD MUSIC TO PLAY LIST

function addMusicToPlayList(obj) {
    console.log("button", document.getElementById('btnAdd'))
    let songId= obj.getAttribute("data-music")
    fetch(`${SERVER_ROOT}/api/playlist/add`, {
        method: 'POST',
        body: JSON.stringify({
            songId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }})

        fetchPlayList();

    // }).then(response => response.json())
    //     .then(musics => {
    //         let count = 2
    //         musics.forEach(music => {
    //             if (!playlistDB.includes(music.title)) {
    //                 if (music.title === title) {
    //                     count ++
    //                     playlistDB.push(music.title)
    //                 }

    //                 ///////////////////////////////////////
    //                 html += `<tr>
    //       <th scope="row">${playlistDB.indexOf(music) + 1}</th>
    //       <td>${music.title}</td>                              
    //       <td><button id="btnPlay"
    //       onclick = "playMusic(${music.id})"><img id="playSign" src="/CS445FinalProject/play.png"/>                                 
    //       </button>
    //       <button id="btnRemove"
    //           onclick = "removeList(${music.id})"><img id="xSign" src="/CS445FinalProject/remove.png"/>                                  
    //           </button>
              
    //           </td>
    //   </tr>`;
    //                 document.getElementById("playList").innerHTML += html

    //             }
    //         })
    //     })
}

////////////////////////////////////////////////////////////////////////////////////////////////REMOVE
function removeList(obj) {
    //console.log("button", obj)
    let songId= obj.getAttribute("data-music")
   // console.log("song id is ", songId)
    fetch(`${SERVER_ROOT}/api/playlist/remove`, {
        method: "post",
        body: JSON.stringify({
            songId
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }
    })   

    fetchPlayList();
    //     .then(response => response.json())
    //     .then(musics => {
    //         // document.getElementById("id").remove()
    //         musics.forEach(music => {
    //             if (music.title != title) {
    //                 console.log("fn", music)
    //                 console.log(music.length)
    //                 if (playlistDB.indexOf(music) === -1) {
    //                     playlistDB.push(music)
    //                 }


    //                 html += `<tr>
    //       <th scope="row">${playlistDB.indexOf(music) + 1}</th>
    //       <td>${music.title}</td>                              
    //       <td><button id="btnRemove"
    //           onclick = "removeList(${music.id})"><img id="xSign" src="/CS445FinalProject/remove.png"/>                                  
    //           </button>
              
    //           </td>
    //   </tr>`;
    //                 document.getElementById("playList").innerHTML += html
    //             }
    //         })
    //     })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function afterLogin() {
    document.getElementById('search').style.display = 'block';
    document.getElementById('logout-div').style.display = 'block';
    document.getElementById('login-div').style.display = 'none';
    document.getElementById('final').style.display = 'block';
    document.getElementById('playList').style.display = 'block';
    document.getElementById('h2List').style.display = 'block';
    document.getElementById('h2Int').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';

    //document.getElementById('content').innerHTML = 'Content of the music';

    fetchMusic();
    fetchPlayList();
    //document.getElementById('content').innerHTML = 'Content of the music';
}

function notLogin() {
    document.getElementById('search').style.display = 'none';
    document.getElementById('final').style.display = 'none';
    document.getElementById('h2List').style.display = 'none';
    document.getElementById('h2Int').style.display = 'none';
    document.getElementById('welcome').style.display = 'block';
    document.getElementById('playList').style.display = 'none';

    //  document.getElementById('.footer').style.display = 'none';
    document.getElementById('logout-div').style.display = 'none';
    document.getElementById('login-div').style.display = 'block';

    //document.getElementById('content').innerHTML = 'Welcome to MIU Station';
}

