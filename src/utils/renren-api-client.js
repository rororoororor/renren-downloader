const request = require('request');
const querystring = require('querystring');

const authProvider = require('../auth-provider/auth-provider');

const getRawAlbumListHtml = async function (userId) {
    //let rawHtml = fs.readFileSync(path.join(__dirname, '../../source-sample/album-list.html'), 'utf8');
    let queryParams = {
        offset: 0,
        limit: 1000,
        showAll: 1
    };
    let url = `http://photo.renren.com/photo/${userId}/albumlist/v7?${querystring.stringify(queryParams)}`;
    let rawHtml = await sendRequest(url, 'GET', authProvider.getAuth());
    return rawHtml;
};

/**
 * This API only return the latest 40 photos in raw html.
 * @param {*} userId 
 * @param {*} albumId 
 */
const getRawAlbumPhotosHtml = async function (userId, albumId) {
    let url = `http://photo.renren.com/photo/${userId}/album-${albumId}/v7`;
    let rawHtml = await sendRequest(url, 'GET', authProvider.getAuth());
    return rawHtml;
}

/**
 * 
 * @param {*} userid 
 * @param {*} albumId 
 * @param {*} page 
 * @param {*} count 
 * http://photo.renren.com/photo/290242907/album-467148329/bypage/ajax/v7?page=0&pageSize=100
 */
const getAlbumPhotos = async function (userId, albumId, page, count) {
    let url = `http://photo.renren.com/photo/${userId}/album-${albumId}/bypage/ajax/v7?page=${page}&pageSize=${count}`;
    return JSON.parse(await sendRequest(url, 'GET', authProvider.getAuth()));
}

const sendRequest = function (url, method, headers) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: method || 'GET',
            headers: headers || {}
        }, (error, response, body) => {
            resolve(body);
        });
    })
};

// (async () => {
//     await getRawAlbumListHtml(290242907);
// })();

module.exports.getRawAlbumListHtml = getRawAlbumListHtml;
module.exports.getRawAlbumPhotosHtml = getRawAlbumPhotosHtml;
module.exports.getAlbumPhotos = getAlbumPhotos;