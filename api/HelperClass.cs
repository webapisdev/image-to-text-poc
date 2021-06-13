using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;

namespace DCP.POC {
    public class HelperClass {

        //Query the image by name(Rowkey) and return the Image blob url and text. 
        public static async Task<ImageWithText> QueryImage (CloudTable imageText_table, string imageName) {

            TableQuery<ImageWithText> query = new TableQuery<ImageWithText> ()
                .Where (TableQuery.GenerateFilterCondition ("RowKey", QueryComparisons.Equal, imageName));
            IEnumerable<ImageWithText> imageWithText = imageText_table.ExecuteQuery (query);

            return imageWithText.ToList ().FirstOrDefault ();

        }

        //Inserts the image and text to Table storage.
        public static async Task<TableResult> InsertTableEntity (CloudTable imageText_table, string imageUrl, string text, string fileName) {
            ImageWithText imageWithText = new ImageWithText (fileName);
            imageWithText.Text = text;
            imageWithText.ImageUrl = imageUrl;

            TableOperation insertOperation = TableOperation.InsertOrMerge (imageWithText);
            TableResult result = await imageText_table.ExecuteAsync (insertOperation);
            return result;
        }

        //Uploads the image to blob storage and return the url of the blob.
        public static async Task<string> UploadFileBlobAsync (string connectionString, string blobContainerName, Stream content, string contentType, string fileName) {
            BlobServiceClient blobServiceClient = new BlobServiceClient (connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient (blobContainerName);
            content.Position = 0;
            var blobClient = containerClient.GetBlobClient (fileName);
            await blobClient.UploadAsync (content, new BlobHttpHeaders { ContentType = contentType });
            return blobClient.Uri.AbsoluteUri;

        }

        ///Checks if the image already exist in blob storage. it will return true or false

        public static async Task<Tuple<string, bool>> CheckIfBlobExists (string connectionString, string blobContainerName, string contentType, string fileName) {
            BlobServiceClient blobServiceClient = new BlobServiceClient (connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient (blobContainerName);
            var blob = containerClient.GetBlobClient (fileName);
            var doesBlobExist = await blob.ExistsAsync ();

            if (doesBlobExist) {
                return Tuple.Create (blob.Uri.AbsoluteUri, doesBlobExist.Value);;
            }
            return Tuple.Create ("", doesBlobExist.Value);;

        }

        public static ComputerVisionClient Authenticate (string endpoint, string key) {
            ComputerVisionClient client =
                new ComputerVisionClient (new ApiKeyServiceClientCredentials (key)) { Endpoint = endpoint };
            return client;
        }

        //Returns the text from the image thats stored in the blob storage.

        public static async Task<StringBuilder> ReadFileUrl (ComputerVisionClient client, string urlFile, ILogger log) {
            StringBuilder fullTextFromImage = new StringBuilder ();
            // Read text from URL
            var textHeaders = await client.ReadAsync (urlFile);
            // After the request, get the operation location (operation ID)
            string operationLocation = textHeaders.OperationLocation;
            Thread.Sleep (2000);

            const int numberOfCharsInOperationId = 36;
            string operationId = operationLocation.Substring (operationLocation.Length - numberOfCharsInOperationId);

            // Extract the text
            ReadOperationResult results;
            log.LogInformation ($"Extracting text from URL file {Path.GetFileName(urlFile)}...");

            do {
                results = await client.GetReadResultAsync (Guid.Parse (operationId));
            }
            while ((results.Status == OperationStatusCodes.Running ||
                    results.Status == OperationStatusCodes.NotStarted));

            var textUrlFileResults = results.AnalyzeResult.ReadResults;
            foreach (ReadResult page in textUrlFileResults) {
                foreach (Line line in page.Lines) {
                    log.LogInformation (line.Text);
                    fullTextFromImage.Append (line.Text);
                    fullTextFromImage.Append (Environment.NewLine);
                }
            }
            return fullTextFromImage;
        }

        //GEt all images with text that are stored in Table Storage
        public static async Task<List<ImageWithText>> GetAllImages (CloudTable imageText_table) {
            TableQuery<ImageWithText> query = new TableQuery<ImageWithText> ()
                .Where (TableQuery.GenerateFilterCondition ("PartitionKey", QueryComparisons.Equal, "ImageWithText"));
            IEnumerable<ImageWithText> imageWithText = imageText_table.ExecuteQuery (query);

            return imageWithText.ToList ();
        }

        public static async Task<Dictionary<string, Uri>> GetImagesFromBlobContainer (string connectionString, string containerName) {

            BlobServiceClient blobServiceClient = new BlobServiceClient (connectionString);

            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient (containerName);

            Dictionary<string, Uri> names = new Dictionary<string, Uri> ();

            await
            foreach (BlobItem blobItem in containerClient.GetBlobsAsync ()) {
                BlobClient blobClient = containerClient.GetBlobClient (blobItem.Name);
                names.Add (blobItem.Name, blobClient.Uri);
            }
            return names;
        }
    }
}