const axios = require('axios');
/**
 *
 * Node Red node type: homebridge device
 *
 */
module.exports = (RED) => {
  function HomebridgeDeviceNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.account = RED.nodes.getNode(config.account);
    node.deviceuniqueid = config.deviceuniqueid;
    node.devicename = config.devicename;
    node.status({ fill: 'grey', shape: 'ring' });

    /**
     *
     * The node's input message handler
     *
     */
    this.on('input', (msg) => {
      try {
        console.log(new Date(),'onInput',this.devicename,msg);
      } catch(err) {
        console.log(new Date(),this.devicename,'input error',err);
      }
      return undefined;
    });

  }

  RED.nodes.registerType('homebridge device', HomebridgeDeviceNode);
};
