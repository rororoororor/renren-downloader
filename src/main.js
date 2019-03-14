const path = require('path');

const albumInfoListProvider = require('./source-provider/album-info-list-provider');
const albumPhotoProvider = require('./source-provider/album-photo-details-provider');
const photoDownloader = require('./utils/photo-downloader')

const main = async function (userId, outputDir) {
    // fetch simple album list
    let albumInfoList = await albumInfoListProvider.getAllAlbumList(userId, outputDir);
    
    let albumOutputDirList = [];
    let albumPhotoDetailList = [];
    // TODO: how to use foreach/map with async ??
    for (let i = 0; i < albumInfoList.length; i++) {
        let albumInfo = albumInfoList[i];
        let albumDir = path.join(outputDir, `${albumInfo.albumId}-${albumInfo.albumName}-${albumInfo.photoCount}`);
        albumOutputDirList.push(albumDir);
        albumPhotoDetailList.push(await albumPhotoProvider.getAllPhotosInAlbum(albumDir, albumInfo));
    }
    
    for (let i = 0; i < albumPhotoDetailList.length; i++) {
        console.log(`downloading to: ${albumOutputDirList[i]}`);
        await photoDownloader.downloadPhotoInAlbum(albumOutputDirList[i], albumPhotoDetailList[i]);
    }
};

module.exports.download = main;

(async () => {
    // past your id and output folder here
    await main(ididid, 'download');
})();