using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.Cosmos.Table;
using api.Models;

namespace DCP.POC
{
    public static class UploadImage
    {
        [FunctionName("UploadImage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("UploadImage function processed a request.");
            try
            {
                var imageData = await req.ReadFormAsync();
                var image = req.Form.Files["file"];
                byte[] imageDataToUpload;
                string blobUrl;
                ImageToTextResponse response;
                if (image.ContentType.Contains("image"))
                {

                    string storageConnectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");
                    string containerName = Environment.GetEnvironmentVariable("AZURE_CONTAINER_NAME");

                    string computerVisionConnectionString = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_CONNECTION_STRING");
                    string computerVisionEndpoint = Environment.GetEnvironmentVariable("AZURE_COMPUTER_VISION_ENDPOINT");

                    string tableName = Environment.GetEnvironmentVariable("AZURE_TABLE_NAME");

                    using (var target = new MemoryStream())
                    {
                        image.CopyTo(target);
                        imageDataToUpload = target.ToArray();

                        var doesBlobAlreadyExist = await HelperClass.CheckIfBlobExists(storageConnectionString, containerName, image.ContentType, image.FileName);
                        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
                        CloudTableClient tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
                        CloudTable imageToTextTable = tableClient.GetTableReference(tableName);

                        if (!doesBlobAlreadyExist.Item2)
                        {
                            blobUrl = await HelperClass.UploadFileBlobAsync(storageConnectionString, containerName, target, image.ContentType, image.FileName);

                            ComputerVisionClient client = HelperClass.Authenticate(computerVisionEndpoint, computerVisionConnectionString);

                            var text = await HelperClass.ReadFileUrl(client, blobUrl, log);

                            var tableInsertResponse = await HelperClass.InsertTableEntity(imageToTextTable, blobUrl, text.ToString(), image.FileName);

                            response = new ImageToTextResponse()
                            {
                                Url = blobUrl,
                                Text = text.ToString()
                            };
                            return new OkObjectResult(JsonConvert.SerializeObject(response));
                        }
                        else
                        {
                            var imageUrlWithText = await HelperClass.QueryImage(imageToTextTable, image.FileName);
                            if (imageUrlWithText != null)
                            {
                                response = new ImageToTextResponse()
                                {
                                    Url = imageUrlWithText.ImageUrl,
                                    Text = imageUrlWithText.Text
                                };
                                return new OkObjectResult(JsonConvert.SerializeObject(response));
                            }

                        }

                        return new BadRequestResult();

                    }
                }
                else
                {
                    return new UnsupportedMediaTypeResult();
                }
            }
            catch (System.Exception ex)
            {
                log.LogInformation("Error Message", ex.Message);

                return new BadRequestResult();

            }

        }

    }
}
