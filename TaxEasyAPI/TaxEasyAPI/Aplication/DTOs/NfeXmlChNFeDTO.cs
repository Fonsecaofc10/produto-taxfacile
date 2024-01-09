using MongoDB.Bson.Serialization.Attributes;

namespace TaxFacileAPI.Aplication.DTOs
{
    public class NfeXmlChNFeDTO
    {
        [BsonId]
        public string? ChNFe { get; set; }
    }
}
