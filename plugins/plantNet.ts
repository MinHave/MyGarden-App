import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import * as base64 from 'base64-js';

const url = 'https://my-api.plantnet.org/v2/identify/all';
const apiKey = '2b10ufHDk4ltygFNOasZO1LjNe'; // Use environment variable for API key
const params = {
  'include-related-images': 'false',
  'no-reject': 'false',
  lang: 'en',
  'api-key': apiKey,
};

export async function identifyPlant(base64Image: string) {
  if (!base64Image) {
    console.error('Base64 image string is empty.');
    return;
  }

  try {
    // Convert base64 to a file and get the URI
    const binaryArray = base64.toByteArray(base64Image);
    const base64String = base64.fromByteArray(binaryArray);
    const fileUri = FileSystem.documentDirectory + 'image.png';

    await FileSystem.writeAsStringAsync(fileUri, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create form data
    const formData = new FormData();
    formData.append('images', {
      uri: fileUri,
      name: 'image.png',
      type: 'image/png',
    } as any);

    console.log('fileUri', fileUri);
    console.log('formData', formData);

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log('File Info:', fileInfo);

    // Send the POST request
    const response = await axios.post(url, formData, {
      headers: {
        Accept: 'application/json',
      },
      params: params,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(response.data);
  } catch (error: any) {
    console.error(
      'Error identifying plant:',
      error.response?.data || error.message
    );
  }
}
