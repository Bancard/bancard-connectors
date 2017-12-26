function lint(files) {
  const CLIEngine = require("eslint").CLIEngine;
  const cli = new CLIEngine();
  const report = cli.executeOnFiles(files);
  const formatter = cli.getFormatter();

  console.log(formatter(report.results));
}

lint(['bancard-checkout.js', 'bancard-checkout.test.js']);
