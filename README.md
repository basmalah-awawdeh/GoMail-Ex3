# GoMail - Exercise 3

Node.js + C++ URL Blacklist System with Bloom Filter

This project implements a full-stack system combining a TCP-based C++ server and a Node.js REST API.

## Clone the Repository

```bash
git clone https://github.com/basmalah-awawdeh/GoMail-Ex3
```
---

## Running the System in Docker

This project supports Docker-based execution via `docker-compose`.

---

## 1st Terminal — Build and Start Containers

```bash
docker-compose up --build
```
This will build and start both the Node.js API container and the C++ server container.

---

## 2nd Terminal — Start the C++ Blacklist Server

```bash
docker exec -it gomail-ex3-cpp-server-1 bash
./server 12345 8 1 2
```

* `12345` = server port

---


## 3rd Terminal — Run the Node.js API Server

```bash
docker exec -it gomail-ex3-node-api-1 bash
CPP_SERVER_PORT=12345 node app.js
```
> Ensure the port matches the one passed to the C++ server.
---


## Example Usage (by curl)

### Add a URL to the blacklist

```bash
curl -X POST http://localhost:3003/api/blacklist \
  -H "Content-Type: application/json" \
  -d '{"url": "http://bad.com"}'
```
![adding url to blacklist](https://github.com/user-attachments/assets/210cbced-e3a7-46ca-9706-8044824d1389)

![adding url already in blacklist](https://github.com/user-attachments/assets/4619b8a2-3fc9-4396-8fa0-1c9030f71d02)


### Delete a blacklisted URL (by ID)

```bash
curl -X DELETE http://localhost:3003/api/blacklist/<id>
```

Replace `<id>` with the UUID you received from the POST response.

![delete url from blacklist](https://github.com/user-attachments/assets/791fb68c-1a48-43d3-bb80-47580257c531)


### Register a new user

```bash
curl -X POST http://localhost:3003/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"<name>", "password":"<pas>", "name":"<name>"}'
```
![create user](https://github.com/user-attachments/assets/b826b7c0-1830-4ba4-86d7-11c6466a7dff)


### Login and get user ID

```bash
curl -X POST http://localhost:3003/api/users/tokens \
  -H "Content-Type: application/json" \
  -d '{"username":"basmalah", "password":"1234"}'
```
![login and get user id](https://github.com/user-attachments/assets/db8ed626-1962-43e6-a2b8-b4e63cd63f79)


### Send a mail containing links

```bash
curl -i -X POST http://localhost:3003/api/mails \
  -H "Content-Type: application/json" \
  -H "x-user-id: 8d0b1521-4c62-4674-9860-48f617b496dc" \
  -d '{
    "to": "khaled",
    "subject": "Nice website",
    "body": "Check this out",
    "links": ["http://example.com"],
    "sent": true
}'

```
![send mail the url not blacklisted](https://github.com/user-attachments/assets/1ff4e6e2-857c-4f19-bda7-391a16acd981)


If the link is blacklisted, the mail will be rejected.


![send mail the url is blacklisted](https://github.com/user-attachments/assets/e982c736-678f-4afc-890c-eaa279e343b0)

---

### Search mail by a word

```bash
curl -i http://localhost:3000/api/mails/search/Hello \
-H "x-user-id: <USER_ID>"
```

![search mail](https://github.com/user-attachments/assets/9571313f-ed6d-440f-8706-11bb4ef687ec)


### Get the last 50 mails
```bash
curl  -X GET http://localhost:3003/api/mails \
-H "x-user-id: <your-user-id>"
```

![get the mails](https://github.com/user-attachments/assets/eefc68bd-ac49-4f4d-bb8a-6ed7764672a5)


### Get tha mails id by user id

```bash
curl -i -X GET http://localhost:3003/api/mails   -H "x-user-id:<your-user-id>"
```

![get the mail by user id](https://github.com/user-attachments/assets/e5a178a9-ea59-4657-b79b-c17af4402594)


### Patch tha mail

```bash
curl -i -X PATCH http://localhost:3003/api/mails/<mail-id> \
  -H "Content-Type: application/json" \
  -H "x-user-id: 8d0b1521-4c62-4674-9860-48f617b496dc" \
  -d '{
    "subject": "Updated Subject Line"
  }'

```
![patch the mail](https://github.com/user-attachments/assets/85709d3d-97b5-493c-b0c8-9fa22a486656)

If the mail is sent, patching will fail
https://private-user-images.githubusercontent.com/203569242/451034164-a06b431c-140b-4e24-80f6-e95ed087de78.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDg5ODI5ODAsIm5iZiI6MTc0ODk4MjY4MCwicGF0aCI6Ii8yMDM1NjkyNDIvNDUxMDM0MTY0LWEwNmI0MzFjLTE0MGItNGUyNC04MGY2LWU5NWVkMDg3ZGU3OC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjAzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYwM1QyMDMxMjBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iZDc2YTBmYzgzNTM5YmVmZjRhOTdjZTIwYWVhZTY4MmM3ZDE4NjNlZmUyYjFmOTBhOTc4YjBjNmVhZDZiYTgyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.R9_ptZxacVRCNNDIk1VStt89ZrPR7Xt5YDep6O_CmhM



### Labels

```bash
curl -i -X POST http://localhost:3003/api/labels \
  -H "Content-Type: application/json" \
  -d '{"name": "Work"}'
```
![create label](https://github.com/user-attachments/assets/06b85e10-71ad-49ef-b625-9fc6031c31e6)


```bash
curl -i http://localhost:3003/api/labels
```

![get the labels](https://github.com/user-attachments/assets/3807fa54-e1f4-4ec1-a7e4-a34a2b774e35)


## Persistent Blacklist Data

The blacklist is stored in `data/blacklist.txt` and `data/bloom_filter.txt`. These files are automatically loaded and updated by the C++ server.


