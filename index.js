// dropbox.com/developers

import { Dropbox } from 'dropbox'

const dbx = new Dropbox({
    accesToken: 'sl.BD3DZ9oS6ZvIZkuc-oauPPG1eXezIg0xNmfv6i8hM84kWki1Ggumpqw6QxViM9qfzLj_0FQPnbRUJ2kYHueZit1IDQ8388ah56K7aSMSYk1RxSmdmf9t8qKggcr1YHP2KXRlhtQ',
    fetch
})

// https://dropbox.github.io/dropbox-sdk-js/Dropbox.html

dbx.filesListFolder({
    path: ''
}).then(res => console.log(res)}