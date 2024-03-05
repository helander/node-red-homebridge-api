const axios = require('axios');
/**
 *
 * Node Red node type: homebridge config
 *
 */
module.exports = (RED) => {
  function HomebridgeConfigNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.baseurl = config.baseurl;
    node.username = config.username;
    node.password = config.password;

    (async () => {

      const authdata = await axios({ method: 'post', url: `${node.baseurl}/api/auth/login`, data: { username: node.username, password: node.password, otp: 'string' } });
      if (authdata.status === 201) {
        headers = { Authorization : `${authdata.data.token_type} ${authdata.data.access_token}` }
        const accsdata = await axios({ method: '', url: `${node.baseurl}/api/accessories`, headers: headers });
        if (accsdata.status === 200) {
          const devices = {};
          for (let i = 0; i < accsdata.data.length; i += 1) {
            const appData = accsdata.data[i];
            if (appData.type !== 'ProtocolInformation') {
              const data = {
                devicename: `${appData.serviceName} - ${appData.type}`,
              };
              devices[appData.uniqueId] = data;
            }
          }
          node.devices = devices;
          //console.log('Devices',JSON.stringify(devices,null,'\t'));
        } else {
          console.error(`Error getting accessories: status ${accsdata.status} ${accsdata.statusText}`);
        }
      } else {
        console.error(`Error getting token: status ${authdata.status} ${authdata.statusText}`);
      }
    })();

    RED.httpAdmin.get('/homebridgedevices/:id', (req, res) => {
      const confignode = RED.nodes.getNode(req.params.id);
      //if (node != null) {
      if (confignode != null) {
        try {
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify(confignode.devices)).end();
        } catch (err) {
          res.sendStatus(500);
          node.error(`Failed:${err}`);
        }
      } else {
        res.sendStatus(404);
      }
    });
  }

  RED.nodes.registerType('homebridge config', HomebridgeConfigNode);
};
