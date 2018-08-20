const admin = require('firebase-admin')

// Imports for thumbnail generating
const sharp = require('sharp')
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')
const gcs = require('@google-cloud/storage')({keyFilename: 'service-account-credentials.json'})

const sizes = [360, 640, 768, 1024, 1280, 1440]


module.exports.generateThumbnail = object =>  {
  // Exit if the image is already a resized one.
  const {name: filePath, contentType} = object
  const fileName = path.basename(filePath)

  const thumbFileNames = sizes.map(size => `thumb_${size}_${fileName}`)


  const dirName = path.dirname(filePath)
  const bucket = gcs.bucket(object.bucket)

  if (fileName.includes('thumb_')) {
    console.log('✖ Already processed image.')
    return null
  }

  if (!contentType.startsWith('image/')) {
    console.log('✖ Not an image.')
    return null
  }
  // Download file from bucket.
  const tempFilePath = path.join(os.tmpdir(), fileName)

  const tempThumbFilePaths = sizes.map((size, index) => path.join(os.tmpdir(), thumbFileNames[index]))


  return bucket.file(filePath).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('Image downloaded locally to', tempFilePath)
    // Generate a thumbnails using Sharp.
    return Promise
      .all(sizes
        .map((size, index) =>
          sharp(tempFilePath)
            .resize(size)
            .toFile(tempThumbFilePaths[index])
    ))
  }).then(() => {
    console.log('Thumbnails created. Now uploading...')

    const thumbFilePaths = sizes.map((size, index) => path.join(dirName, thumbFileNames[index]))
    // Uploading the thumbnails.
    return Promise
      .all(thumbFilePaths
        .map((thumbFilePath, index) =>
          bucket.upload(tempThumbFilePaths[index], {
            destination: thumbFilePath,
            metadata: {contentType}
          })
    ))
  }).then(() => {
    // Once the thumbnails has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempFilePath)
    tempThumbFilePaths.forEach(tempThumbFilePath => fs.unlinkSync(tempThumbFilePath))


    // Now get the URLs of the uploaded images, both the original's and the thumbnails'.
    const config = {
        action: 'read',
        expires: '03-01-2500'
    }
    return Promise.all([
        bucket.file(filePath).getSignedUrl(config),
        ...thumbFileNames
          .map(thumbFileName =>
            bucket
              .file(path
                .join(dirName, thumbFileName))
                .getSignedUrl(config)
        )
    ])
  }).then(([original, ...rest]) => {
    // And add the URLs to the database.
    console.log(rest)

    const pictures = {fileName, SIZE_ORIGINAL: original[0]}
    sizes.forEach((size, index) => pictures[`SIZE_${size}`] = rest[index][0])
    return admin.database()
      .ref(`${dirName}/pictures`)
      .push(pictures)
  })}



/**
 * Delete a picture and its corresponding thumbnails 
 * @param {*} snapshot contains the deleted file's name
 * @param {*} baseURL the directory from which the images should be deleted
 */
module.exports.deletePicture = (snapshot, baseURL) => {    
  const {fileName} = snapshot.val()
  const bucket = admin.storage().bucket()
  return Promise
          .all([
                bucket.file(`${baseURL}/${fileName}`).delete(),
                ...sizes
                  .map(size => 
                    bucket.file(
                      `${baseURL}/thumb_${size}_${fileName}`
                    ).delete())
              ])
          .catch(console.error)
}