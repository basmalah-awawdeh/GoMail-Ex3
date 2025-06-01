import { v4 as uuidv4 } from 'uuid';
import { mails } from '../sharedData.js';
import net from 'net';

//storing blacklisetd urls for local checking
let blacklistUrls = [];

//communicating with cpp server port, or default 8081
const CPP_SERVER_PORT = process.env.CPP_SERVER_PORT || 8081;

//injecting updated balcklist
export const _injectBlacklist = (bl) => {
  blacklistUrls = bl;
};
//getting last 50 mails sent from or to the user from newest
export const getMails = (req, res) => {
  const result = mails.filter(m => m.to === req.userId || m.from === req.userId).slice(-50).reverse();
  res.json(result);
};
//sending a new mail
export const sendMail = async (req, res) => {
  const { to, subject, body, links } = req.body;
  //checking if the fields are present
  if (!to || !body){
    return res.status(400).json({ error: 'Missing recipient or body' });
  }
  try {
    // checking if the url is blacklisted
    for (const link of links || []) {
      const result = await checkWithCppServer(link);
      if (result === 'BLACKLISTED'){
        return res.status(400).json({ error: 'Link is blacklisted' });
      }
    }
  }catch (err){
    console.error('C++ server error:', err.message);
    return res.status(500).json({ error: 'Spam check failed' });
  }
  //storing the mail in memory
  const mail = {
    id: uuidv4(),
    from: req.userId,
    to,
    subject,
    body,
    links
  };
  mails.push(mail);
  res.status(201).end();
};

//getting the mail by its id
export const getMailById = (req, res) => {
  const mail = mails.find(m => m.id === req.params.id);
  if (!mail){
    return res.status(404).json({ error: 'Mail not found' });
  }
  res.json(mail);
};

//updating the mail
export const updateMail = (req, res) => {
  const mail = mails.find(m => m.id === req.params.id);
  if (!mail){
    return res.status(404).json({ error: 'Mail not found' });
  }
  Object.assign(mail, req.body);
  res.status(204).end();
};

//deleting the bail by its id
export const deleteMail = (req, res) => {
  const index = mails.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  //removing from memory
  mails.splice(index, 1);
  res.status(204).end();
};

//searching in the fields: to, from, subject, body
export const searchMails = (req, res) => {
  const query = req.params.query.toLowerCase();
  const result = mails.filter(m =>
    [m.subject, m.body, m.to, m.from].some(field =>
      field?.toLowerCase().includes(query)
    )
  );
  res.json(result);
};

//checking if url is blacklisted by chekcing with cpp server
function checkWithCppServer(url) {
  return new Promise((resolve, reject) => {
      //const client = net.createConnection({ host: 'localhost', port: parseInt(CPP_SERVER_PORT) }, () => {
      const client = net.createConnection({ host: 'cpp-server', port: parseInt(process.env.CPP_SERVER_PORT) }, () => {
      //sending get reqeust 
      client.write(`GET ${url}\n`);
    });
    //handling data that returnd by cpp server
    client.on('data', (data) => {
      const response = data.toString().trim();
      client.end();
      if (response.includes('true')){
        resolve("BLACKLISTED");
      }else{
        resolve("OK");
      }
    });
    //handling errors
    client.on('error', (err) => {
      reject(err);
    });
  });
}

// 5f022b46-c7d2-47d0-89d6-10a30f476f41 - alice

// 01b3d4ae-9ae5-47fe-bf31-34cea74e15a4

//0797d2a0-4617-4e1a-babb-52df22423105