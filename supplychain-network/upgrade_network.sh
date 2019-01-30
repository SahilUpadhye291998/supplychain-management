composer archive create --sourceType dir --sourceName . -a supplychain-network@0.0.2.bna

echo "=================================================================================="
echo "                             New Archive File Created"
echo "=================================================================================="

composer network install --card PeerAdmin@hlfv1 --archiveFile supplychain-network@0.0.2.bna

echo "=================================================================================="
echo "                             Network card install"
echo "=================================================================================="

composer network upgrade -c PeerAdmin@hlfv1 -n supplychain-network -V 0.0.2

echo "=================================================================================="
echo "                             Network card Updated"
echo "=================================================================================="

composer network ping -c admin@supplychain-network | grep Business

echo "=================================================================================="
echo "                                   Completed"
echo "=================================================================================="
