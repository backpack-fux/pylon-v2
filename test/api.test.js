//imports
const dotenv = require('dotenv');
dotenv.config();

//constants
const API_URL = process.env.FRONT_END_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.SERVER_API_KEY;


//helper functions
async function readStream(stream) {
  const reader = stream.getReader();
  let chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  // Concatenate all chunks into a single Uint8Array
  const concatenatedChunks = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset);
    offset += chunk.length;
  }
  // Convert the Uint8Array to a string
  const result = new TextDecoder().decode(concatenatedChunks);
  return result;
}



//tests

test('merchant create', async() => {

	const test_url = API_URL+"/v1/merchant/create";

	const res = await fetch( test_url, {
		method: 'POST',
		headers: {
			'Authorization': `${JWT_SECRET} ${API_KEY}`,
			'Content-Type': 'application/json' // Adjust content type as needed
		},
		body: JSON.stringify({
			"name": "Jeff",
			"surname": "Winger",
			"email": "youruser@gmail.com",
			"phoneNumber": "(558)555-5555",
			"walletAddress": "0x0000000000000000000000000000000000000003",
			"registeredAddress": {
				"street1": "123 Main Street",
				"city": "New York",
				"postcode": "11111",
				"country": "US"
			}
		})
	}).then(response => {
		const statusCode = response.status;

		if( !response.ok ) {
			return readStream(response.body);
		}
	}).then(data=> {
		throw new Error(data);
	})

}); //test('merchant create'


