using System;
using Microsoft.Azure.Cosmos.Table;

public class ImageWithText : TableEntity
{
    public ImageWithText()
    {

    }
    public ImageWithText(string fileName)
    {
        PartitionKey = "ImageWithText";
        RowKey = fileName;

    }
    public string ImageUrl { get; set; }
    public string Text { get; set; }

}