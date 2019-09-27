
const data_reduce = (arr) => {
    return arr.reduce((obj, item, inn) => {
        let start_time = Math.round(item.start_time / 1000);
        //delete item.start_time;
        obj[start_time] = item
        return obj
    }, {})
}

const save = (filename, data) => {
    var blob = new Blob([data], {type: 'text/xml'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

const isoData = (d) => (new Date(d)).toISOString();

const handleFileSelect = (evt) => {
    const files = evt.target.files; // FileList object
    const cnt = files.length;

    // files is a FileList of File objects. List some properties.
    const output = [];
    let merged = {};

    if (typeof window.FileReader !== 'function') {
        document.getElementById('result').innerHTML = 'The file API isn\'t supported on this browser yet.';
        return;
    }

    const finalize = (data) => {
        //console.log('final data:', data);
        let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
    <metadata>
        <time>${isoData(Object.keys(data)[0] * 1000)}</time>
    </metadata>
    <trk>
        <name>My New Ride</name>
        <type>1</type>
        <trkseg>`;

        Object.values(data).reduce(function(previousValue, currentValue, index, array){
            //console.log('index', index, 'currentValue', currentValue);
            if(currentValue.latitude && currentValue.longitude){
                gpx += `
            <trkpt lat="${currentValue.latitude}" lon="${currentValue.longitude}">
                <time>${isoData(currentValue.start_time)}</time>`;
                if(currentValue.altitude){
                    gpx += `
                <ele>${currentValue.altitude}</ele>`;
                }
                if(previousValue.heart_rate){
                    gpx += `
                <extensions>
                    <gpxtpx:TrackPointExtension>
                        <gpxtpx:hr>${previousValue.heart_rate}</gpxtpx:hr>
                    </gpxtpx:TrackPointExtension>
                </extensions>`;
                }
                gpx += `
            </trkpt>`;
            }
            return currentValue;
        })

        gpx += `
        </trkseg>
    </trk>
</gpx>`;

        save('workout.gpx', gpx);
    }

    Object.keys(files).map((key, idx) => {

        let f = files[key];
        if (!f.type.match('application/json')) {
            console.warn('Given file is not Json');
            return;
        }

        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        '</li>');
        
        fr = new FileReader();
        fr.onload = function(e) {
            let result = JSON.parse(e.target.result);

            let formatted_result = data_reduce(result);

            //console.log('result', result);
            //console.log('formatted_result', formatted_result);

            Object.assign(merged, formatted_result);

            if(cnt === idx + 1){
                finalize(merged);
            }
        }
        fr.readAsText(f);

    });
    
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

    //console.log('merged', merged);
    
}
