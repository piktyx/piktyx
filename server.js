const http = require('http');
const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

var fs = require('fs');
var cors = require('cors');
var axios = require('axios');

const proxy = httpProxy.createProxyServer({});
const homedir = require('os').homedir();

const IncomingForm = require('formidable').IncomingForm

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(require('morgan')('short'));
app.use(cors(corsOptions));

(function initWebpack() {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack/common.config');

    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath,
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
    }));

    app.use(express.static(path.join(__dirname, '/')));
    app.use('/files', express.static(homedir));

}());

var ExifImage = require('exif').ExifImage;

function getEXIF( filePath ) {
    return new Promise(resolve => {
        ExifImage(filePath, (err, data) => {
            resolve(data);
        });
    });
}


app.get('/fetch_pictures', (req, res) => {

    var token = req.query.token;

    axios.get(`http://localhost:5000/api/fetch_pictures`, {
        headers: {
            'Authorization': token
        }
    })
    .then((result) => {
        var files = result.data.result;

        var promise = files.map(async (file) => {
            try {
                var data = await getEXIF(file.path);

                file.exif_exist = true;
                file.exif = data.exif;
                file.width = data.exif.ExifImageWidth;
                file.height = data.exif.ExifImageHeight;
                file.date = data.exif.DateTimeOriginal;
            } catch (error) {
                console.log('Error: ' + error.message);
            }

            return file
            
        })
        
        Promise.all(promise).then(function(results) {
            return  res.json({result: results});
        })

  
        
        
    });

    

})


app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});



var uuid4 = require('uuid4');
var dateFormat = require('dateformat');



app.post('/upload', function(req, res) {
    
    var form = new IncomingForm()
    form.keepExtensions = true;
    var files_uploaded = []
    var token = [];

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error('Error', err)
            throw err
        }

        token.push(fields["token"]);

    });
    form.on('fileBegin', function(name, file) {
        
        var uid = name.split('_').pop()

        if (!fs.existsSync(`${homedir}/piktyx/${uid}`)){
            if (!fs.existsSync(`${homedir}/piktyx`)){
                fs.mkdirSync(`${homedir}/piktyx`);
            }
            fs.mkdirSync(`${homedir}/piktyx/${uid}`);
        }

        var ext = file.path.split('.').pop()

        var day = dateFormat(new Date(), "yyyymmdd_hhMMss");

        file.path = `${homedir}/piktyx/${uid}/${uuid4()}_${day}.${ext}`;
        files_uploaded.push(file.path);
    });
    form.on('end', () => {
        axios.post(`http://localhost:5000/api/upload_picture_filename/` + token[0], {
            files_uploaded
        });
        return res.json({status: "success", files: files_uploaded});
    })
    
});

app.use(express.json());

app.post('/delete_picture', function(req, res){
    var pic = req.body.pic;

    axios.post(`http://localhost:5000/api/delete_picture_filename/` + req.body.token, {
        pic
    })
    .then((result) => {
        if(result.data.status == "success"){
            try {
                fs.unlinkSync(pic)
                //file removed
            } catch(err) {
                console.error(err)
            }
        }
        return res.json({status: "success", statusText: "Successfully deleted"});
    });
})


const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
});
