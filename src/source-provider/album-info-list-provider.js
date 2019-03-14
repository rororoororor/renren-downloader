const fs = require('fs');
const path = require('path');

const { JSDOM } = require('jsdom');

const renrenApiClient = require('../utils/renren-api-client');

const albumInfoListFileName = 'all-album-info.json';


const extractAlbumList = async function (rawHtml) {
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
        if (lines[i].match("^'albumList':")) {
            // chop the leading `'albumList:' `and trailing `,`
            let leadingLength = ("'albumList': ").length;
            let result = lines[i].substr(leadingLength, lines[i].length - leadingLength - 1);
            return JSON.parse(result);
        }
    }
};

const getAllAlbumList = async function (userId, ouputDir) {
    let htmlResult = await renrenApiClient.getRawAlbumListHtml(userId);
    if (ouputDir && !fs.existsSync(ouputDir)){
        fs.mkdirSync(ouputDir);
    }
    let albumInfoList = await extractAlbumList(htmlResult, ouputDir);
    fs.writeFileSync(path.join(ouputDir, albumInfoListFileName), JSON.stringify(albumInfoList, null , space = 2));
    return albumInfoList;
};

module.exports.getAllAlbumList = getAllAlbumList;