import $ from 'jquery';
import 'jquery-file-download';

export { downloadZip, downloadWget };

function downloadZip(frameIds, uncompress, archiveRoot, archiveToken) {
  let postData = {};

  frameIds.forEach(function(value, i) {
    postData[`frame_ids[${i}]`] = value;
  });
  postData['auth_token'] = archiveToken;
  postData['uncompress'] = uncompress;

  $.fileDownload(`${archiveRoot}/frames/zip/`, {
    httpMethod: 'POST',
    data: postData
  });
}

function downloadWget() {
  // TODO: this function
}
