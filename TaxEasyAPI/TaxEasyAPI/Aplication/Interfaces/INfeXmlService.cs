using Microsoft.AspNetCore.Mvc;
using System.Xml;
using TaxFacileAPI.Aplication.DTOs;
using TaxFacileAPI.Domain.Models;

namespace TaxFacileAPI.Aplication.Interfaces
{
    public interface INfeXmlService
    {
        Task<List<XmlUploadResultDTO>> UploadFileAsync([FromForm] IList<IFormFile> files, string pathStorage, CancellationToken cancellationtoken);

        Task<NfeXmlModel> GetAsync(string chNFe);

        Task<bool> DeleteAllNFeAsync();

        Task<bool> DeleteAsync(string chNFe);

        Task<NfeXmlAdmBasicDTO> GetAllAsync(DateTime dataDe, DateTime dataAte);

        Task<bool> ExistChNFeAsync(string chNFe);

        string ValidateXmlNfe(string xmlContent, out string key);

        string LoadContentFile(IFormFile formFile);

        Task<string> WriteFile(IFormFile file, string pathStorag);
    }
}
