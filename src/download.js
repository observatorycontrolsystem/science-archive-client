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

function generateScript(frameIds, archiveToken, callback) {
  $.get('scripts/dlscript.sh', function(data) {
    var res = data.replace('FRAMELIST', frameIds.join(' '));
    if (archiveToken != null) {
      res = res.replace('AUTHTOKEN', archiveToken);
    }
    callback(res);
  });
}

function downloadWget(frameIds, archiveToken) {
  generateScript(frameIds, archiveToken, function(data) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
    a.download = 'archivedownload.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
