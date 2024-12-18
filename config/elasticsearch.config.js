import { Client } from "@elastic/elasticsearch";
import * as dotenv from 'dotenv'
dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

export default client;