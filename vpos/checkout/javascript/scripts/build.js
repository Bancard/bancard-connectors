function uglify(srcPath, distPath) {
  const UglifyJS = require('uglify-js');
  const Fs = require('fs');
  const raw = Fs.readFileSync(srcPath).toString();
  const compiled = UglifyJS.minify(raw).code;

  Fs.writeFileSync(distPath, compiled);
  console.log('Script built.');
}

uglify('bancard-checkout.js', `dist/bancard-checkout-${process.env.npm_package_version}.min.js`);
