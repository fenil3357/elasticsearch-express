# Elasticsearch express demo

1) Docker commands for elasticsearch
```
# Create network
docker network create esnet

# Run elasticsearch
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 \
  --network esnet
  --volume esdata
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e ES_JAVA_OPTS="-Xms2g -Xmx2g" \
  elasticsearch:8.10.2

# In case of memory issue
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

# Run kibana (if you want to monitor es)
docker run --name kibana -d \
  --network esnet \
  --volume kibana-data:/usr/share/kibana/data \
  -e "ELASTICSEARCH_HOSTS=http://elasticsearch:9200" \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms2g -Xmx2g" \
  docker.elastic.co/kibana/kibana:7.17.10

# Connect with network
docker network connect esnet elasticsearch
```

2) Install deps and start the server
```
npm install
npm run dev
```

3) For bulk Indexing random test data

```
npm run  bulk-index
```