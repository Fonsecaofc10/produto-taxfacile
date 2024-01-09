using MongoDB.Bson.Serialization.Attributes;
using System.Xml;

namespace TaxFacileAPI.Domain.Entities
{
    public class NfeXmlEntity
    {
        [BsonId]
        public string? ChNFe { get; set; }

        [BsonElement("Nfe")]
        public XmlNode? XmlContent { get; set; }
    }
}
