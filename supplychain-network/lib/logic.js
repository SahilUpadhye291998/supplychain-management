/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
  * This is a demo for understanding
  * @param {org.example.mynetwork.TestTransaction} testTransaction 
  * @transaction
  */
 function testTransaction(testTransaction){

    var factory = getFactory();
    const NS = "org.example.mynetwork";

    var grower = factory.newResource(NS,"Grower","testGrower@gmail.com");
    var growerAddress = factory.newConcept(NS,"Address");
    growerAddress.country = 'USA';
    grower.address = growerAddress;
    grower.accountBalance = 0;

    var shipper = factory.newResource(NS,"Shipper","testShipper@gmail.com");
    var shipperAddress = factory.newConcept(NS,"Address");
    shipperAddress.country = 'USA';
    shipper.address = shipperAddress;
    shipper.accountBalance = 0;

    var importer = factory.newResource(NS,"Importer","testImporter@gmail.com");
    var importerAddress = factory.newConcept(NS,"Address");
    importerAddress.country = 'USA';
    importer.address = growerAddress;
    importer.accountBalance = 0;

    var contract = factory.newResource(NS,"Contract","CON:001");
    contract.grower = factory.newRelationship(NS,'Grower',"testGrower@gmail.com");
    contract.shipper = factory.newRelationship(NS,'Shipper',"testShipper@gmail.com");
    contract.importer = factory.newRelationship(NS,'Importer',"testImporter@gmail.com");
    var tomorrow = testTransaction.timestamp;
    tomorrow.setDate(tomorrow.getDate()+1);
    contract.arrivalDateTime = tomorrow;
    contract.unintPrice = 0.5;
    contract.minTemprature = 2;
    contract.maxTemprature = 10;
    contract.maxPenalty = 0;
    contract.minPenalty = 10;


    var shipment = factory.newResource(NS,"Shipment","Ship:001");
    shipment.productType = "BANANA";
    shipment.shipmentStatus = "ARRIVED";
    shipment.unintCount = 5000;
    shipment.contract = factory.newRelationship(NS,"Contract","CON:001");


    return getParticipantRegistry(NS+".Grower")
    .then(function(growerRegistry){
        return growerRegistry.addAll([grower]);
    })
    .then(function(){
        return getParticipantRegistry(NS+".Importer");
    })
    .then(function(importerRegistry){
        return importerRegistry.addAll([importer]);
    })
    .then(function(){
        return getParticipantRegistry(NS+".Shipper");
    })
    .then(function(shipperRegistry){
        return shipperRegistry.addAll([shipper]);
    })
    .then(function(){
        return getAssetRegistry(NS+".Contract");
    })
    .then(function(contractRegistry){
        return contractRegistry.addAll([contract]);
    })
    .then(function(){
        return getAssetRegistry(NS+".Shipment");
    })
    .then(function(shippmentRegistry){
        return shippmentRegistry.addAll([shipment]);
    })
 }

/**
 * This function will be able to add the tempreture reading to the file
 * @param {org.example.mynetwork.TempratureReading} tempratureReading 
 * @transaction
 */

function tempratureReading(tempratureReading){
    console.log("This is a function to record tempeature reading");
    var shipment = tempratureReading.shipment;
    const NS = "org.example.mynetwork";


    if(shipment.tempratureReading){
        shipment.tempratureReading.push(tempratureReading);
    }else{
        shipment.tempratureReading = [tempratureReading];
    }

    return getAssetRegistry(NS + ".Shipment")
    .then(function(shippmentRegistry){
        return shippmentRegistry.update(shipment);
    });
}

/**
 * This function will be able to interact with the shipment that is arrived
 * @param {org.example.mynetwork.ShipmentRecived} shipmentRecived 
 * @transaction
 */

 function shipmentRecived(shipmentRecived){

    var contract = shipmentRecived.shipment.contract;
    var shipment = shipmentRecived.shipment;
    var money = contract.unintPrice * shipment.unintCount;

    console.log("Shipment is recived at "+contract.arrivalDateTime + "as per contract");
    console.log("Shipment is arrived at"+shipmentRecived.arrivalDateTime);

    shipmentStatus = "Arrived";

    if(shipmentRecived.timestamp > contract.arrivalDateTime){
        money = 0;
        console.log("No Payment will be made due to late delivery")
    }else{
        if(shipment.tempratureReading){
            shipment.tempratureReading.sort(function(a,b){
                return (a.centigrade - b.centigrade);
            });

            var lowestReading = shipment.tempratureReading[0];
            var hightestReading = shipment.transactionReading[shipment.transactionReading.length - 1];
            var penalty = 0;

            console.log("Lowest temprature : ",lowestReading);
            console.log("Highest temprature : ",highestReading);

            if(lowestReading.centigrade < contract.minTemprature){
                penalty += (contract.minTemprature - lowestReading.centigrade) * contract.minPenalty;
                console.log("Penelty will be ",penalty);
            }
            
            if(highestReading.centigrade < contract.maxTemprature){
                penalty += (contract.maxTemprature - highestReading.centigrade) * contract.maxPenalty;
                console.log("Penelty will be ",penalty);
            }
            
            if(money < 0){
                money = 0;
            }
        }
    }

    console.log("Money recived",money);

    contract.grower.accountBalance += money;
    contract.shipper.accountBalance -= money;


    return getParticipantRegistry(NS+",Grower")
    .then(function(growerRegistry){
        return growerRegistry.update(contract.grower);
    })
    .then(function(){
        return getParticipantRegistry(NS+".Importer")
    })
    .then(function(importerRegistry){
        return importerRegistry.update(contract.importer);
    })
    .then(function(){
        return getAssetRegistry(NS+".Shipment")
    })
    .then(function(shipmentRegistry){

        var shipmentNotification = newFactory().newEvent("org.example.mynetwork","ShipmentHasArrived");
        shipmentNotification.shipment = shipment;
        emit(shipmentNotification);

        return shipmentRegistry.update(contract.shipment);
    })
    
 }