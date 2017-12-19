function uglify(srcPath, distPath) {
  const UglifyJS = require('uglify-js');
  const Fs = require('fs');
  const raw = Fs.readFileSync(srcPath).toString();
  const uglifyResult = UglifyJS.minify(raw);

  if (uglifyResult.error) {
    throw uglifyResult.error;
  }

  const compiled = uglifyResult.code;
  Fs.writeFileSync(distPath, compiled);

  console.log('Script built.');
}

uglify('bancard-checkout.js', `dist/bancard-checkout-${process.env.npm_package_version}.min.js`);
