const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

//variables
const namespace = 'org.degree.ucsd';
const businessNetworkName = 'degree';
const connectionProfile = {
    "name": "fabric-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
    "peers": {
     "peer0.org1.example.com": {
      "url": "grpc://localhost:7051",
      "eventUrl": "grpc://localhost:7053"
     }
    },
    "certificateAuthorities": {
     "ca.org1.example.com": {
      "url": "http://localhost:7054",
      "caName": "ca.org1.example.com"
     }
    },
    "orderers": {
     "orderer.example.com": {
      "url": "grpc://localhost:7050"
     }
    },
    "organizations": {
     "Org1": {
      "mspid": "Org1MSP",
      "peers": [
       "peer0.org1.example.com"
      ],
      "certificateAuthorities": [
       "ca.org1.example.com"
      ]
     }
    },
    "channels": {
     "composerchannel": {
      "orderers": [
       "orderer.example.com"
      ],
      "peers": {
       "peer0.org1.example.com": {
        "endorsingPeer": true,
        "chaincodeQuery": true,
        "eventSource": true
       }
      }
     }
    },
    "client": {
     "organization": "Org1",
     "connection": {
      "timeout": {
       "peer": {
        "endorser": "300",
        "eventHub": "300",
        "eventReg": "300"
       },
       "orderer": "300"
      }
     }
    }
   };

/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

    //use admin connection
    adminConnection = new AdminConnection();
    businessNetworkName = 'degree';
   
    //declare metadata
    const metadata = {
     userName: identity.userID,
     version: 1,
     enrollmentSecret: identity.userSecret,
     businessNetwork: businessNetworkName
    };
   
    //get connectionProfile from json, create Idcard
   
    const card = new IdCard(metadata, connectionProfile);
   
    //import card
    await adminConnection.importCard(cardName, card);
   }

module.exports = {

    /*
  * Create University participant and import card for identity
  * To be used inside other functions
  * @param {String} cardId Import card id for university
  * @param {String} universityRut University account number as identifier on network
  * @param {String} shortName University short name
  * @param {String} fullName University short name
  * @param {String} email University email
  */
 registerUniversity: async function(cardId, universityRut, shortName, fullName, email) {
    try {
  
     //connect as admin
     businessNetworkConnection = new BusinessNetworkConnection();
     await businessNetworkConnection.connect('admin@degree');
  
     //get the factory for the business network
     factory = businessNetworkConnection.getBusinessNetwork().getFactory();
  
     //create university participant
     const university = factory.newResource(namespace, 'University', universityRut);
     university.shortName = shortName;
     university.fullName = fullName;
     university.email = email;
  
     //add university participant
     const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
     await participantRegistry.add(university);
  
     //issue identity
     const identity = await businessNetworkConnection.issueIdentity(namespace + '.University#' + universityRut, cardId);
  
     //import card for identity
     await importCardForIdentity(cardId, identity);
  
     //disconnect
     await businessNetworkConnection.disconnect('admin@degree');
  
     return true;
  
    } catch (err) {
     throw error
    }
   },
   
}



