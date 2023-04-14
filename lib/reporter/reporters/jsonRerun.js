
const lodashPick = require('lodash.pick');
const path = require('path');
const Utils = require('../../utils');
const Logger = Utils.Logger;
const BaseReporter = require('../base-reporter.js');

class JsonRerunReporter extends BaseReporter {

  adaptModule(module) {

    // Pick only the necessary fields
    const result = lodashPick(module, [
      'modulePath',
      'status'
    ]);

    return result;
  }

  adaptResults() {
    const {modulesWithEnv}  = this.results;
    this.modulesWithEnv = {};

    Object.keys(modulesWithEnv).forEach((env) => {
      const modules = modulesWithEnv[env];
      this.modulesWithEnv[env] = {};

      Object.keys(modules).forEach((moduleKey) => {
        this.modulesWithEnv[env][moduleKey] = this.adaptModule(modules[moduleKey]);
      });
    });

    return this.modulesWithEnv;
  }

  writeReport() {
    const results = this.adaptResults();
    const {output_folder} = this.options;
    const filename = path.join(output_folder, 'rerun.json');
    const shouldCreateFolder = !Utils.dirExistsSync(output_folder);

    const report = {
      modulesWithEnv: results
    };

    return this.writeReportFile(filename, JSON.stringify(report), shouldCreateFolder, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote JSON Rerun report file to: ${path.resolve(filename)}`));
      });
  }
}

module.exports = (function() {
  return {
    write(results, options, callback) {

      const reporter = new JsonRerunReporter(results, options);

      reporter.writeReport()
        .then(_ => {
          callback();
        })
        .catch(err => {
          Logger.error(err);
          callback(err);
        });
    }
  };
})();
