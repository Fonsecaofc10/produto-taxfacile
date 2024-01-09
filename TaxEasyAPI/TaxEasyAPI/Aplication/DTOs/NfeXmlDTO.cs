using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Xml;

namespace TaxFacileAPI.Aplication.DTOs
{
    public class NfeXmlDTO
    {
        [BsonId]
        public string? ChNFe { get; set; }

        [BsonElement("nfeProc")]
        public object? XmlContent { get; set; }
    }

}
