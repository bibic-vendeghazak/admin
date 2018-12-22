// Imports for thumbnail generating
import sharp from "sharp"
import path from "path"
import os from "os"
import fs from "fs"
import { database, storage } from "./firebase"

const sizes = [360, 640, 768, 1024, 1280, 1440]


export const generateThumbnail = async object =>  {
  const {name: filePath, contentType} = object
  const fileName = path.basename(filePath)

  // Exit if not an image
  if (!contentType.startsWith("image/")) return console.log("✖ Not an image.")

  // Exit if the image is already a resized one.
  if (fileName.includes("thumb_")) return console.log("✖ Already processed image.")

  const bucket = storage.bucket(object.bucket)

  // Create paths
  const destination = path.dirname(filePath)
  const tempDir = os.tmpdir()

  const tempFile = path.join(tempDir, fileName)

  const thumbFileNames = sizes.map(size => `thumb_${size}_${fileName}`)
  const tempThumbFiles = thumbFileNames.map(thumbFileName => path.join(tempDir, thumbFileName))
  const thumbFiles = thumbFileNames.map(thumbFileName => path.join(destination, thumbFileName))

  // Download file from bucket.
  await bucket.file(filePath).download({destination: tempFile})
  console.log("Image downloaded locally to", tempFile)

  // Generate thumbnails using Sharp.
  await Promise.all(
    tempThumbFiles.map((tempThumbFile, index) =>
      sharp(tempFile).resize(sizes[index]).toFile(tempThumbFile)
    )
  )

  console.log("Thumbnails created. Now uploading...")
  // Uploading the thumbnails.
  await Promise.all(
    thumbFiles
      .map((thumbFile, index) =>
        bucket.upload(tempThumbFiles[index], {
          destination: thumbFile,
          metadata: {contentType}
        })
      ))

  // Once the thumbnails has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempFile)
  tempThumbFiles.forEach(tempThumbFile => fs.unlinkSync(tempThumbFile))


  // Now get the URLs of the uploaded images, both the original's and the thumbnails'.
  const config = {action: "read", expires: "03-01-2500"}

  const [[original], ...thumbnails] = await Promise.all([
    bucket.file(filePath).getSignedUrl(config),
    ...thumbFiles
      .map(thumbFile =>
        bucket.file(thumbFile).getSignedUrl(config)
      )
  ])
  // And add the URLs to the database.

  const pictures = {fileName, SIZE_ORIGINAL: original}

  thumbnails.forEach(([thumbnail], index) => {
    pictures[`SIZE_${sizes[index]}`] = thumbnail
  })

  await database.ref(destination).push(pictures)
  return console.log(`urls are pushed to the database at ${destination}.`)
}



/**
 * Delete a picture and its corresponding thumbnails
 * @param {DataSnapshot} snap contains the deleted files' names
 * @param {string} context.params.galleryId the location where the pictures were deleted from
 * @param {string} [context.params.roomId] the id of the room where the pictures were deleted from
 */
export const deletePictures = async (snap, {params: {galleryId, roomId}}) => {
  console.log("Image deletion detected in the database, deleting images from the Storage...")

  const {fileName} = snap.val()
  const baseURL = `galleries/${galleryId}${roomId ? `/${roomId}`: ""}`

  const files = [`${baseURL}/${fileName}`]
  sizes.forEach(size => {files.push(`${baseURL}/thumb_${size}_${fileName}`)})

  files.forEach(async file => {await storage.bucket().file(file).delete()})

  return console.log(`All versions of ${fileName} are now deleted.`)
}