// import axios from 'axios';

// const url = 'https://my-api.plantnet.org/v2/identify/all';
// const params = {
//   'include-related-images': 'false',
//   'no-reject': 'false',
//   lang: 'en',
// };
// const headers = {
//   accept: 'application/json',
//   'Content-Type': 'multipart/form-data',
// };

// async function identifyPlant(base64Image: string) {
//   // Convert the base64 string to a Buffer
//   const buffer = Buffer.from(base64Image, 'base64');

//   // Create FormData
//   const form = new FormData();
//   form.append('images', buffer, {
//     filename: 'image.png',
//     contentType: 'image/png',
//   });

//   try {
//     const response = await axios.post(url, form, {
//       headers: {
//         ...headers,
//         ...form.getHeaders(),
//       },
//       params: params,
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error identifying plant:', error);
//   }
// }

// // Example base64 string (truncated for example purposes)
// const base64String = 'iVBORw0KGgoAAAANSUhEUgAA...'; // Replace with your actual base64 string

// identifyPlant(base64String);
