using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver;
using TaxFacileAPI.Aplication.DTOs;
using TaxFacileAPI.Domain.Entities;
using TaxFacileAPI.Domain.Interfaces;
using Newtonsoft.Json;
using TaxFacileAPI.Domain.Models;
using TaxFacileAPI.InfraData.Context;

namespace TaxFacileAPI.InfraData.Repositories
{
    public class NfeXmlRepository : IXmlNfeRepository
    {
        private readonly IMongoCollection<NfeXmlModel> _xmlNfeColletion;
        private readonly IMongoCollection<BsonDocument> _xmlNfeColletionBSon;
        public NfeXmlRepository(IOptions<NfeXmlDatabaseSetting> xmlNfeService)
        {
            var mongoClient = new MongoClient(xmlNfeService.Value.ConnectionString);
            var mongoDb = mongoClient.GetDatabase(xmlNfeService.Value.DatabaseName);
            _xmlNfeColletion = mongoDb.GetCollection<NfeXmlModel>(xmlNfeService.Value.ColletionNFeXml);

            _xmlNfeColletionBSon = mongoDb.GetCollection<BsonDocument>(xmlNfeService.Value.ColletionNFeXml);
        }

        public async Task<bool> ExistChNFeAsync(string chNFe)
        {
            var filter = Builders<NfeXmlModel>.Filter.Eq(x => x.ChNFe, chNFe);
            var fields = Builders<NfeXmlModel>.Projection.Include(p => p.ChNFe);

            try
            {
                var nfe = await _xmlNfeColletion.Find(filter).Project<NfeXmlModel>(fields).FirstAsync();
                return nfe.ChNFe!.Length == 44;

            }
            catch
            {
                return false;
            }

        }

        public async Task<NfeXmlModel> GetAsync(string chNFe)
        {
            var filter = Builders<NfeXmlModel>.Filter.Eq(x => x.ChNFe, chNFe);
            var nfe = await _xmlNfeColletion.Find(filter).FirstAsync();
            return nfe;
        }

        public async Task<List<NfeXmlModel>> GetAllAsync(DateTime dataDe, DateTime dataAte)
        {
            var dataIn = dataDe.ToString("yyyy-MM-dd");
            var dataFim = dataAte.AddDays(1).ToString("yyyy-MM-dd");

            var filter = Builders<NfeXmlModel>.Filter.Gte("nfeProc.NFe.infNFe.ide.dhEmi", dataIn) & Builders<NfeXmlModel>.Filter.Lt("nfeProc.NFe.infNFe.ide.dhEmi", dataFim);

            var nfes = await _xmlNfeColletion.Find(filter).ToListAsync();

            return nfes;
        }

        public async Task<bool> DeleteAllNFeAsync()
        {
            await _xmlNfeColletion.DeleteManyAsync(Builders<NfeXmlModel>.Filter.Empty);
            return true;
        }

        public async Task<bool> DeleteAsync(string chNFe)
        {
            var filter = Builders<NfeXmlModel>.Filter.Eq(x => x.ChNFe, chNFe);
            var result = await _xmlNfeColletion.DeleteOneAsync(filter);
            return result.DeletedCount > 0 ? true : false;
        }

        public async Task<bool> AddAsync(NfeXmlEntity nfeXml)
        {
            string nfeJson = JsonConvert.SerializeXmlNode(nfeXml.XmlContent);

            var bsDoc = BsonSerializer.Deserialize<BsonDocument>(nfeJson);
            bsDoc.Add("_id", nfeXml.ChNFe);

            await _xmlNfeColletionBSon.InsertOneAsync(bsDoc);
            return true;
        }



    }
}
