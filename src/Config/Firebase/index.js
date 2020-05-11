import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
const imagesRef = storage().ref("images")

async function uploadImageFile(fileName, file) {
    // console.log(`FileName: ${fileName}`)
    console.log(`File: ${file}`)
    // try {
    //     const result = await imagesRef.child(fileName).putFile(file)
    //     console.log(`ImageUploadResult: ${result}`)
    // } catch (error) {
    //     console.log(error, JSON.stringify(error, null, 2));
    // }
}

export {
    uploadImageFile
}