# liquefact




### IPFS / OrbitDB engine

#### Install

IPFS's pubsub is better documented for go-ipfs, so let's install that:

```
wget https://dist.ipfs.io/go-ipfs/v0.6.0/go-ipfs_v0.6.0_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.6.0_linux-amd64.tar.gz
sudo mv ./go-ipfs/ipfs  /usr/local/bin
ipfs init
```

Clone orbitDb repo (currently furthersty is aplelionz's)
`git clone `....

```
cd
npm i
```
NB, if using `orbit-db-http-api` repo, make sure you know which IPFS version you are using and if build fails on an out of date `leveldown`, then `rm package-lock.json`.


Generate root and dev SSL certs, and sign the dev cert with the root cert:
```
openssl genrsa -des3 -out rootSSL.key 2048
openssl req -x509 -new -nodes -key rootSSL.key -sha256 -days 1024 -out rootSSL.pem

openssl req  -new -sha256 -nodes  -out localhost.csr  -newkey rsa:2048 -keyout localhost.key

openssl x509 \
 -req \
 -in localhost.csr \
 -CA rootSSL.pem -CAkey rootSSL.key -CAcreateserial \
 -out localhost.crt \
 -days 500 \
 -sha256 \
 -extfile <(echo " \
    [ v3_ca ]\n \
    authorityKeyIdentifier=keyid,issuer\n \
    basicConstraints=CA:FALSE\n \
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\n \
    subjectAltName=DNS:localhost \
   ")
```

Import keys:
. into OS : ```
  sudo mkdir /usr/local/share/ca-certificates/extra
  sudo cp rootSSL.pem \/usr/local/share/ca-certificates/extra/rootSSL.crt
  sudo update-ca-certificates
  ```
. or into browser
. or individually per CURL request `curl -k rootSSL.crt`


#### Run ipfs and OrbitDB


Run ipfs as daemon with `--enable-pubsub-experiment`
```
ipfs daemon --enable-pubsub-experiment &
```
Run OrbitDB with SSL based on the key:
```
node src/cli.js api --ipfs-host localhost --orbitdb-dir ./orbitdb --https-key localhost.key --https-cert localhost.crt &

```

Test it out!!!
(NB requires https: protocol, it won't redirect)

`curl -X GET https://localhost:3000/identity  | jq '.' ``
 or
 `curl -X POST https://localhost:3000/db/my-feed --data 'create=true' --data 'type=feed' | jq '.''`
Check the OrbitDB [queries reference](https://github.com/orbitdb/orbit-db-http-api#postput-dbdbnameadd)
