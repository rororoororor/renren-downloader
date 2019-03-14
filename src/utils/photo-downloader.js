const fs = require('fs');
const request = require('request');
const path = require('path');

const authProvider = require('../auth-provider/auth-provider');

/**
 * Auto add cookie header for downloading photos
 * @param {*} uri 
 * @param {*} filePath 
 */
const downloadPhoto = function (uri, filePath) {
    return new Promise((resolve, reject) => {
        request({
            url: uri,
            method: 'GET',
            headers: authProvider.getAuth()
        })
        .pipe(fs.createWriteStream(filePath))
        .on('close', () => {
            resolve(`download ${uri} succeed!`);
        });
    });
};

const downloadPhotoInAlbum = async function (albumDir, albumPhotoDetail) {
    await Promise.all(albumPhotoDetail.map(photoInfo => {
        return downloadPhoto(photoInfo.url, path.join(albumDir, "" + photoInfo.position + path.extname(photoInfo.url)));
    }));
}


module.exports.downloadPhotoInAlbum = downloadPhotoInAlbum;