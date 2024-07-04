import AWS from 'aws-sdk';

const BUCKET_NAME = "postmortemshala"


const uploadFile = async (params: AWS.S3.PutObjectRequest) => {
    const s3 = new AWS.S3();
    console.log('uploadFile called');
    try {
        let apiRes = await s3.upload(params).promise()
        console.log('uploadFile success', apiRes);
        return apiRes.Key
    } catch (error) {
        console.log('uploadFile error', error);

        return ""
    }
}
const uploadImage = async (file: any, isPublic: boolean) => {
    console.log('uploadImage called', file);

    const params: any = {
        Bucket: BUCKET_NAME,
        Key: `image/original/${new Date().getTime() + file?.name || new Date().getTime()}`,
        Body: file,
    };
    // if (isPublic) {
    //     params["ACL"] = "public-read"
    // }
    return await uploadFile(params)
}
const uploadVideo = async (file: any) => {
    console.log('uploadImage called', file);

    const params = {
        Bucket: BUCKET_NAME,
        Key: `video/original/${new Date().getTime() + file?.name || new Date().getTime()}`,
        Body: file,
    };
    return await uploadFile(params)
}
export const BucketBaseUrl = (bucketKey: string) => `https://postmortemshala.s3.ap-south-1.amazonaws.com/${bucketKey}`

export default {
    uploadImage,
    uploadVideo,
    BucketBaseUrl
}