#!/bin/sh
function getJsonVal () {
    python3 -c "import json,sys;sys.stdout.write(json.dumps(json.load(sys.stdin)$1))";
}

# make sure we add this to the path so we can access ds9
PATH=$PATH:/usr/local/bin

# split URI params into array
arr=(${1//[=&]/ })

# URI param values are the odd array elements, keys the even
frames=${arr[1]}
authtoken=${arr[3]}
frame_url=${arr[5]}

echo "Downloading frames to the /tmp/archive_download directory"
mkdir /tmp/archive_download
for f in $(echo $frames | tr "," "\n"); do
    if [ "$authtoken" != "AUTHTOKEN" ]; then
      json=$(wget -qO- --header="Authorization: Token $authtoken" "$frame_url$f/")
    else
      json=$(wget -qO- "$frame_url$f/")
    fi
    filename=$(echo $json| getJsonVal "['filename']" | tr -d '"')
    url=$(echo $json | getJsonVal "['url']" | tr -d '"')
    wget -O /tmp/archive_download/$filename -c $url
done

# now open these in ds9
files=( /tmp/archive_download/* )
if [[ "${files[0]}" == *"fa"* && "${files[0]}" == *"00.fits"* ]]; then
  echo "opening in mosaic mode"
  ds9 -zscale -lock frame image -mosaicimage iraf /tmp/archive_download/*
else
  echo "opening in non-mosaic mode"
  ds9 -zscale -lock frame image /tmp/archive_download/*
fi

# now remove the files
rm -rf /tmp/archive_download

