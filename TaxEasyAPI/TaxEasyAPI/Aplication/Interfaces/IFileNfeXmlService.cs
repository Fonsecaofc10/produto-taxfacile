using Microsoft.AspNetCore.Mvc;
using System.Xml;
using TaxFacileAPI.Aplication.DTOs;

namespace TaxFacileAPI.Aplication.Interfaces
{
    public interface IFileNfeXmlService
    {
        Task<List<XmlUploadResultDTO>> UploadFileAsync([FromForm] IList<IFormFile> files, string pathStorage, CancellationToken cancellationtoken);

        Task<NfeXmlDTO> GetAsync(string chNFe);

        Task<NfeXmlAdmBasicDTO> GetAllAsync(DateTime dataDe, DateTime dataAte);

        Task<bool> ExistChNFeAsync(string chNFe);

        string ValidateXmlNfe(string xmlContent, out string key);

        string LoadContentFile(IFormFile formFile);

        Task<string> WriteFile(IFormFile file, string pathStorag);
    }
}
