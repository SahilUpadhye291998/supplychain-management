composer network install --card PeerAdmin@hlfv1 --archiveFile supplychain-network@0.0.1.bna

echo "====================================================="
echo "                Network is installed"
echo "====================================================="

composer network start --networkName supplychain-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

echo "====================================================="
echo "                Network is started"
echo "====================================================="

composer card import --file networkadmin.card

echo "====================================================="
echo "                Network Admin imported"
echo "====================================================="

composer network ping --card admin@supplychain-network

echo "====================================================="
echo "                Everything completed"
echo "====================================================="
