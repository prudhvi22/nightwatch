const assert = require('assert');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');


describe('Mobile Component Testing', function () {
  it('test baseUrl',  function(){
    const client = NightwatchClient.client({
      baseUrl: 'http://localhost:3000',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11'
      }
    });

    assert.strictEqual(client.api.baseUrl, 'http://10.0.2.2:3000');
  });
});