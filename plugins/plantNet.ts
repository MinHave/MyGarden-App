import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import * as base64 from 'base64-js';

const url = 'https://my-api.plantnet.org/v2/identify/all';
const apiKey = '2b10ufHDk4ltygFNOasZO1LjNe'; // Use environment variable for API key
const params = {
  'include-related-images': 'false',
  'no-reject': 'false',
  'api-key': apiKey,
};
export async function identifyPlant(fileBlob: Blob) {
  console.log('BLOB', fileBlob);
  // Create form data
  const formData = new FormData();
  formData.append('images', fileBlob, 'image' + fileBlob.type.split('/'[1]));
  // formData.append('lang', 'en');
  // formData.append('include-related-images', 'false');
  // formData.append('api-key', apiKey);

  // https://github.com/plantnet/my.plantnet/blob/master/examples/post/js/run.js
  const a = await axios.post(
    'https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=en&api-key=2b10ufHDk4ltygFNOasZO1LjNe',
    formData
  );
  console.log(a);

  // Post the form data
  const newUrl =
    url +
    '?include-related-images=false&no-reject=false&lang=en&api-key=2b10ufHDk4ltygFNOasZO1LjNe';
  const response = await axios.post(newUrl, formData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

  // const apiResponse = await axios.post(
  //   `${url}` + `&api-key=${apiKey}`,
  //   formData,
  //   {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   }
  // );
  console.log('apiResponse', response);
}

// export async function identifyPlant(fileURI: string) {
//   try {
//     const URLencoded = encodeURIComponent(fileURI);

//     const api_url = `${url}?lang=en&include-related-images=false&api-key=${apiKey}`;
//     // const api_url = `${url}?images=${URLencoded}&lang=en&include-related-images=false&api-key=${apiKey}`;
//     // const URL = `${API_URL}/${project}?images=${URLencoded}&organs=${organs}&lang=${lang}&include-related-images=${includeRelatedImages}&api-key=${key}`;

//     let uriSplit = fileURI.split('/');
//     let fileName = uriSplit[uriSplit.length - 1];
//     let fileExtension = fileName.split('.')[1];

//     console.log('fileURI', fileURI);
//     // Create form data
//     const formData = new FormData();
//     formData.append('images', {
//       uri: fileURI,
//       name: fileName,
//       type: 'image/' + fileExtension,
//     } as any);

//     console.log('api_url', api_url);

//     // Hit the API
//     const response = await axios.post(url, formData, {
//       // headers: {
//       //   Accept: 'application/json',
//       // },
//       params: params,
//     });

//     // Check the status
//     const status = response.status;
//     console.log(status);

//     if (status === 200) {
//       const prediction = response.data;
//       console.log(prediction);
//       console.log('Prediction', JSON.stringify(prediction));
//     } else {
//       console.error('Error:', response.statusText);
//       console.log('Error', response.statusText);
//     }
//   } catch (error: any) {
//     console.error(
//       'Error identifying plant:',
//       error.response?.data || error.message
//     );
//   }
// }

// export async function identifyPlant(base64Image: string, imgURI:string) {
//   if (!base64Image) {
//     console.error('Base64 image string is empty.');
//     return;
//   }

//   try {
//     // Convert base64 to a file and get the URI
//     const binaryArray = base64.toByteArray(base64Image);
//     const base64String = base64.fromByteArray(binaryArray);
//     const fileUri = FileSystem.documentDirectory + 'image.png';

//     // await FileSystem.writeAsStringAsync(fileUri, base64String, {
//     //   encoding: FileSystem.EncodingType.Base64,
//     // });

//     // Create form data
//     const formData = new FormData();
//     formData.append('images', {
//       uri: imgURI,
//       name: 'image.png',
//       type: 'image/png',
//     } as any);

//     console.log('fileUri', fileUri);
//     console.log('formData', formData);
//     const base64content = await FileSystem.readDirectoryAsync(fileUri);
//     console.log('base64content', base64content);
//     console.log('base64content');

//     const fileInfo = await FileSystem.getInfoAsync(fileUri);
//     // console.log('File Info:', fileInfo);
//     // console.log('File Info:');

//     // Send the POST request
//     const response = await axios.post(url, formData, {
//       headers: {
//         Accept: 'application/json',
//       },
//       params: params,
//     });

//     if (response.status !== 200) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     console.log(response.data);
//   } catch (error: any) {
//     console.error(
//       'Error identifying plant:',
//       error.response?.data || error.message
//     );
//   }
// }
