using MongoDB.Bson.Serialization.Attributes;

namespace TaxFacileAPI.Domain.Models
{
    public class NfeXmlModel
    {
        [BsonId]
        public string? ChNFe { get; set; }

        [BsonElement("nfeProc")]
        public object? XmlContent { get; set; }
    }
}
