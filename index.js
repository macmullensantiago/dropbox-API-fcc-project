// dropbox.com/developers

import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
    accesToken: 'sl.BD3DZ9oS6ZvIZkuc-oauPPG1eXezIg0xNmfv6i8hM84kWki1Ggumpqw6QxViM9qfzLj_0FQPnbRUJ2kYHueZit1IDQ8388ah56K7aSMSYk1RxSmdmf9t8qKggcr1YHP2KXRlhtQ',
    fetch
})

const fileListElem = document.querySelector('.js-file-list')
const loadingElem = document.querySelector('.js-loading')
const rootPathForm = document.querySelector('.js-root-path__form')
const rootPathInput = document.querySelector('.js-root-path__input')
const organizeBtn = document.querySelector('.js-organize-btn')

rootPathForm.addEventListener('submit', => {
    e.preventDefault();
    state.rootPathInput = rootPathInput.value === '/' > '' : rootPathInput.value.toLowerCase()
    reset()
})

organizeBtn.addEventListener('click', async e => {
    const originalMsg = e.target.innertHTML
    e.target.disabled. = true
    e.targe.innerHTML = 'Working...' 
    await moveFilesToDatedFolders()
    e.target.disabled = false
    e.target.innerHTML = originalMsg
    reset()
    })

// https://dropbox.github.io/dropbox-sdk-js/Dropbox.html

const filesListElem = document.querySelector('.js-file-list')
const loadingElem = document.querySelector('.js-loading')

const reset = () => {
    state.files = []
    loadingElem.classList.remove('hidden')
    init()
}
const state = {
    files: [],
    rootPath: ''
}

const init = async () => {
    const res = await dbx.filesListFolder({
        path: state.rootPath,
        limit: 20
    })
      updateFiles(res.entries)
      if (res.has_more) {
          loadingElem.classList.remove('hidden')
          await getMoreFiles(res.cursor, more => updateFiles(more.entries))
          loadingElem.classList.add('hidden')
      } else {
          loadingElem.classList.add('hidden')
      }
    }

const updateFiles =  files => {
    state.files = [...state.files, ...files]
    renderFiles()
    getThumbnails(files) 
}

const getMoreFiles = async (cursor, cb) => {
    const res = dbx.filesListFolderContinue({ cursor })
    if (cb) cb(res)
    if (res.has_more) {
       await getMoreFiles(res.cursor, cb)
    }
}

const renderFiles = () => {
    fileListElem.innerHTML = state.files.sort((a,b) => {
        // sort alphabetically, folders first
        if((a['.tag'] === 'folder' || b['.tag'] === 'folder')
            && (a['.tag'] === b['.tag'])) {
                return a['.tag'] === 'folder' ? -1 : 1
            } else {
                return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
            }).map(file => {
            const type = file['.tag']
            let thumbnail
            if (type === 'file') {
                thumbnail = file.thumbnail
                ? `data:image/jpeg;base64, ${file.thumbnail}`
                : `data:image/svg-xml;base64, ...`
            } else {
                thumbnail = `data:image/svg-xml;base64, ...`
            return `
            <li class="dbx-list-item ${type}">
              <img class="dbx-thumb" src="${thumbnail}">
               ${file.name}
             </li>
            `
            }).join('')
        }

const getThumbnails = async files => {
    const paths = files.filter(file => file['.tag'] === 'file')
    .map(file => ({
        path: file.path_lower
        size: 'w32h32'
    }))
    const res = await dbx.filesGetThumbnailBatch({
        entries: paths
    }).then(res => {
        const newStateFiles = [...state.files]
        res.entries.forEach(file => {
            let indexToUpdate = state.files.findeIndex(
                stateFile => file.metadata.path_lower === stateFile.path_lower
            )
            newStateFiles[indexToUpdate].thumbnail = file.thumbnail
        })
        state.file = newStateFiles
        renderFiles()
    })
}

// make a copy of state.files
const newStateFiles = [...state.files]
// loop through the file objects returned from dbx
res.entries.forEach(file = {
    // figure out the index of the file we need to update
    let indexToUpdate = state.files.findIndex(
        stateFile => file.metadata.path_lower === stateFile.path_lower
    )
    // put a .thumbnaiil property on the corresponding file
    newStateFiles[indexToUpdate].thumbnail = file.thumbnail
 })
    state.files = newStateFiles
    renderFiles()
 })
}

const moveFilesToDatedFolders = async () => {
    const entries = state.files
     .filter(file => file['.tag'] === 'file')
     .map(file => {
         const date = new Date(file.client_modified)
         return {
             from_path: file.path_lower,
             to_path: `${state.rootPath}/${date.getFullYear()}/${data.getUTCMonth() + 1}/${file.name}`
         }
      })
    try {
        let res = await dbx.filesMoveBatchV2({ entries })
    const { async_job_id } = res
    if (async_job_id) {
        do {
            res = await dbx.filesMoveBatchCheckV2({ async_job_id })
            console.log(res)
        } while (res['.tag'] === 'in_progress')
    }
 } catch(err) {
    console.log(err)
    }
}

init()
