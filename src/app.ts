import { create, insertMultiple, search } from '@orama/orama';
import express from 'express';
const app = express();
const port = 3000;
const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags';
let countriesDB;

app.get('/:title', async function(req, res) {
  const searchResult = await search(countriesDB, {
    term: req.params.title,
    properties: '*',
  })
  res.send(searchResult);    
});

app.get('/', async (req, res) => {
  const searchResult = await search(countriesDB, {
    term: '',
    properties: '*',
    limit: countriesDB.data.docs.count
  });

  res.send(searchResult);
});

app.listen(port, async () => {
  countriesDB = await create({
    schema: {
      flags:{
        png: 'string',
        svg: 'string',
        alt: 'string'
      },
      name:{
        common: 'string',
        official: 'string',
        nativeName:{
          est:{
            official: 'string',
            common: 'string'
          }
        }
      }
    },
  });
  fetch(API_URL, {
    method: 'GET'
  })
  .then((response) => response.json())
  .then(async (json) => await insertMultiple(countriesDB, json, 500));
 
  return console.log(`Express is listening at http://localhost:${port}`);
});
