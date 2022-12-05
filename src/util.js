import _ from 'lodash';
// import JS9 from 'js9';

export { itemInList, removeItemFromList};

function itemInList(list, item) {
  return _.includes(list, item);
}

function removeItemFromList(list, item) {
  list = list.filter(function(value) {
    return value != item;
  });
  return list;
}

// function openJs9Window(frame) {
//   // Open in a new window
//   var opts = {
//     scaleclipping: 'zscale',
//     zoom: 'toFit',
//     id: 'MyJS9' + '_' + frame.id,
//     // By default, images are restricted to 2048 by 2048. Set xdim and ydim to 0 for no restriction.
//     image: {
//       xdim: 0,
//       ydim: 0
//     }
//   };
//   if (frame.INSTRUME.indexOf('fl') > -1 || frame.INSTRUME.indexOf('fa') > -1) {
//     // Use second extension for multi-extension fits
//     opts.extension = 1;
//   }
//   JS9.LoadWindow(frame.url, opts, 'new');
// }
