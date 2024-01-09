using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Xml;

namespace TaxFacileAPI.Aplication.DTOs
{
    public class NfeXmlOutput
    {
        [BsonId]
        public string? ChNFe { get; set; }

        [BsonElement("nfeProc")]
        public object? XmlContent { get; set; }
    }

}
