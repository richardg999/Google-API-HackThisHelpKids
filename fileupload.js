var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;


// Creates a client
const client = new speech.SpeechClient();

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      /*var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/RichardG/HackThisHelpKids/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded');
        res.end();

      });*/
      res.write('File uploaded');
      res.end();
      setTimeout(startTranscription, 10, files.filetoupload.path);
      
      
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);




function startTranscription(name) {
	// Imports the Google Cloud client library for Beta API
/**
 * TODO(developer): Update client library import to use new
 * version of API when desired features become available
 */


/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 console.log(name);
const filename = name;
const model = 'video';
const encoding = 'LINEAR16';
const sampleRateHertz = 44100;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  model: model,
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
client
  .recognize(request)
  .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: `, transcription);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}