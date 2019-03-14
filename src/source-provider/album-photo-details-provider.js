const fs = require('fs');
const path = require('path');

const { JSDOM } = require('jsdom');

const renrenApiClient = require('../utils/renren-api-client');

/**
 * Extract photo list from raw html content returned by api
 * http://photo.renren.com/photo/${userId}/album-${albumId}/v7
 * Deprecated since the html only contains the first 40 photos
 * @param {*} rawHtml 
 */
const extractPhotos = async function (rawHtml) {
    let dom = new JSDOM(rawHtml);
    let $scripts = await dom.window.document.querySelectorAll('script');
    let $targetScript = null;
    for (let i = 0; i < $scripts.length; i++) {
        if ($scripts[i].textContent.indexOf('nx.data.photo') > -1) {
            $targetScript = $scripts[i];
            break;
        }
    }
    let lines = $targetScript.textContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match("^'photoList':")) {
            // chop the leading `'albumList:' `and trailing `,`
            let leadingLength = ("'albumList':").length;
            let result = lines[i].substr(leadingLength, lines[i].length - leadingLength - 1)
            return JSON.parse(result);
        }
    }
};

/**
 * albumInfo: the following properties are used
 ```json
 {
    "albumName": "手机相册",
    "albumId": "string",
    "ownerId": int,
    "photoCount": 58,
 }
 ```
 * @param {*} albumInfo 
 */
const getAllPhotosInAlbum = async function (outputDir, albumInfo) {
    // split album photos into n batches, and take them one by one
    let batchSize = 20;
    let batchCnt = Math.ceil(albumInfo.photoCount / batchSize);
    let requests = [];
    // page starts from 1
    for (let idx of toArray(1, batchCnt)) {
        requests.push(renrenApiClient.getAlbumPhotos(albumInfo.ownerId, albumInfo.albumId, idx, batchSize));
    }
    let photoLists = await Promise.all(requests);
    let photoList = [];
    photoLists.forEach(photos => photoList = photoList.concat(photos.photoList));

    if (outputDir && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(
        path.join(outputDir, 'album-detail.json'),
        JSON.stringify(photoList, null, space = 2));
    return photoList;
    function* toArray(start, cnt) {
        let i = start;
        let end = start + cnt;
        while (i < end) {
            yield i;
            i++
        }
    }
};

module.exports.getAllPhotosInAlbum = getAllPhotosInAlbum;