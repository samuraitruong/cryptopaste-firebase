import * as functions from 'firebase-functions';
import * as fbAdmin from 'firebase-admin'
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
let counter =1;
fbAdmin.initializeApp(functions.config().firebase);

 export const increaseCounter = functions.https.onRequest((request, response) => {
 	counter ++;
 	const {mode} = request.body;
 	console.log("mode" , mode)
 	const toUpdate = {};
    const db = fbAdmin.database();
    const ref = db.ref("/");
    let oldvalue = null;
    if(mode != 'encrypt' && mode!= 'decrypt') {
    	response.status(400).send('bad request: unknow mode').end()
    	return;
    }
    ref.once("value").then((snapshot)=> {
      
      oldvalue = snapshot.val();
      toUpdate[mode] = (oldvalue[mode] || 0) +1;

      ref.update(toUpdate).then( () => {
        console.log("oldvalue", oldvalue)
        response.status(200).json({oldvalue, counter,mode}).end();
      }).catch(error=> response.status(500).send(error))

    }).catch(error => response.status(500).send(error))

  
 });

export const increaseCounterOnGA =  functions.analytics.event('counter').onLog((event) => { 

const db = fbAdmin.database();
    const ref = db.ref("/");
    let oldvalue = 0;
    ref.once("value").then((snapshot)=> {
      
      oldvalue = snapshot.val().encrypt +1
      
      ref.update({encrypt:oldvalue}).then( () => {
        console.log("oldvalue", oldvalue)
        
      }).catch(error=> console.log(error))

    }).catch(error =>  console.log(error))

})