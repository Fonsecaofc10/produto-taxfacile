using TaxFacileAPI.Domain.Entities;
using TaxFacileAPI.Domain.Models;

namespace TaxFacileAPI.Domain.Interfaces
{
    public interface IXmlNfeRepository
    {
        Task<bool> ExistChNFeAsync(string chNFe);
        Task<NfeXmlModel> GetAsync(string chNFe);
        Task<List<NfeXmlModel>> GetAllAsync(DateTime dataDe, DateTime dataAte);
        Task<bool> DeleteAllNFeAsync();
        Task<bool> DeleteAsync(string chNFe);
        Task<bool> AddAsync(NfeXmlEntity nfeXml);
    }
}
