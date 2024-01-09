using MongoDB.Bson;
using MongoDB.Driver;

namespace TaxFacileAPI.InfraData.Context
{
    public class NfeXmlDatabaseSetting
    {
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? ColletionNFeXml { get; set; }
    }
}
