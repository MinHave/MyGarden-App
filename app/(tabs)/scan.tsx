import { identifyPlant } from '@/plugins/plantNet';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanView() {
  const [facing, setFacing] = useState<CameraType | undefined>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null); // Moved useRef here

  async function takeImage() {
    if (cameraRef.current) {
      let plantData = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      // let plantData = await cameraRef.current.takePictureAsync();
      // console.log('IMAGE: ', plantData?.uri);
      if (plantData && plantData.base64) {
        console.log('');
        console.log('y');
        console.log('');
        let file = base64ToBlob(plantData.base64);
        console.log('file', file);

        await identifyPlant(file);
        // }
      }
    }
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const base64ToBlob = (base64Data: string): Blob => {
    // Split the base64 string to get the content type and the actual data
    const splitData = base64Data.split(',');
    const contentType = splitData[0].split(':')[1].split(';')[0];
    const b64Data = splitData[1];

    // Convert base64 to binary string
    const byteCharacters = atob(b64Data);

    // Create an array buffer and a view (as a byte array)
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a blob from the byte array
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Added ref here */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takeImage}>
            <Text style={styles.text}>Take image</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
