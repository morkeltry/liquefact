const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

let methods = [
  ['GET', '/dbs', x=>x.split('/')[1]==='dbs', 'curl https://localhost:3000/dbs'],

  ['GET', '/db/:dbname', x=>x.split('/')[1]==='db'&&!(x.split('/')[2]),
   'curl https://localhost:3000/db/docstore'],

  ['GET', '/db/:dbname/value', x=>x.split('/')[3]==='iterator',
   'curl -X GET https://localhost:3000/db/counter/value'],

  ['GET', '/db/:dbname/:item', x=>x.split('/')[1]==='db'&&(x.split('/')[1])&&(x.split('/')[2]) ],

  ['GET', '/db/:dbname/iterator', x=>x.split('/')[3]==='iterator',
   "curl -X GET https://localhost:3000/db/feed/iterator",
   "curl -X GET https://localhost:3000/db/feed/iterator -d 'limit=-1'"],

  ['GET', '/db/:dbname/index', x=>x.split('/')[3]==='index',
   'curl -X GET https://localhost:3000/keyvalue/index'],

  ['GET', '/identity', x=>x.split('/')[1]==='identity',
   'curl -X GET https://localhost:3000/identity'],

  ['POST', '/db/:dbname', x=>false,
    'curl https://localhost:3000/db/docstore -d "create=true" -d "type=docstore"',
    'curl https://localhost:3000/db/docstore -d "create=true" -d "type=docstore" -d "indexBy=name"',
    `curl -H "Content-Type: application/json" --data '{"create":"true","type":"feed","accessController":{"type": "orbitdb","write": ["1234"]}}'`,
    'curl -X POST https://localhost:3000/db/zdpuAmnfJZ6UTssG5Ns3o8ALXZJXVx5eTLTxf7gfFzHxurbJq%2Fdocstore',
    'curl https://localhost:3000/db/docstore -d "create=true" -d "type=docstore" -d "overwrite=true"'
  ],

  ['POST', '/db/:dbname/query',  x=>x.split('/')[3]==='query',
    `curl https://localhost:3000/db/docstore/query -X GET -H "Content-Type: application/json" --data '{"values":[]}'`, `curl https://localhost:3000/db/docstore/query -H "Content-Type: application/json" --data '{"propname":"likes","comp":"gt","values":[300]}'`,
    `curl -X POST https://localhost:3000/db/docstore/query -H "Content-Type:application/json" --data '{"propname":"likes", "comp":"mod", "values":[100,0]}'`,
    `curl -X GET https://localhost:3000/db/docstore/query -H "Content-Type:application/json" --data '{"propname":"likes", "comp":"range", "values":[250,1000]}'`,
  ],

  ['POST', '/db/:dbname/add',  x=>x.split('/')[3]==='add',
    `curl -X POST https://localhost:3000/db/feed/add -d 'feed-item-1'`],
  ['PUT', '/db/:dbname/add',   x=>false,
  `curl -X POST https://localhost:3000/db/feed/add -d 'feed-item-1'`],

  ['POST', '/db/:dbname/put',  x=>x.split('/')[3]==='put',
    `curl -X POST https://localhost:3000/db/docstore/put -H "Content-Type: application/json" -d '{"_id":1, "value": "test"}'`,
    `curl -X POST https://localhost:3000/db/keyvalue/put  -H "Content-Type: application/json" -d '{"key":"Key","value":{ "name": "Value" }}'`,
  ],
  ['PUT', '/db/:dbname/put',   x=>false,
    `curl -X POST https://localhost:3000/db/docstore/put -H "Content-Type: application/json" -d '{"_id":1, "value": "test"}'`,
    `curl -X POST https://localhost:3000/db/keyvalue/put  -H "Content-Type: application/json" -d '{"key":"Key","value":{ "name": "Value" }}'`,
  ],

  ['POST', '/db/:dbname/inc',  x=>x.split('/')[3]==='inc',
    `curl -X POST https://localhost:3000/db/counter/inc`],
  ['PUT', '/db/:dbname/inc',   x=>false,
    `curl -X POST https://localhost:3000/db/counter/inc`],

  ['POST', '/db/:dbname/inc/:val',  x=>x.split('/')[3]==='inc',
    `curl -X POST https://localhost:3000/db/counter/inc/100`],
  ['PUT', '/db/:dbname/inc/:val',   x=>false,
    `curl -X POST https://localhost:3000/db/counter/inc/100`],

  ['POST', '/db/:dbname/access/write',  x=>x.split('/')[3]==='access',
    `curl -X POST https://localhost:3000/db/docstore/access/write -d 'id=045757bffcc7a4...'`],
  ['PUT', '/db/:dbname/access/write',   x=>false,
    `curl -X POST https://localhost:3000/db/docstore/access/write -d 'id=045757bffcc7a4...'`],

  ['DELETE', '/db/:dbname',   x=>false,
    `curl -X DELETE https://localhost:3000/db/docstore`],

  ['DELETE', '/db/:dbname/:item',  x=>false,
    `curl -X DELETE https://localhost:3000/db/docstore/1`]
]



let arg = process.argv[2] ? `/${process.argv[2]}` : [''];
let url= `https://localhost:3000${arg}`;
console.log(arg.split('/'));
let method = methods
  .find( tuple=>tuple[2](arg) )
  || []
  [1] ;

console.log(url);
console.log(method);
// if (url)
//   fetch(url)
//     .then(res => res.json())
//     .then(json => console.log(json));
