// Imports for thumbnail generating
const sharp = require('sharp')
const path = require('path')
const os = require('os')
const fs = require('fs')
const gcs = require('@google-cloud/storage')({keyFilename: 'service-account-credentials.json'})



// exports.resizeImage = functions.storage
//     .object('photos/rooms/{roomId}/{imageId}')
//     .onChange(event => {

//         console.log(event)

//         const object = event.data // The Storage object.
//         const {
//             name: filePath, // File path in the bucket.
//             contentType, // File content type.
//             resourceState, // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
//             metageneration // Number of times metadata has been generated. New objects have a value of 1.
//         } = object 
        
//         // Exit if this is a move or deletion event.
//         if (resourceState === 'not_exists') {
//             console.log('✖ Deletion event.')
//             return null
//         }
//         // Exit if file exists but is not new and is only being triggered
//         // because of a metadata change. 
//         else if(metageneration > 1) {
//             console.log('✖ Metadata change event.')
//             return null
//         }

//         // Exit if the image is already a resized one.
//         if (filePath.includes('resized_')) {
//             console.log('✖ Already processed image.')
//             return null
//         }

//         if (!contentType.startsWith('image/')) {
//             console.log('✖ Not an image.')
//             return null
//         }

//         console.log("i All checks passed, ready to resize.")
//         const SIZES = [1024, 1920, 2560] // Resize target widths in pixels
//         const fileBucket = object.bucket // The Storage bucket that contains the file.
//         const bucket = gcs.bucket(fileBucket)
//         const fileName = path.basename(filePath)
//         const fileTemp = path.join(os.tmpdir(), fileName)
//         filePath.split('/').pop()
//         let newFileName = `resized_${2560}_${fileName}`
//         let newFile = path.join(path.dirname(filePath), newFileName)
//         let newFileTemp = path.join(os.tmpdir(), newFileName)
        
//         return bucket.file(filePath).download({destination: fileTemp})
//             .then(() => {
//                 console.log(`i Resizing ${fileName} to ${newFileName}`)
//                 return sharp(fileTemp)
//                     .resize(2560, null)
//                     .toFile(newFileTemp)      
//             })
//             .then(() => {
//                 console.log(`✔ ${fileName} resized to width of ${2560}px`)
//                 console.log(`i Uploading ${newFileName}...`)
//                 return bucket.upload(newFileTemp, {
//                     destination: newFile
//                 })
//             })
//             .then(() => {
//                 // Delete the local files to free up disk space.
//                 console.log(`i Deleting local files to free up disk space.`)
//                 fs.unlinkSync(fileTemp)
//                 const config = {
//                     action: 'read',
//                     expires: '03-01-2500',
//                 }
//                 return Promise.all([
//                     bucket.file(newFile).getSignedUrl(config),
//                     bucket.file(object.name).getSignedUrl(config)
//                 ])
//             }).then(results => {
//                 console.log('Got Signed URLs.')
//                 const thumbResult = results[0]
//                 const originalResult = results[1]
//                 const thumbFileUrl = thumbResult[0]
//                 const fileUrl = originalResult[0]
//                 const roomId = filePath.split("/")[2]
//                 admin.database().ref(`rooms/${roomId}/pictures`).push({
//                     name: fileName,
//                     original: fileUrl,
//                     resized: thumbFileUrl
//                 })
                
//                 return
//             }).catch(error => {
//                 console.error("✖ ", error)
//                 return
//             })
//     })