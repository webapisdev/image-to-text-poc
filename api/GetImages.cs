using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos.Table;
using System.Linq;

namespace DCP.POC
{
    public static class UploadTrigger
    {
        [FunctionName("GetImages")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("GetImages function processed a request.");

            string storageConnectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");

            string tableName = Environment.GetEnvironmentVariable("AZURE_TABLE_NAME");
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
            CloudTable imageToTextTable = tableClient.GetTableReference(tableName);

            var allImages = await HelperClass.GetAllImages(imageToTextTable);

            return new OkObjectResult(JsonConvert.SerializeObject(allImages));
        }

    }
}
