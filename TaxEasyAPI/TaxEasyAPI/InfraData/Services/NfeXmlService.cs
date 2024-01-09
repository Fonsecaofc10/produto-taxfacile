using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using Newtonsoft.Json;
using System.Xml;
using TaxFacileAPI.Aplication.DTOs;
using TaxFacileAPI.Domain.Entities;

namespace TaxFacileAPI.InfraData.Services
{
    public class NfeXmlService 
    {
        private readonly IMongoDatabase _database;

        public NfeXmlService(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task<bool> ExistChNFeAsync(string chNFe)
        {
            var collection = _database.GetCollection<NfeXmlDTO>("NfeXml");
            var filter = Builders<NfeXmlDTO>.Filter.Eq(x => x.ChNFe, chNFe);
            var fields = Builders<NfeXmlDTO>.Projection.Include(p => p.ChNFe);

            try
            {
                var nfe = await collection.Find(filter).Project<NfeXmlDTO>(fields).FirstAsync(); 
                return nfe.ChNFe!.Length == 44;

            } 
            catch
            {
                return false;
            }
           
        }

        public async Task<NfeXmlDTO> GetAsync(string chNFe)
        {
            var collection = _database.GetCollection<NfeXmlDTO>("NfeXml");

            var filter = Builders<NfeXmlDTO>.Filter.Eq(x => x.ChNFe, chNFe);
            var nfe = await collection.Find(filter).FirstAsync();


            return nfe;
        }

        public async Task<List<NfeXmlDTO>> GetAllAsync(DateTime dataDe, DateTime dataAte)
        {
            var collection = _database.GetCollection<NfeXmlDTO>("NfeXml");

            var dataIn = dataDe.ToString("yyyy-MM-dd");
            var dataFim = dataAte.AddDays(1).ToString("yyyy-MM-dd");
           
            var filter = Builders<NfeXmlDTO>.Filter.Gte("nfeProc.NFe.infNFe.ide.dhEmi", dataIn) & Builders<NfeXmlDTO>.Filter.Lt("nfeProc.NFe.infNFe.ide.dhEmi", dataFim);

            var nfes = await collection.Find(filter).ToListAsync();

            return nfes;
        }

        public async Task<bool> AddAsync(NfeXmlEntity nfeXml)
        {
            var collection = _database.GetCollection<BsonDocument>("NfeXml");

            string nfeJson = JsonConvert.SerializeXmlNode(nfeXml.XmlContent);

            var bsDoc = BsonSerializer.Deserialize<BsonDocument>(nfeJson);
            bsDoc.Add("_id", nfeXml.ChNFe );

            await collection.InsertOneAsync(bsDoc);

            return true;

        }

    }
}


