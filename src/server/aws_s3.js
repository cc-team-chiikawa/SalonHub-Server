// dotenvの読み込み
const dotenv = require("dotenv");
dotenv.config();
const {
  S3Client,
  // CreateBucketCommand,
  // DeleteBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");

// S3クライアントの設定
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ファイルのアップロード
async function uploadFile(bucketName, filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  try {
    const data = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
      })
    );
    // console.log("Success", data);
    return data;
  } catch (err) {
    // console.log("Error", err);
    return err;
  }
}

// ファイルの取得
async function getFile(bucketName, key, downloadPath) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const { Body } = await s3Client.send(command);
    const stream = Body.pipe(fs.createWriteStream(downloadPath));
    stream.on("finish", () => {
      console.log("File downloaded successfully");
      return true;
    });
  } catch (err) {
    console.log("Error", err);
    return err;
  }
}

// バケットを作成する関数
// const createBucket = async (bucketName) => {
//   const command = new CreateBucketCommand({
//     Bucket: bucketName,
//     locationConstraint: process.env.AWS_REGION, // 明確にリージョンを設定しないと弾かれる
//   });

//   try {
//     const data = await s3Client.send(command);
//     console.log("Success", data);
//   } catch (err) {
//     console.log("Error", err);
//   }
// };

// バケットを削除する関数
// const deleteBucket = async (bucketName) => {
//   const command = new DeleteBucketCommand({
//     Bucket: bucketName,
//     locationConstraint: process.env.AWS_REGION, // 明確にリージョンを設定しないと弾かれる
//   });

//   try {
//     const data = await s3Client.send(command);
//     console.log("Success", data);
//   } catch (err) {
//     console.log("Error", err);
//   }
// };

// 関数を呼び出してバケットを作成
//createBucket("test-bucket-123456789123456789");
// deleteBucket("test-bucket-123456789123456789");

//// アップロード
// const bucketName = "cc-hairstyle-image";
// const filePath = "./test/S3test.png"; // 例: "./example.txt"
// const key = "changed.png";
// uploadFile(bucketName, filePath, key);

// Success {
//   '$metadata': {
//     httpStatusCode: 200,
//     requestId: 'GHKGP1YK5YCPSW0V',
//     extendedRequestId: 'PQYXf9h78LvU8offorzEwGp9JF4Nr3L5djEMaJ9/Sv500pqw7S0Z8OC8ZaEgEzP1SkWSvpONA6s=',
//     cfId: undefined,
//     attempts: 1,
//     totalRetryDelay: 0
//   },
//   ETag: '"de6dbae153fd7d0cf33c31e1a3b10f61"',
//   ServerSideEncryption: 'AES256'
// }
// 名前重複は上書き

//// 取得
// const bucketName = "cc-hairstyle-image";
// const key = "changed.png";
// const downloadPath = "./download_test/download.png"; // 例: "./downloaded_example.txt"
// getFile(bucketName, key, downloadPath);

module.exports = { uploadFile, getFile };
